# 🚀 H1 Labs Tokenomics Upgrade - Complete Implementation Guide

## 📋 Overview

This document provides a comprehensive guide for the H1 tokenomics upgrade, which implements automatic H1 token distribution on lab creation with vesting schedules.

**Date:** October 23, 2025  
**Version:** 1.0.0  
**Status:** ✅ Implementation Complete - Ready for Deployment

---

## 🎯 What This Upgrade Does

### Automatic H1 Distribution
When a lab is created, H1 tokens are automatically minted and distributed according to the following allocation:

| Recipient | Allocation | Amount (for 100k LABS) | Status |
|-----------|-----------|------------------------|--------|
| Lab Owner | **30%** | 30,000 H1 | Vested over 6 months (weekly unlocks) |
| Bonding Curve | **10%** | 10,000 H1 | Liquid (enables immediate trading) |
| Scholar Reserve | **40%** | 40,000 H1 | Vested (paid as validation completes) |
| Dev Reserve | **15%** | 15,000 H1 | Vested (paid as work completes) |
| Protocol Treasury | **5%** | 5,000 H1 | Instant distribution |
| **Total** | **100%** | **100,000 H1** | 1:1 with LABS (capped at 500k) |

### Key Features

1. **Automatic Bonding Curve Deployment** - Every lab gets a bonding curve immediately
2. **1:1 H1 to LABS Ratio** - Up to 500,000 H1 per lab based on staked LABS
3. **Owner Vesting** - 26 weeks duration with weekly unlocks (first unlock after 1 week)
4. **Instant Treasury Distribution** - Protocol receives 5% immediately
5. **Reserved Pools** - 40% for scholars + 15% for devs held in vault
6. **Liquid Market** - 10% in bonding curve enables immediate trading

---

## 📦 New Smart Contracts

### 1. H1VestingFacet.sol
**Purpose:** Manages vesting schedules for H1 token distributions

**Key Functions:**
- `createVestingSchedule()` - Creates vesting schedules for owners/scholars/devs
- `claimVestedTokens()` - Allows users to claim unlocked H1 tokens
- `getClaimableAmount()` - Returns how much H1 can be claimed now
- `getVestingSchedule()` - Returns full vesting details
- `getLabDistribution()` - Returns H1 distribution breakdown per lab

**Location:** `/contracts/facets/H1VestingFacet.sol`

### 2. Updated LABSCoreFacet.sol
**Changes:**
- Auto-deploys bonding curve on lab creation
- Mints initial H1 supply based on staked LABS
- Distributes H1 according to tokenomics
- Creates owner vesting schedule
- Records distribution in storage

**Location:** `/contracts/facets/LABSCoreFacet.sol`

### 3. Updated LabVault.sol
**Changes:**
- Added `initialMint()` function for one-time H1 issuance
- Added `diamond` immutable address for authorization
- Added `initialMintCompleted` flag to prevent double minting

**Location:** `/contracts/vaults/LabVault.sol`

### 4. Updated LibH1Storage.sol
**Changes:**
- Added `VestingSchedule` struct
- Added `H1Distribution` struct
- Added vesting and distribution mappings

**Location:** `/contracts/libraries/LibH1Storage.sol`

---

## 🔧 Deployment Instructions

### Prerequisites

1. **Environment Variables**
   ```bash
   export PRIVATE_KEY="your_deployer_private_key"
   ```

2. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

3. **Verify Configuration**
   - Diamond Address: `0x29a7297e84df485aff8def2d27e467f3a37619c0`
   - Network: Base Sepolia (Chain ID: 84532)
   - RPC: `https://sepolia.base.org`

### Deployment Steps

#### Option 1: Complete Upgrade (Recommended)
Deploy both H1VestingFacet and updated LABSCoreFacet atomically:

```bash
node scripts/deploy-tokenomics-upgrade.js
```

This script:
1. Deploys H1VestingFacet (new)
2. Deploys updated LABSCoreFacet (replacement)
3. Executes atomic diamond cut
4. Verifies installation

**Estimated Gas:** ~3-5M gas (0.001-0.002 ETH on Base Sepolia)

#### Option 2: Individual Deployment
If you need to deploy facets separately:

**Step 1: Deploy H1VestingFacet**
```bash
node scripts/deploy-h1vesting-facet.js
```

**Step 2: Deploy Updated LABSCoreFacet**
```bash
node scripts/deploy-labscore-fix.js
```

### Post-Deployment Verification

1. **Check Facet Installation**
   ```bash
   # Use Blockscout or Etherscan to verify functions are available
   # Diamond address: 0x29a7297e84df485aff8def2d27e467f3a37619c0
   ```

2. **Test Lab Creation**
   - Stake at least 100,000 LABS
   - Create a new lab
   - Verify H1 distribution via `getLabDistribution(labId)`
   - Verify vesting via `getVestingSchedule(vestingId)`

3. **Test Vesting Claim**
   - Wait 1 week after lab creation
   - Call `claimVestedTokens(vestingId, labId)`
   - Verify H1 balance increased

---

## 💻 Frontend Integration

### Updated Files

#### 1. src/contracts/abis.ts
Added `H1VestingFacet_ABI` export:
```typescript
export const H1VestingFacet_ABI = [
  "function getLabDistribution(uint256 labId) external view returns (...)",
  "function getVestingSchedule(uint256 vestingId) external view returns (...)",
  "function claimVestedTokens(uint256 vestingId, uint256 labId) external returns (uint256)",
  // ... more functions
];
```

#### 2. src/pages/Prototype.tsx
**New Functions:**
- `loadLabVestingData()` - Fetches H1 distribution and vesting info
- `handleClaimVestedH1()` - Allows users to claim vested tokens

**Updated UI:**
- Displays H1 distribution breakdown in "Your Created Labs"
- Shows vesting progress with progress bar
- Displays claimable amount
- "Claim H1" button when tokens are unlocked
- Shows current H1 balance

**New Interface:**
```typescript
interface CreatedLab {
  // ... existing fields
  h1Distribution?: {
    totalMinted: string;
    ownerAllocation: string;
    curveAllocation: string;
    scholarAllocation: string;
    devAllocation: string;
    treasuryAllocation: string;
    ownerVestingId: number;
    initialized: boolean;
  };
  ownerVesting?: {
    vestingId: number;
    totalAmount: string;
    claimedAmount: string;
    claimableAmount: string;
    startTime: number;
    duration: number;
    vestingType: number;
  };
  ownerH1Balance?: string;
}
```

---

## 📊 User Flow Example

### Creating a Lab (With New Tokenomics)

**Before:**
1. Stake 100,000 LABS ✅
2. Create lab → Get lab ID + vault ✅
3. Manually deploy bonding curve ❌
4. No H1 tokens received ❌

**After (New System):**
1. Stake 100,000 LABS ✅
2. Create lab → **Automatically:**
   - Lab created with ID
   - LabVault deployed
   - **Bonding curve auto-deployed** ✨
   - **100,000 H1 minted and distributed:** ✨
     - 30,000 H1 → Owner (vested, 6 months)
     - 10,000 H1 → Bonding curve (liquid)
     - 40,000 H1 → Scholar reserve (vault)
     - 15,000 H1 → Dev reserve (vault)
     - 5,000 H1 → Protocol treasury (instant)
3. Owner can trade H1 on bonding curve immediately
4. Owner can claim vested H1 weekly

### Claiming Vested H1

**Timeline:**
- **Week 0 (Lab Creation)**: 30,000 H1 allocated, 0 claimable
- **Week 1**: ~1,154 H1 claimable (1/26 of allocation)
- **Week 2**: ~2,308 H1 claimable (cumulative)
- **Week 26 (6 months)**: 30,000 H1 fully claimable

**User Actions:**
1. Go to "Your Created Labs"
2. See vesting progress bar
3. Click "Claim X H1" button (appears when > 0 claimable)
4. Confirm transaction
5. H1 added to wallet balance

---

## 🔐 Security Considerations

### Smart Contract Security

1. **One-Time Initialization**
   - `initialMint()` can only be called once per vault
   - `initialMintCompleted` flag prevents double minting

2. **Authorization**
   - Only H1Diamond can call `initialMint()`
   - Only lab owner can claim their vested tokens
   - Only beneficiary can claim vested tokens

3. **Vesting Protection**
   - Cliff period enforced (1 week for owners)
   - Linear vesting prevents early withdrawal
   - `revoked` flag allows admin emergency stop

4. **Distribution Validation**
   - Total allocation must equal 100% (10,000 basis points)
   - Arrays length validation in `initialMint()`
   - All amounts validated before minting

### Upgrade Safety

1. **Diamond Cut Safety**
   - Atomic upgrade (both facets deployed in one transaction)
   - Existing labs unaffected (no H1 distribution)
   - Storage layout preserved (no collisions)

2. **Backward Compatibility**
   - Old labs continue to function normally
   - New `getLabDistribution()` returns `initialized: false` for old labs
   - Frontend handles both old and new labs gracefully

3. **Testing Checklist**
   - [ ] Deploy on testnet first
   - [ ] Create test lab with 100k LABS
   - [ ] Verify H1 distribution amounts
   - [ ] Test vesting claim after 1 week
   - [ ] Test bonding curve trading
   - [ ] Verify treasury received 5%
   - [ ] Check vault holds 55% (scholars + devs)

---

## 📈 Tokenomics Details

### H1 Minting Formula

```solidity
totalH1 = min(stakedLABS, 500_000e18); // 1:1 up to 500k cap

ownerAmount = totalH1 * 30% = totalH1 * 3000 / 10000
curveAmount = totalH1 * 10% = totalH1 * 1000 / 10000
scholarAmount = totalH1 * 40% = totalH1 * 4000 / 10000
devAmount = totalH1 * 15% = totalH1 * 1500 / 10000
treasuryAmount = totalH1 * 5% = totalH1 * 500 / 10000
```

### Vesting Math (Owner)

```solidity
duration = 26 weeks = 15,724,800 seconds
cliffDuration = 1 week = 604,800 seconds

if (timeElapsed < cliff):
  claimable = 0
elif (timeElapsed >= duration):
  claimable = totalAmount - claimedAmount
else:
  vestedAmount = (totalAmount * timeElapsed) / duration
  claimable = vestedAmount - claimedAmount
```

### Example Calculations

#### Lab with 100k LABS Staked
- **Total H1**: 100,000 H1
- **Owner**: 30,000 H1 (vested)
  - Week 1: 1,154 H1 claimable
  - Week 13: 15,000 H1 claimable
  - Week 26: 30,000 H1 claimable
- **Curve**: 10,000 H1 (liquid, tradeable immediately)
- **Scholars**: 40,000 H1 (paid as work completes)
- **Devs**: 15,000 H1 (paid as work completes)
- **Treasury**: 5,000 H1 (received instantly)

#### Lab with 500k LABS Staked (Max)
- **Total H1**: 500,000 H1 (capped)
- **Owner**: 150,000 H1 (vested)
- **Curve**: 50,000 H1 (liquid)
- **Scholars**: 200,000 H1 (reserve)
- **Devs**: 75,000 H1 (reserve)
- **Treasury**: 25,000 H1 (instant)

---

## 🚨 Important Notes

### For Lab Creators

1. **Stake Before Creating**
   - You must have LABS staked BEFORE creating a lab
   - H1 is minted based on your staked balance at creation time
   - Staking more LABS after creation does NOT mint more H1

2. **One-Time Distribution**
   - H1 distribution only happens once per lab (at creation)
   - You cannot mint additional H1 for an existing lab
   - Maximum 500,000 H1 per lab

3. **Vesting Schedule**
   - Owner H1 vests over 6 months with weekly unlocks
   - First unlock happens 1 week after lab creation
   - You must manually claim unlocked H1 (not automatic)

4. **Trading vs. Vesting**
   - 10% goes to bonding curve (liquid, tradeable immediately)
   - 30% is vested to you (claim weekly over 6 months)
   - Total 40% ends up with you (10% + 30%)

### For Existing Labs

1. **No Impact on Existing Labs**
   - This upgrade only affects NEW labs created after deployment
   - Existing labs continue to function as before
   - Existing labs do NOT receive retroactive H1 distribution

2. **Manual Bonding Curve**
   - Existing labs must manually deploy bonding curves (if not done)
   - Use `deployBondingCurve(labId)` function
   - Frontend "Deploy Curve" button available

### For Developers

1. **Storage Layout**
   - New vesting mappings added to `LibH1Storage`
   - No conflicts with existing storage
   - Safe for diamond upgrade

2. **Gas Costs**
   - Lab creation now costs more gas (~500k additional)
   - Includes bonding curve deployment + initial H1 mint
   - Still reasonable for Base (~$0.50-$1.00)

3. **Event Emissions**
   - New events: `BondingCurveDeployed`, `H1Distributed`
   - Frontend uses these for UI updates
   - Blockscout indexing supported

---

## 🧪 Testing Guide

### Manual Testing Steps

#### 1. Pre-Deployment Testing
```bash
# Compile contracts
npx hardhat compile

# Run tests (if available)
npx hardhat test

# Check contract sizes
npx hardhat size-contracts
```

#### 2. Testnet Deployment
```bash
# Set testnet private key
export PRIVATE_KEY="your_testnet_key"

# Deploy upgrade
node scripts/deploy-tokenomics-upgrade.js

# Note the deployed addresses
```

#### 3. Functional Testing

**Test Case 1: Lab Creation**
```
1. Stake 100,000 LABS
2. Create lab (name: "Test Lab", symbol: "TEST", domain: "healthcare")
3. Verify:
   - Lab created with ID
   - Vault deployed
   - Bonding curve deployed automatically
   - H1 distribution shows 100,000 H1 total
   - Owner allocation shows 30,000 H1
   - Vesting shows 0 claimable initially
```

**Test Case 2: Vesting Claim (Week 1)**
```
1. Fast-forward time 1 week (or wait on testnet)
2. Go to "Your Created Labs"
3. Click "Claim X H1" button
4. Verify:
   - Transaction succeeds
   - ~1,154 H1 added to balance
   - Vesting shows updated claimed amount
   - Progress bar updates
```

**Test Case 3: Bonding Curve Trading**
```
1. Go to H1 Lab Marketplace
2. Find your created lab
3. Enter amount (e.g., 1000 LABS)
4. Click "Buy H1"
5. Verify:
   - Approve + Buy transactions
   - H1 received in wallet
   - Price updates based on TVL
```

**Test Case 4: Multiple Labs**
```
1. Stake 500,000 LABS
2. Create first lab
3. Verify 500,000 H1 minted (capped)
4. Create second lab (same wallet)
5. Verify:
   - Error: Insufficient staked LABS (all used for first lab)
   - Need to stake more LABS for additional labs
```

---

## 📞 Support & Resources

### Documentation
- **Litepaper**: `/docs/litepaper.md`
- **Architecture**: `/ARCHITECTURE_CLARIFICATION.md`
- **Quick Reference**: `/IMPLEMENTATION_QUICK_REFERENCE.md`

### Contract Addresses (Base Sepolia)
- **H1Diamond**: `0x29a7297e84df485aff8def2d27e467f3a37619c0`
- **LABS Token**: `0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd`

### Block Explorer
- **Blockscout**: https://base-sepolia.blockscout.com

### Key Files Changed
```
contracts/facets/H1VestingFacet.sol (NEW)
contracts/facets/LABSCoreFacet.sol (UPDATED)
contracts/vaults/LabVault.sol (UPDATED)
contracts/libraries/LibH1Storage.sol (UPDATED)
contracts/libraries/LibLabVaultFactory.sol (UPDATED)
scripts/deploy-h1vesting-facet.js (NEW)
scripts/deploy-tokenomics-upgrade.js (NEW)
src/contracts/abis.ts (UPDATED)
src/pages/Prototype.tsx (UPDATED)
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All contracts compiled successfully
- [ ] Linter shows no errors
- [ ] Gas estimates reviewed
- [ ] Testnet deployment successful
- [ ] Manual testing completed
- [ ] Security review passed

### Deployment
- [ ] Environment variables set
- [ ] Sufficient ETH for gas in deployer wallet
- [ ] Backup of current diamond state taken
- [ ] Diamond owner confirmed
- [ ] Deployment script executed successfully

### Post-Deployment
- [ ] Facets installed correctly (verified via Blockscout)
- [ ] Functions callable (test read operations)
- [ ] Test lab creation successful
- [ ] H1 distribution verified
- [ ] Vesting schedule created
- [ ] Bonding curve deployed automatically
- [ ] Frontend updated with new ABIs
- [ ] Frontend displays vesting info correctly
- [ ] Documentation updated

### User Communication
- [ ] Announcement prepared
- [ ] User guide published
- [ ] FAQ updated
- [ ] Support team briefed
- [ ] Community notified

---

## 🎉 Success Criteria

The upgrade is considered successful when:

1. ✅ H1VestingFacet deployed and installed in diamond
2. ✅ LABSCoreFacet updated and replaced in diamond
3. ✅ Lab creation automatically deploys bonding curve
4. ✅ Lab creation automatically distributes H1
5. ✅ Owner vesting schedule created correctly
6. ✅ Weekly vesting claims work correctly
7. ✅ Frontend displays H1 distribution info
8. ✅ Frontend displays vesting progress
9. ✅ Frontend allows vesting claims
10. ✅ No breaking changes to existing labs

---

## 📝 Version History

### v1.0.0 (October 23, 2025)
- Initial implementation of automatic H1 distribution
- H1VestingFacet created
- LABSCoreFacet updated with distribution logic
- LabVault updated with initialMint function
- Frontend integration complete
- Deployment scripts created
- Documentation complete

---

## 🔮 Future Enhancements

Potential future improvements:
- Scholar/Dev payment automation
- Dynamic vesting schedules based on lab level
- Vesting schedule modifications (extend/reduce)
- Bulk claiming for multiple vesting schedules
- Vesting NFTs (tradeable vesting positions)
- Secondary market for vested tokens

---

**End of Documentation**

For questions or issues, refer to the main project README or contact the development team.

