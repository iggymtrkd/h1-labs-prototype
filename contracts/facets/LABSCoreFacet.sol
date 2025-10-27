// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LibStaking } from "../libraries/LibStaking.sol";

/// @title LABSCoreFacet
/// @notice Handles LABS staking and lab-related queries (no creation logic)
/// @dev Part of the H1Diamond - lightweight facet for staking and queries
/// @dev For lab creation, use LabCreationFacet
contract LABSCoreFacet {
  // ============================================
  // STAKING FUNCTIONS
  // ============================================
  
  /// @notice Stake LABS tokens to become eligible for lab creation
  /// @param amount Amount of LABS tokens to stake
  function stakeLABS(uint256 amount) external {
    LibStaking.stake(amount, msg.sender);
  }

  /// @notice Get staked balance for a user
  /// @param user Address to check
  /// @return balance Amount of LABS staked by the user
  function getStakedBalance(address user) external view returns (uint256 balance) {
    return LibH1Storage.h1Storage().stakedBalances[user];
  }

  // ============================================
  // LAB QUERY FUNCTIONS
  // ============================================
  
  /// @notice Check if a domain is available for registration
  /// @param domain The domain to check
  /// @return available Always returns true (domain exclusivity removed)
  function isDomainAvailable(string calldata domain) external pure returns (bool available) {
    return true;
  }

  /// @notice Get the level (1-3) of a lab based on its TVL
  /// @param labId The lab ID to query
  /// @return level The lab's level (1, 2, or 3)
  function getLabLevel(uint256 labId) external view returns (uint8 level) {
    return LibH1Storage.h1Storage().labs[labId].level;
  }

  /// @notice Get detailed information about a lab
  /// @param labId The lab ID to query
  /// @return owner The lab owner's address
  /// @return h1Token The lab's H1 token (vault) address
  /// @return domain The lab's domain identifier
  /// @return active Whether the lab is active
  /// @return level The lab's level (1-3)
  function getLabDetails(uint256 labId) external view returns (
    address owner, 
    address h1Token, 
    string memory domain, 
    bool active, 
    uint8 level
  ) {
    LibH1Storage.Lab storage lab = LibH1Storage.h1Storage().labs[labId];
    return (lab.owner, lab.h1Token, lab.domain, lab.active, lab.level);
  }
}