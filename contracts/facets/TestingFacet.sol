// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LibDiamond } from "../diamond-standard/libraries/LibDiamond.sol";
import { LabVault } from "../vaults/LabVault.sol";
import { LABSToken } from "../tokens/LABSToken.sol";

/// @title TestingFacet
/// @notice Admin testing utilities for accelerating testnet development
/// @dev ⚠️ TESTNET ONLY - Contains privileged functions for testing financial flows
/// @custom:security Should NOT be deployed to mainnet
contract TestingFacet {
  event TestingParameterUpdated(string indexed parameter, uint256 value, address indexed target);
  event LABSMinted(address indexed to, uint256 amount);
  event VaultTimeOffsetSet(address indexed vault, uint256 offset);
  event VaultLevelOverridden(address indexed vault, uint8 level);
  event VaultTestModeChanged(address indexed vault, bool enabled);
  event EpochForceReset(address indexed vault, uint64 newEpochStart);
  event DefaultsInitialized(uint64 cooldown, uint16 exitCapBps, uint16 curveFeeBps, uint16 curvePolBps);
  event ProtocolConfigurationUpdated(string indexed parameter, uint256 value);
  
  error Unauthorized();
  error InvalidAddress();
  error InvalidParameter();
  
  /// @notice Ensures only diamond owner can call testing functions
  modifier onlyOwner() {
    LibDiamond.enforceIsContractOwner();
    _;
  }
  
  // ============================================
  // INITIALIZATION & CONFIGURATION
  // ============================================
  
  /// @notice Initialize protocol with default values (can only be called once)
  /// @dev Sets default cooldown, exit cap, curve fees, and POL allocation
  /// @param treasury Protocol treasury address
  function initializeDefaults(address treasury) external onlyOwner {
    if (treasury == address(0)) revert InvalidAddress();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    require(!hs.defaultsInitialized, "Defaults already initialized");
    
    hs.defaultCooldown = LibH1Storage.DEFAULT_COOLDOWN;
    hs.defaultExitCapBps = LibH1Storage.DEFAULT_EXIT_CAP_BPS;
    hs.curveFeeBps = LibH1Storage.DEFAULT_CURVE_FEE_BPS;
    hs.curvePolBps = LibH1Storage.DEFAULT_CURVE_POL_BPS;
    hs.protocolTreasury = treasury;
    hs.defaultsInitialized = true;
    
    emit DefaultsInitialized(
      LibH1Storage.DEFAULT_COOLDOWN,
      LibH1Storage.DEFAULT_EXIT_CAP_BPS,
      LibH1Storage.DEFAULT_CURVE_FEE_BPS,
      LibH1Storage.DEFAULT_CURVE_POL_BPS
    );
  }
  
  // ============================================
  // LABS TOKEN TESTING FUNCTIONS
  // ============================================
  
  /// @notice Mint LABS tokens to any address (TESTNET ONLY)
  /// @dev Allows admin to distribute LABS for testing without needing faucet
  /// @param to Recipient address
  /// @param amount Amount of LABS to mint (18 decimals)
  function mintLABS(address to, uint256 amount) external onlyOwner {
    if (to == address(0)) revert InvalidAddress();
    if (amount == 0) revert InvalidParameter();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    require(hs.labsToken != address(0), "LABS token not set");
    
    LABSToken(hs.labsToken).mint(to, amount);
    emit LABSMinted(to, amount);
  }
  
  /// @notice Batch mint LABS to multiple addresses
  /// @dev Useful for airdropping to test users
  /// @param recipients Array of recipient addresses
  /// @param amounts Array of amounts (must match recipients length)
  function batchMintLABS(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
    require(recipients.length == amounts.length, "length mismatch");
    require(recipients.length <= 100, "too many recipients");
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    require(hs.labsToken != address(0), "LABS token not set");
    
    for (uint256 i = 0; i < recipients.length; i++) {
      if (recipients[i] == address(0)) revert InvalidAddress();
      if (amounts[i] == 0) continue;
      LABSToken(hs.labsToken).mint(recipients[i], amounts[i]);
      emit LABSMinted(recipients[i], amounts[i]);
    }
  }
  
  // ============================================
  // VAULT TESTING FUNCTIONS
  // ============================================
  
  /// @notice Override vault cooldown period
  /// @dev Allows setting cooldown to minutes instead of days for testing
  /// @param vault Address of LabVault
  /// @param seconds_ New cooldown in seconds (can be very short for testing)
  function setVaultCooldown(address vault, uint64 seconds_) external onlyOwner {
    if (vault == address(0)) revert InvalidAddress();
    if (seconds_ > 30 days) revert InvalidParameter();
    
    LabVault(vault).setCooldown(seconds_);
    emit TestingParameterUpdated("cooldown", seconds_, vault);
  }
  
  /// @notice Override vault exit cap
  /// @dev Allows testing exit limits by modifying cap percentage
  /// @param vault Address of LabVault
  /// @param bps Exit cap in basis points (10000 = 100%)
  function setVaultExitCap(address vault, uint16 bps) external onlyOwner {
    if (vault == address(0)) revert InvalidAddress();
    if (bps > 10000) revert InvalidParameter();
    
    LabVault(vault).setEpochExitCapBps(bps);
    emit TestingParameterUpdated("exitCap", bps, vault);
  }
  
  /// @notice Set time offset for vault (fast-forward time)
  /// @dev Allows testing cooldown expiry without waiting days
  /// @param vault Address of LabVault
  /// @param offset Seconds to add to block.timestamp
  function setVaultTimeOffset(address vault, uint256 offset) external onlyOwner {
    if (vault == address(0)) revert InvalidAddress();
    // Allow up to 365 days offset
    if (offset > 365 days) revert InvalidParameter();
    
    LabVault(vault).setTestTimeOffset(offset);
    emit VaultTimeOffsetSet(vault, offset);
  }
  
  /// @notice Enable/disable test mode for vault
  /// @dev Test mode allows level override and other testing features
  /// @param vault Address of LabVault
  /// @param enabled True to enable test mode
  function setVaultTestMode(address vault, bool enabled) external onlyOwner {
    if (vault == address(0)) revert InvalidAddress();
    
    LabVault(vault).setTestMode(enabled);
    emit VaultTestModeChanged(vault, enabled);
  }
  
  /// @notice Override vault level (bypass TVL requirements)
  /// @dev Allows testing app slots without depositing full amounts
  /// @param vault Address of LabVault
  /// @param level Level to set (0-3)
  function overrideVaultLevel(address vault, uint8 level) external onlyOwner {
    if (vault == address(0)) revert InvalidAddress();
    if (level > 3) revert InvalidParameter();
    
    LabVault(vault).setOverrideLevel(level);
    emit VaultLevelOverridden(vault, level);
  }
  
  /// @notice Reset vault epoch (allows more exits immediately)
  /// @dev Useful for testing exit cap limits without waiting 24 hours
  /// @param vault Address of LabVault
  function resetVaultEpoch(address vault) external onlyOwner {
    if (vault == address(0)) revert InvalidAddress();
    
    LabVault(vault).resetEpoch();
    emit EpochForceReset(vault, uint64(block.timestamp));
  }
  
  /// @notice Force complete a redemption request (bypass cooldown)
  /// @dev Allows testing claim flow without waiting for cooldown
  /// @param vault Address of LabVault
  /// @param requestId Redemption request ID
  function forceCompleteRedemption(address vault, uint256 requestId) external onlyOwner {
    if (vault == address(0)) revert InvalidAddress();
    
    LabVault(vault).forceCompleteRedemption(requestId);
    emit TestingParameterUpdated("forceComplete", requestId, vault);
  }
  
  // ============================================
  // PROTOCOL CONFIGURATION WITH DEFAULTS
  // ============================================
  
  /// @notice Override default cooldown for new vaults
  /// @dev Affects only vaults created after this call
  /// @param seconds_ Default cooldown in seconds
  function setDefaultCooldown(uint64 seconds_) external onlyOwner {
    if (seconds_ > 30 days) revert InvalidParameter();
    LibH1Storage.h1Storage().defaultCooldown = seconds_;
    emit ProtocolConfigurationUpdated("defaultCooldown", seconds_);
  }
  
  /// @notice Override default exit cap for new vaults
  /// @dev Affects only vaults created after this call
  /// @param bps Exit cap in basis points
  function setDefaultExitCap(uint16 bps) external onlyOwner {
    if (bps > 10000) revert InvalidParameter();
    LibH1Storage.h1Storage().defaultExitCapBps = bps;
    emit ProtocolConfigurationUpdated("defaultExitCap", bps);
  }
  
  /// @notice Override bonding curve fee
  /// @dev Affects only curves created after this call
  /// @param feeBps Fee in basis points (max 1000 = 10%)
  function setCurveFeeBps(uint16 feeBps) external onlyOwner {
    if (feeBps > 1000) revert InvalidParameter();
    LibH1Storage.h1Storage().curveFeeBps = feeBps;
    emit ProtocolConfigurationUpdated("curveFeeBps", feeBps);
  }
  
  /// @notice Override bonding curve POL allocation
  /// @dev Affects only curves created after this call
  /// @param polBps POL in basis points (max 1000 = 10%)
  function setCurvePolBps(uint16 polBps) external onlyOwner {
    if (polBps > 1000) revert InvalidParameter();
    LibH1Storage.h1Storage().curvePolBps = polBps;
    emit ProtocolConfigurationUpdated("curvePolBps", polBps);
  }
  
  /// @notice Override protocol treasury address
  /// @param treasury New treasury address
  function setProtocolTreasury(address treasury) external onlyOwner {
    if (treasury == address(0)) revert InvalidAddress();
    LibH1Storage.h1Storage().protocolTreasury = treasury;
    emit ProtocolConfigurationUpdated("protocolTreasury", uint256(uint160(treasury)));
  }
  
  /// @notice Set LABS token address
  /// @param labsToken LABS token contract address
  function setLABSToken(address labsToken) external onlyOwner {
    if (labsToken == address(0)) revert InvalidAddress();
    LibH1Storage.h1Storage().labsToken = labsToken;
    emit ProtocolConfigurationUpdated("labsToken", uint256(uint160(labsToken)));
  }
  
  /// @notice Set vault factory address
  /// @dev TESTNET ONLY - Allows anyone to set factory for easier testing
  /// @param factory Address of the LabVaultFactory contract
  function setVaultFactory(address factory) external onlyOwner {
    if (factory == address(0)) revert InvalidAddress();
    LibH1Storage.h1Storage().vaultFactory = factory;
    emit ProtocolConfigurationUpdated("vaultFactory", uint256(uint160(factory)));
  }
  
  /// @notice Get LABS token address
  /// @return labsToken Current LABS token address
  function getLABSToken() external view returns (address labsToken) {
    labsToken = LibH1Storage.h1Storage().labsToken;
  }
  
  /// @notice Get vault factory address
  /// @return factory Current vault factory address
  function getVaultFactory() external view returns (address factory) {
    factory = LibH1Storage.h1Storage().vaultFactory;
  }
  
  // ============================================
  // QUERY FUNCTIONS
  // ============================================
  
  /// @notice Get all default configuration values
  /// @return defaultCooldown Default cooldown for new vaults
  /// @return defaultExitCapBps Default exit cap for new vaults
  /// @return curveFeeBps Default curve fee
  /// @return curvePolBps Default curve POL allocation
  function getDefaultConfiguration() external view returns (
    uint64 defaultCooldown,
    uint16 defaultExitCapBps,
    uint16 curveFeeBps,
    uint16 curvePolBps
  ) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    defaultCooldown = hs.defaultCooldown;
    defaultExitCapBps = hs.defaultExitCapBps;
    curveFeeBps = hs.curveFeeBps;
    curvePolBps = hs.curvePolBps;
  }
  
  /// @notice Get all testing-related parameters for a vault
  /// @param vault Address of LabVault
  /// @return cooldown Current cooldown
  /// @return exitCapBps Current exit cap
  /// @return testMode Whether test mode is enabled
  /// @return timeOffset Current time offset
  function getVaultTestParams(address vault) external view returns (
    uint64 cooldown,
    uint16 exitCapBps,
    bool testMode,
    uint256 timeOffset
  ) {
    LabVault v = LabVault(vault);
    cooldown = v.cooldownSeconds();
    exitCapBps = v.epochExitCapBps();
    testMode = v.testMode();
    timeOffset = v.testTimeOffset();
  }
  
  /// @notice Get all global protocol parameters
  /// @return labsToken LABS token address
  /// @return protocolTreasury Treasury address
  /// @return defaultCooldown Default cooldown for new vaults
  /// @return defaultExitCapBps Default exit cap for new vaults
  /// @return curveFeeBps Curve fee for new curves
  /// @return curvePolBps Curve POL for new curves
  /// @return defaultsInitialized Whether defaults have been initialized
  function getProtocolParams() external view returns (
    address labsToken,
    address protocolTreasury,
    uint64 defaultCooldown,
    uint16 defaultExitCapBps,
    uint16 curveFeeBps,
    uint16 curvePolBps,
    bool defaultsInitialized
  ) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    labsToken = hs.labsToken;
    protocolTreasury = hs.protocolTreasury;
    defaultCooldown = hs.defaultCooldown;
    defaultExitCapBps = hs.defaultExitCapBps;
    curveFeeBps = hs.curveFeeBps;
    curvePolBps = hs.curvePolBps;
    defaultsInitialized = hs.defaultsInitialized;
  }

  /// @notice Get total LABS staked by a user (protocol-level eligibility stake)
  /// @param user Address to query
  /// @return amount Amount of LABS staked by the user
  function getStakedBalance(address user) external view returns (uint256 amount) {
    amount = LibH1Storage.h1Storage().stakedBalances[user];
  }
}

