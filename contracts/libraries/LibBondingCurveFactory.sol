// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { BondingCurveSale } from "../sales/BondingCurveSale.sol";

library LibBondingCurveFactory {
  /// @notice Deploy a bonding curve sale contract
  /// @param labsToken Address of LABS token
  /// @param vault Address of lab vault
  /// @param treasury Address of protocol treasury
  /// @param feeBps Fee in basis points
  /// @param polBps Protocol-owned liquidity in basis points
  /// @return Address of deployed bonding curve
  function deployBondingCurve(
    address labsToken,
    address vault,
    address treasury,
    uint16 feeBps,
    uint16 polBps
  ) internal returns (address) {
    return address(new BondingCurveSale(labsToken, vault, treasury, feeBps, polBps));
  }
}

