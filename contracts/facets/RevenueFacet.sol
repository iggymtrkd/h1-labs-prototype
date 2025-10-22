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

  // Storage slot for multi-wallet configuration
  bytes32 private constant REVENUE_CONFIG_SLOT = keccak256("h1labs.storage.revenueconfig");

  struct RevenueWallets {
    address buybackWallet;          // H1 buyback execution wallet
    address developerWallet;        // Developer/app builder wallet
    address creatorPoolWallet;      // Creator/collector distribution pool
    address scholarPoolWallet;      // Scholar/validator distribution pool
    address h1TreasuryWallet;       // Protocol operations wallet
  }

  struct RevenueConfig {
    RevenueWallets defaultWallets;  // Default wallets for distributions
    bool useMultiWallet;            // Enable multi-wallet mode
  }

  event RevenueDistributed(
    uint256 indexed datasetId,
    uint256 indexed labId,
    uint256 buybackAmount,
    uint256 developerAmount,
    uint256 creatorAmount,
    uint256 scholarAmount,
    uint256 treasuryAmount
  );

  event RevenueDistributedMultiWallet(
    uint256 indexed datasetId,
    uint256 indexed labId,
    address indexed buybackTo,
    address developerTo,
    address creatorTo,
    address scholarTo,
    address treasuryTo,
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

  event RevenueWalletsUpdated(
    address indexed buybackWallet,
    address indexed developerWallet,
    address indexed creatorPoolWallet,
    address scholarPoolWallet,
    address h1TreasuryWallet
  );

  error ReentrancyGuard();
  error InvalidLabId();
  error InvalidAmount();
  error TransferFailed();
  error ArrayLengthMismatch();
  error InvalidDatasetCount();
  error InvalidWallet();

  modifier nonReentrant() {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.reentrancyStatus == ENTERED) revert ReentrancyGuard();
    hs.reentrancyStatus = ENTERED;
    _;
    hs.reentrancyStatus = NOT_ENTERED;
  }

  /// @notice Set multi-wallet distribution addresses
  /// @param buybackWallet Address to receive buyback funds
  /// @param developerWallet Address to receive developer incentives
  /// @param creatorPoolWallet Address to receive creator distributions
  /// @param scholarPoolWallet Address to receive scholar distributions
  /// @param h1TreasuryWallet Address to receive protocol treasury fees
  function setRevenueWallets(
    address buybackWallet,
    address developerWallet,
    address creatorPoolWallet,
    address scholarPoolWallet,
    address h1TreasuryWallet
  ) external {
    if (buybackWallet == address(0) || developerWallet == address(0) || 
        creatorPoolWallet == address(0) || scholarPoolWallet == address(0) ||
        h1TreasuryWallet == address(0)) {
      revert InvalidWallet();
    }

    RevenueConfig storage config = revenueConfig();
    config.defaultWallets = RevenueWallets({
      buybackWallet: buybackWallet,
      developerWallet: developerWallet,
      creatorPoolWallet: creatorPoolWallet,
      scholarPoolWallet: scholarPoolWallet,
      h1TreasuryWallet: h1TreasuryWallet
    });
    config.useMultiWallet = true;

    emit RevenueWalletsUpdated(
      buybackWallet,
      developerWallet,
      creatorPoolWallet,
      scholarPoolWallet,
      h1TreasuryWallet
    );
  }

  /// @notice Get current revenue wallet configuration
  function getRevenueWallets() external view returns (RevenueWallets memory) {
    return revenueConfig().defaultWallets;
  }

  /// @notice Internal function to access revenue config storage
  function revenueConfig() internal pure returns (RevenueConfig storage rc) {
    bytes32 slot = REVENUE_CONFIG_SLOT;
    assembly {
      rc.slot := slot
    }
  }

  /// @notice Batch distribute revenue with multi-wallet support
  /// @dev If multi-wallet mode is enabled, routes funds to individual wallets
  /// @param datasetIds Array of dataset IDs being purchased
  /// @param labIds Array of lab IDs (one per dataset)
  /// @param amounts Array of amounts for each dataset
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
    RevenueConfig storage config = revenueConfig();

    // Use multi-wallet mode if configured
    if (config.useMultiWallet) {
      _batchDistributeRevenueMultiWallet(datasetIds, labIds, amounts, hs, config);
    } else {
      // Fall back to legacy single-treasury mode
      _batchDistributeRevenueLegacy(datasetIds, labIds, amounts, hs);
    }

    emit BatchRevenueDistributed(datasetIds, labIds, totalAmount, block.timestamp);
  }

  /// @notice Distribute revenue to individual wallets (new multi-wallet mode)
  function _batchDistributeRevenueMultiWallet(
    uint256[] calldata datasetIds,
    uint256[] calldata labIds,
    uint256[] calldata amounts,
    LibH1Storage.H1Storage storage hs,
    RevenueConfig storage config
  ) internal {
    RevenueWallets memory wallets = config.defaultWallets;

    for (uint256 i = 0; i < datasetIds.length; i++) {
      uint256 datasetId = datasetIds[i];
      uint256 labId = labIds[i];
      uint256 amount = amounts[i];

      LibH1Storage.Lab storage lab = hs.labs[labId];
      if (lab.owner == address(0)) revert InvalidLabId();

      uint256 buybackAmount = (amount * BUYBACK_H1_HOLDERS_BPS) / BPS_DENOMINATOR;
      uint256 developerAmount = (amount * APP_DEVELOPER_BPS) / BPS_DENOMINATOR;
      uint256 creatorAmount = (amount * DATA_CREATORS_BPS) / BPS_DENOMINATOR;
      uint256 scholarAmount = (amount * SCHOLARS_BPS) / BPS_DENOMINATOR;
      uint256 treasuryAmount = (amount * H1_TREASURY_BPS) / BPS_DENOMINATOR;

      lab.totalRevenue += amount;

      // Route to individual wallets
      if (buybackAmount > 0) {
        (bool success, ) = payable(wallets.buybackWallet).call{value: buybackAmount}("");
        if (!success) revert TransferFailed();
      }

      if (developerAmount > 0) {
        (bool success, ) = payable(wallets.developerWallet).call{value: developerAmount}("");
        if (!success) revert TransferFailed();
      }

      if (creatorAmount > 0) {
        (bool success, ) = payable(wallets.creatorPoolWallet).call{value: creatorAmount}("");
        if (!success) revert TransferFailed();
      }

      if (scholarAmount > 0) {
        (bool success, ) = payable(wallets.scholarPoolWallet).call{value: scholarAmount}("");
        if (!success) revert TransferFailed();
      }

      if (treasuryAmount > 0) {
        (bool success, ) = payable(wallets.h1TreasuryWallet).call{value: treasuryAmount}("");
        if (!success) revert TransferFailed();
      }

      emit RevenueDistributedMultiWallet(
        datasetId,
        labId,
        wallets.buybackWallet,
        wallets.developerWallet,
        wallets.creatorPoolWallet,
        wallets.scholarPoolWallet,
        wallets.h1TreasuryWallet,
        buybackAmount,
        developerAmount,
        creatorAmount,
        scholarAmount,
        treasuryAmount
      );
    }
  }

  /// @notice Distribute revenue to single treasury (legacy mode)
  function _batchDistributeRevenueLegacy(
    uint256[] calldata datasetIds,
    uint256[] calldata labIds,
    uint256[] calldata amounts,
    LibH1Storage.H1Storage storage hs
  ) internal {
    address treasury = hs.protocolTreasury;

    for (uint256 i = 0; i < datasetIds.length; i++) {
      uint256 datasetId = datasetIds[i];
      uint256 labId = labIds[i];
      uint256 amount = amounts[i];

      LibH1Storage.Lab storage lab = hs.labs[labId];
      if (lab.owner == address(0)) revert InvalidLabId();

      uint256 buybackAmount = (amount * BUYBACK_H1_HOLDERS_BPS) / BPS_DENOMINATOR;
      uint256 developerAmount = (amount * APP_DEVELOPER_BPS) / BPS_DENOMINATOR;
      uint256 creatorAmount = (amount * DATA_CREATORS_BPS) / BPS_DENOMINATOR;
      uint256 scholarAmount = (amount * SCHOLARS_BPS) / BPS_DENOMINATOR;
      uint256 treasuryAmount = (amount * H1_TREASURY_BPS) / BPS_DENOMINATOR;

      lab.totalRevenue += amount;

      if (treasury != address(0) && buybackAmount > 0) {
        (bool successBuyback, ) = payable(treasury).call{value: buybackAmount}("");
        if (!successBuyback) revert TransferFailed();
      }

      if (treasury != address(0) && developerAmount > 0) {
        (bool successDeveloper, ) = payable(treasury).call{value: developerAmount}("");
        if (!successDeveloper) revert TransferFailed();
      }

      if (treasury != address(0) && creatorAmount > 0) {
        (bool successCreator, ) = payable(treasury).call{value: creatorAmount}("");
        if (!successCreator) revert TransferFailed();
      }

      if (treasury != address(0) && scholarAmount > 0) {
        (bool successScholar, ) = payable(treasury).call{value: scholarAmount}("");
        if (!successScholar) revert TransferFailed();
      }

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


