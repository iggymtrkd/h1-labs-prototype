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
  event LabCreated(uint256 indexed labId, address indexed owner, string name, string symbol, string domain, address h1Token);
  event VaultDeployed(uint256 indexed labId, address indexed vault, uint64 cooldownSeconds, uint16 exitCapBps);
  event Staked(address indexed staker, uint256 amount);

  error InvalidString();
  error InvalidAmount();
  error DomainAlreadyExists();
  error LabsTokenNotSet();
  error TransferFailed();

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
    
    labId = hs.nextLabId++;
    hs.labs[labId].owner = msg.sender;
    hs.labs[labId].domain = domain;
    hs.labs[labId].active = true;
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

    emit LabCreated(labId, msg.sender, name, symbol, domain, vault);
    emit VaultDeployed(labId, vault, hs.defaultCooldown, hs.defaultExitCapBps);
  }
  
  function isDomainAvailable(string calldata domain) external view returns (bool) {
    bytes32 domainKey = keccak256(bytes(domain));
    return !LibH1Storage.h1Storage().domainTaken[domainKey];
  }
}