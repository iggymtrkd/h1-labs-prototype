// H1 Labs Contract Configuration
// Auto-generated from deployed contracts on Base Sepolia

export const CONTRACTS = {
  // Network Configuration
  CHAIN_ID: 84532, // Base Sepolia
  RPC_URL: "https://sepolia.base.org",
  BLOCK_EXPLORER: "https://sepolia.basescan.org",
  
  // Core Contracts (✅ DEPLOYED)
  H1Diamond: "0x29a7297e84df485aff8def2d27e467f3a37619c0",
  LABSToken: "0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd",
  
  // Diamond Facets (✅ ALL DEPLOYED)
  DiamondCutFacet: "0x0c21433be788016a7bf7471308dbf3918b827f9e",
  DiamondLoupeFacet: "0x94c4868d99590e247ff48de19cd7be385a2b5e58",
  OwnershipFacet: "0xb49b55fa025b4bc0a7e5c5a35d42acdebaabe2b9",
  SecurityFacet: "0x330c418951a0237d4c28685c0a7dbdb5b42eb441",
  LABSCoreFacet: "0x07bdea6e6665156ee1d1d14cf81e03566244c14d",
  VaultFacet: "0xd6157e381ec5c1d06aca995fa77c5d0a388ff512",
  BondingCurveFacet: "0x400b47355be05bbe21f5660016b50b93ab6c9267",
  LabPassFacet: "0x799cb349e8feec8ce0155abe0a2f258307a66834",
  RevenueFacet: "0x7047002e807e4aaa0dcb79b74017775d9fdbe65b",
  TreasuryFacet: "0x65c38321d60b3e2fdbf30a474ff7063eadc9f509",
  
  // Uniswap V3 (Base Sepolia)
  WETH: "0x4200000000000000000000000000000000000006",
  UniswapV3Factory: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
  UniswapV3PositionManager: "0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2",
  
  // Protocol Configuration (⚠️ TO BE SET)
  // These need to be configured via smart contract calls
  // See: QUICK_START.md Phase 3
  ProtocolTreasury: "", // To be set via setProtocolTreasury()
  DefaultCooldown: 604800, // 7 days in seconds
  DefaultExitCap: 2000, // 20% in basis points
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: (import.meta as any).env?.VITE_API_URL || "http://localhost:3001",
  WS_URL: (import.meta as any).env?.VITE_WS_URL || "ws://localhost:3001",
} as const;

// Feature Flags
export const FEATURES = {
  BONDING_CURVES: true,
  LAB_PASS_NFTS: true,
  UNISWAP_POOL: false, // Not deployed yet
  FAUCET: true,
  ADMIN_TESTING: true, // Set to false in production
} as const;

// Contract Event Topics (for filtering)
export const EVENT_TOPICS = {
  LabCreated: "0x...", // To be filled after first event
  VaultDeployed: "0x...",
  Deposited: "0x...",
  RedeemRequested: "0x...",
  RedeemClaimed: "0x...",
} as const;

export type ContractAddresses = typeof CONTRACTS;
export type ContractName = keyof ContractAddresses;

