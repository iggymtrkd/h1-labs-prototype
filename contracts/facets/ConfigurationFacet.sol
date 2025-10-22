// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LibDiamond } from "../diamond-standard/libraries/LibDiamond.sol";

/// @title ConfigurationFacet
/// @notice Production configuration management for H1 Labs protocol
/// @dev Manages protocol-wide settings with built-in defaults
contract ConfigurationFacet {
  event ProtocolConfigurationUpdated(string indexed parameter, uint256 value, address indexed updatedBy);
  event DefaultsInitialized(
    uint64 cooldown,
    uint16 exitCapBps,
    uint16 curveFeeBps,
    uint16 curvePolBps,
    address treasury
  );
  
  error Unauthorized();
  error InvalidAddress();
  error InvalidParameter();
  error AlreadyInitialized();
  
  /// @notice Ensures only diamond owner can call configuration functions
  modifier onlyOwner() {
    LibDiamond.enforceIsContractOwner();
    _;
  }
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  /// @notice Initialize protocol with default configuration values
  /// @dev Can only be called once. Sets all default parameters at once.
  /// @param treasury Protocol treasury address
  function initializeDefaults(address treasury) external onlyOwner {
    if (treasury == address(0)) revert InvalidAddress();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.defaultsInitialized) revert AlreadyInitialized();
    
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
      LibH1Storage.DEFAULT_CURVE_POL_BPS,
      treasury
    );
  }
  
  // ============================================
  // CONFIGURATION SETTERS (WITH DEFAULTS)
  // ============================================
  
  /// @notice Get default constant for cooldown
  /// @return cooldown Default cooldown period in seconds (1 day = 86400 seconds)
  function getDefaultCooldownConstant() external pure returns (uint64 cooldown) {
    return LibH1Storage.DEFAULT_COOLDOWN;
  }
  
  /// @notice Set cooldown period for new vaults
  /// @dev Overrides the default. Only affects vaults created after this call.
  /// @param seconds_ Cooldown period in seconds (max 30 days)
  function setCooldown(uint64 seconds_) external onlyOwner {
    if (seconds_ > 30 days) revert InvalidParameter();
    LibH1Storage.h1Storage().defaultCooldown = seconds_;
    emit ProtocolConfigurationUpdated("cooldown", seconds_, msg.sender);
  }
  
  /// @notice Get default constant for exit cap
  /// @return bps Default exit cap in basis points (20% = 2000 bps)
  function getDefaultExitCapConstant() external pure returns (uint16 bps) {
    return LibH1Storage.DEFAULT_EXIT_CAP_BPS;
  }
  
  /// @notice Set exit cap for new vaults
  /// @dev Overrides the default. Only affects vaults created after this call.
  /// @param bps Exit cap in basis points (10000 = 100%)
  function setExitCap(uint16 bps) external onlyOwner {
    if (bps > 10000) revert InvalidParameter();
    LibH1Storage.h1Storage().defaultExitCapBps = bps;
    emit ProtocolConfigurationUpdated("exitCap", bps, msg.sender);
  }
  
  /// @notice Get default constant for bonding curve fee
  /// @return feeBps Default curve fee in basis points (5% = 500 bps)
  function getDefaultCurveFeeBpsConstant() external pure returns (uint16 feeBps) {
    return LibH1Storage.DEFAULT_CURVE_FEE_BPS;
  }
  
  /// @notice Set bonding curve fee for new curves
  /// @dev Overrides the default. Only affects curves created after this call.
  /// @param feeBps Fee in basis points (max 1000 = 10%)
  function setCurveFeeBps(uint16 feeBps) external onlyOwner {
    if (feeBps > 1000) revert InvalidParameter();
    LibH1Storage.h1Storage().curveFeeBps = feeBps;
    emit ProtocolConfigurationUpdated("curveFeeBps", feeBps, msg.sender);
  }
  
  /// @notice Get default constant for bonding curve POL allocation
  /// @return polBps Default POL allocation in basis points (5% = 500 bps)
  function getDefaultCurvePolBpsConstant() external pure returns (uint16 polBps) {
    return LibH1Storage.DEFAULT_CURVE_POL_BPS;
  }
  
  /// @notice Set bonding curve POL allocation for new curves
  /// @dev Overrides the default. Only affects curves created after this call.
  /// @param polBps POL allocation in basis points (max 1000 = 10%)
  function setCurvePolBps(uint16 polBps) external onlyOwner {
    if (polBps > 1000) revert InvalidParameter();
    LibH1Storage.h1Storage().curvePolBps = polBps;
    emit ProtocolConfigurationUpdated("curvePolBps", polBps, msg.sender);
  }
  
  /// @notice Set protocol treasury address
  /// @param treasury New treasury address
  function setProtocolTreasury(address treasury) external onlyOwner {
    if (treasury == address(0)) revert InvalidAddress();
    LibH1Storage.h1Storage().protocolTreasury = treasury;
    emit ProtocolConfigurationUpdated("protocolTreasury", uint256(uint160(treasury)), msg.sender);
  }
  
  /// @notice Set LABS token address
  /// @param labsToken Address of the LABS token contract
  function setLABSToken(address labsToken) external onlyOwner {
    if (labsToken == address(0)) revert InvalidAddress();
    LibH1Storage.h1Storage().labsToken = labsToken;
    emit ProtocolConfigurationUpdated("labsToken", uint256(uint160(labsToken)), msg.sender);
  }
  
  // ============================================
  // QUERY FUNCTIONS
  // ============================================
  
  /// @notice Get all current configuration values
  /// @return labsToken LABS token address
  /// @return protocolTreasury Treasury address
  /// @return defaultCooldown Current default cooldown
  /// @return defaultExitCapBps Current default exit cap
  /// @return curveFeeBps Current curve fee
  /// @return curvePolBps Current curve POL allocation
  /// @return defaultsInitialized Whether defaults have been initialized
  function getConfiguration() external view returns (
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
  
  /// @notice Get all default constant values (hardcoded)
  /// @return defaultCooldown Default cooldown constant
  /// @return defaultExitCapBps Default exit cap constant
  /// @return curveFeeBps Default curve fee constant
  /// @return curvePolBps Default curve POL constant
  function getDefaultConstants() external pure returns (
    uint64 defaultCooldown,
    uint16 defaultExitCapBps,
    uint16 curveFeeBps,
    uint16 curvePolBps
  ) {
    defaultCooldown = LibH1Storage.DEFAULT_COOLDOWN;
    defaultExitCapBps = LibH1Storage.DEFAULT_EXIT_CAP_BPS;
    curveFeeBps = LibH1Storage.DEFAULT_CURVE_FEE_BPS;
    curvePolBps = LibH1Storage.DEFAULT_CURVE_POL_BPS;
  }
}
