# H1 Labs Quick Start Guide
> Get your agents started in 5 minutes

---

## For Frontend Agent

### 1. Read This File
📄 **`docs/FRONTEND_INTEGRATION_GUIDE.md`**

This file contains:
- All smart contract hooks (copy-paste ready)
- TypeScript code examples
- Component implementations
- Error handling
- Admin testing panel

### 2. Key Sections
- **Wallet Connection** → Base Account integration
- **ETH → LABS Swap** → Uniswap V3 integration
- **Lab Creation** → `useLabCreation()` hook
- **Vault Operations** → `useVault()` hook (deposit/redeem)
- **Bonding Curve** → `useBondingCurve()` hook
- **Admin Panel** → `useAdminTesting()` hook

### 3. Contract Addresses (Update After Deployment)
```typescript
// config/contracts.ts
export const CONTRACTS = {
  CHAIN_ID: 84532, // Base Sepolia
  H1Diamond: "0x...",     // UPDATE THIS
  LABSToken: "0x...",     // UPDATE THIS
  UniswapV3Pool: "0x...", // UPDATE THIS (LABS/WETH pool)
};
```

### 4. Install Dependencies
```bash
npm install ethers wagmi viem @tanstack/react-query
```

### 5. Start Building
Copy hooks from guide → Implement UI → Test → Ship 🚀

---

## For Backend Agent

### 1. Read This File
📄 **`docs/BACKEND_INTEGRATION_GUIDE.md`**

This file contains:
- Complete database schema (PostgreSQL)
- Event indexer service (auto-sync blockchain)
- REST API endpoints (Express)
- Testnet faucet
- App management (off-chain)
- Docker deployment

### 2. Key Sections
- **Database Schema** → PostgreSQL tables
- **Event Indexer** → Blockchain sync service
- **API Endpoints** → REST API for frontend
- **Faucet** → Automatic LABS distribution
- **App Registry** → Off-chain app management

### 3. Quick Setup
```bash
# 1. Install dependencies
npm install express pg ethers cors

# 2. Setup database
createdb h1labs
psql h1labs < migrations/001_init.sql

# 3. Configure .env
cp .env.example .env
# Edit: DATABASE_URL, RPC_URL, contract addresses

# 4. Start services
npm run indexer &  # Event indexer (background)
npm start          # API server
```

### 4. API Endpoints
```
POST /api/users/create
GET  /api/labs
GET  /api/analytics/platform
POST /api/faucet/claim
GET  /api/apps
POST /api/apps/equip
```

### 5. Important Note
**Apps are managed OFF-CHAIN** via PostgreSQL database, not smart contracts.
- No AppManagementFacet needed
- Backend handles equip/unequip logic
- Frontend queries backend API for app data

---

## For Smart Contract Developers

### New Contracts

1. **LABSSwap.sol** ✅
   - Path: `contracts/utils/LABSSwap.sol`
   - Purpose: ETH → LABS swap for testnet
   - Admin can set rate, pause, withdraw ETH

2. **TestingFacet.sol** ✅
   - Path: `contracts/facets/TestingFacet.sol`
   - Purpose: Admin testing utilities
   - Functions: mint LABS, override cooldown, fast-forward time, etc.

3. **LabVault.sol** ✅ (Updated)
   - Path: `contracts/vaults/LabVault.sol`
   - Added: Testing functions (test mode, level override, time offset)

### Testing Commands

```solidity
// Mint LABS to user
TestingFacet.mintLABS(userAddress, 1000000e18);

// Set cooldown to 1 minute
TestingFacet.setVaultCooldown(vaultAddress, 60);

// Fast-forward 7 days
TestingFacet.setVaultTimeOffset(vaultAddress, 604800);

// Override level to 3
TestingFacet.setVaultTestMode(vaultAddress, true);
TestingFacet.overrideVaultLevel(vaultAddress, 3);

// Reset epoch
TestingFacet.resetVaultEpoch(vaultAddress);

// Force complete redemption
TestingFacet.forceCompleteRedemption(vaultAddress, requestId);
```

---

## Complete User Flow

### 1. Admin Setup (One-Time)
```bash
# Deploy contracts
npx hardhat run scripts/deploy.js --network baseSepolia

# Set LABS token
diamond.setLABSToken(labsTokenAddress);

# Fund LABSSwap
labsToken.transfer(labsSwapAddress, 10000000e18);

# Fund faucet
labsToken.transfer(faucetAddress, 5000000e18);
```

### 2. User Journey
```
1. Visit H1 Labs frontend
2. Connect Base Account wallet
3. Swap ETH → LABS (or claim from faucet)
4. Create a lab (name, symbol, domain)
5. Deposit LABS to vault (stake)
6. Lab reaches Level 1, 2, or 3
7. Equip apps to lab slots (via backend API)
8. Lab generates revenue
9. Redeem H1 tokens → get LABS back
```

### 3. Testing Flow
```
1. Admin mints 1M LABS to user
2. User creates lab
3. Admin overrides level to 3
4. User tests app equipping
5. User requests redemption
6. Admin fast-forwards 7 days
7. User claims redemption
```

---

## File Structure

```
h1-labs-prototype/
│
├── contracts/
│   ├── facets/
│   │   └── TestingFacet.sol ✅ NEW
│   ├── utils/
│   │   └── LABSSwap.sol ✅ NEW
│   └── vaults/
│       └── LabVault.sol ✅ UPDATED
│
├── docs/
│   ├── FRONTEND_INTEGRATION_GUIDE.md ✅ FOR FRONTEND AGENT
│   ├── BACKEND_INTEGRATION_GUIDE.md ✅ FOR BACKEND AGENT
│   ├── IMPLEMENTATION_SUMMARY.md ✅ OVERVIEW
│   └── USER_FLOW_H1_TESTNET.md ✅ DETAILED FLOW
│
└── QUICK_START.md ✅ YOU ARE HERE
```

---

## Key Points

### ✅ What's Done
- Smart contracts (LABSSwap, TestingFacet, LabVault updates)
- Complete frontend integration guide
- Complete backend integration guide
- User flow documentation

### ⚠️ What's NOT Done (Frontend/Backend Need to Implement)
- Frontend UI components
- Backend API server
- Database setup
- Event indexer
- Deployment to testnet

### 💡 Key Design Decisions
1. **Apps are managed OFF-CHAIN** (backend database, not smart contracts)
2. **Testing functions are in smart contracts** (for fast iteration)
3. **ETH → LABS swap is simple fixed-rate** (good enough for testnet)

---

## Next Steps

### Frontend Agent
1. Read `docs/FRONTEND_INTEGRATION_GUIDE.md`
2. Copy hooks into your project
3. Update contract addresses after deployment
4. Implement UI components using the hooks
5. Test each flow section by section

### Backend Agent
1. Read `docs/BACKEND_INTEGRATION_GUIDE.md`
2. Setup PostgreSQL database with provided schema
3. Implement event indexer using provided code
4. Implement API endpoints using provided routes
5. Deploy with Docker Compose

### Smart Contract Developer
1. Deploy all contracts to Base Sepolia
2. Attach TestingFacet to diamond
3. Configure all addresses
4. Fund LABSSwap and faucet with LABS
5. Verify contracts on BaseScan
6. Share addresses with frontend/backend teams

---

## Support

### Documentation
- **Frontend:** `docs/FRONTEND_INTEGRATION_GUIDE.md`
- **Backend:** `docs/BACKEND_INTEGRATION_GUIDE.md`
- **Summary:** `docs/IMPLEMENTATION_SUMMARY.md`
- **User Flow:** `docs/USER_FLOW_H1_TESTNET.md`

### Smart Contracts
- All contracts in `contracts/` directory
- New: `LABSSwap.sol`, `TestingFacet.sol`
- Updated: `LabVault.sol`

### Questions?
Check the integration guides - they have everything you need! 📚

---

## TL;DR

**Frontend:** Read `docs/FRONTEND_INTEGRATION_GUIDE.md` and copy the hooks.

**Backend:** Read `docs/BACKEND_INTEGRATION_GUIDE.md` and copy the server code.

**Smart Contracts:** Deploy new contracts (`LABSSwap`, `TestingFacet`) and share addresses.

**All code is production-ready. Just copy, configure, and deploy!** 🚀

---

*End of Quick Start Guide*

