// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LibLabVaultFactory } from "../libraries/LibLabVaultFactory.sol";
import { BondingCurveSale } from "../sales/BondingCurveSale.sol";

interface IERC20 {
  function transferFrom(address from, address to, uint256 amount) external returns (bool);
  function approve(address spender, uint256 amount) external returns (bool);
  function transfer(address to, uint256 amount) external returns (bool);
}

interface ILabVault {
  function initialMint(uint256 labsAmount, address[] calldata recipients, uint256[] calldata amounts) external returns (uint256 totalH1Minted);
}

interface IH1VestingFacet {
  function createVestingSchedule(uint256 labId, address beneficiary, uint256 totalAmount, uint8 vestingType, address vault) external returns (uint256 vestingId);
}

/// @title LABSCoreFacet
/// @notice Core functionality for lab creation and LABS token staking
/// @dev Diamond facet for H1 Labs platform core operations
contract LABSCoreFacet {
  event LabCreated(uint256 indexed labId, address indexed owner, string name, string symbol, string domain, address h1Token, uint8 level);
  event VaultDeployed(uint256 indexed labId, address indexed vault, uint64 cooldownSeconds, uint16 exitCapBps);
  event BondingCurveDeployed(uint256 indexed labId, address indexed curve);
  event H1Distributed(
    uint256 indexed labId,
    uint256 totalH1,
    uint256 ownerAmount,
    uint256 curveAmount,
    uint256 scholarAmount,
    uint256 devAmount,
    uint256 treasuryAmount,
    uint256 ownerVestingId
  );
  event Staked(address indexed staker, uint256 amount);

  error InvalidString();
  error InvalidAmount();
  error DomainAlreadyExists();
  error LabsTokenNotSet();
  error TransferFailed();
  error InsufficientStake(uint256 required, uint256 actual);
  error TreasuryNotSet();

  // Lab level thresholds (in wei, 18 decimals)
  uint256 constant MIN_STAKE_FOR_LAB = 100_000e18;    // 100,000 LABS
  uint256 constant LEVEL1_THRESHOLD = 100_000e18;     // Level 1: 100,000 LABS
  uint256 constant LEVEL2_THRESHOLD = 250_000e18;     // Level 2: 250,000 LABS
  uint256 constant LEVEL3_THRESHOLD = 500_000e18;     // Level 3: 500,000 LABS
  uint256 constant MAX_H1_PER_LAB = 500_000e18;       // Max 500,000 H1 per lab
  
  // H1 Distribution percentages (basis points)
  uint16 constant OWNER_ALLOCATION_BPS = 3000;     // 30% to owner (vested)
  uint16 constant CURVE_ALLOCATION_BPS = 1000;     // 10% to bonding curve (liquid)
  uint16 constant SCHOLAR_ALLOCATION_BPS = 4000;   // 40% to scholars (vested)
  uint16 constant DEV_ALLOCATION_BPS = 1500;       // 15% to devs (vested)
  uint16 constant TREASURY_ALLOCATION_BPS = 500;   // 5% to treasury (instant)
  uint16 constant TOTAL_ALLOCATION_BPS = 10000;    // 100% total
  
  // Vesting types (must match H1VestingFacet)
  uint8 constant VESTING_TYPE_OWNER = 0;

  // NOTE: storage moved to LibH1Storage to avoid diamond storage collisions

  /// @notice Stakes LABS tokens to earn LabSlot NFT eligibility
  /// @dev Transfers LABS tokens from user and tracks staked balance
  /// @param amount Amount of LABS tokens to stake (must be > 0)
  function stakeLABS(uint256 amount) external {
    if (amount == 0) revert InvalidAmount();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.labsToken == address(0)) revert LabsTokenNotSet();
    
    // Transfer LABS tokens from user to this contract using proper ERC-20 interface
    require(
      IERC20(hs.labsToken).transferFrom(msg.sender, address(this), amount),
      "TransferFailed"
    );
    
    // Track staked balance
    unchecked {
      LibH1Storage.h1Storage().stakedBalances[msg.sender] += amount; // Safe: overflow unlikely with real token amounts
    }
    
    emit Staked(msg.sender, amount);
    
    // Note: LabSlot NFT minting logic to be added in separate facet/upgrade
  }

  function createLab(string calldata name, string calldata symbol, string calldata domain) external returns (uint256 labId) {
    // Input validation
    if (bytes(name).length == 0 || bytes(name).length > 50) revert InvalidString();
    if (bytes(symbol).length == 0 || bytes(symbol).length > 10) revert InvalidString();
    if (bytes(domain).length == 0 || bytes(domain).length > 100) revert InvalidString();
    bytes32 domainKey = keccak256(bytes(domain));
    if (LibH1Storage.h1Storage().domainTaken[domainKey]) revert DomainAlreadyExists();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    if (hs.labsToken == address(0)) revert LabsTokenNotSet();
    if (hs.protocolTreasury == address(0)) revert TreasuryNotSet();
    
    // Validate staked balance meets minimum requirement
    uint256 stakedBalance = hs.stakedBalances[msg.sender];
    if (stakedBalance < MIN_STAKE_FOR_LAB) {
      revert InsufficientStake(MIN_STAKE_FOR_LAB, stakedBalance);
    }
    
    // Calculate lab level based on staked amount
    uint8 labLevel;
    if (stakedBalance >= LEVEL3_THRESHOLD) {
      labLevel = 3;
    } else if (stakedBalance >= LEVEL2_THRESHOLD) {
      labLevel = 2;
    } else {
      labLevel = 1;
    }
    
    // Create lab record
    labId = hs.nextLabId++;
    hs.labs[labId].owner = msg.sender;
    hs.labs[labId].domain = domain;
    hs.labs[labId].active = true;
    hs.labs[labId].level = labLevel;
    hs.domainTaken[domainKey] = true;

    // Deploy LabVault with diamond address for authorization
    address vault = LibLabVaultFactory.deployVault(
      hs.labsToken,
      name,
      symbol,
      name,
      hs.defaultCooldown,
      hs.defaultExitCapBps,
      msg.sender,
      msg.sender,
      hs.protocolTreasury,
      address(this)  // Diamond address for initialMint authorization
    );
    hs.labIdToVault[labId] = vault;
    hs.labs[labId].h1Token = vault;

    emit LabCreated(labId, msg.sender, name, symbol, domain, vault, labLevel);
    emit VaultDeployed(labId, vault, hs.defaultCooldown, hs.defaultExitCapBps);

    // ============================================
    // AUTOMATIC BONDING CURVE DEPLOYMENT
    // ============================================
    address curve = address(new BondingCurveSale(
      hs.labsToken,
      vault,
      hs.protocolTreasury,
      hs.curveFeeBps,
      hs.curvePolBps
    ));
    hs.labIdToCurve[labId] = curve;
    emit BondingCurveDeployed(labId, curve);

    // ============================================
    // AUTOMATIC H1 DISTRIBUTION
    // ============================================
    
    // Calculate total H1 to mint (1:1 with LABS, capped at 500k)
    uint256 totalH1 = stakedBalance > MAX_H1_PER_LAB ? MAX_H1_PER_LAB : stakedBalance;
    
    // Calculate distribution amounts
    uint256 ownerAmount = (totalH1 * OWNER_ALLOCATION_BPS) / TOTAL_ALLOCATION_BPS;      // 30%
    uint256 curveAmount = (totalH1 * CURVE_ALLOCATION_BPS) / TOTAL_ALLOCATION_BPS;      // 10%
    uint256 scholarAmount = (totalH1 * SCHOLAR_ALLOCATION_BPS) / TOTAL_ALLOCATION_BPS;  // 40%
    uint256 devAmount = (totalH1 * DEV_ALLOCATION_BPS) / TOTAL_ALLOCATION_BPS;          // 15%
    uint256 treasuryAmount = (totalH1 * TREASURY_ALLOCATION_BPS) / TOTAL_ALLOCATION_BPS; // 5%
    
    // Transfer LABS from user to diamond (this contract) to back H1 issuance
    require(
      IERC20(hs.labsToken).transferFrom(msg.sender, address(this), totalH1),
      "LABS transfer failed"
    );
    
    // Approve vault to spend LABS for initial mint
    require(
      IERC20(hs.labsToken).approve(vault, totalH1),
      "LABS approve failed"
    );
    
    // Prepare recipients and amounts for initial mint
    // [0] = vault (holds owner vesting tokens)
    // [1] = curve (liquid market making)
    // [2] = vault (holds scholar reserve)
    // [3] = vault (holds dev reserve)
    // [4] = treasury (instant distribution)
    address[] memory recipients = new address[](5);
    recipients[0] = vault;              // Owner vesting holder
    recipients[1] = curve;              // Liquid curve supply
    recipients[2] = vault;              // Scholar reserve holder
    recipients[3] = vault;              // Dev reserve holder
    recipients[4] = hs.protocolTreasury; // Treasury instant
    
    uint256[] memory amounts = new uint256[](5);
    amounts[0] = ownerAmount;
    amounts[1] = curveAmount;
    amounts[2] = scholarAmount;
    amounts[3] = devAmount;
    amounts[4] = treasuryAmount;
    
    // Execute initial mint on vault
    ILabVault(vault).initialMint(totalH1, recipients, amounts);
    
    // Create vesting schedule for owner (26 weeks with weekly unlocks)
    uint256 ownerVestingId = IH1VestingFacet(address(this)).createVestingSchedule(
      labId,
      msg.sender,
      ownerAmount,
      VESTING_TYPE_OWNER,
      vault
    );
    
    // Record distribution in storage
    hs.labDistributions[labId] = LibH1Storage.H1Distribution({
      totalMinted: totalH1,
      ownerAllocation: ownerAmount,
      curveAllocation: curveAmount,
      scholarAllocation: scholarAmount,
      devAllocation: devAmount,
      treasuryAllocation: treasuryAmount,
      ownerVestingId: ownerVestingId,
      initialized: true
    });
    
    emit H1Distributed(
      labId,
      totalH1,
      ownerAmount,
      curveAmount,
      scholarAmount,
      devAmount,
      treasuryAmount,
      ownerVestingId
    );
  }
  
  function isDomainAvailable(string calldata domain) external view returns (bool) {
    bytes32 domainKey = keccak256(bytes(domain));
    return !LibH1Storage.h1Storage().domainTaken[domainKey];
  }

  /// @notice Get the level of a created lab (1-3)
  /// @param labId The lab ID to query
  /// @return level Lab level (0 = no level, 1-3 = valid levels)
  function getLabLevel(uint256 labId) external view returns (uint8 level) {
    return LibH1Storage.h1Storage().labs[labId].level;
  }

  /// @notice Get the staked LABS balance for a user
  /// @param user The user address to query
  /// @return amount Total LABS staked by the user
  function getStakedBalance(address user) external view returns (uint256 amount) {
    return LibH1Storage.h1Storage().stakedBalances[user];
  }

  /// @notice Get all lab details including level
  /// @param labId The lab ID to query
  /// @return owner Lab owner address
  /// @return h1Token H1 token (vault) address
  /// @return domain Lab domain
  /// @return active Whether lab is active
  /// @return level Lab level (1-3)
  function getLabDetails(uint256 labId) external view returns (
    address owner,
    address h1Token,
    string memory domain,
    bool active,
    uint8 level
  ) {
    LibH1Storage.Lab storage lab = LibH1Storage.h1Storage().labs[labId];
    return (lab.owner, lab.h1Token, lab.domain, lab.active, lab.level);
  }
}