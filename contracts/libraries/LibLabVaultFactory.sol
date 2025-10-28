// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Library containing types and constants for LabVault deployment
library LibLabVaultFactory {
  /// @notice Constructor parameters struct to avoid stack too deep
  struct ConstructorParams {
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
}

