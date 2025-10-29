// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "./LibH1Storage.sol";
import { IERC20 } from "../interfaces/IERC20.sol";

interface ILabVault {
  function initialMint(uint256 labsAmount, address[] calldata recipients, uint256[] calldata amounts) external returns (uint256);
}

interface IH1VestingFacet {
  function createVestingSchedule(uint256 labId, address beneficiary, uint256 totalAmount, uint8 vestingType, address vault) external returns (uint256);
}

library LibH1Distribution {
  uint256 constant MAX_H1_PER_LAB = 500_000e18;
  uint8 constant VESTING_TYPE_OWNER = 0;

  event H1Distributed(uint256 indexed labId, uint256 totalH1, uint256 ownerAmount, uint256 curveAmount, uint256 scholarAmount, uint256 devAmount, uint256 treasuryAmount, uint256 ownerVestingId);

  struct Amounts {
    uint256 total;
    uint256 owner;
    uint256 curve;
    uint256 scholar;
    uint256 dev;
    uint256 treasury;
  }

  function distribute(uint256 labId, address vault, address curve, uint256 stake, address sender) internal {
    Amounts memory a = _calc(stake);
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    // LABS are already staked in the Diamond, so Diamond already has them
    // Just approve vault to use them for initial H1 mint
    require(IERC20(hs.labsToken).approve(vault, a.total), "APRV");
    
    address curveRecipient = curve == address(0) ? vault : curve;
    address[] memory r = new address[](5);
    r[0]=vault; r[1]=curveRecipient; r[2]=vault; r[3]=vault; r[4]=hs.protocolTreasury;
    uint256[] memory m = new uint256[](5);
    m[0]=a.owner; m[1]=a.curve; m[2]=a.scholar; m[3]=a.dev; m[4]=a.treasury;
    ILabVault(vault).initialMint(a.total, r, m);
    
    // Decrease staked balance by the amount of LABS used for this lab
    hs.stakedBalances[sender] -= a.total;
    
    uint256 vid = IH1VestingFacet(address(this)).createVestingSchedule(labId, sender, a.owner, VESTING_TYPE_OWNER, vault);
    hs.labDistributions[labId] = LibH1Storage.H1Distribution(a.total, a.owner, a.curve, a.scholar, a.dev, a.treasury, vid, true);
    emit H1Distributed(labId, a.total, a.owner, a.curve, a.scholar, a.dev, a.treasury, vid);
  }

  function _calc(uint256 bal) private pure returns (Amounts memory) {
    uint256 t = bal > MAX_H1_PER_LAB ? MAX_H1_PER_LAB : bal;
    return Amounts(t, t*3000/10000, t*1000/10000, t*4000/10000, t*1500/10000, t*500/10000);
  }
}

