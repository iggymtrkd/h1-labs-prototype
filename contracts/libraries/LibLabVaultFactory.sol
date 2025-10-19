// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LabVault } from "../vaults/LabVault.sol";

/// @title LibLabVaultFactory
/// @notice Library for deploying LabVault contracts
/// @dev Separates deployment logic to reduce facet contract size
library LibLabVaultFactory {
  /// @notice Deploys a new LabVault contract
  /// @param labsToken The LABS token address
  /// @param h1Name The H1 token name
  /// @param h1Symbol The H1 token symbol
  /// @param labDisplayName The lab display name
  /// @param cooldownSeconds Cooldown period for redemptions
  /// @param epochExitCapBps Exit cap in basis points
  /// @param admin Admin address for the vault
  /// @return vault The address of the deployed vault
  function deployVault(
    address labsToken,
    string memory h1Name,
    string memory h1Symbol,
    string memory labDisplayName,
    uint64 cooldownSeconds,
    uint16 epochExitCapBps,
    address admin
  ) internal returns (address vault) {
    vault = address(new LabVault(
      labsToken,
      h1Name,
      h1Symbol,
      labDisplayName,
      cooldownSeconds,
      epochExitCapBps,
      admin
    ));
  }
}

