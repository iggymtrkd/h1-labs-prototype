// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LABSToken } from "../tokens/LABSToken.sol";

contract TreasuryFacet {
  address public labsToken;

  event BuybackExecuted(uint256 amount);

  function setLABSToken(address token) external {
    // prototype: no auth; production: restrict
    labsToken = token;
  }

  function buybackLABS(uint256 amount) external {
    // prototype stub: just emit
    emit BuybackExecuted(amount);
  }
}


