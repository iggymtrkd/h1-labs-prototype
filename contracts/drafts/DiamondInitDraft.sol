// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

contract DiamondInitDraft {
  function init(
    address labsToken,
    uint64 cooldownSeconds,
    uint16 exitCapBps,
    address protocolTreasury,
    uint16 curveFeeBps,
    uint16 curvePolBps
  ) external {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    hs.labsToken = labsToken;
    hs.defaultCooldown = cooldownSeconds;
    hs.defaultExitCapBps = exitCapBps;
    hs.protocolTreasury = protocolTreasury;
    hs.curveFeeBps = curveFeeBps;
    hs.curvePolBps = curvePolBps;
  }
}


