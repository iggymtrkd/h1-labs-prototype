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
    // Use struct to avoid stack too deep
    LabVault.ConstructorParams memory params = LabVault.ConstructorParams({
      labsToken: labsToken,
      h1Name: h1Name,
      h1Symbol: h1Symbol,
      labDisplayName: labDisplayName,
      cooldownSeconds: cooldownSeconds,
      epochExitCapBps: epochExitCapBps,
      admin: admin,
      labOwner: labOwner,
      treasury: treasury,
      diamond: diamond
    });
    
    vault = address(new LabVault(params));
    emit VaultDeployed(vault, labOwner);
  }
}
