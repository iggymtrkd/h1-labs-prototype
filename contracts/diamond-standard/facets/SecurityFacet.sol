// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibDiamond } from "../libraries/LibDiamond.sol";

/// @title SecurityFacet
/// @notice Security management functions for the diamond
/// @dev Provides initializer whitelist management and security controls
contract SecurityFacet {
  event InitializerApproved(address indexed initializer);
  event InitializerRevoked(address indexed initializer);

  /// @notice Approves an initializer contract for delegatecall operations
  /// @dev Only callable by diamond owner
  /// @param initializer Address of initializer contract to approve
  function approveInitializer(address initializer) external {
    LibDiamond.enforceIsContractOwner();
    require(initializer != address(0), "SecurityFacet: zero address");
    require(initializer.code.length > 0, "SecurityFacet: not a contract");
    LibDiamond.approveInitializer(initializer);
  }

  /// @notice Revokes an initializer contract
  /// @dev Only callable by diamond owner
  /// @param initializer Address of initializer contract to revoke
  function revokeInitializer(address initializer) external {
    LibDiamond.enforceIsContractOwner();
    LibDiamond.revokeInitializer(initializer);
  }

  /// @notice Checks if an initializer is approved
  /// @param initializer Address to check
  /// @return True if approved, false otherwise
  function isInitializerApproved(address initializer) external view returns (bool) {
    return LibDiamond.isInitializerApproved(initializer);
  }
}

