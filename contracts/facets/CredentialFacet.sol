// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

/// @title CredentialFacet
/// @notice Manages user credentials, verification, and identity for the H1 Labs protocol
/// @dev Enables off-chain verified credentials to be tracked on-chain for provenance
contract CredentialFacet {
  // ============ Constants ============
  uint256 private constant CREDENTIAL_PENDING = 0;
  uint256 private constant CREDENTIAL_VERIFIED = 1;
  uint256 private constant CREDENTIAL_REVOKED = 2;
  
  // ============ Events ============
  event CredentialIssued(
    uint256 indexed credentialId,
    address indexed holder,
    address indexed issuer,
    string credentialType,
    string domain,
    bytes32 offChainVerificationHash,
    uint256 timestamp
  );

  event CredentialVerified(
    uint256 indexed credentialId,
    address indexed verifier,
    string verificationDetails,
    uint256 timestamp
  );

  event CredentialRevoked(
    uint256 indexed credentialId,
    address indexed revoker,
    string reason,
    uint256 timestamp
  );

  event CredentialMetadataUpdated(
    uint256 indexed credentialId,
    string newMetadata,
    uint256 timestamp
  );

  event UserIdCreated(
    address indexed user,
    uint256 indexed userId,
    string domainFocus,
    uint256 timestamp
  );

  // ============ Errors ============
  error InvalidCredentialId();
  error InvalidUserId();
  error InvalidAddress();
  error InvalidStatus();
  error Unauthorized();
  error CredentialAlreadyExists();
  error InvalidCredentialType();
  error InvalidDomain();

  // ============ Core Functions ============

  /// @notice Create a unique user ID with credential tracking
  /// @dev Generates a userId for a user and initializes their credential history
  /// @param user The address to create an ID for
  /// @param domainFocus The primary domain focus (e.g., "medical", "finance", "research")
  /// @return userId The unique identifier for this user
  function createUserId(
    address user,
    string calldata domainFocus
  ) external returns (uint256 userId) {
    if (user == address(0)) revert InvalidAddress();
    if (bytes(domainFocus).length == 0) revert InvalidDomain();

    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    // Check user doesn't already have an ID
    if (hs.userAddressToId[user] != 0) revert CredentialAlreadyExists();

    // Generate new userId
    userId = ++hs.nextUserId;
    
    // Store mapping
    hs.userAddressToId[user] = userId;
    hs.userIdToAddress[userId] = user;
    
    // Create user profile
    hs.userProfiles[userId] = LibH1Storage.UserProfile({
      userAddress: user,
      domainFocus: domainFocus,
      createdAt: block.timestamp,
      credentialCount: 0,
      verifiedCredentialCount: 0,
      isActive: true
    });

    emit UserIdCreated(user, userId, domainFocus, block.timestamp);
  }

  /// @notice Issue a credential to a user (off-chain verified)
  /// @dev Issuer can be an organization, institution, or credentialing body
  /// @param userId The user receiving the credential
  /// @param credentialType The type of credential (e.g., "physician", "ml-engineer", "data-scientist")
  /// @param domain The domain of expertise (e.g., "medical", "research", "finance")
  /// @param offChainVerificationHash Hash of off-chain verification document (IPFS/Arweave)
  /// @return credentialId The unique credential identifier
  function issueCredential(
    uint256 userId,
    string calldata credentialType,
    string calldata domain,
    bytes32 offChainVerificationHash
  ) external returns (uint256 credentialId) {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    if (hs.userIdToAddress[userId] == address(0)) revert InvalidUserId();
    if (bytes(credentialType).length == 0) revert InvalidCredentialType();
    if (bytes(domain).length == 0) revert InvalidDomain();
    if (offChainVerificationHash == bytes32(0)) revert InvalidCredentialId();
    
    // Generate credentialId
    credentialId = ++hs.nextCredentialId;

    // Store credential
    hs.credentials[credentialId] = LibH1Storage.Credential({
      credentialId: credentialId,
      holder: hs.userIdToAddress[userId],
      userId: userId,
      issuer: msg.sender,
      credentialType: credentialType,
      domain: domain,
      status: CREDENTIAL_PENDING,
      offChainVerificationHash: offChainVerificationHash,
      issuedAt: block.timestamp,
      verifiedAt: 0,
      revokedAt: 0
    });

    // Add to user's credentials
    hs.userCredentials[userId].push(credentialId);
    
    // Increment user's credential count
    LibH1Storage.UserProfile storage profile = hs.userProfiles[userId];
    profile.credentialCount++;

    emit CredentialIssued(
      credentialId,
      hs.userIdToAddress[userId],
      msg.sender,
      credentialType,
      domain,
      offChainVerificationHash,
      block.timestamp
    );
  }

  /// @notice Verify a credential (marks it as verified)
  /// @dev Can be called by issuer or designated verifier
  /// @param credentialId The credential to verify
  /// @param verificationDetails Details of verification (stored in events)
  function verifyCredential(
    uint256 credentialId,
    string calldata verificationDetails
  ) external {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.Credential storage cred = hs.credentials[credentialId];

    if (cred.credentialId == 0) revert InvalidCredentialId();
    if (cred.issuer != msg.sender) revert Unauthorized();
    if (cred.status != CREDENTIAL_PENDING) revert InvalidStatus();

    // Mark as verified
    cred.status = CREDENTIAL_VERIFIED;
    cred.verifiedAt = block.timestamp;

    // Increment user's verified count
    LibH1Storage.UserProfile storage profile = hs.userProfiles[cred.userId];
    profile.verifiedCredentialCount++;

    emit CredentialVerified(credentialId, msg.sender, verificationDetails, block.timestamp);
  }

  /// @notice Revoke a credential
  /// @dev Only issuer can revoke
  /// @param credentialId The credential to revoke
  /// @param reason Reason for revocation (stored in events)
  function revokeCredential(
    uint256 credentialId,
    string calldata reason
  ) external {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LibH1Storage.Credential storage cred = hs.credentials[credentialId];

    if (cred.credentialId == 0) revert InvalidCredentialId();
    if (cred.issuer != msg.sender) revert Unauthorized();
    if (cred.status == CREDENTIAL_REVOKED) revert InvalidStatus();

    // Mark as revoked
    cred.status = CREDENTIAL_REVOKED;
    cred.revokedAt = block.timestamp;

    // Decrement verified count if was verified
    if (cred.verifiedAt > 0) {
      LibH1Storage.UserProfile storage profile = hs.userProfiles[cred.userId];
      if (profile.verifiedCredentialCount > 0) {
        profile.verifiedCredentialCount--;
      }
    }

    emit CredentialRevoked(credentialId, msg.sender, reason, block.timestamp);
  }

  // ============ View Functions ============

  /// @notice Get user ID from address
  /// @param user The user address
  /// @return userId The user's unique ID (0 if not created)
  function getUserId(address user) external view returns (uint256) {
    return LibH1Storage.h1Storage().userAddressToId[user];
  }

  /// @notice Get user address from ID
  /// @param userId The user ID
  /// @return userAddress The address associated with this ID
  function getUserAddress(uint256 userId) external view returns (address) {
    return LibH1Storage.h1Storage().userIdToAddress[userId];
  }

  /// @notice Get full credential record
  /// @param credentialId The credential ID
  /// @return The credential record
  function getCredential(uint256 credentialId) 
    external 
    view 
    returns (LibH1Storage.Credential memory) 
  {
    return LibH1Storage.h1Storage().credentials[credentialId];
  }

  /// @notice Get user profile
  /// @param userId The user ID
  /// @return The user profile with credential counts
  function getUserProfile(uint256 userId) 
    external 
    view 
    returns (LibH1Storage.UserProfile memory) 
  {
    return LibH1Storage.h1Storage().userProfiles[userId];
  }

  /// @notice Get all credentials for a user
  /// @param userId The user ID
  /// @return Array of credential IDs for this user
  function getUserCredentials(uint256 userId) 
    external 
    view 
    returns (uint256[] memory) 
  {
    return LibH1Storage.h1Storage().userCredentials[userId];
  }

  /// @notice Get verified credentials for a user
  /// @param userId The user ID
  /// @return Array of verified credential IDs
  function getVerifiedCredentials(uint256 userId) 
    external 
    view 
    returns (uint256[] memory) 
  {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    uint256[] storage allCredentials = hs.userCredentials[userId];
    
    // Count verified credentials
    uint256 count = 0;
    for (uint256 i = 0; i < allCredentials.length; i++) {
      if (hs.credentials[allCredentials[i]].status == CREDENTIAL_VERIFIED) {
        count++;
      }
    }

    // Build array of verified
    uint256[] memory verified = new uint256[](count);
    uint256 idx = 0;
    for (uint256 i = 0; i < allCredentials.length; i++) {
      if (hs.credentials[allCredentials[i]].status == CREDENTIAL_VERIFIED) {
        verified[idx++] = allCredentials[i];
      }
    }
    return verified;
  }

  /// @notice Check if user has a verified credential in a domain
  /// @param userId The user ID
  /// @param domain The domain to check (e.g., "medical", "finance")
  /// @return hasVerified True if user has at least one verified credential in domain
  function hasVerifiedCredentialInDomain(uint256 userId, string calldata domain) 
    external 
    view 
    returns (bool) 
  {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    uint256[] storage credentials = hs.userCredentials[userId];
    
    for (uint256 i = 0; i < credentials.length; i++) {
      LibH1Storage.Credential storage cred = hs.credentials[credentials[i]];
      if (
        cred.status == CREDENTIAL_VERIFIED &&
        keccak256(abi.encodePacked(cred.domain)) == keccak256(abi.encodePacked(domain))
      ) {
        return true;
      }
    }
    return false;
  }

  /// @notice Get credential status
  /// @param credentialId The credential ID
  /// @return status 0=PENDING, 1=VERIFIED, 2=REVOKED
  function getCredentialStatus(uint256 credentialId) 
    external 
    view 
    returns (uint256) 
  {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    return hs.credentials[credentialId].status;
  }
}

