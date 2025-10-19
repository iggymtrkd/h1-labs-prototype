// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

/// @title RevenueFacet
/// @notice Handles revenue distribution for labs with reentrancy protection
/// @dev Implements checks-effects-interactions pattern with custom reentrancy guard
contract RevenueFacet {
  uint256 private constant NOT_ENTERED = 1;
  uint256 private constant ENTERED = 2;

  uint256 private constant LAB_OWNER_SHARE_BPS = 5000; // 50%
  uint256 private constant H1_POOL_SHARE_BPS = 2500;   // 25%
  uint256 private constant BUYBACK_SHARE_BPS = 2500;   // 25%
  uint256 private constant BPS_DENOMINATOR = 10000;

  event RevenueDistributed(uint256 indexed labId, uint256 labOwner, uint256 h1Pool, uint256 buyback);

  error ReentrancyGuard();
  error InvalidLabId();
  error InvalidAmount();
  error TransferFailed();

  modifier nonReentrant() {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.reentrancyStatus == ENTERED) revert ReentrancyGuard();
    hs.reentrancyStatus = ENTERED;
    _;
    hs.reentrancyStatus = NOT_ENTERED;
  }

  /// @notice Distributes revenue to lab owner, H1 pool, and buyback reserve
  /// @dev Uses checks-effects-interactions pattern to prevent reentrancy
  /// @param labId The lab identifier to distribute revenue for
  /// @custom:reverts InvalidAmount if msg.value is zero
  /// @custom:reverts InvalidLabId if lab doesn't exist
  /// @custom:reverts TransferFailed if ETH transfer fails
  function distributeRevenue(uint256 labId) external payable nonReentrant {
    uint256 amount = msg.value;
    if (amount == 0) revert InvalidAmount();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.Lab storage lab = hs.labs[labId];
    
    if (lab.owner == address(0)) revert InvalidLabId();

    // Calculate shares
    uint256 labOwnerAmt = (amount * LAB_OWNER_SHARE_BPS) / BPS_DENOMINATOR;
    uint256 h1PoolAmt = (amount * H1_POOL_SHARE_BPS) / BPS_DENOMINATOR;
    uint256 buybackAmt = amount - labOwnerAmt - h1PoolAmt;

    // Update state before external calls
    lab.totalRevenue += amount;
    
    // Emit event before external calls
    emit RevenueDistributed(labId, labOwnerAmt, h1PoolAmt, buybackAmt);

    // External calls last (checks-effects-interactions pattern)
    (bool successOwner, ) = payable(lab.owner).call{value: labOwnerAmt}("");
    if (!successOwner) revert TransferFailed();

    // Route H1 pool share to protocol treasury to avoid calling non-existent functions
    address treasury = hs.protocolTreasury;
    if (treasury != address(0) && h1PoolAmt > 0) {
      (bool successTreasury, ) = payable(treasury).call{value: h1PoolAmt}("");
      if (!successTreasury) revert TransferFailed();
    }

    // Buyback amount remains in contract; a future function can execute buyback controlled by owner
  }
}


