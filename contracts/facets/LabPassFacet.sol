// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LabPass } from "../tokens/LabPass.sol";

contract LabPassFacet {
  event LabPassDeployed(uint256 indexed labId, address labPass);
  event LabPassMinted(uint256 indexed labId, uint256 tokenId, address to, uint8 level, uint8 slots);

  function deployLabPass(uint256 labId) public returns (address pass) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    require(hs.labs[labId].owner == msg.sender, "not lab owner");
    require(hs.labIdToLabPass[labId] == address(0), "exists");
    pass = address(new LabPass());
    hs.labIdToLabPass[labId] = pass;
    emit LabPassDeployed(labId, pass);
  }

  function mintLabPass(uint256 labId, uint256 tokenId, address to, uint8 level, uint8 slots) external {
    address pass = LibH1Storage.h1Storage().labIdToLabPass[labId];
    require(pass != address(0), "no pass");
    LabPass(pass).mint(to, tokenId, level, slots);
    emit LabPassMinted(labId, tokenId, to, level, slots);
  }
}


