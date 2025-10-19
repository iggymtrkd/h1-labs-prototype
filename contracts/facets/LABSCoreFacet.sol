// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LabVault } from "../vaults/LabVault.sol";

contract LABSCoreFacet {
  event LabCreated(uint256 indexed labId, address indexed owner, string name, string symbol, string domain, address h1Token);
  event Staked(address indexed staker, uint256 amount);

  // NOTE: Token and factory integrations are left as stubs for the prototype stage

  function stakeLABS(uint256 amount) external {
    // Prototype stub: integrate ERC20 LABS token and mint LabSlot (ERC-721)
    emit Staked(msg.sender, amount);
  }

  function createLab(string calldata name, string calldata symbol, string calldata domain) external returns (uint256 labId) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    labId = hs.nextLabId++;
    hs.labs[labId].owner = msg.sender;
    hs.labs[labId].domain = domain;
    hs.labs[labId].active = true;

    // Auto-deploy LabVault (ERC-4626-style shares as H1 token)
    // For now, use lab name as token name and a default symbol "H1" (frontend can add custom ticker input later)
    address vault = address(new LabVault(
      hs.labsToken,
      name,
      symbol,
      name,
      hs.defaultCooldown,
      hs.defaultExitCapBps
    ));
    hs.labIdToVault[labId] = vault;
    hs.labs[labId].h1Token = vault;

    // Optionally deploy a LabPass immediately (owner can mint later)
    // Left to LabPassFacetDraft to deploy/mint on demand

    emit LabCreated(labId, msg.sender, name, symbol, domain, vault);
  }
}


