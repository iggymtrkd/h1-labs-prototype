// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

interface ILabVaultFactory {
  function deployVault(
    address labsToken,
    string calldata h1Name,
    string calldata h1Symbol,
    string calldata labDisplayName,
    uint64 cooldownSeconds,
    uint16 epochExitCapBps,
    address admin,
    address labOwner,
    address treasury,
    address diamond
  ) external returns (address vault);
}

/// @title LabVaultDeploymentFacet
/// @notice Creates lab entry and deploys vault (Step 1 of lab creation)
/// @dev Uses external factory to reduce contract size
contract LabVaultDeploymentFacet {
  event LabVaultDeployed(uint256 indexed labId, address indexed owner, address vault);
  
  error InvalidInput();
  error InsufficientStake();
  error FactoryNotSet();
  
  uint256 constant MIN_STAKE = 100_000e18;
  
  /// @notice Create lab and deploy vault (Step 1 of 2)
  /// @return labId The newly created lab ID
  /// @return vault The deployed vault address
  function createLabStep1(
    string calldata name,
    string calldata symbol,
    string calldata domain
  ) external returns (uint256 labId, address vault) {
    // Validate
    if (bytes(name).length == 0 || bytes(name).length > 50) revert InvalidInput();
    if (bytes(symbol).length == 0 || bytes(symbol).length > 10) revert InvalidInput();
    if (bytes(domain).length == 0 || bytes(domain).length > 100) revert InvalidInput();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    if (hs.stakedBalances[msg.sender] < MIN_STAKE) revert InsufficientStake();
    
    // Calculate level
    uint256 bal = hs.stakedBalances[msg.sender];
    uint8 level = bal >= 500_000e18 ? 3 : (bal >= 250_000e18 ? 2 : 1);
    
    // Create lab
    labId = hs.nextLabId++;
    hs.labs[labId].owner = msg.sender;
    hs.labs[labId].domain = domain;
    hs.labs[labId].active = true;
    hs.labs[labId].level = level;
    
    // Deploy vault via external factory
    if (hs.vaultFactory == address(0)) revert FactoryNotSet();
    
    vault = ILabVaultFactory(hs.vaultFactory).deployVault(
      hs.labsToken,
      name,
      symbol,
      name,
      hs.defaultCooldown,
      hs.defaultExitCapBps,
      msg.sender,
      msg.sender,
      hs.protocolTreasury,
      address(this)
    );
    
    hs.labIdToVault[labId] = vault;
    hs.labs[labId].h1Token = vault;
    
    emit LabVaultDeployed(labId, msg.sender, vault);
  }
}

