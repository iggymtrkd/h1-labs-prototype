// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibLabCreation } from "../libraries/LibLabCreation.sol";

/// @title LabCreationFacet
/// @notice Handles lab creation
/// @dev Separated from queries to minimize contract size
contract LabCreationFacet {
  /// @notice Create a new lab with H1 token distribution
  /// @param name The name for the H1 token
  /// @param symbol The symbol for the H1 token
  /// @param domain The unique domain identifier for the lab
  /// @return labId The ID of the newly created lab
  function createLab(
    string calldata name, 
    string calldata symbol, 
    string calldata domain
  ) external returns (uint256 labId) {
    return LibLabCreation.createLab(name, symbol, domain, msg.sender);
  }
}

