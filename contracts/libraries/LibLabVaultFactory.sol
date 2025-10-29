// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LabVault } from "../vaults/LabVault.sol";

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
  
  // Alias for backward compatibility with existing code
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
  
  /// @notice Deploy a vault using the two-step factory pattern
  /// @param factory Address of LabVaultFactory
  /// @param params Constructor parameters
  /// @return vault Address of deployed LabVault
  function deployVault(address factory, VaultParams memory params) internal returns (address vault) {
    // Create vault with metadata
    (bool ok1, bytes memory data1) = factory.call(
      abi.encodeWithSignature(
        "createVault(string,string,string)",
        params.h1Name,
        params.h1Symbol,
        params.labDisplayName
      )
    );
    require(ok1, "createVault failed");
    vault = abi.decode(data1, (address));
    
    // Finalize vault configuration
    (bool ok2, ) = factory.call(
      abi.encodeWithSignature(
        "finalizeVault(address,address,uint64,uint16,address,address,address,address)",
        vault,
        params.labsToken,
        params.cooldownSeconds,
        params.epochExitCapBps,
        params.admin,
        params.labOwner,
        params.treasury,
        params.diamond
      )
    );
    require(ok2, "finalizeVault failed");
  }
}

