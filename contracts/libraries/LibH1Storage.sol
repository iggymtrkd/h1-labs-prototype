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
  }

  function h1Storage() internal pure returns (H1Storage storage hs) {
    bytes32 position = H1_STORAGE_POSITION;
    assembly {
      hs.slot := position
    }
  }
}


