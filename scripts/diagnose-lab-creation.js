/**
 * Diagnose Lab Creation Issues
 * 
 * This script checks all prerequisites for lab creation and identifies
 * the exact reason why the transaction is reverting.
 * 
 * Usage:
 *   node scripts/diagnose-lab-creation.js YOUR_WALLET_ADDRESS
 */

const { ethers } = require("ethers");

const H1Diamond = "0x29a7297e84df485aff8def2d27e467f3a37619c0";
const RPC_URL = "https://sepolia.base.org";

async function diagnose() {
  const userAddress = process.argv[2];
  
  if (!userAddress) {
    console.log("❌ Please provide your wallet address:");
    console.log("   node scripts/diagnose-lab-creation.js YOUR_WALLET_ADDRESS");
    process.exit(1);
  }
  
  console.log("🔍 Diagnosing Lab Creation Issues...\n");
  console.log("User Address:", userAddress);
  console.log("Diamond:", H1Diamond);
  console.log("Network: Base Sepolia\n");
  console.log("=".repeat(70));
  
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  const TestingFacet_ABI = [
    "function getProtocolParams() external view returns (address labsToken, address protocolTreasury, uint64 defaultCooldown, uint16 defaultExitCapBps, uint16 curveFeeBps, uint16 curvePolBps, bool defaultsInitialized)",
    "function getVaultFactory() external view returns (address)",
    "function getStakedBalance(address user) external view returns (uint256)"
  ];
  
  const LabVaultDeploymentFacet_ABI = [
    "function createLab(string calldata name, string calldata symbol, string calldata domain) external returns (uint256 labId, address vault, address curve)"
  ];
  
  const diamond = new ethers.Contract(H1Diamond, TestingFacet_ABI, provider);
  const deploymentFacet = new ethers.Contract(H1Diamond, LabVaultDeploymentFacet_ABI, provider);
  
  let issuesFound = [];
  
  try {
    // CHECK 1: Protocol Parameters
    console.log("\n1️⃣  PROTOCOL PARAMETERS");
    console.log("─".repeat(70));
    
    const params = await diamond.getProtocolParams();
    
    console.log("LABS Token:          ", params.labsToken);
    console.log("Protocol Treasury:   ", params.protocolTreasury);
    console.log("Default Cooldown:    ", params.defaultCooldown.toString(), "seconds");
    console.log("Default Exit Cap:    ", params.defaultExitCapBps.toString(), "BPS");
    console.log("Curve Fee:           ", params.curveFeeBps.toString(), "BPS");
    console.log("Curve POL:           ", params.curvePolBps.toString(), "BPS");
    console.log("Defaults Initialized:", params.defaultsInitialized);
    
    if (!params.defaultsInitialized) {
      issuesFound.push("❌ CRITICAL: Protocol defaults NOT initialized");
      console.log("\n❌ PROBLEM: Defaults not initialized!");
      console.log("   Solution: Call initializeDefaults(treasury) as Diamond owner");
    } else {
      console.log("\n✅ Defaults initialized");
    }
    
    if (params.labsToken === ethers.ZeroAddress) {
      issuesFound.push("❌ CRITICAL: LABS token not set");
      console.log("❌ PROBLEM: LABS token not set!");
    } else {
      console.log("✅ LABS token configured");
    }
    
    if (params.protocolTreasury === ethers.ZeroAddress) {
      issuesFound.push("❌ CRITICAL: Protocol treasury not set");
      console.log("❌ PROBLEM: Protocol treasury not set!");
    } else {
      console.log("✅ Protocol treasury configured");
    }
    
  } catch (error) {
    console.log("❌ Failed to read protocol params:", error.message);
    issuesFound.push("Cannot read protocol parameters");
  }
  
  try {
    // CHECK 2: Vault Factory
    console.log("\n2️⃣  VAULT FACTORY");
    console.log("─".repeat(70));
    
    const factory = await diamond.getVaultFactory();
    console.log("Vault Factory:", factory);
    
    if (factory === ethers.ZeroAddress) {
      issuesFound.push("❌ CRITICAL: Vault factory not set");
      console.log("\n❌ PROBLEM: Vault factory not set!");
      console.log("   Solution: Call setVaultFactory(0xd7dc1f9b3cd8c0eeb44e3cdf8c14447540f05e9f)");
    } else {
      console.log("\n✅ Vault factory configured");
      
      if (factory.toLowerCase() === "0xd7dc1f9b3cd8c0eeb44e3cdf8c14447540f05e9f") {
        console.log("✅ Correct factory address");
      } else {
        console.log("⚠️  WARNING: Factory address doesn't match expected value");
      }
    }
    
  } catch (error) {
    console.log("❌ Failed to read vault factory:", error.message);
    issuesFound.push("Cannot read vault factory");
  }
  
  try {
    // CHECK 3: User's Staked Balance
    console.log("\n3️⃣  YOUR STAKED BALANCE");
    console.log("─".repeat(70));
    
    const staked = await diamond.getStakedBalance(userAddress);
    const stakedAmount = parseFloat(ethers.formatEther(staked));
    
    console.log("Your Staked LABS:", stakedAmount.toLocaleString());
    console.log("Required:        100,000 LABS");
    console.log("Difference:     ", (stakedAmount - 100000).toLocaleString(), "LABS");
    
    if (stakedAmount < 100000) {
      issuesFound.push("❌ CRITICAL: Insufficient LABS staked");
      console.log("\n❌ PROBLEM: Insufficient stake!");
      console.log("   You need", (100000 - stakedAmount).toLocaleString(), "more LABS");
      console.log("   Solution: Stake more LABS tokens");
    } else {
      console.log("\n✅ Sufficient stake");
      
      // Calculate lab level
      let level = 1;
      if (stakedAmount >= 500000) level = 3;
      else if (stakedAmount >= 250000) level = 2;
      console.log("✅ Your lab will be Level", level);
    }
    
  } catch (error) {
    console.log("❌ Failed to read staked balance:", error.message);
    issuesFound.push("Cannot read staked balance");
  }
  
  // CHECK 4: Test with staticCall
  console.log("\n4️⃣  SIMULATING LAB CREATION");
  console.log("─".repeat(70));
  console.log("Testing: createLab('Test Lab', 'TEST', 'healthcare')\n");
  
  try {
    const result = await deploymentFacet.createLab.staticCall(
      "Test Lab",
      "TEST",
      "healthcare"
    );
    
    console.log("✅ SIMULATION SUCCESSFUL!");
    console.log("   Lab ID:", result[0].toString());
    console.log("   Vault:", result[1]);
    console.log("   Curve:", result[2]);
    console.log("\n🎉 Lab creation should work! Transaction will succeed.");
    
  } catch (staticErr) {
    console.log("❌ SIMULATION FAILED!");
    console.log("\nError message:", staticErr.message);
    
    // Try to decode error
    const errorData = staticErr.data || staticErr.error?.data || "";
    console.log("\nRaw error data:", errorData);
    
    // Known error selectors
    const errorMap = {
      "b4fa3fb3": { name: "InvalidInput()", reason: "Name, symbol, or domain length invalid" },
      "ccb21934": { name: "InsufficientStake()", reason: "Need at least 100,000 LABS staked" },
      "7138356f": { name: "FactoryNotSet()", reason: "Vault factory not configured" },
      "InvalidVaultAddress": { name: "InvalidVaultAddress()", reason: "Vault deployment failed" }
    };
    
    let errorFound = false;
    for (const [selector, info] of Object.entries(errorMap)) {
      if (errorData.includes(selector) || staticErr.message.includes(selector)) {
        console.log("\n🔍 DECODED ERROR:", info.name);
        console.log("   Reason:", info.reason);
        issuesFound.push(`❌ Contract error: ${info.name} - ${info.reason}`);
        errorFound = true;
        break;
      }
    }
    
    if (!errorFound) {
      issuesFound.push("❌ Unknown contract error during simulation");
    }
  }
  
  // SUMMARY
  console.log("\n" + "=".repeat(70));
  console.log("📊 DIAGNOSIS SUMMARY");
  console.log("=".repeat(70));
  
  if (issuesFound.length === 0) {
    console.log("\n✅ All checks passed!");
    console.log("✅ Lab creation should work from frontend!");
  } else {
    console.log("\n❌ Issues found:\n");
    issuesFound.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
    
    console.log("\n📝 NEXT STEPS:");
    
    if (issuesFound.some(i => i.includes("defaults NOT initialized"))) {
      console.log("\n   1. Initialize protocol defaults:");
      console.log("      npx hardhat run scripts/initialize-defaults.js --network baseSepolia");
    }
    
    if (issuesFound.some(i => i.includes("Vault factory"))) {
      console.log("\n   2. Set vault factory:");
      console.log("      npx hardhat run scripts/set-vault-factory.js --network baseSepolia");
    }
    
    if (issuesFound.some(i => i.includes("Insufficient"))) {
      console.log("\n   3. Stake more LABS tokens:");
      console.log("      - Go to frontend");
      console.log("      - Use 'Stake LABS' section");
      console.log("      - Stake at least 100,000 LABS");
    }
  }
  
  console.log("\n" + "=".repeat(70));
}

diagnose().catch((error) => {
  console.error("\n❌ Fatal error:", error.message);
  process.exit(1);
});

