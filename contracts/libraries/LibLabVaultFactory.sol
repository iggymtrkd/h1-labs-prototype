// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LabVault } from "../vaults/LabVault.sol";

/// @title LibLabVaultFactory
/// @notice Library for deploying LabVault contracts
/// @dev Separates deployment logic to reduce facet contract size
library LibLabVaultFactory {
  /// @notice Parameters for deploying a LabVault
  struct VaultParams {
    address labsToken;
    string h1Name;
    string h1Symbol;
    string labDisplayName;
    uint64 cooldownSeconds;
    uint16 epochExitCapBps;
    address admin;
    address labOwner;
    address treasury;
    address diamond;
  }

  /// @notice Deploys a new LabVault contract
  /// @param params The vault deployment parameters
  /// @return vault The address of the deployed vault
  function deployVault(VaultParams memory params) internal returns (address vault) {
    vault = address(new LabVault(
      params.labsToken,
      params.h1Name,
      params.h1Symbol,
      params.labDisplayName,
      params.cooldownSeconds,
      params.epochExitCapBps,
      params.admin,
      params.labOwner,
      params.treasury,
      params.diamond
    ));
  }
}

