/**
 * Configure H1 Diamond - Step 7 of Deployment
 * 
 * This script configures the diamond with necessary parameters
 * after all contracts have been deployed and facets attached.
 * 
 * Prerequisites:
 * - Diamond deployed and facets attached
 * - LABS token deployed
 * - You are the diamond owner
 * 
 * Run: node scripts/configure-diamond.js
 */

const { ethers } = require("ethers");

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

const CONFIG = {
  // Network
  RPC_URL: "https://sepolia.base.org", // Base Sepolia
  CHAIN_ID: 84532,
  
  // Your wallet (must be diamond owner)
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  
  // Deployed contract addresses
  DIAMOND_ADDRESS: "0x29a7297e84df485aff8def2d27e467f3a37619c0",
  LABS_TOKEN_ADDRESS: "0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd",
  
  // Protocol parameters (adjust for testnet vs production)
  PROTOCOL_TREASURY: "0xYourTreasuryAddressHere", // ⚠️ CHANGE THIS
  DEFAULT_COOLDOWN: 3600, // 1 hour (testing) or 604800 (7 days for production)
  DEFAULT_EXIT_CAP_BPS: 5000, // 50% (testing) or 1000 (10% for production)
  CURVE_FEE_BPS: 50, // 0.5%
  CURVE_POL_BPS: 200, // 2%
};

// ============================================
// CONTRACT ABIs
// ============================================

const TREASURY_FACET_ABI = [
  "function setLABSToken(address token) external",
];

const TESTING_FACET_ABI = [
  "function setDefaultCooldown(uint64 seconds_) external",
  "function setDefaultExitCap(uint16 bps) external",
  "function setProtocolTreasury(address treasury) external",
  "function setCurveFeeBps(uint16 feeBps) external",
  "function setCurvePolBps(uint16 polBps) external",
];

// ============================================
// MAIN SCRIPT
// ============================================

async function main() {
  console.log("\n🚀 H1 Labs Diamond Configuration Script\n");
  console.log("=" .repeat(60));
  
  // Validate config
  if (!CONFIG.PRIVATE_KEY) {
    console.error("❌ Error: PRIVATE_KEY not set in environment");
    process.exit(1);
  }
  
  if (CONFIG.PROTOCOL_TREASURY === "0xYourTreasuryAddressHere") {
    console.error("❌ Error: Please set PROTOCOL_TREASURY in CONFIG");
    process.exit(1);
  }
  
  // Setup provider and signer
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const signer = new ethers.Wallet(CONFIG.PRIVATE_KEY, provider);
  const signerAddress = await signer.getAddress();
  
  console.log(`\n📍 Network: Base Sepolia (Chain ID: ${CONFIG.CHAIN_ID})`);
  console.log(`👤 Signer: ${signerAddress}`);
  console.log(`💎 Diamond: ${CONFIG.DIAMOND_ADDRESS}`);
  console.log(`🪙 LABS Token: ${CONFIG.LABS_TOKEN_ADDRESS}\n`);
  
  // Check balance
  const balance = await provider.getBalance(signerAddress);
  console.log(`💰 ETH Balance: ${ethers.formatEther(balance)} ETH\n`);
  
  if (balance === 0n) {
    console.error("❌ Error: No ETH balance for gas fees");
    process.exit(1);
  }
  
  console.log("=" .repeat(60));
  
  // Step 1: Set LABS Token
  console.log("\n📝 Step 1: Setting LABS Token Address");
  try {
    const treasuryFacet = new ethers.Contract(
      CONFIG.DIAMOND_ADDRESS,
      TREASURY_FACET_ABI,
      signer
    );
    
    const tx1 = await treasuryFacet.setLABSToken(CONFIG.LABS_TOKEN_ADDRESS);
    console.log(`   ⏳ Transaction sent: ${tx1.hash}`);
    await tx1.wait();
    console.log(`   ✅ LABS token configured`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    if (error.message.includes("not a contract owner")) {
      console.error("   💡 Hint: Make sure you're using the diamond owner's private key");
    }
  }
  
  // Step 2: Set Default Cooldown
  console.log("\n📝 Step 2: Setting Default Cooldown");
  console.log(`   Value: ${CONFIG.DEFAULT_COOLDOWN} seconds (${CONFIG.DEFAULT_COOLDOWN / 3600} hours)`);
  try {
    const testingFacet = new ethers.Contract(
      CONFIG.DIAMOND_ADDRESS,
      TESTING_FACET_ABI,
      signer
    );
    
    const tx2 = await testingFacet.setDefaultCooldown(CONFIG.DEFAULT_COOLDOWN);
    console.log(`   ⏳ Transaction sent: ${tx2.hash}`);
    await tx2.wait();
    console.log(`   ✅ Default cooldown set`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    if (error.message.includes("function selector was not found")) {
      console.error("   💡 Hint: TestingFacet may not be attached to diamond yet");
      console.error("   💡 You can skip this step and set it later after attaching TestingFacet");
    }
  }
  
  // Step 3: Set Default Exit Cap
  console.log("\n📝 Step 3: Setting Default Exit Cap");
  console.log(`   Value: ${CONFIG.DEFAULT_EXIT_CAP_BPS} bps (${CONFIG.DEFAULT_EXIT_CAP_BPS / 100}%)`);
  try {
    const testingFacet = new ethers.Contract(
      CONFIG.DIAMOND_ADDRESS,
      TESTING_FACET_ABI,
      signer
    );
    
    const tx3 = await testingFacet.setDefaultExitCap(CONFIG.DEFAULT_EXIT_CAP_BPS);
    console.log(`   ⏳ Transaction sent: ${tx3.hash}`);
    await tx3.wait();
    console.log(`   ✅ Default exit cap set`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
  
  // Step 4: Set Protocol Treasury
  console.log("\n📝 Step 4: Setting Protocol Treasury");
  console.log(`   Address: ${CONFIG.PROTOCOL_TREASURY}`);
  try {
    const testingFacet = new ethers.Contract(
      CONFIG.DIAMOND_ADDRESS,
      TESTING_FACET_ABI,
      signer
    );
    
    const tx4 = await testingFacet.setProtocolTreasury(CONFIG.PROTOCOL_TREASURY);
    console.log(`   ⏳ Transaction sent: ${tx4.hash}`);
    await tx4.wait();
    console.log(`   ✅ Protocol treasury set`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
  
  // Step 5: Set Curve Fee
  console.log("\n📝 Step 5: Setting Curve Fee (optional)");
  console.log(`   Value: ${CONFIG.CURVE_FEE_BPS} bps (${CONFIG.CURVE_FEE_BPS / 100}%)`);
  try {
    const testingFacet = new ethers.Contract(
      CONFIG.DIAMOND_ADDRESS,
      TESTING_FACET_ABI,
      signer
    );
    
    const tx5 = await testingFacet.setCurveFeeBps(CONFIG.CURVE_FEE_BPS);
    console.log(`   ⏳ Transaction sent: ${tx5.hash}`);
    await tx5.wait();
    console.log(`   ✅ Curve fee set`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
  
  // Step 6: Set Curve POL
  console.log("\n📝 Step 6: Setting Curve POL (optional)");
  console.log(`   Value: ${CONFIG.CURVE_POL_BPS} bps (${CONFIG.CURVE_POL_BPS / 100}%)`);
  try {
    const testingFacet = new ethers.Contract(
      CONFIG.DIAMOND_ADDRESS,
      TESTING_FACET_ABI,
      signer
    );
    
    const tx6 = await testingFacet.setCurvePolBps(CONFIG.CURVE_POL_BPS);
    console.log(`   ⏳ Transaction sent: ${tx6.hash}`);
    await tx6.wait();
    console.log(`   ✅ Curve POL set`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("\n✨ Configuration Complete!\n");
  console.log("Next steps:");
  console.log("1. Create Uniswap V3 pool (LABS/WETH)");
  console.log("2. Add initial liquidity");
  console.log("3. Update frontend with contract addresses");
  console.log("4. Test end-to-end user flow\n");
  console.log("See DEPLOYMENT_NEXT_STEPS.md for details.\n");
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });


