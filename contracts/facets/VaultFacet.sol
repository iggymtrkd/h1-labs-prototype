// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LabVault } from "../vaults/LabVault.sol";

contract VaultFacet {
  event VaultDeployed(uint256 indexed labId, address vault);

  function deployVault(uint256 labId, string calldata h1Name, string calldata h1Symbol, string calldata labDisplayName) external returns (address vault) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    require(hs.labs[labId].owner == msg.sender, "not lab owner");
    require(hs.labIdToVault[labId] == address(0), "exists");

    vault = address(new LabVault(
      hs.labsToken,
      h1Name,
      h1Symbol,
      labDisplayName,
      hs.defaultCooldown,
      hs.defaultExitCapBps
    ));
    hs.labIdToVault[labId] = vault;
    emit VaultDeployed(labId, vault);
  }

  function getVault(uint256 labId) external view returns (address) {
    return LibH1Storage.h1Storage().labIdToVault[labId];
  }
}


