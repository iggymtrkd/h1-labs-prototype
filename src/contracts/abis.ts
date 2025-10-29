// Contract ABIs for H1 Labs
// Minimal ABIs for the functions we need

export const LABSToken_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

export const LABSCoreFacet_ABI = [
  // Staking functions
  "function stakeLABS(uint256 amount) external",
  "function getStakedBalance(address user) external view returns (uint256)",
  // Lab query functions
  "function isDomainAvailable(string calldata domain) external view returns (bool)",
  "function getLabLevel(uint256 labId) external view returns (uint8)",
  "function getLabDetails(uint256 labId) external view returns (address owner, address h1Token, string memory domain, bool active, uint8 level)"
];

export const LabVaultDeploymentFacet_ABI = [
  "function setVaultFactory(address factory) external",
  "function createLab(string calldata name, string calldata symbol, string calldata domain) external returns (uint256 labId, address vault, address curve)",
  "function getLabDetails(uint256 labId) external view returns (address owner, address h1Token, string memory domain, bool active, uint8 level)",
  "event LabVaultDeployed(uint256 indexed labId, address indexed owner, address vault, string name, string symbol, string domain)",
  "event LabDistributionComplete(uint256 indexed labId, address indexed curve)"
];

export const LabDistributionFacet_ABI = [
  "function createLabStep2(uint256 labId) external",
  "event LabDistributionComplete(uint256 indexed labId, address indexed curve)"
];

export const DiamondLoupeFacet_ABI = [
  "function facetAddress(bytes4) external view returns (address)"
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
  "function getCredential(uint256 credentialId) external view returns (tuple(uint256 credentialId, address holder, uint256 userId, address issuer, string credentialType, string domain, uint256 status, bytes32 offChainVerificationHash, uint256 issuedAt, uint256 verifiedAt, uint256 revokedAt))"
];

export const RevenueFacet_ABI = [
  "function batchDistributeRevenue(uint256[] calldata datasetIds, uint256[] calldata labIds, uint256[] calldata amounts) external payable",
  "function getLabTotalRevenue(uint256 labId) external view returns (uint256)",
  "function getRevenueBreakdown(uint256 amount) external pure returns (uint256 buyback, uint256 developer, uint256 creator, uint256 scholar, uint256 treasury)"
];

// Optional (may not be deployed): Testing/Config facet used for diagnostics
export const TestingFacet_ABI = [
  "function initializeDefaults(address treasury) external",
  "function getProtocolParams() external view returns (address labsToken, address protocolTreasury, uint64 defaultCooldown, uint16 defaultExitCapBps, uint16 curveFeeBps, uint16 curvePolBps, bool defaultsInitialized)",
  "function getDefaultConfiguration() external view returns (uint64 defaultCooldown, uint16 defaultExitCapBps, uint16 curveFeeBps, uint16 curvePolBps)",
  "function setDefaultCooldown(uint64 seconds_) external",
  "function setDefaultExitCap(uint16 bps) external",
  "function setCurveFeeBps(uint16 feeBps) external",
  "function setCurvePolBps(uint16 polBps) external",
  "function setProtocolTreasury(address treasury) external",
  "function setLABSToken(address labsToken) external",
  "function getLABSToken() external view returns (address)",
  "function getStakedBalance(address user) external view returns (uint256)"
];

export const BondingCurveFacet_ABI = [
  "function deployBondingCurve(uint256 labId) external returns (address curve)",
  "function getBondingCurve(uint256 labId) external view returns (address)"
];

export const BondingCurveSale_ABI = [
  "function buy(uint256 labsAmount, address receiver, uint256 minSharesOut) external returns (uint256 sharesOut)",
  "function sell(uint256 sharesAmount, address receiver, uint256 minLabsOut) external returns (uint256 labsOut)",
  "function price() external view returns (uint256)",
  "function labsToken() external view returns (address)",
  "function vault() external view returns (address)",
  "function treasury() external view returns (address)",
  "function feeBps() external view returns (uint256)",
  "function polBps() external view returns (uint256)",
  "function paused() external view returns (bool)"
];

export const LabVault_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function totalAssets() external view returns (uint256)",
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function assetsPerShare() external view returns (uint256)",
  "function depositLABS(uint256 assets, address receiver) external returns (uint256 shares)",
  "function requestRedeem(uint256 shares) external returns (uint256 requestId)",
  "function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function getLevel() external view returns (uint8)",
  "function initialMintCompleted() external view returns (bool)"
];

export const H1VestingFacet_ABI = [
  "function createVestingSchedule(uint256 labId, address beneficiary, uint256 totalAmount, uint8 vestingType, address vault) external returns (uint256 vestingId)",
  "function getClaimableAmount(uint256 vestingId) external view returns (uint256 claimableAmount)",
  "function claimVestedTokens(uint256 vestingId, uint256 labId) external returns (uint256 claimed)",
  "function revokeVesting(uint256 vestingId, uint256 labId) external",
  "function getVestingSchedule(uint256 vestingId) external view returns (address beneficiary, uint256 totalAmount, uint256 claimedAmount, uint256 startTime, uint256 duration, uint256 cliffDuration, uint8 vestingType, bool revoked)",
  "function getLabScholarVestings(uint256 labId) external view returns (uint256[] memory)",
  "function getLabDevVestings(uint256 labId) external view returns (uint256[] memory)",
  "function getLabDistribution(uint256 labId) external view returns (uint256 totalMinted, uint256 ownerAllocation, uint256 curveAllocation, uint256 scholarAllocation, uint256 devAllocation, uint256 treasuryAllocation, uint256 ownerVestingId, bool initialized)",
  "event VestingScheduleCreated(uint256 indexed vestingId, uint256 indexed labId, address indexed beneficiary, uint256 totalAmount, uint256 startTime, uint256 duration, uint8 vestingType)",
  "event TokensClaimed(uint256 indexed vestingId, uint256 indexed labId, address indexed beneficiary, uint256 amount)"
];
