const { ethers } = require("ethers");

async function checkLabCreation() {
  const H1Diamond = "0x29a7297e84df485aff8def2d27e467f3a37619c0";
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  
  // Get user's address (replace with actual)
  const userAddress = process.argv[2] || "0xYOUR_ADDRESS";
  
  console.log("🔍 Checking Lab Creation Prerequisites...\n");
  console.log("User Address:", userAddress);
  console.log("Diamond:", H1Diamond);
  console.log("");
  
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
  
  try {
    // Check 1: Protocol params
    console.log("1️⃣ Checking Protocol Parameters...");
    const params = await diamond.getProtocolParams();
    console.log("   LABS Token:", params.labsToken);
    console.log("   Treasury:", params.protocolTreasury);
    console.log("   Default Cooldown:", params.defaultCooldown.toString());
    console.log("   Default Exit Cap (BPS):", params.defaultExitCapBps.toString());
    console.log("   Curve Fee (BPS):", params.curveFeeBps.toString());
    console.log("   Curve POL (BPS):", params.curvePolBps.toString());
    console.log("   Defaults Initialized:", params.defaultsInitialized);
    
    if (!params.defaultsInitialized) {
      console.log("   ❌ PROBLEM: Defaults not initialized!");
    } else {
      console.log("   ✅ Defaults initialized");
    }
    
    if (params.labsToken === ethers.ZeroAddress) {
      console.log("   ❌ PROBLEM: LABS token not set!");
    } else {
      console.log("   ✅ LABS token set");
    }
    
    if (params.protocolTreasury === ethers.ZeroAddress) {
      console.log("   ❌ PROBLEM: Treasury not set!");
    } else {
      console.log("   ✅ Treasury set");
    }
    
    console.log("");
    
    // Check 2: Vault factory
    console.log("2️⃣ Checking Vault Factory...");
    const factory = await diamond.getVaultFactory();
    console.log("   Vault Factory:", factory);
    
    if (factory === ethers.ZeroAddress) {
      console.log("   ❌ PROBLEM: Vault factory not set!");
    } else {
      console.log("   ✅ Vault factory set");
    }
    
    console.log("");
    
    // Check 3: User's staked balance
    console.log("3️⃣ Checking Your Staked Balance...");
    const staked = await diamond.getStakedBalance(userAddress);
    const stakedAmount = ethers.formatEther(staked);
    console.log("   Staked:", stakedAmount, "LABS");
    console.log("   Required: 100,000 LABS");
    
    if (parseFloat(stakedAmount) < 100000) {
      console.log("   ❌ PROBLEM: Insufficient stake! Need", (100000 - parseFloat(stakedAmount)).toFixed(2), "more LABS");
    } else {
      console.log("   ✅ Sufficient stake");
    }
    
    console.log("");
    
    // Check 4: Try staticCall to see exact error
    console.log("4️⃣ Testing Lab Creation with staticCall...");
    try {
      const result = await deploymentFacet.createLab.staticCall(
        "Test Lab",
        "TEST",
        "healthcare"
      );
      console.log("   ✅ Static call succeeded!");
      console.log("   Would create Lab ID:", result[0].toString());
      console.log("   Vault would be:", result[1]);
      console.log("   Curve would be:", result[2]);
    } catch (staticErr) {
      console.log("   ❌ Static call FAILED!");
      console.log("   Error:", staticErr.message);
      console.log("");
      
      // Try to decode the error
      const errorData = staticErr.data || "";
      console.log("   Raw error data:", errorData);
      
      // Known error selectors
      const errors = {
        "0xb4fa3fb3": "InvalidInput()",
        "0xccb21934": "InsufficientStake()", 
        "0x7138356f": "FactoryNotSet()",
        "0xe27034e7": "InvalidVaultAddress()"
      };
      
      for (const [selector, name] of Object.entries(errors)) {
        if (errorData.includes(selector.slice(2))) {
          console.log("   🔍 Decoded error:", name);
          break;
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Error running checks:", error.message);
  }
}

checkLabCreation().catch(console.error);
