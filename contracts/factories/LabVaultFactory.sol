// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LabVault } from "../vaults/LabVault.sol";

/// @title LabVaultFactory
/// @notice External factory for deploying LabVault contracts
/// @dev Separates vault bytecode from facets to reduce contract size
/// @dev Uses two-step initialization to minimize stack pressure
contract LabVaultFactory {
  event VaultDeployed(address indexed vault, address indexed owner);
  event VaultInitialized(address indexed vault);
  
  /// @notice Step 1: Create vault with metadata
  /// @param h1Name H1 token name
  /// @param h1Symbol H1 token symbol
  /// @param labDisplayName Display name for the lab
  /// @return vault The address of the newly created vault
  function createVault(
    string calldata h1Name,
    string calldata h1Symbol,
    string calldata labDisplayName
  ) external returns (address vault) {
    // Deploy with zero-parameter constructor
    LabVault vaultContract = new LabVault();
    vault = address(vaultContract);
    
    // Initialize metadata only (3 params - low stack pressure)
    vaultContract.initializeMetadata(h1Name, h1Symbol, labDisplayName);
  }
  
  /// @notice Step 2: Finalize vault configuration
  /// @dev Must be called after createVault with the vault address from step 1
  /// @param vault The vault address from createVault
  /// @param labsToken LABS token address
  /// @param cooldownSeconds Redemption cooldown period
  /// @param epochExitCapBps Epoch exit cap in basis points
  /// @param admin Admin address
  /// @param labOwner Lab owner address (receives fees)
  /// @param treasury Treasury address (receives fees)
  /// @param diamond H1Diamond address for authorization
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
    require(vault != address(0), "Invalid vault");
    
    // Initialize configuration (8 params - manageable stack)
    LabVault(vault).initializeConfig(
      labsToken,
      cooldownSeconds,
      epochExitCapBps,
      admin,
      labOwner,
      treasury,
      diamond
    );
    
    emit VaultInitialized(vault);
    emit VaultDeployed(vault, labOwner);
  }
}
