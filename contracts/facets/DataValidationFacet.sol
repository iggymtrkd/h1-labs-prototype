// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

/// @title DataValidationFacet
/// @notice Handles data creation, validation, and proof of provenance with human supervision
/// @dev Implements on-chain data validation with attribution tracking and human oversight
contract DataValidationFacet {
  // ============ Constants ============
  uint256 private constant NOT_ENTERED = 1;
  uint256 private constant ENTERED = 2;
  uint256 private constant STATUS_PENDING = 0;
  uint256 private constant STATUS_APPROVED = 1;
  uint256 private constant STATUS_REJECTED = 2;

  // ============ Events ============
  event DataCreated(
    uint256 indexed dataId,
    uint256 indexed labId,
    address indexed creator,
    bytes32 dataHash,
    string domain,
    address baseModel,
    uint256 timestamp
  );

  event DataSubmittedForReview(
    uint256 indexed dataId,
    address indexed supervisor,
    uint256 timestamp
  );

  event DataApproved(
    uint256 indexed dataId,
    address indexed supervisor,
    bytes32 approvalSignature,
    uint256 timestamp
  );

  event DataRejected(
    uint256 indexed dataId,
    address indexed supervisor,
    string reason,
    uint256 timestamp
  );

  event ProvenanceRecorded(
    uint256 indexed dataId,
    address indexed creator,
    address indexed supervisor,
    bytes32 contentHash,
    uint256 deltaGainScore,
    uint256 timestamp
  );

  event CredentialLinked(
    uint256 indexed dataId,
    uint256 indexed creatorCredentialId,
    uint256 indexed supervisorCredentialId,
    uint256 timestamp
  );

  // ============ Errors ============
  error ReentrancyGuard();
  error InvalidLabId();
  error InvalidDataId();
  error InvalidAddress();
  error Unauthorized();
  error InvalidStatus();
  error InvalidGainScore();
  error DataAlreadyExists();
  error InvalidCredential();
  error UnverifiedCredential();

  // ============ Modifiers ============
  modifier nonReentrant() {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    if (hs.reentrancyStatus == ENTERED) revert ReentrancyGuard();
    hs.reentrancyStatus = ENTERED;
    _;
    hs.reentrancyStatus = NOT_ENTERED;
  }

  modifier onlyLabOwner(uint256 labId) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.Lab storage lab = hs.labs[labId];
    if (msg.sender != lab.owner) revert Unauthorized();
    _;
  }

  // ============ Core Functions ============

  /// @notice Create a new dataset with proof of provenance (with credential linking)
  /// @dev Initializes data entry with creator, hash, base model, and creator's credential
  /// @param labId The lab identifier
  /// @param dataHash The content hash of the dataset (IPFS/Arweave)
  /// @param domain The data domain (e.g., "medical", "research", "synthetic")
  /// @param baseModel The address or identifier of the base model used
  /// @param creatorCredentialId Optional credential ID for creator verification
  /// @return dataId The unique identifier for this dataset
  function createData(
    uint256 labId,
    bytes32 dataHash,
    string calldata domain,
    address baseModel,
    uint256 creatorCredentialId
  ) external returns (uint256 dataId) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.Lab storage lab = hs.labs[labId];
    
    if (lab.owner == address(0)) revert InvalidLabId();
    if (baseModel == address(0)) revert InvalidAddress();
    if (dataHash == bytes32(0)) revert InvalidDataId();

    // Verify creator credential if provided
    if (creatorCredentialId > 0) {
      LibH1Storage.Credential storage cred = hs.credentials[creatorCredentialId];
      if (cred.credentialId == 0) revert InvalidCredential();
      if (cred.holder != msg.sender) revert Unauthorized();
      if (cred.status != 1) revert UnverifiedCredential(); // 1 = VERIFIED
    }

    // Generate unique dataId
    dataId = hs.nextDataId++;

    // Store data provenance
    LibH1Storage.DataRecord storage record = hs.dataRecords[dataId];
    record.creator = msg.sender;
    record.labId = labId;
    record.dataHash = dataHash;
    record.domain = domain;
    record.baseModel = baseModel;
    record.status = STATUS_PENDING;
    record.createdAt = block.timestamp;
    record.deltaGainScore = 0;

    // Add to lab's data list
    hs.labDataRecords[labId].push(dataId);

    emit DataCreated(
      dataId,
      labId,
      msg.sender,
      dataHash,
      domain,
      baseModel,
      block.timestamp
    );

    // Emit credential link if provided
    if (creatorCredentialId > 0) {
      emit CredentialLinked(dataId, creatorCredentialId, 0, block.timestamp);
    }
  }

  /// @notice Submit data for human supervisor review with credential requirement
  /// @dev Marks data as pending review; supervisor must have verified credential in domain
  /// @param dataId The dataset identifier
  /// @param supervisor The credentialed human who will review
  /// @param supervisorCredentialId The credential ID proving supervisor's expertise
  function submitForReview(
    uint256 dataId, 
    address supervisor,
    uint256 supervisorCredentialId
  ) 
    external 
    nonReentrant 
  {
    if (supervisor == address(0)) revert InvalidAddress();
    
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.DataRecord storage record = hs.dataRecords[dataId];

    if (record.creator == address(0)) revert InvalidDataId();
    if (msg.sender != record.creator) revert Unauthorized();
    if (record.status != STATUS_PENDING) revert InvalidStatus();

    // Verify supervisor has a verified credential in the data's domain
    LibH1Storage.Credential storage superCred = hs.credentials[supervisorCredentialId];
    if (superCred.credentialId == 0) revert InvalidCredential();
    if (superCred.holder != supervisor) revert Unauthorized();
    if (superCred.status != 1) revert UnverifiedCredential(); // 1 = VERIFIED
    if (keccak256(abi.encodePacked(superCred.domain)) != keccak256(abi.encodePacked(record.domain))) {
      revert Unauthorized(); // Supervisor not credentialed in this domain
    }

    record.pendingSupervisor = supervisor;

    emit DataSubmittedForReview(dataId, supervisor, block.timestamp);
  }

  /// @notice Supervisor approves the dataset with delta-gain and credential recording
  /// @dev Records approval signature, delta-gain score, and links credential for audit trail
  /// @param dataId The dataset identifier
  /// @param deltaGainScore The improvement score vs base model (0-100 basis points)
  /// @param approvalSignature The supervisor's signature hash for verification
  function approveData(
    uint256 dataId,
    uint256 deltaGainScore,
    bytes32 approvalSignature
  ) external {
    if (deltaGainScore > 10000) revert InvalidGainScore(); // Max 100%

    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.DataRecord storage record = hs.dataRecords[dataId];

    if (record.creator == address(0)) revert InvalidDataId();
    if (msg.sender != record.pendingSupervisor) revert Unauthorized();
    if (record.status != STATUS_PENDING) revert InvalidStatus();

    // Update record with supervision metadata
    record.supervisor = msg.sender;
    record.status = STATUS_APPROVED;
    record.approvalSignature = approvalSignature;
    record.deltaGainScore = deltaGainScore;
    record.approvedAt = block.timestamp;

    // Record attribution for revenue splits
    hs.attributionRecords[dataId] = LibH1Storage.Attribution({
      creator: record.creator,
      supervisor: msg.sender,
      labId: record.labId,
      deltaGainScore: deltaGainScore,
      revenueShare: 0, // Calculated at sale time
      recordedAt: block.timestamp
    });

    emit DataApproved(dataId, msg.sender, approvalSignature, block.timestamp);
    emit ProvenanceRecorded(
      dataId,
      record.creator,
      msg.sender,
      record.dataHash,
      deltaGainScore,
      block.timestamp
    );
  }

  /// @notice Supervisor rejects the dataset with reason
  /// @dev Marks dataset as rejected; creator can iterate and resubmit
  /// @param dataId The dataset identifier
  /// @param reason The reason for rejection (stored off-chain via event)
  function rejectData(uint256 dataId, string calldata reason) external {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.DataRecord storage record = hs.dataRecords[dataId];

    if (record.creator == address(0)) revert InvalidDataId();
    if (msg.sender != record.pendingSupervisor) revert Unauthorized();
    if (record.status != STATUS_PENDING) revert InvalidStatus();

    record.status = STATUS_REJECTED;
    record.supervisor = msg.sender;

    emit DataRejected(dataId, msg.sender, reason, block.timestamp);
  }

  // ============ View Functions ============

  /// @notice Get the full provenance record for a dataset
  /// @param dataId The dataset identifier
  /// @return The complete data record with all metadata
  function getDataRecord(uint256 dataId) 
    external 
    view 
    returns (LibH1Storage.DataRecord memory) 
  {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    return hs.dataRecords[dataId];
  }

  /// @notice Get attribution record for revenue distribution
  /// @param dataId The dataset identifier
  /// @return The attribution with creator, supervisor, and delta-gain score
  function getAttribution(uint256 dataId) 
    external 
    view 
    returns (LibH1Storage.Attribution memory) 
  {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    return hs.attributionRecords[dataId];
  }

  /// @notice Get all approved data for a lab
  /// @param labId The lab identifier
  /// @return Array of approved data IDs for this lab
  function getLabApprovedData(uint256 labId) 
    external 
    view 
    returns (uint256[] memory) 
  {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    uint256[] storage allData = hs.labDataRecords[labId];
    
    // Count approved records
    uint256 count = 0;
    for (uint256 i = 0; i < allData.length; i++) {
      if (hs.dataRecords[allData[i]].status == STATUS_APPROVED) {
        count++;
      }
    }

    // Build array of approved
    uint256[] memory approved = new uint256[](count);
    uint256 idx = 0;
    for (uint256 i = 0; i < allData.length; i++) {
      if (hs.dataRecords[allData[i]].status == STATUS_APPROVED) {
        approved[idx++] = allData[i];
      }
    }
    return approved;
  }

  /// @notice Get all data records for a lab
  /// @param labId The lab identifier
  /// @return Array of all data IDs for this lab
  function getLabData(uint256 labId) 
    external 
    view 
    returns (uint256[] memory) 
  {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    return hs.labDataRecords[labId];
  }

  /// @notice Get data record status
  /// @param dataId The dataset identifier
  /// @return status 0=PENDING, 1=APPROVED, 2=REJECTED
  function getDataStatus(uint256 dataId) 
    external 
    view 
    returns (uint256 status) 
  {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    return hs.dataRecords[dataId].status;
  }
}
