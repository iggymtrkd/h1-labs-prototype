// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { BondingCurveSale } from "../sales/BondingCurveSale.sol";

contract BondingCurveFacet {
  event BondingCurveDeployed(uint256 indexed labId, address curve);

  error Unauthorized();
  error InvalidLabId();
  error VaultNotDeployed();
  error CurveAlreadyExists();
  error TreasuryNotSet();

  function deployBondingCurve(uint256 labId) external returns (address curve) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    if (hs.labs[labId].owner == address(0)) revert InvalidLabId();
    if (hs.labs[labId].owner != msg.sender) revert Unauthorized();
    if (hs.labIdToVault[labId] == address(0)) revert VaultNotDeployed();
    if (hs.labIdToCurve[labId] != address(0)) revert CurveAlreadyExists();
    if (hs.protocolTreasury == address(0)) revert TreasuryNotSet();

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
  
  function getBondingCurve(uint256 labId) external view returns (address) {
    return LibH1Storage.h1Storage().labIdToCurve[labId];
  }
}


