// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LabPass } from "../tokens/LabPass.sol";

contract LabPassFacet {
  event LabPassDeployed(uint256 indexed labId, address labPass);
  event LabPassMinted(uint256 indexed labId, uint256 tokenId, address indexed to, uint8 level, uint8 slots);

  error Unauthorized();
  error InvalidAddress();
  error LabPassAlreadyExists();
  error LabPassNotDeployed();
  error InvalidLabId();
  error InvalidLevel();
  error InvalidSlots();

  function deployLabPass(uint256 labId) public returns (address pass) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    if (hs.labs[labId].owner == address(0)) revert InvalidLabId();
    if (hs.labs[labId].owner != msg.sender) revert Unauthorized();
    if (hs.labIdToLabPass[labId] != address(0)) revert LabPassAlreadyExists();
    
    pass = address(new LabPass());
    hs.labIdToLabPass[labId] = pass;
    
    // Set the facet as the minter
    LabPass(pass).setMinter(address(this));
    
    emit LabPassDeployed(labId, pass);
  }

  function mintLabPass(uint256 labId, uint256 tokenId, address to, uint8 level, uint8 slots) external {
    if (to == address(0)) revert InvalidAddress();
    if (level > 10) revert InvalidLevel();
    if (slots > 10) revert InvalidSlots();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    if (hs.labs[labId].owner != msg.sender) revert Unauthorized();
    
    address pass = hs.labIdToLabPass[labId];
    if (pass == address(0)) revert LabPassNotDeployed();
    
    LabPass(pass).mint(to, tokenId, level, slots);
    emit LabPassMinted(labId, tokenId, to, level, slots);
  }
  
  function getLabPass(uint256 labId) external view returns (address) {
    return LibH1Storage.h1Storage().labIdToLabPass[labId];
  }
}


