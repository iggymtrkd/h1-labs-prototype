import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ethers } from "https://esm.sh/ethers@6.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Base Sepolia Configuration
const UNISWAP_V3_FACTORY = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24";
const UNISWAP_V3_POSITION_MANAGER = "0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2";
const WETH = "0x4200000000000000000000000000000000000006";
const LABS_TOKEN = "0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd";
const FEE_TIER = 3000; // 0.3%

// Liquidity amounts
const ETH_AMOUNT = "1.0"; // 1 ETH
const LABS_AMOUNT = "1000"; // 1000 LABS
const TICK_LOWER = -887220;
const TICK_UPPER = 887220;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const privateKey = Deno.env.get("WALLET_PRIVATE_KEY");
    if (!privateKey) {
      throw new Error("WALLET_PRIVATE_KEY not configured");
    }

    console.log("🦄 Starting Uniswap V3 Pool Deployment");

    // Setup provider and signer
    const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const balance = await provider.getBalance(wallet.address);
    console.log("Deployer:", wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");

    // Determine token order
    const token0 = LABS_TOKEN.toLowerCase() < WETH.toLowerCase() ? LABS_TOKEN : WETH;
    const token1 = LABS_TOKEN.toLowerCase() < WETH.toLowerCase() ? WETH : LABS_TOKEN;
    const labsIsToken0 = LABS_TOKEN.toLowerCase() === token0.toLowerCase();

    console.log("Token0:", token0);
    console.log("Token1:", token1);

    // Factory interface
    const factoryABI = [
      "function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)",
      "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
    ];
    
    const factory = new ethers.Contract(UNISWAP_V3_FACTORY, factoryABI, wallet);

    // Check if pool exists
    console.log("Checking for existing pool...");
    const existingPool = await factory.getPool(token0, token1, FEE_TIER);
    
    let poolAddress;
    
    if (existingPool !== ethers.ZeroAddress) {
      console.log("✅ Pool already exists:", existingPool);
      poolAddress = existingPool;
    } else {
      console.log("Creating new pool...");
      const createTx = await factory.createPool(token0, token1, FEE_TIER);
      console.log("Transaction:", createTx.hash);
      await createTx.wait();
      
      poolAddress = await factory.getPool(token0, token1, FEE_TIER);
      console.log("✅ Pool created:", poolAddress);
    }

    // Initialize pool with price
    const poolABI = [
      "function initialize(uint160 sqrtPriceX96) external",
      "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
    ];
    
    const pool = new ethers.Contract(poolAddress, poolABI, wallet);

    // Check if already initialized
    let isInitialized = false;
    try {
      const slot0 = await pool.slot0();
      if (slot0.sqrtPriceX96 > 0n) {
        console.log("✅ Pool already initialized");
        isInitialized = true;
      }
    } catch (error) {
      console.log("Pool not initialized, initializing...");
    }

    if (!isInitialized) {
      // Calculate initial price: 1 ETH = 1000 LABS
      let price;
      if (labsIsToken0) {
        price = ethers.parseEther("0.001"); // ETH/LABS = 0.001
      } else {
        price = ethers.parseEther("1000"); // LABS/ETH = 1000
      }
      
      const sqrt = Math.sqrt(parseFloat(ethers.formatEther(price)));
      const sqrtPriceX96 = BigInt(Math.floor(sqrt * 2**96));
      
      console.log("Initializing with sqrtPriceX96:", sqrtPriceX96.toString());
      
      const initTx = await pool.initialize(sqrtPriceX96);
      console.log("Init transaction:", initTx.hash);
      await initTx.wait();
      console.log("✅ Pool initialized");
    }

    // Now add liquidity
    console.log("\n💧 Adding Liquidity");

    const erc20ABI = [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function balanceOf(address account) external view returns (uint256)"
    ];

    const positionManagerABI = [
      "function mint(tuple(address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
    ];

    const labsToken = new ethers.Contract(LABS_TOKEN, erc20ABI, wallet);
    const positionManager = new ethers.Contract(UNISWAP_V3_POSITION_MANAGER, positionManagerABI, wallet);

    // Check balances
    const labsBalance = await labsToken.balanceOf(wallet.address);
    const ethBalance = await provider.getBalance(wallet.address);
    
    console.log("LABS balance:", ethers.formatEther(labsBalance));
    console.log("ETH balance:", ethers.formatEther(ethBalance));

    const labsAmount = ethers.parseEther(LABS_AMOUNT);
    const ethAmount = ethers.parseEther(ETH_AMOUNT);

    if (labsBalance < labsAmount) {
      throw new Error("Insufficient LABS balance");
    }

    if (ethBalance < ethAmount) {
      throw new Error("Insufficient ETH balance");
    }

    // Approve LABS token
    console.log("Checking LABS approval...");
    const allowance = await labsToken.allowance(wallet.address, UNISWAP_V3_POSITION_MANAGER);
    
    if (allowance < labsAmount) {
      console.log("Approving LABS...");
      const approveTx = await labsToken.approve(UNISWAP_V3_POSITION_MANAGER, ethers.MaxUint256);
      console.log("Approval tx:", approveTx.hash);
      await approveTx.wait();
      console.log("✅ LABS approved");
    } else {
      console.log("✅ LABS already approved");
    }

    // Prepare mint parameters
    const amount0Desired = labsIsToken0 ? labsAmount : ethAmount;
    const amount1Desired = labsIsToken0 ? ethAmount : labsAmount;
    
    const params = {
      token0,
      token1,
      fee: FEE_TIER,
      tickLower: TICK_LOWER,
      tickUpper: TICK_UPPER,
      amount0Desired,
      amount1Desired,
      amount0Min: 0n,
      amount1Min: 0n,
      recipient: wallet.address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600)
    };

    console.log("Adding liquidity...");
    const value = labsIsToken0 ? ethAmount : 0n;

    const mintTx = await positionManager.mint(params, { value });
    console.log("Mint transaction:", mintTx.hash);
    const receipt = await mintTx.wait();
    
    console.log("✅ Liquidity added!");
    console.log("Gas used:", receipt.gasUsed.toString());

    return new Response(
      JSON.stringify({
        success: true,
        poolAddress,
        token0,
        token1,
        deployer: wallet.address,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString(),
        uniswapUrl: `https://app.uniswap.org/#/pool/${poolAddress}`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error: any) {
    console.error("Error in deploy-uniswap-pool:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
