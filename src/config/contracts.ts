// H1 Labs Contract Configuration
// Auto-generated from deployed contracts on Base Sepolia
// 
// ⚠️ IMPORTANT: This application ONLY supports Base Sepolia testnet (chainId: 84532)
// All smart contracts are deployed exclusively on Base Sepolia
// Users will be automatically prompted to switch networks if on a different chain

export const CONTRACTS = {
  // Network Configuration - Base Sepolia ONLY
  CHAIN_ID: 84532, // Base Sepolia testnet (REQUIRED)
  RPC_URL: "https://sepolia.base.org",
  RPC_FALLBACKS: [
    "https://base-sepolia.publicnode.com",
    "https://base-sepolia-rpc.publicnode.com",
    "https://base-sepolia.blockpi.network/v1/rpc/public"
  ],
  BLOCK_EXPLORER: "https://sepolia.basescan.org",
  
  // Contract deployment block (for efficient event queries)
  DEPLOYMENT_BLOCK: 32565868, // Actual deployment block for optimized scanning
  
  // Core Contracts (✅ DEPLOYED)
  H1Diamond: "0x29a7297e84df485aff8def2d27e467f3a37619c0",
  LABSToken: "0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd",
  LabVaultFactory: "0xb26922366a9eecb4c8452c8d1745dcef0b7ec7c8", // Factory for deploying vaults
  
  // Diamond Facets (✅ ALL DEPLOYED)
  DiamondCutFacet: "0x0c21433be788016a7bf7471308dbf3918b827f9e",
  DiamondLoupeFacet: "0x94c4868d99590e247ff48de19cd7be385a2b5e58",
  OwnershipFacet: "0xb49b55fa025b4bc0a7e5c5a35d42acdebaabe2b9",
  SecurityFacet: "0x330c418951a0237d4c28685c0a7dbdb5b42eb441",
  LABSCoreFacet: "0xdf972c8cf5b1757d133aebbce1a704aeb65a2b29", // ✅ UPDATED: Removed domain requirements
  LabVaultDeploymentFacet: "0xc53E0Eac63508a05169e22B3fAa5A3839e9446a9", // ✅ FIXED: Removed state variable collision
  LabDistributionFacet: "0xfb7c840eb842e99837fd13aa957d499f5ad223df", // ✅ UPDATED
  VaultFacet: "0xd6157e381ec5c1d06aca995fa77c5d0a388ff512",
  BondingCurveFacet: "0x90c81d864d4d71af2449153091733cb1249706c6",
  LabPassFacet: "0x799cb349e8feec8ce0155abe0a2f258307a66834",
  RevenueFacet: "0xbe14097af4ad6f9ffd9ec39b404121ab44a5b112",
  TreasuryFacet: "0x65c38321d60b3e2fdbf30a474ff7063eadc9f509",
  DataValidationFacet: "0xb607b954ed414bcdba321a02f487991518a795c0",
  CredentialFacet: "0x3ffab9fa9568c68bf60c88891f238556f8d99387",
  TestingFacet: "0xb44e262cb6039689873e9a721c1495fa1028cbbb",
  H1VestingFacet: "0x084c94e1f226393df32a6662abb4fdb75b3da54b", // ✅ H1 vesting schedules
  
  // Uniswap V3 (Base Sepolia)
  WETH: "0x4200000000000000000000000000000000000006",
  UniswapV3Factory: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
  UniswapV3PositionManager: "0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2",
  
  // Protocol Configuration (⚠️ SET THESE VALUES)
  ProtocolTreasury: "0x189549dB56DB7cB4e34fb1Ea96674873fDcfAEB4", // H1 Protocol Treasury
  DefaultCooldown: 604800, // 7 days in seconds
  DefaultExitCap: 2000, // 20% in basis points
  
  // Multi-Wallet Distribution Configuration (DEMO WALLETS)
  // These represent different roles in the H1 ecosystem
  RevenueDemonstration: {
    buybackWallet: "0x1111111111111111111111111111111111111111",        // H1 Buyback Reserve
    developerWallet: "0x2222222222222222222222222222222222222222",     // App Developer Incentive
    creatorPoolWallet: "0x3333333333333333333333333333333333333333",   // Data Creator Pool
    scholarPoolWallet: "0x4444444444444444444444444444444444444444",   // Scholar/Validator Pool
    h1TreasuryWallet: "0x189549dB56DB7cB4e34fb1Ea96674873fDcfAEB4",   // H1 Protocol Treasury
  },
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
  MULTI_WALLET_REVENUE: true, // Enable multi-wallet distribution
  H1_VESTING: true, // ✅ NEW (2025-10-23): H1 vesting schedules for owners/scholars/devs
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

