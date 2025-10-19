// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { H1Token } from "../tokens/H1Token.sol";

contract RevenueFacet {
  event RevenueDistributed(uint256 indexed labId, uint256 labOwner, uint256 h1Pool, uint256 buyback);

  function distributeRevenue(uint256 labId) external payable {
    uint256 amount = msg.value;
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.Lab storage lab = hs.labs[labId];

    uint256 labOwnerAmt = (amount * 50) / 100;
    uint256 h1PoolAmt = (amount * 25) / 100;
    uint256 buybackAmt = amount - labOwnerAmt - h1PoolAmt; // 25%

    payable(lab.owner).transfer(labOwnerAmt);
    if (lab.h1Token != address(0)) {
      H1Token(lab.h1Token).transferRevenue(h1PoolAmt);
    }
    // buyback stub: retained in contract for further logic
    emit RevenueDistributed(labId, labOwnerAmt, h1PoolAmt, buybackAmt);
  }
}


