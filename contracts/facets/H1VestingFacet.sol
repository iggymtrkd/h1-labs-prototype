// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

interface ILabVault {
  function transfer(address to, uint256 amount) external returns (bool);
  function balanceOf(address account) external view returns (uint256);
}

/// @title H1VestingFacet
/// @notice Manages vesting schedules for H1 token distributions
/// @dev Handles owner, scholar, and dev vesting with different unlock schedules
contract H1VestingFacet {
  
  // ============================================
  // EVENTS
  // ============================================
  
  event VestingScheduleCreated(
    uint256 indexed vestingId,
    uint256 indexed labId,
    address indexed beneficiary,
    uint256 totalAmount,
    uint256 startTime,
    uint256 duration,
    uint8 vestingType
  );
  
  event TokensClaimed(
    uint256 indexed vestingId,
    uint256 indexed labId,
    address indexed beneficiary,
    uint256 amount
  );
  
  event VestingRevoked(
    uint256 indexed vestingId,
    uint256 indexed labId,
    address indexed beneficiary,
    uint256 amountRevoked
  );
  
  // ============================================
  // ERRORS
  // ============================================
  
  error InvalidVestingId();
  error Unauthorized();
  error NothingToClaim();
  error VestingAlreadyRevoked();
  error InvalidLabId();
  
  // ============================================
  // CONSTANTS
  // ============================================
  
  // Vesting types
  uint8 constant VESTING_TYPE_OWNER = 0;
  uint8 constant VESTING_TYPE_SCHOLAR = 1;
  uint8 constant VESTING_TYPE_DEV = 2;
  
  // Owner vesting: 6 months (26 weeks) with weekly unlocks
  uint256 constant OWNER_VESTING_DURATION = 26 weeks;
  uint256 constant OWNER_VESTING_CLIFF = 1 weeks;  // First unlock after 1 week
  
  // Scholar/Dev vesting: Instant unlock (paid as work is completed)
  uint256 constant SCHOLAR_VESTING_DURATION = 0;
  uint256 constant DEV_VESTING_DURATION = 0;
  
  // ============================================
  // CORE FUNCTIONS
  // ============================================
  
  /// @notice Create a vesting schedule (called internally during lab creation)
  /// @param labId The lab ID this vesting is for
  /// @param beneficiary Address receiving the vested tokens
  /// @param totalAmount Total H1 tokens to vest
  /// @param vestingType Type of vesting (0=owner, 1=scholar, 2=dev)
  /// @param vault The LabVault address (H1 token contract)
  /// @return vestingId The created vesting schedule ID
  function createVestingSchedule(
    uint256 labId,
    address beneficiary,
    uint256 totalAmount,
    uint8 vestingType,
    address vault
  ) external returns (uint256 vestingId) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    // Validate lab exists
    if (hs.labs[labId].owner == address(0)) revert InvalidLabId();
    
    // Only callable by diamond (from LABSCoreFacet during lab creation)
    // or by lab owner for adding new scholars/devs
    if (msg.sender != address(this) && msg.sender != hs.labs[labId].owner) {
      revert Unauthorized();
    }
    
    // Determine duration and cliff based on vesting type
    uint256 duration;
    uint256 cliffDuration;
    
    if (vestingType == VESTING_TYPE_OWNER) {
      duration = OWNER_VESTING_DURATION;
      cliffDuration = OWNER_VESTING_CLIFF;
    } else if (vestingType == VESTING_TYPE_SCHOLAR) {
      duration = SCHOLAR_VESTING_DURATION;
      cliffDuration = 0;
    } else if (vestingType == VESTING_TYPE_DEV) {
      duration = DEV_VESTING_DURATION;
      cliffDuration = 0;
    } else {
      revert InvalidVestingId();
    }
    
    // Create vesting schedule
    vestingId = hs.nextVestingId++;
    hs.vestingSchedules[vestingId] = LibH1Storage.VestingSchedule({
      beneficiary: beneficiary,
      totalAmount: totalAmount,
      claimedAmount: 0,
      startTime: block.timestamp,
      duration: duration,
      cliffDuration: cliffDuration,
      vestingType: vestingType,
      revoked: false
    });
    
    // Track vesting by type for lab
    if (vestingType == VESTING_TYPE_SCHOLAR) {
      hs.labScholarVestings[labId].push(vestingId);
    } else if (vestingType == VESTING_TYPE_DEV) {
      hs.labDevVestings[labId].push(vestingId);
    }
    
    emit VestingScheduleCreated(
      vestingId,
      labId,
      beneficiary,
      totalAmount,
      block.timestamp,
      duration,
      vestingType
    );
  }
  
  /// @notice Calculate claimable amount for a vesting schedule
  /// @param vestingId The vesting schedule ID
  /// @return claimableAmount Amount of H1 tokens that can be claimed now
  function getClaimableAmount(uint256 vestingId) public view returns (uint256 claimableAmount) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.VestingSchedule storage schedule = hs.vestingSchedules[vestingId];
    
    if (schedule.beneficiary == address(0)) revert InvalidVestingId();
    if (schedule.revoked) return 0;
    
    uint256 elapsed = block.timestamp - schedule.startTime;
    
    // Check if cliff period has passed
    if (elapsed < schedule.cliffDuration) {
      return 0;
    }
    
    // For instant vesting (scholars/devs paid as work completes)
    if (schedule.duration == 0) {
      // All tokens claimable immediately after any task completion
      return schedule.totalAmount - schedule.claimedAmount;
    }
    
    // For time-based vesting (owner)
    uint256 vestedAmount;
    if (elapsed >= schedule.duration) {
      // Fully vested
      vestedAmount = schedule.totalAmount;
    } else {
      // Linear vesting
      vestedAmount = (schedule.totalAmount * elapsed) / schedule.duration;
    }
    
    claimableAmount = vestedAmount - schedule.claimedAmount;
  }
  
  /// @notice Claim vested tokens
  /// @param vestingId The vesting schedule ID
  /// @param labId The lab ID (for event tracking)
  /// @return claimed Amount of H1 tokens claimed
  function claimVestedTokens(uint256 vestingId, uint256 labId) external returns (uint256 claimed) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.VestingSchedule storage schedule = hs.vestingSchedules[vestingId];
    
    if (schedule.beneficiary == address(0)) revert InvalidVestingId();
    if (schedule.beneficiary != msg.sender) revert Unauthorized();
    if (schedule.revoked) revert VestingAlreadyRevoked();
    
    claimed = getClaimableAmount(vestingId);
    if (claimed == 0) revert NothingToClaim();
    
    schedule.claimedAmount += claimed;
    
    // Transfer H1 tokens from vault
    address vault = hs.labIdToVault[labId];
    require(
      ILabVault(vault).transfer(msg.sender, claimed),
      "H1 transfer failed"
    );
    
    emit TokensClaimed(vestingId, labId, msg.sender, claimed);
  }
  
  /// @notice Revoke a vesting schedule (admin only, emergency use)
  /// @param vestingId The vesting schedule ID
  /// @param labId The lab ID
  function revokeVesting(uint256 vestingId, uint256 labId) external {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.VestingSchedule storage schedule = hs.vestingSchedules[vestingId];
    
    if (schedule.beneficiary == address(0)) revert InvalidVestingId();
    if (msg.sender != hs.labs[labId].owner) revert Unauthorized();
    if (schedule.revoked) revert VestingAlreadyRevoked();
    
    uint256 unvested = schedule.totalAmount - schedule.claimedAmount;
    schedule.revoked = true;
    
    emit VestingRevoked(vestingId, labId, schedule.beneficiary, unvested);
  }
  
  // ============================================
  // VIEW FUNCTIONS
  // ============================================
  
  /// @notice Get full vesting schedule details
  /// @param vestingId The vesting schedule ID
  function getVestingSchedule(uint256 vestingId) external view returns (
    address beneficiary,
    uint256 totalAmount,
    uint256 claimedAmount,
    uint256 startTime,
    uint256 duration,
    uint256 cliffDuration,
    uint8 vestingType,
    bool revoked
  ) {
    LibH1Storage.VestingSchedule storage schedule = LibH1Storage.h1Storage().vestingSchedules[vestingId];
    return (
      schedule.beneficiary,
      schedule.totalAmount,
      schedule.claimedAmount,
      schedule.startTime,
      schedule.duration,
      schedule.cliffDuration,
      schedule.vestingType,
      schedule.revoked
    );
  }
  
  /// @notice Get all scholar vesting IDs for a lab
  /// @param labId The lab ID
  /// @return vestingIds Array of vesting schedule IDs
  function getLabScholarVestings(uint256 labId) external view returns (uint256[] memory vestingIds) {
    return LibH1Storage.h1Storage().labScholarVestings[labId];
  }
  
  /// @notice Get all dev vesting IDs for a lab
  /// @param labId The lab ID
  /// @return vestingIds Array of vesting schedule IDs
  function getLabDevVestings(uint256 labId) external view returns (uint256[] memory vestingIds) {
    return LibH1Storage.h1Storage().labDevVestings[labId];
  }
  
  /// @notice Get lab H1 distribution details
  /// @param labId The lab ID
  function getLabDistribution(uint256 labId) external view returns (
    uint256 totalMinted,
    uint256 ownerAllocation,
    uint256 curveAllocation,
    uint256 scholarAllocation,
    uint256 devAllocation,
    uint256 treasuryAllocation,
    uint256 ownerVestingId,
    bool initialized
  ) {
    LibH1Storage.H1Distribution storage dist = LibH1Storage.h1Storage().labDistributions[labId];
    return (
      dist.totalMinted,
      dist.ownerAllocation,
      dist.curveAllocation,
      dist.scholarAllocation,
      dist.devAllocation,
      dist.treasuryAllocation,
      dist.ownerVestingId,
      dist.initialized
    );
  }
}

