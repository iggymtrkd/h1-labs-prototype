// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

contract LabVaultDeploymentFacet {
  event LabVaultDeployed(uint256 indexed labId, address indexed owner, address vault);
  error InvalidInput();
  error InsufficientStake();
  error FactoryNotSet();
  
  function createLabStep1(string calldata name, string calldata symbol, string calldata domain) 
    external returns (uint256 labId, address vault) {
    if (bytes(name).length == 0 || bytes(name).length > 50) revert InvalidInput();
    if (bytes(symbol).length == 0 || bytes(symbol).length > 10) revert InvalidInput();
    if (bytes(domain).length == 0 || bytes(domain).length > 100) revert InvalidInput();
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.stakedBalances[msg.sender] < 100_000e18) revert InsufficientStake();
    if (hs.vaultFactory == address(0)) revert FactoryNotSet();
    uint256 b = hs.stakedBalances[msg.sender];
    labId = hs.nextLabId++;
    hs.labs[labId].owner = msg.sender;
    hs.labs[labId].domain = domain;
    hs.labs[labId].active = true;
    hs.labs[labId].level = b >= 500_000e18 ? 3 : (b >= 250_000e18 ? 2 : 1);
    (bool ok, bytes memory data) = hs.vaultFactory.call(abi.encodeWithSignature(
      "deployVault(address,string,string,string,uint64,uint16,address,address,address,address)",
      hs.labsToken, name, symbol, name, hs.defaultCooldown, hs.defaultExitCapBps,
      msg.sender, msg.sender, hs.protocolTreasury, address(this)
    ));
    require(ok, "deploy failed");
    vault = abi.decode(data, (address));
    hs.labIdToVault[labId] = vault;
    hs.labs[labId].h1Token = vault;
    emit LabVaultDeployed(labId, msg.sender, vault);
  }
}

