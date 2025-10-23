// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "./LibH1Storage.sol";
import { IERC20 } from "../interfaces/IERC20.sol";

library LibStaking {
  event Staked(address indexed staker, uint256 amount);

  error ZeroAmount();
  error TokenNotSet();
  error TransferFailed();

  function stake(uint256 amount, address sender) internal {
    if (amount == 0) revert ZeroAmount();
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.labsToken == address(0)) revert TokenNotSet();
    if (!IERC20(hs.labsToken).transferFrom(sender, address(this), amount)) revert TransferFailed();
    unchecked { hs.stakedBalances[sender] += amount; }
    emit Staked(sender, amount);
  }
}

