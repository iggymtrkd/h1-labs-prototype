// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

contract ComplianceFacet {
  event ComplianceEnforced(uint256 indexed labId, string domain);

  function enforceCompliance(uint256 labId, string calldata domain) external {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    require(hs.labs[labId].active, "Lab inactive");
    emit ComplianceEnforced(labId, domain);
  }
}


