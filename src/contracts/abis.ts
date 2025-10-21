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
