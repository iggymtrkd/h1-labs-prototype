// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title LibH1Storage
/// @notice Diamond storage library for H1 Labs platform state
/// @dev Uses diamond storage pattern to avoid storage collisions during upgrades
library LibH1Storage {
  bytes32 internal constant H1_STORAGE_POSITION = keccak256("h1.labs.storage.v1");

  /// @notice Lab metadata and state (optimized struct packing: 5 slots)
  /// @dev Packed to minimize storage slots from 6 to 5 slots
  struct Lab {
    address owner;          // slot 0: 20 bytes
    address h1Token;        // slot 1: 20 bytes
    uint96 totalStaked;     // slot 2: 12 bytes (packed with active)
    bool active;            // slot 2: 1 byte (packed with totalStaked) - 11 bytes padding
    uint256 totalRevenue;   // slot 3: 32 bytes
    string domain;          // slot 4+: dynamic
  }

  struct H1Storage {
    mapping(uint256 => Lab) labs;
    uint256 nextLabId;
    // Global config
    address labsToken;
    uint64 defaultCooldown;
    uint16 defaultExitCapBps;
    address protocolTreasury;
    uint16 curveFeeBps;
    uint16 curvePolBps;
    // Global guards/state (shared across facets)
    uint256 reentrancyStatus; // 1 = NOT_ENTERED, 2 = ENTERED
    // Domain registry and staking balances (moved from facets to avoid storage collisions)
    mapping(bytes32 => bool) domainTaken; // keccak256(domain) => taken
    mapping(address => uint256) stakedBalances; // user => LABS staked amount
    // Per-lab vault address (ERC-4626-style)
    mapping(uint256 => address) labIdToVault;
    // Per-lab LabPass NFT
    mapping(uint256 => address) labIdToLabPass;
    // Per-lab bonding curve sale contract
    mapping(uint256 => address) labIdToCurve;
  }

  function h1Storage() internal pure returns (H1Storage storage hs) {
    bytes32 position = H1_STORAGE_POSITION;
    assembly {
      hs.slot := position
    }
  }
}


