// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LabVault } from "../vaults/LabVault.sol";

contract VaultFacet {
  event VaultDeployed(uint256 indexed labId, address vault);

  error Unauthorized();
  error InvalidLabId();
  error VaultAlreadyExists();
  error InvalidString();
  error LabsTokenNotSet();

  function deployVault(uint256 labId, string calldata h1Name, string calldata h1Symbol, string calldata labDisplayName) external returns (address vault) {
    // Input validation
    if (bytes(h1Name).length == 0 || bytes(h1Name).length > 50) revert InvalidString();
    if (bytes(h1Symbol).length == 0 || bytes(h1Symbol).length > 10) revert InvalidString();
    if (bytes(labDisplayName).length == 0 || bytes(labDisplayName).length > 100) revert InvalidString();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    if (hs.labs[labId].owner == address(0)) revert InvalidLabId();
    if (hs.labs[labId].owner != msg.sender) revert Unauthorized();
    if (hs.labIdToVault[labId] != address(0)) revert VaultAlreadyExists();
    if (hs.labsToken == address(0)) revert LabsTokenNotSet();

    vault = address(new LabVault(
      hs.labsToken,
      h1Name,
      h1Symbol,
      labDisplayName,
      hs.defaultCooldown,
      hs.defaultExitCapBps,
      msg.sender
    ));
    
    hs.labIdToVault[labId] = vault;
    hs.labs[labId].h1Token = vault;
    
    emit VaultDeployed(labId, vault);
  }

  function getVault(uint256 labId) external view returns (address) {
    return LibH1Storage.h1Storage().labIdToVault[labId];
  }
}


