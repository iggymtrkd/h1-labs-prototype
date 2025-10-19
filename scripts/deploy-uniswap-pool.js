/**
 * Deploy Uniswap V3 Pool for LABS/WETH on Base Sepolia
 * 
 * Setup:
 * 1. Add your private key to .env file:
 *    PRIVATE_KEY=your_wallet_private_key_here
 * 2. Run: node scripts/deploy-uniswap-pool.js
 * 
 * Get testnet ETH: https://sepolia.dev/
 */

const { ethers } = require("ethers");
require("dotenv").config();

// Base Sepolia Configuration
const UNISWAP_V3_FACTORY = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24";
const UNISWAP_V3_POSITION_MANAGER = "0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2";
const WETH = "0x4200000000000000000000000000000000000006";

// Your LABS token address
const LABS_TOKEN = "0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd";

// Pool configuration
const FEE_TIER = 3000; // 0.3% fee (standard)

// Initial price: 1 ETH = 1000 LABS
// This means 1 LABS = 0.001 ETH
// Price = ETH per LABS = 0.001 = 1e15 wei per LABS (1e18 decimals)

async function calculateSqrtPriceX96(priceToken1PerToken0) {
  // sqrtPriceX96 = sqrt(price) * 2^96
  const Q96 = ethers.BigNumber.from(2).pow(96);
  const sqrtPrice = ethers.BigNumber.from(
    Math.floor(Math.sqrt(priceToken1PerToken0))
  );
  return sqrtPrice.mul(Q96).div(ethers.BigNumber.from(10).pow(9));
}

async function main() {
  console.log("🦄 Deploying Uniswap V3 Pool for LABS/WETH\n");

  // Validate environment variables
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ Error: PRIVATE_KEY not set in .env file");
    console.error("Setup:");
    console.error("1. Copy .env.example to .env");
    console.error("2. Add your wallet's private key from MetaMask");
    console.error("3. Get testnet ETH from: https://sepolia.dev/");
    process.exit(1);
  }

  // Setup provider and signer
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org"
  );
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.utils.formatEther(await wallet.getBalance()), "ETH\n");

  // Determine token order (token0 < token1)
  const token0 = LABS_TOKEN.toLowerCase() < WETH.toLowerCase() ? LABS_TOKEN : WETH;
  const token1 = LABS_TOKEN.toLowerCase() < WETH.toLowerCase() ? WETH : LABS_TOKEN;
  const labsIsToken0 = LABS_TOKEN.toLowerCase() === token0.toLowerCase();

  console.log("Token0:", token0);
  console.log("Token1:", token1);
  console.log("LABS is token0:", labsIsToken0, "\n");

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
  
  if (existingPool !== ethers.constants.AddressZero) {
    console.log("✅ Pool already exists:", existingPool);
    poolAddress = existingPool;
  } else {
    console.log("Creating new pool...");
    
    // Create pool
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
  try {
    const slot0 = await pool.slot0();
    if (slot0.sqrtPriceX96.gt(0)) {
      console.log("✅ Pool already initialized");
      console.log("Current sqrtPriceX96:", slot0.sqrtPriceX96.toString());
    }
  } catch (error) {
    console.log("Initializing pool with price...");
    
    // Calculate initial price
    // 1 ETH = 1000 LABS means 1 LABS = 0.001 ETH
    let price;
    if (labsIsToken0) {
      // price = token1/token0 = ETH/LABS = 0.001
      price = ethers.utils.parseEther("0.001");
    } else {
      // price = token1/token0 = LABS/ETH = 1000
      price = ethers.utils.parseEther("1000");
    }
    
    // Calculate sqrtPriceX96
    // Simplified calculation - for production use precise library
    const sqrt = Math.sqrt(parseFloat(ethers.utils.formatEther(price)));
    const sqrtPriceX96 = ethers.BigNumber.from(Math.floor(sqrt * 2**96));
    
    console.log("Initial price:", ethers.utils.formatEther(price));
    console.log("sqrtPriceX96:", sqrtPriceX96.toString());
    
    const initTx = await pool.initialize(sqrtPriceX96);
    console.log("Transaction:", initTx.hash);
    await initTx.wait();
    console.log("✅ Pool initialized");
  }

  console.log("\n🎉 Setup Complete!");
  console.log("\n📝 Pool Details:");
  console.log("Pool Address:", poolAddress);
  console.log("Token0:", token0);
  console.log("Token1:", token1);
  console.log("Fee Tier:", FEE_TIER / 10000, "%");
  
  console.log("\n💡 Next Steps:");
  console.log("1. Add liquidity using Uniswap UI or Position Manager");
  console.log("2. Update testnet addresses file");
  console.log("3. Test swaps on Uniswap interface");
  
  console.log("\n🔗 Uniswap Pool URL:");
  console.log(`https://app.uniswap.org/#/pool/${poolAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

