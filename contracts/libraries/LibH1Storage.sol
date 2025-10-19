// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LibH1Storage {
  bytes32 internal constant H1_STORAGE_POSITION = keccak256("h1.labs.storage.v1");

  struct Lab {
    address owner;
    address h1Token;
    string domain;
    uint256 totalStaked;
    uint256 totalRevenue;
    bool active;
  }

  struct H1Storage {
    mapping(uint256 => Lab) labs;
    mapping(address => bool) credentialedValidators;
    uint256 nextLabId;
    // Global config
    address labsToken;
    uint64 defaultCooldown;
    uint16 defaultExitCapBps;
    address protocolTreasury;
    uint16 curveFeeBps;
    uint16 curvePolBps;
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


