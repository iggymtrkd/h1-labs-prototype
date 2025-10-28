// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LabVault } from "../vaults/LabVault.sol";
import { LibLabVaultFactory } from "../libraries/LibLabVaultFactory.sol";

/// @title LabVaultFactory
/// @notice External factory for deploying LabVault contracts
/// @dev Separates vault bytecode from facets to reduce contract size
contract LabVaultFactory {
  event VaultDeployed(address indexed vault, address indexed owner);
  
  /// @notice Create and initialize a new LabVault contract (part 1 - metadata)
  /// @dev Must call finalizeVault after this
  function createVault(
    string calldata h1Name,
    string calldata h1Symbol,
    string calldata labDisplayName
  ) external returns (address vault) {
    // Deploy with zero parameters
    LabVault vaultContract = new LabVault();
    vault = address(vaultContract);
    
    // Initialize metadata only
    vaultContract.initializeMetadata(h1Name, h1Symbol, labDisplayName);
  }
  
  /// @notice Finalize vault configuration (part 2)
  /// @dev Must be called after createVault
  function finalizeVault(
    address vault,
    address labsToken,
    uint64 cooldownSeconds,
    uint16 epochExitCapBps,
    address admin,
    address labOwner,
    address treasury,
    address diamond
  ) external {
    LabVault(vault).initializeConfig(
      labsToken,
      cooldownSeconds,
      epochExitCapBps,
      admin,
      labOwner,
      treasury,
      diamond
    );
    
    emit VaultDeployed(vault, labOwner);
  }
  
  /// @notice Single-call deployment function (combines createVault + finalizeVault)
  /// @dev This is the function called by LabVaultDeploymentFacet
  function deployVault(
    address labsToken,
    string calldata name,
    string calldata symbol,
    string calldata domain,
    uint64 cooldownSeconds,
    uint16 epochExitCapBps,
    address owner,
    address manager,
    address treasury,
    address caller
  ) external returns (address vault) {
    // Deploy with zero parameters
    LabVault vaultContract = new LabVault();
    vault = address(vaultContract);
    
    // Initialize metadata
    vaultContract.initializeMetadata(name, symbol, domain);
    
    // Initialize config
    vaultContract.initializeConfig(
      labsToken,
      cooldownSeconds,
      epochExitCapBps,
      manager,
      owner,
      treasury,
      caller
    );
    
    emit VaultDeployed(vault, owner);
  }
}
