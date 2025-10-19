// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { BondingCurveSale } from "../sales/BondingCurveSale.sol";

contract BondingCurveFacet {
  event BondingCurveDeployed(uint256 indexed labId, address curve);

  function deployBondingCurve(uint256 labId) external returns (address curve) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    require(hs.labs[labId].owner == msg.sender, "not lab owner");
    require(hs.labIdToVault[labId] != address(0), "no vault");
    require(hs.labIdToCurve[labId] == address(0), "exists");

    curve = address(new BondingCurveSale(
      hs.labsToken,
      hs.labIdToVault[labId],
      hs.protocolTreasury,
      hs.curveFeeBps,
      hs.curvePolBps
    ));
    hs.labIdToCurve[labId] = curve;
    emit BondingCurveDeployed(labId, curve);
  }
}


