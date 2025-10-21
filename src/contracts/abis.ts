// Contract ABIs for H1 Labs
// Minimal ABIs for the functions we need

export const LABSToken_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

export const LABSCoreFacet_ABI = [
  "function stakeLABS(uint256 amount) external",
  "function createLab(string calldata name, string calldata symbol, string calldata domain) external returns (uint256 labId)",
  "function isDomainAvailable(string calldata domain) external view returns (bool)"
];

export const DataValidationFacet_ABI = [
  "function createData(uint256 labId, bytes32 dataHash, string calldata domain, address baseModel, uint256 creatorCredentialId) external returns (uint256 dataId)",
  "function submitForReview(uint256 dataId, address supervisor, uint256 supervisorCredentialId) external",
  "function approveData(uint256 dataId, uint256 deltaGainScore, bytes32 approvalSignature) external",
  "function getDataRecord(uint256 dataId) external view returns (tuple(uint256 dataId, uint256 labId, bytes32 dataHash, string domain, address baseModel, uint256 status, uint256 creatorCredentialId, uint256 supervisorCredentialId, uint256 deltaGainScore, uint256 timestamp))"
];

export const CredentialFacet_ABI = [
  "function createUserId(address user, string calldata domainFocus) external returns (uint256 userId)",
  "function issueCredential(uint256 userId, string calldata credentialType, string calldata domain, bytes32 offChainVerificationHash) external returns (uint256 credentialId)",
  "function verifyCredential(uint256 credentialId, string calldata verificationDetails) external",
  "function getUserId(address user) external view returns (uint256)",
  "function getCredential(uint256 credentialId) external view returns (tuple(uint256 id, uint256 userId, string credentialType, string domain, bytes32 offChainVerificationHash, uint256 status, uint256 issuedAt, uint256 verifiedAt))"
];

export const RevenueFacet_ABI = [
  "function batchDistributeRevenue(uint256[] calldata datasetIds, uint256[] calldata labIds, uint256[] calldata amounts) external payable",
  "function getLabTotalRevenue(uint256 labId) external view returns (uint256)",
  "function getRevenueBreakdown(uint256 amount) external pure returns (uint256 buyback, uint256 developer, uint256 creator, uint256 scholar, uint256 treasury)"
];
