// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

/// @title RevenueFacet
/// @notice Handles revenue distribution for labs with per-dataset, per-lab tracking
/// @dev Implements checks-effects-interactions pattern with custom reentrancy guard
contract RevenueFacet {
  uint256 private constant NOT_ENTERED = 1;
  uint256 private constant ENTERED = 2;

  // Revenue distribution percentages (in basis points) - Total: 100%
  uint256 private constant BUYBACK_H1_HOLDERS_BPS = 4000;       // 40% - Buyback for lab's H1 holders
  uint256 private constant APP_DEVELOPER_BPS = 1500;            // 15% - App/SDK developer incentive
  uint256 private constant DATA_CREATORS_BPS = 2000;            // 20% - Data creators/collectors
  uint256 private constant SCHOLARS_BPS = 2000;                 // 20% - Scholars/supervisors who validated
  uint256 private constant H1_TREASURY_BPS = 500;               // 5% - H1 protocol treasury
  uint256 private constant BPS_DENOMINATOR = 10000;

  event RevenueDistributed(
    uint256 indexed datasetId,
    uint256 indexed labId,
    uint256 buybackAmount,
    uint256 developerAmount,
    uint256 creatorAmount,
    uint256 scholarAmount,
    uint256 treasuryAmount
  );

  event BatchRevenueDistributed(
    uint256[] datasetIds,
    uint256[] labIds,
    uint256 totalAmount,
    uint256 timestamp
  );

  error ReentrancyGuard();
  error InvalidLabId();
  error InvalidAmount();
  error TransferFailed();
  error ArrayLengthMismatch();
  error InvalidDatasetCount();

  modifier nonReentrant() {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.reentrancyStatus == ENTERED) revert ReentrancyGuard();
    hs.reentrancyStatus = ENTERED;
    _;
    hs.reentrancyStatus = NOT_ENTERED;
  }

  /// @notice Batch distribute revenue from dataset purchases with per-dataset, per-lab tracking
  /// @dev Processes dataset marketplace purchases with automatic revenue splitting
  /// @param datasetIds Array of dataset IDs being purchased
  /// @param labIds Array of lab IDs (one per dataset, must match dataset's lab)
  /// @param amounts Array of amounts for each dataset (must match array lengths)
  function batchDistributeRevenue(
    uint256[] calldata datasetIds,
    uint256[] calldata labIds,
    uint256[] calldata amounts
  ) external payable nonReentrant {
    if (datasetIds.length != labIds.length || labIds.length != amounts.length) {
      revert ArrayLengthMismatch();
    }
    if (labIds.length == 0) revert InvalidDatasetCount();

    // Calculate and validate total amount
    uint256 totalAmount = 0;
    for (uint256 i = 0; i < amounts.length; i++) {
      if (amounts[i] == 0) revert InvalidAmount();
      totalAmount += amounts[i];
    }

    if (msg.value != totalAmount) revert InvalidAmount();

    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    address treasury = hs.protocolTreasury;

    // Process each dataset purchase with per-lab, per-dataset revenue distribution
    for (uint256 i = 0; i < datasetIds.length; i++) {
      uint256 datasetId = datasetIds[i];
      uint256 labId = labIds[i];
      uint256 amount = amounts[i];

      LibH1Storage.Lab storage lab = hs.labs[labId];
      if (lab.owner == address(0)) revert InvalidLabId();

      // Calculate distribution (100% split):
      // 40% - Buyback for lab's H1 holders (increases NAV via supply reduction)
      // 15% - App developer incentive
      // 20% - Data creators/collectors
      // 20% - Scholars/supervisors who validated
      // 5% - H1 protocol treasury
      
      uint256 buybackAmount = (amount * BUYBACK_H1_HOLDERS_BPS) / BPS_DENOMINATOR;
      uint256 developerAmount = (amount * APP_DEVELOPER_BPS) / BPS_DENOMINATOR;
      uint256 creatorAmount = (amount * DATA_CREATORS_BPS) / BPS_DENOMINATOR;
      uint256 scholarAmount = (amount * SCHOLARS_BPS) / BPS_DENOMINATOR;
      uint256 treasuryAmount = (amount * H1_TREASURY_BPS) / BPS_DENOMINATOR;

      // Update lab state
      lab.totalRevenue += amount;

      // Distribute buyback reserve to treasury for H1 repurchase execution
      if (treasury != address(0) && buybackAmount > 0) {
        (bool successBuyback, ) = payable(treasury).call{value: buybackAmount}("");
        if (!successBuyback) revert TransferFailed();
      }

      // Distribute developer incentive to treasury for later payout
      if (treasury != address(0) && developerAmount > 0) {
        (bool successDeveloper, ) = payable(treasury).call{value: developerAmount}("");
        if (!successDeveloper) revert TransferFailed();
      }

      // Distribute creator share to treasury for later distribution
      if (treasury != address(0) && creatorAmount > 0) {
        (bool successCreator, ) = payable(treasury).call{value: creatorAmount}("");
        if (!successCreator) revert TransferFailed();
      }

      // Distribute scholar share to treasury for later distribution
      if (treasury != address(0) && scholarAmount > 0) {
        (bool successScholar, ) = payable(treasury).call{value: scholarAmount}("");
        if (!successScholar) revert TransferFailed();
      }

      // Distribute H1 treasury fee
      if (treasury != address(0) && treasuryAmount > 0) {
        (bool successTreasury, ) = payable(treasury).call{value: treasuryAmount}("");
        if (!successTreasury) revert TransferFailed();
      }

      emit RevenueDistributed(
        datasetId,
        labId,
        buybackAmount,
        developerAmount,
        creatorAmount,
        scholarAmount,
        treasuryAmount
      );
    }

    // Emit batch completion event
    emit BatchRevenueDistributed(datasetIds, labIds, totalAmount, block.timestamp);
  }

  /// @notice Get lab's total revenue
  /// @param labId The lab identifier
  /// @return totalRevenue Amount of revenue received by the lab
  function getLabTotalRevenue(uint256 labId) external view returns (uint256) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    return hs.labs[labId].totalRevenue;
  }

  /// @notice Get revenue distribution percentages for a purchase (100% total)
  /// @param amount The purchase amount
  /// @return buyback H1 Holders buyback (40%)
  /// @return developer App developer incentive (15%)
  /// @return creator Data creators/collectors (20%)
  /// @return scholar Scholars/supervisors (20%)
  /// @return treasury H1 protocol treasury (5%)
  function getRevenueBreakdown(uint256 amount)
    external
    pure
    returns (
      uint256 buyback,
      uint256 developer,
      uint256 creator,
      uint256 scholar,
      uint256 treasury
    )
  {
    buyback = (amount * BUYBACK_H1_HOLDERS_BPS) / BPS_DENOMINATOR;
    developer = (amount * APP_DEVELOPER_BPS) / BPS_DENOMINATOR;
    creator = (amount * DATA_CREATORS_BPS) / BPS_DENOMINATOR;
    scholar = (amount * SCHOLARS_BPS) / BPS_DENOMINATOR;
    treasury = (amount * H1_TREASURY_BPS) / BPS_DENOMINATOR;
  }
}


