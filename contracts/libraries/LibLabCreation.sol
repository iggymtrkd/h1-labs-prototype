// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "./LibH1Storage.sol";
import { LibLabVaultFactory } from "./LibLabVaultFactory.sol";
import { LibH1Distribution } from "./LibH1Distribution.sol";
import { LibBondingCurveFactory } from "./LibBondingCurveFactory.sol";

library LibLabCreation {
  uint256 constant MIN_STAKE_FOR_LAB = 100_000e18;
  uint256 constant LEVEL2_THRESHOLD = 250_000e18;
  uint256 constant LEVEL3_THRESHOLD = 500_000e18;

  event LabCreated(uint256 indexed labId, address indexed owner, string name, string symbol, string domain, address h1Token, uint8 level);
  event VaultDeployed(uint256 indexed labId, address indexed vault, uint64 cooldownSeconds, uint16 exitCapBps);
  event BondingCurveDeployed(uint256 indexed labId, address indexed curve);

  error InvalidName();
  error InvalidSymbol();
  error InvalidDomain();
  error ConfigNotSet();
  error InsufficientStake();

  function createLab(string calldata name, string calldata symbol, string calldata domain, address sender) internal returns (uint256 labId) {
    // Validate inputs inline to avoid extra variables
    {
      uint256 nameLen = bytes(name).length;
      if (nameLen == 0 || nameLen > 50) revert InvalidName();
    }
    {
      uint256 symbolLen = bytes(symbol).length;
      if (symbolLen == 0 || symbolLen > 10) revert InvalidSymbol();
    }
    {
      uint256 domainLen = bytes(domain).length;
      if (domainLen == 0 || domainLen > 100) revert InvalidDomain();
    }
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.labsToken == address(0) || hs.protocolTreasury == address(0)) revert ConfigNotSet();
    
    uint256 staked = hs.stakedBalances[sender];
    if (staked < MIN_STAKE_FOR_LAB) revert InsufficientStake();
    
    uint8 labLevel = _calculateLabLevel(staked);
    
    labId = hs.nextLabId++;
    hs.labs[labId].owner = sender;
    hs.labs[labId].domain = domain;
    hs.labs[labId].active = true;
    hs.labs[labId].level = labLevel;

    address vault;
    {
      vault = LibLabVaultFactory.deployVault(
        LibLabVaultFactory.VaultParams({
          labsToken: hs.labsToken,
          h1Name: name,
          h1Symbol: symbol,
          labDisplayName: name,
          cooldownSeconds: hs.defaultCooldown,
          epochExitCapBps: hs.defaultExitCapBps,
          admin: sender,
          labOwner: sender,
          treasury: hs.protocolTreasury,
          diamond: address(this)
        })
      );
      hs.labIdToVault[labId] = vault;
      hs.labs[labId].h1Token = vault;
    }

    emit LabCreated(labId, sender, name, symbol, domain, vault, labLevel);
    emit VaultDeployed(labId, vault, hs.defaultCooldown, hs.defaultExitCapBps);

    address curve;
    {
      curve = LibBondingCurveFactory.deployBondingCurve(
        hs.labsToken, vault, hs.protocolTreasury, hs.curveFeeBps, hs.curvePolBps
      );
      hs.labIdToCurve[labId] = curve;
      emit BondingCurveDeployed(labId, curve);
    }

    LibH1Distribution.distribute(labId, vault, curve, staked, sender);
  }

  function _calculateLabLevel(uint256 bal) private pure returns (uint8) {
    return bal >= LEVEL3_THRESHOLD ? 3 : (bal >= LEVEL2_THRESHOLD ? 2 : 1);
  }
}

