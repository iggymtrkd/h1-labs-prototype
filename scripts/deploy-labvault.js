/**
 * Deploy LabVault Contract with New Fee System
 * 
 * This script deploys a fresh LabVault contract with the updated fee logic
 * 
 * Prerequisites:
 * - Set PRIVATE_KEY environment variable
 * - Have ETH for gas fees
 * 
 * Run: node scripts/deploy-labvault.js
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  RPC_URL: "https://sepolia.base.org", // Base Sepolia
  CHAIN_ID: 84532,
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  
  // Token configuration (must match your setup)
  LABS_TOKEN: "0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd",
  
  // Lab configuration for test deployment
  LAB_NAME: "Test H1 Lab",
  LAB_SYMBOL: "H1TEST",
  DISPLAY_NAME: "Test Lab with New Fees",
  
  // Vault parameters
  COOLDOWN_SECONDS: 3600, // 1 hour for testing
  EXIT_CAP_BPS: 5000, // 50% for testing
  ADMIN_ADDRESS: "", // Will be set to signer address
};

// ============================================
// LabVault ABI (Constructor + Key Functions)
// ============================================

const LABVAULT_ABI = [
  // Constructor signature for verification
  "constructor(address,string,string,string,uint64,uint16,address)",
  // View functions
  "function depositFeeBps() view returns (uint16)",
  "function redemptionFeeBps() view returns (uint16)",
  "function assetsPerShare() view returns (uint256)",
  "function getLevel() view returns (uint8)",
  "function paused() view returns (bool)",
];

// ============================================
// DEPLOY FUNCTION
// ============================================

async function deployLabVault() {
  console.log("\n🚀 Deploying LabVault with New Fee System\n");
  console.log("=".repeat(60));
  
  // Validate configuration
  if (!CONFIG.PRIVATE_KEY) {
    console.error("❌ Error: PRIVATE_KEY environment variable not set");
    console.error("   Set it with: export PRIVATE_KEY=0x...");
    process.exit(1);
  }
  
  // Setup provider and signer
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const signer = new ethers.Wallet(CONFIG.PRIVATE_KEY, provider);
  const signerAddress = await signer.getAddress();
  CONFIG.ADMIN_ADDRESS = signerAddress;
  
  console.log(`\n📍 Network: Base Sepolia (Chain ID: ${CONFIG.CHAIN_ID})`);
  console.log(`👤 Deployer: ${signerAddress}`);
  console.log(`🪙 LABS Token: ${CONFIG.LABS_TOKEN}`);
  console.log(`\n📋 Lab Configuration:`);
  console.log(`   Name: ${CONFIG.LAB_NAME}`);
  console.log(`   Symbol: ${CONFIG.LAB_SYMBOL}`);
  console.log(`   Cooldown: ${CONFIG.COOLDOWN_SECONDS}s`);
  console.log(`   Exit Cap: ${CONFIG.EXIT_CAP_BPS} bps\n`);
  
  // Check balance
  const balance = await provider.getBalance(signerAddress);
  console.log(`💰 ETH Balance: ${ethers.formatEther(balance)} ETH`);
  
  if (balance === 0n) {
    console.error("\n❌ Error: No ETH balance for gas fees");
    process.exit(1);
  }
  
  console.log("=".repeat(60));
  
  try {
    // Read LabVault bytecode
    console.log("\n📦 Reading LabVault bytecode...");
    
    const contractPath = path.join(__dirname, "../contracts/vaults/LabVault.sol");
    if (!fs.existsSync(contractPath)) {
      throw new Error(`LabVault.sol not found at ${contractPath}`);
    }
    
    console.log(`   ✅ Found LabVault.sol at ${contractPath}`);
    
    // Deploy using ethers ContractFactory
    // Note: In production, you'd compile with solc or use artifacts
    console.log("\n⚠️  Note: This script requires pre-compiled LabVault bytecode");
    console.log("   To compile: npm install -g solc && solcjs contracts/vaults/LabVault.sol");
    console.log("   Or use Hardhat: npx hardhat compile");
    
    // For now, show the deployment transaction that would be sent
    console.log("\n📤 Deployment Transaction Template:");
    console.log(`   To: (new deployment)`);
    console.log(`   Data: <LabVault bytecode>`);
    console.log(`   Constructor Args:`);
    console.log(`     - labsToken: ${CONFIG.LABS_TOKEN}`);
    console.log(`     - h1Name: "${CONFIG.LAB_NAME}"`);
    console.log(`     - h1Symbol: "${CONFIG.LAB_SYMBOL}"`);
    console.log(`     - labDisplayName: "${CONFIG.DISPLAY_NAME}"`);
    console.log(`     - cooldownSeconds: ${CONFIG.COOLDOWN_SECONDS}`);
    console.log(`     - epochExitCapBps: ${CONFIG.EXIT_CAP_BPS}`);
    console.log(`     - admin: ${CONFIG.ADMIN_ADDRESS}`);
    
    console.log("\n" + "=".repeat(60));
    console.log("\n💡 To deploy LabVault, use one of these methods:\n");
    
    console.log("1️⃣  HARDHAT (Recommended):");
    console.log("   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox");
    console.log("   npx hardhat compile");
    console.log("   npx hardhat deploy --network sepolia");
    
    console.log("\n2️⃣  FOUNDRY (Alternative):");
    console.log("   forge compile");
    console.log("   forge create contracts/vaults/LabVault.sol:LabVault \\");
    console.log("     --rpc-url https://sepolia.base.org \\");
    console.log("     --private-key $PRIVATE_KEY \\");
    console.log(`     --constructor-args ${CONFIG.LABS_TOKEN} "${CONFIG.LAB_NAME}" "${CONFIG.LAB_SYMBOL}" "${CONFIG.DISPLAY_NAME}" ${CONFIG.COOLDOWN_SECONDS} ${CONFIG.EXIT_CAP_BPS} ${CONFIG.ADMIN_ADDRESS}`);
    
    console.log("\n3️⃣  DIRECT ETHERS (No compilation):");
    console.log("   If you have compiled bytecode, update this script with it");
    console.log("   Then the deployment will execute automatically");
    
    console.log("\n" + "=".repeat(60));
    console.log("\n✨ Next Steps:");
    console.log("1. Choose a deployment method above");
    console.log("2. After deployment, you'll get the contract address");
    console.log("3. Update src/config/contracts.ts if creating new vaults");
    console.log("4. Test with: npm run dev\n");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

// Run the script
deployLabVault()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });

