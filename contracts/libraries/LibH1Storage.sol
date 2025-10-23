// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title LibH1Storage
/// @notice Diamond storage library for H1 Labs platform state
/// @dev Uses diamond storage pattern to avoid storage collisions during upgrades
library LibH1Storage {
  bytes32 internal constant H1_STORAGE_POSITION = keccak256("h1.labs.storage.v1");

  // ============================================
  // DEFAULT CONFIGURATION CONSTANTS
  // ============================================
  uint64 internal constant DEFAULT_COOLDOWN = 1 days;
  uint16 internal constant DEFAULT_EXIT_CAP_BPS = 2000; // 20%
  uint16 internal constant DEFAULT_CURVE_FEE_BPS = 500; // 5%
  uint16 internal constant DEFAULT_CURVE_POL_BPS = 500; // 5%

  /// @notice Lab metadata and state (optimized struct packing: 5 slots)
  /// @dev Packed to minimize storage slots from 6 to 5 slots
  struct Lab {
    address owner;          // slot 0: 20 bytes
    address h1Token;        // slot 1: 20 bytes
    uint96 totalStaked;     // slot 2: 12 bytes (packed with active)
    bool active;            // slot 2: 1 byte (packed with totalStaked) - 11 bytes padding
    uint256 totalRevenue;   // slot 3: 32 bytes
    string domain;          // slot 4+: dynamic
    uint8 level;            // Level 1-3 based on staked amount (0 = no level)
  }

  /// @notice Data record with provenance and human supervision metadata
  /// @dev Tracks creator, supervisor, content hash, and delta-gain for revenue attribution
  struct DataRecord {
    address creator;                // 20 bytes: who created the data
    address supervisor;             // 20 bytes: who reviewed/approved
    address pendingSupervisor;      // 20 bytes: supervisor awaiting approval
    address baseModel;              // 20 bytes: model used to generate
    uint256 labId;                  // 32 bytes: associated lab
    bytes32 dataHash;               // 32 bytes: IPFS/Arweave content hash
    string domain;                  // variable: data domain (medical, research, etc)
    uint256 status;                 // 32 bytes: 0=PENDING, 1=APPROVED, 2=REJECTED
    uint256 deltaGainScore;         // 32 bytes: improvement vs base model (0-10000 bps)
    bytes32 approvalSignature;      // 32 bytes: supervisor's signature hash
    uint256 createdAt;              // 32 bytes: creation timestamp
    uint256 approvedAt;             // 32 bytes: approval timestamp (0 if not approved)
  }

  /// @notice Attribution record for revenue distribution
  /// @dev Links creator, supervisor, and delta-gain to data ID for correct splits
  struct Attribution {
    address creator;                // 20 bytes: data creator
    address supervisor;             // 20 bytes: human supervisor
    uint256 labId;                  // 32 bytes: lab ID
    uint256 deltaGainScore;         // 32 bytes: delta-gain percentage (bps)
    uint256 revenueShare;           // 32 bytes: revenue allocated to data
    uint256 recordedAt;             // 32 bytes: when recorded
  }

  /// @notice User credential record
  /// @dev Tracks individual credentials issued to users with verification status
  struct Credential {
    uint256 credentialId;           // 32 bytes: unique credential ID
    address holder;                 // 20 bytes: credential holder address
    uint256 userId;                 // 32 bytes: associated user ID
    address issuer;                 // 20 bytes: organization/body that issued
    string credentialType;          // variable: type (physician, engineer, etc)
    string domain;                  // variable: domain (medical, finance, etc)
    uint256 status;                 // 32 bytes: 0=PENDING, 1=VERIFIED, 2=REVOKED
    bytes32 offChainVerificationHash; // 32 bytes: IPFS/Arweave verification doc
    uint256 issuedAt;               // 32 bytes: issuance timestamp
    uint256 verifiedAt;             // 32 bytes: verification timestamp (0 if pending)
    uint256 revokedAt;              // 32 bytes: revocation timestamp (0 if active)
  }

  /// @notice User profile with credential tracking
  /// @dev Aggregates credential information for quick access
  struct UserProfile {
    address userAddress;            // 20 bytes: associated address
    string domainFocus;             // variable: primary domain focus
    uint256 createdAt;              // 32 bytes: profile creation timestamp
    uint256 credentialCount;        // 32 bytes: total issued credentials
    uint256 verifiedCredentialCount;// 32 bytes: verified credentials
    bool isActive;                  // 1 byte: profile active status
  }

  /// @notice Vesting schedule for locked H1 tokens
  /// @dev Tracks vesting parameters and claim progress
  struct VestingSchedule {
    address beneficiary;            // 20 bytes: who receives the tokens
    uint256 totalAmount;            // 32 bytes: total H1 tokens vesting
    uint256 claimedAmount;          // 32 bytes: amount already claimed
    uint256 startTime;              // 32 bytes: vesting start timestamp
    uint256 duration;               // 32 bytes: vesting duration in seconds
    uint256 cliffDuration;          // 32 bytes: cliff period before any unlock
    uint8 vestingType;              // 1 byte: 0=owner, 1=scholar, 2=dev
    bool revoked;                   // 1 byte: if vesting was revoked
  }

  /// @notice Initial H1 distribution tracking per lab
  /// @dev Records how tokens were allocated on lab creation
  struct H1Distribution {
    uint256 totalMinted;            // 32 bytes: total H1 minted for this lab
    uint256 ownerAllocation;        // 32 bytes: 30% to owner (vested)
    uint256 curveAllocation;        // 32 bytes: 10% to bonding curve (liquid)
    uint256 scholarAllocation;      // 32 bytes: 40% to scholars (vested)
    uint256 devAllocation;          // 32 bytes: 15% to devs (vested)
    uint256 treasuryAllocation;     // 32 bytes: 5% to treasury (instant)
    uint256 ownerVestingId;         // 32 bytes: vesting schedule ID for owner
    bool initialized;               // 1 byte: if distribution happened
  }

  struct H1Storage {
    mapping(uint256 => Lab) labs;
    uint256 nextLabId;
    // Global config
    address labsToken;
    uint64 defaultCooldown;
    uint16 defaultExitCapBps;
    address protocolTreasury;
    uint16 curveFeeBps;
    uint16 curvePolBps;
    // Global guards/state (shared across facets)
    uint256 reentrancyStatus; // 1 = NOT_ENTERED, 2 = ENTERED
    // Domain registry and staking balances (moved from facets to avoid storage collisions)
    mapping(bytes32 => bool) domainTaken; // keccak256(domain) => taken
    mapping(address => uint256) stakedBalances; // user => LABS staked amount
    // Per-lab vault address (ERC-4626-style)
    mapping(uint256 => address) labIdToVault;
    // Per-lab LabPass NFT
    mapping(uint256 => address) labIdToLabPass;
    // Per-lab bonding curve sale contract
    mapping(uint256 => address) labIdToCurve;
    // ============ Data Validation Storage ============
    // Data records indexed by dataId
    mapping(uint256 => DataRecord) dataRecords;
    // Attribution records indexed by dataId
    mapping(uint256 => Attribution) attributionRecords;
    // All data IDs for a lab
    mapping(uint256 => uint256[]) labDataRecords;
    // Next data ID counter
    uint256 nextDataId;
    // ============ Credentialing Storage ============
    // User ID management
    mapping(address => uint256) userAddressToId;    // address → userId
    mapping(uint256 => address) userIdToAddress;    // userId → address
    mapping(uint256 => UserProfile) userProfiles;   // userId → profile
    uint256 nextUserId;                             // userId counter
    // Credential management
    mapping(uint256 => Credential) credentials;     // credentialId → record
    mapping(uint256 => uint256[]) userCredentials;  // userId → [credentialIds]
    uint256 nextCredentialId;                       // credentialId counter
    bool defaultsInitialized;
    // ============ H1 Vesting & Distribution Storage ============
    // Vesting schedules
    mapping(uint256 => VestingSchedule) vestingSchedules;  // vestingId → schedule
    uint256 nextVestingId;                                  // vestingId counter
    // Lab H1 distributions
    mapping(uint256 => H1Distribution) labDistributions;    // labId → distribution
    // Lab vesting IDs (for scholars and devs)
    mapping(uint256 => uint256[]) labScholarVestings;       // labId → [vestingIds]
    mapping(uint256 => uint256[]) labDevVestings;           // labId → [vestingIds]
  }

  function h1Storage() internal pure returns (H1Storage storage hs) {
    bytes32 position = H1_STORAGE_POSITION;
    assembly {
      hs.slot := position
    }
  }
}


