/**
 * Add Initial Liquidity to LABS/WETH Uniswap V3 Pool
 * 
 * Setup:
 * 1. Deploy pool first: node scripts/deploy-uniswap-pool.js
 * 2. Add your private key to .env file:
 *    PRIVATE_KEY=your_wallet_private_key_here
 * 3. Run: node scripts/add-liquidity.js
 */

const { ethers } = require("ethers");
require("dotenv").config();

// Base Sepolia Configuration
const UNISWAP_V3_POSITION_MANAGER = "0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2";
const WETH = "0x4200000000000000000000000000000000000006";
const LABS_TOKEN = "0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd";

// Liquidity configuration
const FEE_TIER = 3000; // 0.3%
const ETH_AMOUNT = "1.0"; // 1 ETH
const LABS_AMOUNT = "1000"; // 1000 LABS (assumes 1 ETH = 1000 LABS)

// Price range (ticks)
// Full range: tickLower = -887220, tickUpper = 887220
// Concentrated range around current price is more capital efficient
const TICK_LOWER = -887220; // Min tick
const TICK_UPPER = 887220;  // Max tick

async function main() {
  console.log("💧 Adding Liquidity to LABS/WETH Pool\n");

  // Validate environment variables
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ Error: PRIVATE_KEY not set in .env file");
    console.error("Setup:");
    console.error("1. Copy .env.example to .env");
    console.error("2. Add your wallet's private key from MetaMask");
    process.exit(1);
  }

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org"
  );
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.utils.formatEther(await wallet.getBalance()), "ETH\n");

  // ERC20 ABI for approvals
  const erc20ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)"
  ];

  // Position Manager ABI
  const positionManagerABI = [
    "function mint(tuple(address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
  ];

  const labsToken = new ethers.Contract(LABS_TOKEN, erc20ABI, wallet);
  const positionManager = new ethers.Contract(
    UNISWAP_V3_POSITION_MANAGER,
    positionManagerABI,
    wallet
  );

  // Determine token order
  const token0 = LABS_TOKEN.toLowerCase() < WETH.toLowerCase() ? LABS_TOKEN : WETH;
  const token1 = LABS_TOKEN.toLowerCase() < WETH.toLowerCase() ? WETH : LABS_TOKEN;
  const labsIsToken0 = LABS_TOKEN.toLowerCase() === token0.toLowerCase();

  console.log("Token0:", token0);
  console.log("Token1:", token1, "\n");

  // Check balances
  const labsBalance = await labsToken.balanceOf(wallet.address);
  const ethBalance = await wallet.getBalance();
  
  console.log("Your balances:");
  console.log("LABS:", ethers.utils.formatEther(labsBalance));
  console.log("ETH:", ethers.utils.formatEther(ethBalance), "\n");

  const labsAmount = ethers.utils.parseEther(LABS_AMOUNT);
  const ethAmount = ethers.utils.parseEther(ETH_AMOUNT);

  if (labsBalance.lt(labsAmount)) {
    console.error("❌ Insufficient LABS balance");
    process.exit(1);
  }

  if (ethBalance.lt(ethAmount)) {
    console.error("❌ Insufficient ETH balance");
    process.exit(1);
  }

  // Approve LABS token
  console.log("Approving LABS token...");
  const allowance = await labsToken.allowance(wallet.address, UNISWAP_V3_POSITION_MANAGER);
  
  if (allowance.lt(labsAmount)) {
    const approveTx = await labsToken.approve(
      UNISWAP_V3_POSITION_MANAGER,
      ethers.constants.MaxUint256
    );
    console.log("Approval tx:", approveTx.hash);
    await approveTx.wait();
    console.log("✅ LABS approved\n");
  } else {
    console.log("✅ LABS already approved\n");
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
    amount0Min: 0, // Set slippage in production
    amount1Min: 0, // Set slippage in production
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000) + 3600 // 1 hour
  };

  console.log("Adding liquidity...");
  console.log("Amount0Desired:", ethers.utils.formatEther(amount0Desired));
  console.log("Amount1Desired:", ethers.utils.formatEther(amount1Desired), "\n");

  // For ETH, need to send value with transaction
  const value = labsIsToken0 ? ethAmount : ethers.constants.Zero;

  const mintTx = await positionManager.mint(params, { value });
  console.log("Transaction:", mintTx.hash);
  const receipt = await mintTx.wait();
  
  console.log("✅ Liquidity added!");
  console.log("\n📝 Receipt:");
  console.log("Gas used:", receipt.gasUsed.toString());
  
  // Parse events to get tokenId
  const mintEvent = receipt.events?.find(e => e.event === "IncreaseLiquidity");
  if (mintEvent) {
    console.log("Position Token ID:", mintEvent.args.tokenId.toString());
  }

  console.log("\n🎉 Setup Complete!");
  console.log("Users can now trade LABS/ETH on Uniswap V3");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

