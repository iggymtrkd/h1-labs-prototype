// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LibLabVaultFactory } from "../libraries/LibLabVaultFactory.sol";

interface IERC20 {
  function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @title LABSCoreFacet
/// @notice Core functionality for lab creation and LABS token staking
/// @dev Diamond facet for H1 Labs platform core operations
contract LABSCoreFacet {
  event LabCreated(uint256 indexed labId, address indexed owner, string name, string symbol, string domain, address h1Token, uint8 level);
  event VaultDeployed(uint256 indexed labId, address indexed vault, uint64 cooldownSeconds, uint16 exitCapBps);
  event Staked(address indexed staker, uint256 amount);

  error InvalidString();
  error InvalidAmount();
  error DomainAlreadyExists();
  error LabsTokenNotSet();
  error TransferFailed();
  error InsufficientStake(uint256 required, uint256 actual);

  // Lab level thresholds (in wei, 18 decimals)
  uint256 constant MIN_STAKE_FOR_LAB = 100_000e18;    // 100,000 LABS
  uint256 constant LEVEL1_THRESHOLD = 100_000e18;     // Level 1: 100,000 LABS
  uint256 constant LEVEL2_THRESHOLD = 250_000e18;     // Level 2: 250,000 LABS
  uint256 constant LEVEL3_THRESHOLD = 500_000e18;     // Level 3: 500,000 LABS

  // NOTE: storage moved to LibH1Storage to avoid diamond storage collisions

  /// @notice Stakes LABS tokens to earn LabSlot NFT eligibility
  /// @dev Transfers LABS tokens from user and tracks staked balance
  /// @param amount Amount of LABS tokens to stake (must be > 0)
  function stakeLABS(uint256 amount) external {
    if (amount == 0) revert InvalidAmount();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.labsToken == address(0)) revert LabsTokenNotSet();
    
    // Transfer LABS tokens from user to this contract using proper ERC-20 interface
    require(
      IERC20(hs.labsToken).transferFrom(msg.sender, address(this), amount),
      "TransferFailed"
    );
    
    // Track staked balance
    unchecked {
      LibH1Storage.h1Storage().stakedBalances[msg.sender] += amount; // Safe: overflow unlikely with real token amounts
    }
    
    emit Staked(msg.sender, amount);
    
    // Note: LabSlot NFT minting logic to be added in separate facet/upgrade
  }

  function createLab(string calldata name, string calldata symbol, string calldata domain) external returns (uint256 labId) {
    // Input validation
    if (bytes(name).length == 0 || bytes(name).length > 50) revert InvalidString();
    if (bytes(symbol).length == 0 || bytes(symbol).length > 10) revert InvalidString();
    if (bytes(domain).length == 0 || bytes(domain).length > 100) revert InvalidString();
    bytes32 domainKey = keccak256(bytes(domain));
    if (LibH1Storage.h1Storage().domainTaken[domainKey]) revert DomainAlreadyExists();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    if (hs.labsToken == address(0)) revert LabsTokenNotSet();
    
    // ✅ NEW: Validate staked balance meets minimum requirement
    uint256 stakedBalance = hs.stakedBalances[msg.sender];
    if (stakedBalance < MIN_STAKE_FOR_LAB) {
      revert InsufficientStake(MIN_STAKE_FOR_LAB, stakedBalance);
    }
    
    // ✅ NEW: Calculate lab level based on staked amount
    uint8 labLevel;
    if (stakedBalance >= LEVEL3_THRESHOLD) {
      labLevel = 3;
    } else if (stakedBalance >= LEVEL2_THRESHOLD) {
      labLevel = 2;
    } else {
      labLevel = 1;  // Minimum is level 1 (already validated above)
    }
    
    labId = hs.nextLabId++;
    hs.labs[labId].owner = msg.sender;
    hs.labs[labId].domain = domain;
    hs.labs[labId].active = true;
    hs.labs[labId].level = labLevel;  // ✅ NEW: Store the calculated level
    hs.domainTaken[domainKey] = true;

    // Auto-deploy LabVault (ERC-4626-style shares as H1 token)
    address vault = LibLabVaultFactory.deployVault(
      hs.labsToken,
      name,
      symbol,
      name,
      hs.defaultCooldown,
      hs.defaultExitCapBps,
      msg.sender,
      msg.sender,
      hs.protocolTreasury
    );
    hs.labIdToVault[labId] = vault;
    hs.labs[labId].h1Token = vault;

    emit LabCreated(labId, msg.sender, name, symbol, domain, vault, labLevel);  // ✅ NEW: Include level in event
    emit VaultDeployed(labId, vault, hs.defaultCooldown, hs.defaultExitCapBps);
  }
  
  function isDomainAvailable(string calldata domain) external view returns (bool) {
    bytes32 domainKey = keccak256(bytes(domain));
    return !LibH1Storage.h1Storage().domainTaken[domainKey];
  }

  /// @notice Get the level of a created lab (1-3)
  /// @param labId The lab ID to query
  /// @return level Lab level (0 = no level, 1-3 = valid levels)
  function getLabLevel(uint256 labId) external view returns (uint8 level) {
    return LibH1Storage.h1Storage().labs[labId].level;
  }

  /// @notice Get the staked LABS balance for a user
  /// @param user The user address to query
  /// @return amount Total LABS staked by the user
  function getStakedBalance(address user) external view returns (uint256 amount) {
    return LibH1Storage.h1Storage().stakedBalances[user];
  }

  /// @notice Get all lab details including level
  /// @param labId The lab ID to query
  /// @return owner Lab owner address
  /// @return h1Token H1 token (vault) address
  /// @return domain Lab domain
  /// @return active Whether lab is active
  /// @return level Lab level (1-3)
  function getLabDetails(uint256 labId) external view returns (
    address owner,
    address h1Token,
    string memory domain,
    bool active,
    uint8 level
  ) {
    LibH1Storage.Lab storage lab = LibH1Storage.h1Storage().labs[labId];
    return (lab.owner, lab.h1Token, lab.domain, lab.active, lab.level);
  }
}