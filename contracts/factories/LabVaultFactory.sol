// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LabVault } from "../vaults/LabVault.sol";

/// @title LabVaultFactory
/// @notice External factory for deploying LabVault contracts
/// @dev Separates vault bytecode from facets to reduce contract size
contract LabVaultFactory {
  event VaultDeployed(address indexed vault, address indexed owner);
  
  /// @notice Deploy a new LabVault contract
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
  ) external returns (address vault) {
    vault = address(new LabVault(
      labsToken,
      h1Name,
      h1Symbol,
      labDisplayName,
      cooldownSeconds,
      epochExitCapBps,
      admin,
      labOwner,
      treasury,
      diamond
    ));
    
    emit VaultDeployed(vault, labOwner);
  }
}
