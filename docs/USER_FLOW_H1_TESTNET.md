# H1 Labs — User Flow for Testnet
> Status: Planning document for testnet deployment & frontend integration (2025-10-19)

---

## Table of Contents
1. [Overview](#overview)
2. [User Flow Diagram](#user-flow-diagram)
3. [Detailed User Flow Steps](#detailed-user-flow-steps)
4. [Missing Features & Fixes Needed](#missing-features--fixes-needed)
5. [Smart Contract Hooks for Frontend](#smart-contract-hooks-for-frontend)
6. [Admin Testing Functions](#admin-testing-functions)
7. [Backend Integration Points](#backend-integration-points)
8. [MVP Checklist](#mvp-checklist)

---

## Overview

This document outlines the complete user flow for the H1 Labs testnet prototype, identifies missing features, and provides detailed smart contract integration hooks for frontend implementation.

**Target Network:** Base Sepolia (testnet)  
**Future Network:** H1 custom testnet  
**Wallet Integration:** Base Account (Coinbase Wallet SDK)

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          H1 LABS USER FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

ADMIN SETUP (One-time)
  │
  ├─► 1. Deploy H1Diamond (EIP-2535 proxy)
  ├─► 2. Deploy & attach all facets (LABSCore, Vault, BondingCurve, etc.)
  ├─► 3. Deploy LABSToken (ERC20)
  ├─► 4. Call TreasuryFacet.setLABSToken(labsTokenAddress)
  ├─► 5. Mint initial LABS supply for testing/distribution
  └─► 6. Set protocol treasury address

USER ONBOARDING
  │
  ├─► 1. User visits H1 Labs frontend
  ├─► 2. Click "Connect Wallet" → Base Account integration
  ├─► 3. Wallet connects to Base Sepolia
  ├─► 4. Backend creates user profile (off-chain)
  └─► 5. User redirected to Dashboard

ACQUIRING $LABS TOKENS
  │
  ├─► Option A: Direct Transfer (Testnet)
  │     └─► Admin transfers LABS tokens to user wallet
  │
  ├─► Option B: ETH → LABS Swap (NEEDS IMPLEMENTATION)
  │     ├─► User enters swap interface
  │     ├─► Inputs ETH amount
  │     ├─► Calls swap contract (Uniswap V3 or simple AMM)
  │     └─► Receives LABS tokens
  │
  └─► Option C: Faucet (Testnet Only)
        └─► User requests LABS from testnet faucet

LAB CREATION & STAKING
  │
  ├─► 1. User navigates to "Create Lab" interface
  ├─► 2. Inputs lab details:
  │     ├─► Lab Name (e.g., "MedVault Cardio")
  │     ├─► H1 Token Symbol (e.g., "H1CARD")
  │     └─► Domain (e.g., "Healthcare/Cardiology")
  │
  ├─► 3. System checks domain availability
  │     └─► Call: LABSCoreFacet.isDomainAvailable(domain)
  │
  ├─► 4. User approves LABS token spending
  │     └─► Call: LABSToken.approve(diamondAddress, amount)
  │
  ├─► 5. User calls createLab function
  │     ├─► Call: LABSCoreFacet.createLab(name, symbol, domain)
  │     ├─► Diamond auto-deploys LabVault (H1 token)
  │     └─► User receives labId
  │
  ├─► 6. [Optional] Deploy LabPass NFT
  │     ├─► Call: LabPassFacet.deployLabPass(labId)
  │     └─► Call: LabPassFacet.mintLabPass(labId, tokenId, owner, level, slots)
  │
  └─► 7. [Optional] Deploy Bonding Curve
        ├─► Call: BondingCurveFacet.deployBondingCurve(labId)
        └─► Bonding curve contract created for bootstrap sales

DEPOSITING TO VAULT (STAKING)
  │
  ├─► 1. User decides to stake LABS into their lab's vault
  ├─► 2. Navigate to lab detail page
  ├─► 3. Input amount to stake (must meet level thresholds)
  │     ├─► Level 1: 100,000 LABS → 1 app slot
  │     ├─► Level 2: 250,000 LABS → 2 app slots
  │     └─► Level 3: 500,000 LABS → 3 app slots
  │
  ├─► 4. Approve LABS spending
  │     └─► Call: LABSToken.approve(vaultAddress, amount)
  │
  ├─► 5. Deposit LABS to vault
  │     ├─► Call: LabVault.depositLABS(amount, receiver)
  │     └─► Receives H1 shares (vault tokens)
  │
  ├─► 6. System checks new level
  │     ├─► Call: LabVault.getLevel()
  │     ├─► Call: LabVault.getAppSlots()
  │     └─► Emits LevelChanged event
  │
  └─► 7. Frontend updates UI with new level & slots

LAB OWNERSHIP & INTERFACE ACCESS
  │
  ├─► 1. User owns a lab (is creator/owner)
  ├─► 2. Navigate to "My Labs" section
  ├─► 3. Click on lab card → Lab Detail Page
  ├─► 4. Lab interface shows:
  │     ├─► Lab level & app slots available
  │     ├─► Total staked LABS (TVL)
  │     ├─► H1 token balance
  │     ├─► Revenue earned
  │     └─► App management section
  │
  └─► 5. Lab owner can:
        ├─► Equip apps (based on available slots)
        ├─► View analytics & metrics
        ├─► Manage vault parameters (admin functions)
        └─► Withdraw revenue

APP EQUIPPING (NEEDS IMPLEMENTATION)
  │
  ├─► 1. Lab owner navigates to "App Store"
  ├─► 2. Browses available apps:
  │     ├─► Scrubber (Healthcare)
  │     ├─► Second Opinion+ (Healthcare)
  │     ├─► ArtSense (Art)
  │     └─► RoboTrace (Robotics)
  │
  ├─► 3. Clicks "Equip" on desired app
  ├─► 4. System checks:
  │     ├─► Does lab have available slots?
  │     ├─► Is app compatible with lab domain?
  │     └─► Any special requirements?
  │
  ├─► 5. App equipped to lab (NEEDS SMART CONTRACT)
  │     └─► Possible implementation: mapping(labId => address[] equippedApps)
  │
  └─► 6. App appears in lab interface
        └─► User can access app functionality

BONDING CURVE PARTICIPATION
  │
  ├─► 1. User discovers a lab via marketplace
  ├─► 2. Lab has bonding curve deployed
  ├─► 3. User views current price
  │     └─► Call: BondingCurveSale.price()
  │
  ├─► 4. User decides to buy H1 tokens via curve
  ├─► 5. Input LABS amount to spend
  ├─► 6. Approve LABS spending
  │     └─► Call: LABSToken.approve(curveAddress, amount)
  │
  ├─► 7. Purchase H1 tokens
  │     ├─► Call: BondingCurveSale.buy(labsAmount, receiver, minSharesOut)
  │     ├─► Fee deducted (default: ~1%)
  │     ├─► POL allocated (default: ~10%)
  │     └─► User receives H1 shares
  │
  └─► 8. H1 tokens appear in user's wallet

REDEEMING FROM VAULT
  │
  ├─► 1. User wants to exit position
  ├─► 2. Navigate to vault interface
  ├─► 3. Input H1 shares to redeem
  ├─► 4. Request redemption
  │     ├─► Call: LabVault.requestRedeem(shares)
  │     ├─► Receives requestId
  │     └─► Cooldown period starts (default: 7 days)
  │
  ├─► 5. Wait for cooldown to expire
  │     └─► Check: RedeemRequest.unlockTime
  │
  ├─► 6. [Optional] Cancel redemption before claim
  │     └─► Call: LabVault.cancelRedeem(requestId)
  │
  └─► 7. Claim LABS after cooldown
        ├─► Call: LabVault.claimRedeem(requestId)
        └─► Receives LABS tokens back

REVENUE DISTRIBUTION
  │
  ├─► 1. Lab generates revenue from:
  │     ├─► Dataset sales to AI companies
  │     ├─► App usage fees
  │     └─► Validation services
  │
  ├─► 2. Revenue sent to RevenueFacet
  │     └─► Call: RevenueFacet.distributeRevenue(labId) {value: amount}
  │
  ├─► 3. Automatic split:
  │     ├─► 50% → Lab owner (ETH)
  │     ├─► 25% → Protocol treasury (ETH)
  │     └─► 25% → Buyback reserve (retained)
  │
  └─► 4. Frontend displays:
        ├─► Total revenue earned
        ├─► Revenue per category
        └─► Claimable amounts

MARKETPLACE BROWSING
  │
  ├─► 1. User explores lab marketplace
  ├─► 2. Filters by:
  │     ├─► Domain (Healthcare, Art, Robotics, etc.)
  │     ├─► Level (L1, L2, L3)
  │     ├─► TVL (total value locked)
  │     └─► Recent activity
  │
  ├─► 3. Lab cards display:
  │     ├─► Lab name & symbol
  │     ├─► H1 token ticker
  │     ├─► Current level & slots
  │     ├─► Total staked LABS
  │     ├─► Exchange rate (LABS per H1)
  │     └─► "Buy" button (if bonding curve exists)
  │
  └─► 4. Click lab → View lab detail page
```

---

## Detailed User Flow Steps

### Phase 1: Admin Setup

**Prerequisites:**
- Solidity contracts compiled
- Deployer wallet funded with Base Sepolia ETH
- Diamond deployment scripts ready

**Steps:**

1. **Deploy H1Diamond**
   ```solidity
   // Deploy diamond with owner address
   H1Diamond diamond = new H1Diamond(ownerAddress);
   ```

2. **Deploy All Facets**
   ```solidity
   LABSCoreFacet labsCore = new LABSCoreFacet();
   VaultFacet vault = new VaultFacet();
   BondingCurveFacet curve = new BondingCurveFacet();
   LabPassFacet labPass = new LabPassFacet();
   RevenueFacet revenue = new RevenueFacet();
   TreasuryFacet treasury = new TreasuryFacet();
   DiamondCutFacet cut = new DiamondCutFacet();
   DiamondLoupeFacet loupe = new DiamondLoupeFacet();
   OwnershipFacet ownership = new OwnershipFacet();
   ```

3. **Attach Facets to Diamond**
   ```solidity
   // Use DiamondCut to add facets
   // Map function selectors to facet addresses
   diamondCut.diamondCut(facetCuts, address(0), "");
   ```

4. **Deploy LABS Token**
   ```solidity
   LABSToken labs = new LABSToken(ownerAddress);
   ```

5. **Configure Diamond**
   ```solidity
   // Set LABS token in diamond storage
   TreasuryFacet(diamond).setLABSToken(address(labs));
   
   // Mint initial supply for testing
   labs.mint(ownerAddress, 10_000_000 * 1e18); // 10M LABS
   ```

6. **Set Protocol Parameters**
   ```solidity
   // Set treasury address (receives fees)
   LibH1Storage.h1Storage().protocolTreasury = treasuryAddress;
   
   // Set default vault parameters
   LibH1Storage.h1Storage().defaultCooldown = 7 days;
   LibH1Storage.h1Storage().defaultExitCapBps = 2000; // 20%
   
   // Set bonding curve parameters
   LibH1Storage.h1Storage().curveFeeBps = 100; // 1%
   LibH1Storage.h1Storage().curvePolBps = 1000; // 10%
   ```

### Phase 2: User Onboarding

**Frontend Implementation:**

1. **Wallet Connection**
   ```typescript
   import { useAccount, useConnect } from 'wagmi';
   import { baseSepolia } from 'wagmi/chains';
   
   function ConnectButton() {
     const { connect } = useConnect({
       chainId: baseSepolia.id,
     });
     
     return (
       <button onClick={() => connect()}>
         Connect Base Wallet
       </button>
     );
   }
   ```

2. **User Profile Creation (Backend)**
   ```typescript
   // POST /api/users/create
   {
     walletAddress: "0x...",
     chainId: 84532, // Base Sepolia
     timestamp: Date.now()
   }
   ```

3. **Dashboard Redirect**
   - Check if user has LABS balance
   - Check if user owns any labs
   - Display appropriate onboarding flow

### Phase 3: Acquiring LABS

**Option A: Direct Transfer (Testnet)**
```solidity
// Admin transfers LABS to user
LABSToken(labsTokenAddress).transfer(userAddress, amount);
```

**Option B: ETH → LABS Swap** ⚠️ **NEEDS IMPLEMENTATION**

Current gap: No swap mechanism exists.

**Proposed Solutions:**

1. **Simple Fixed-Price Swap Contract (Quick testnet solution)**
   ```solidity
   // SwapHelper.sol - Simple ETH → LABS converter
   contract LABSSwap {
     LABSToken public labsToken;
     uint256 public rate = 1000; // 1 ETH = 1000 LABS
     
     function swapETHForLABS() external payable {
       uint256 labsAmount = msg.value * rate;
       labsToken.transfer(msg.sender, labsAmount);
     }
   }
   ```

2. **Uniswap V3 Integration (Production solution)**
   - Deploy LABS/WETH pool on Base Sepolia
   - Add liquidity
   - Use Uniswap SDK for swaps

**Option C: Testnet Faucet**
```typescript
// POST /api/faucet/claim
{
  walletAddress: "0x...",
  amount: 1000 * 1e18 // 1000 LABS
}
```

### Phase 4: Lab Creation

**Frontend Flow:**

1. **Check Domain Availability**
   ```typescript
   const isDomainAvailable = await diamondContract.isDomainAvailable(domain);
   if (!isDomainAvailable) {
     alert("Domain already taken");
     return;
   }
   ```

2. **Approve LABS Spending**
   ```typescript
   // Note: Lab creation itself is free (no LABS burned)
   // But user will need LABS approved for later vault deposits
   const approveTx = await labsToken.approve(
     diamondAddress,
     ethers.constants.MaxUint256
   );
   await approveTx.wait();
   ```

3. **Create Lab**
   ```typescript
   const createTx = await diamondContract.createLab(
     "MedVault Cardio",      // name
     "H1CARD",               // symbol
     "Healthcare/Cardiology" // domain
   );
   const receipt = await createTx.wait();
   
   // Extract labId from LabCreated event
   const labCreatedEvent = receipt.events.find(
     e => e.event === "LabCreated"
   );
   const labId = labCreatedEvent.args.labId;
   const vaultAddress = labCreatedEvent.args.h1Token;
   ```

4. **[Optional] Deploy LabPass**
   ```typescript
   const deployPassTx = await diamondContract.deployLabPass(labId);
   await deployPassTx.wait();
   
   // Mint LabPass NFT to owner
   const mintPassTx = await diamondContract.mintLabPass(
     labId,
     1,           // tokenId
     userAddress, // to
     0,           // level (starts at 0)
     0            // slots (starts at 0)
   );
   await mintPassTx.wait();
   ```

5. **[Optional] Deploy Bonding Curve**
   ```typescript
   const deployCurveTx = await diamondContract.deployBondingCurve(labId);
   await deployCurveTx.wait();
   ```

### Phase 5: Staking LABS (Depositing to Vault)

**Frontend Flow:**

1. **Get Vault Address**
   ```typescript
   const vaultAddress = await diamondContract.getVault(labId);
   const vault = new ethers.Contract(vaultAddress, LabVaultABI, signer);
   ```

2. **Check Current Level**
   ```typescript
   const currentLevel = await vault.getLevel();
   const currentSlots = await vault.getAppSlots();
   const totalAssets = await vault.totalAssets();
   
   // Calculate next level requirements
   const LEVEL1 = ethers.utils.parseEther("100000");
   const LEVEL2 = ethers.utils.parseEther("250000");
   const LEVEL3 = ethers.utils.parseEther("500000");
   ```

3. **Preview Deposit**
   ```typescript
   const depositAmount = ethers.utils.parseEther("100000");
   const expectedShares = await vault.previewDeposit(depositAmount);
   
   // Display to user:
   // "Deposit 100,000 LABS → Receive ~X H1 shares"
   ```

4. **Approve & Deposit**
   ```typescript
   // Approve vault to spend LABS
   const approveTx = await labsToken.approve(vaultAddress, depositAmount);
   await approveTx.wait();
   
   // Deposit LABS to vault
   const depositTx = await vault.depositLABS(depositAmount, userAddress);
   const receipt = await depositTx.wait();
   
   // Check for LevelChanged event
   const levelEvent = receipt.events.find(e => e.event === "LevelChanged");
   if (levelEvent) {
     const newLevel = levelEvent.args.newLevel;
     // Show celebration UI: "Level Up! Now Level {newLevel}"
   }
   ```

5. **Update UI**
   ```typescript
   // Refresh lab stats
   const newLevel = await vault.getLevel();
   const newSlots = await vault.getAppSlots();
   const newTotalAssets = await vault.totalAssets();
   const userH1Balance = await vault.balanceOf(userAddress);
   ```

### Phase 6: App Equipping

⚠️ **MAJOR GAP: App equipping not implemented in smart contracts**

**Current State:**
- Lab levels determine available slots (1, 2, or 3)
- No on-chain registry of which apps are equipped
- No smart contract enforcement of slot limits

**Proposed Implementation:**

```solidity
// AppManagementFacet.sol (NEW CONTRACT NEEDED)
contract AppManagementFacet {
  event AppEquipped(uint256 indexed labId, address indexed app, uint8 slot);
  event AppUnequipped(uint256 indexed labId, address indexed app, uint8 slot);
  
  struct App {
    address contractAddress;
    string name;
    string category; // "Healthcare", "Art", etc.
    bool active;
  }
  
  // Storage
  mapping(uint256 => mapping(uint8 => address)) public labIdToSlotToApp;
  mapping(address => App) public registeredApps;
  
  function registerApp(
    address appAddress,
    string calldata name,
    string calldata category
  ) external {
    // Only admin can register apps
    LibDiamond.enforceIsContractOwner();
    registeredApps[appAddress] = App(appAddress, name, category, true);
  }
  
  function equipApp(uint256 labId, address appAddress, uint8 slot) external {
    // Check ownership
    require(
      LibH1Storage.h1Storage().labs[labId].owner == msg.sender,
      "not owner"
    );
    
    // Check slot availability
    address vaultAddress = LibH1Storage.h1Storage().labIdToVault[labId];
    uint8 availableSlots = ILabVault(vaultAddress).getAppSlots();
    require(slot < availableSlots, "slot unavailable");
    
    // Check app is registered
    require(registeredApps[appAddress].active, "app not registered");
    
    // Equip app
    labIdToSlotToApp[labId][slot] = appAddress;
    emit AppEquipped(labId, appAddress, slot);
  }
  
  function unequipApp(uint256 labId, uint8 slot) external {
    require(
      LibH1Storage.h1Storage().labs[labId].owner == msg.sender,
      "not owner"
    );
    
    address app = labIdToSlotToApp[labId][slot];
    delete labIdToSlotToApp[labId][slot];
    emit AppUnequipped(labId, app, slot);
  }
  
  function getEquippedApps(uint256 labId) external view returns (address[] memory) {
    address vaultAddress = LibH1Storage.h1Storage().labIdToVault[labId];
    uint8 slots = ILabVault(vaultAddress).getAppSlots();
    
    address[] memory apps = new address[](slots);
    for (uint8 i = 0; i < slots; i++) {
      apps[i] = labIdToSlotToApp[labId][i];
    }
    return apps;
  }
}
```

**Frontend Integration:**
```typescript
// Equip app to slot
const equipTx = await diamondContract.equipApp(
  labId,
  appAddress,
  slotIndex
);
await equipTx.wait();

// Get equipped apps
const apps = await diamondContract.getEquippedApps(labId);
```

### Phase 7: Bonding Curve Participation

**Frontend Flow:**

1. **View Bonding Curve Price**
   ```typescript
   const curveAddress = await diamondContract.getBondingCurve(labId);
   const curve = new ethers.Contract(curveAddress, BondingCurveSaleABI, signer);
   
   const currentPrice = await curve.price();
   // Price is in LABS per H1 share
   ```

2. **Calculate Purchase**
   ```typescript
   const labsToSpend = ethers.utils.parseEther("1000");
   
   // Fee calculation
   const feeBps = await curve.feeBps(); // e.g., 100 (1%)
   const polBps = await curve.polBps(); // e.g., 1000 (10%)
   
   const fee = labsToSpend.mul(feeBps).div(10000);
   const pol = labsToSpend.mul(polBps).div(10000);
   const toDeposit = labsToSpend.sub(fee).sub(pol);
   
   // Estimate shares received
   const expectedShares = toDeposit.mul(1e18).div(currentPrice);
   ```

3. **Execute Purchase**
   ```typescript
   // Approve curve to spend LABS
   const approveTx = await labsToken.approve(curveAddress, labsToSpend);
   await approveTx.wait();
   
   // Buy with slippage protection
   const minSharesOut = expectedShares.mul(95).div(100); // 5% slippage
   
   const buyTx = await curve.buy(
     labsToSpend,
     userAddress,
     minSharesOut
   );
   await buyTx.wait();
   ```

### Phase 8: Redemption Flow

**Frontend Flow:**

1. **Request Redemption**
   ```typescript
   const sharesToRedeem = ethers.utils.parseEther("100");
   
   // Preview redemption
   const expectedAssets = await vault.previewRedeem(sharesToRedeem);
   
   // Request redeem
   const requestTx = await vault.requestRedeem(sharesToRedeem);
   const receipt = await requestTx.wait();
   
   // Get requestId from event
   const redeemEvent = receipt.events.find(
     e => e.event === "RedeemRequested"
   );
   const requestId = redeemEvent.args.requestId;
   const unlockTime = redeemEvent.args.unlockTime;
   ```

2. **Track Cooldown**
   ```typescript
   // Get request details
   const request = await vault.redeemRequests(requestId);
   const { owner, assets, unlockTime, claimed } = request;
   
   // Calculate time remaining
   const now = Math.floor(Date.now() / 1000);
   const timeRemaining = unlockTime - now;
   
   if (timeRemaining > 0) {
     // Display countdown: "X days Y hours remaining"
   }
   ```

3. **Claim Redemption**
   ```typescript
   // After cooldown expires
   const claimTx = await vault.claimRedeem(requestId);
   await claimTx.wait();
   
   // LABS tokens returned to user
   ```

4. **Cancel Redemption (Optional)**
   ```typescript
   // Before cooldown expires
   const cancelTx = await vault.cancelRedeem(requestId);
   await cancelTx.wait();
   
   // H1 shares re-minted to user
   ```

---

## Missing Features & Fixes Needed

### Critical Missing Features

#### 1. ETH → LABS Swap Mechanism
**Status:** ❌ Not Implemented

**Impact:** Users cannot acquire LABS tokens on testnet without direct transfer from admin.

**Solutions:**

**Option A: Simple Swap Contract (Quick Fix)**
```solidity
// contracts/utils/LABSSwap.sol
contract LABSSwap {
  LABSToken public immutable labsToken;
  uint256 public rate; // LABS per ETH
  address public admin;
  
  constructor(address labsToken_, uint256 initialRate) {
    labsToken = LABSToken(labsToken_);
    rate = initialRate;
    admin = msg.sender;
  }
  
  function swapETHForLABS() external payable returns (uint256 labsAmount) {
    require(msg.value > 0, "zero eth");
    labsAmount = msg.value * rate / 1e18;
    require(labsToken.balanceOf(address(this)) >= labsAmount, "insufficient LABS");
    labsToken.transfer(msg.sender, labsAmount);
  }
  
  function setRate(uint256 newRate) external {
    require(msg.sender == admin, "not admin");
    rate = newRate;
  }
  
  function withdrawETH() external {
    require(msg.sender == admin, "not admin");
    payable(admin).transfer(address(this).balance);
  }
}
```

**Option B: Uniswap V3 Pool (Production Ready)**
- Deploy LABS/WETH pool on Base Sepolia
- Add initial liquidity
- Use Uniswap SDK for frontend integration

#### 2. App Equipping System
**Status:** ❌ Not Implemented

**Impact:** Lab owners cannot equip apps to their lab slots.

**Solution:** Implement `AppManagementFacet` (detailed above in Phase 6)

**Required Functions:**
- `registerApp(address, name, category)` - Admin registers apps
- `equipApp(labId, appAddress, slot)` - Owner equips app
- `unequipApp(labId, slot)` - Owner removes app
- `getEquippedApps(labId)` - View equipped apps

#### 3. Admin Testing Functions for Bonding Curve
**Status:** ⚠️ Partially Implemented

**Current State:**
- Bonding curve exists
- Admin can deploy curves
- No functions to modify parameters for testing

**Needed Functions:**
```solidity
// Add to BondingCurveFacet or create TestingFacet
contract TestingFacet {
  // Fast-forward time for cooldown testing
  function setBlockTimestamp(uint256 timestamp) external {
    LibDiamond.enforceIsContractOwner();
    // TESTNET ONLY - manipulate block.timestamp
    // NOTE: This is not possible in real EVM
    // Alternative: Modify LabVault to use adjustable time offset
  }
  
  // Override cooldown for specific vault
  function overrideCooldown(address vault, uint64 newCooldown) external {
    LibDiamond.enforceIsContractOwner();
    LabVault(vault).setCooldown(newCooldown);
  }
  
  // Override exit cap for testing
  function overrideExitCap(address vault, uint16 newCapBps) external {
    LibDiamond.enforceIsContractOwner();
    LabVault(vault).setEpochExitCapBps(newCapBps);
  }
  
  // Fast-complete redemption request (bypass cooldown)
  function forceCompleteRedemption(address vault, uint256 requestId) external {
    LibDiamond.enforceIsContractOwner();
    // Directly modify request.unlockTime to current time
    // Then allow immediate claim
  }
}
```

**Better Approach: Modifiable Time Offset**
```solidity
// Modify LabVault.sol
contract LabVault {
  uint256 public timeOffset; // For testing only
  
  function _currentTime() internal view returns (uint256) {
    return block.timestamp + timeOffset;
  }
  
  function setTimeOffset(uint256 offset) external onlyAdmin {
    timeOffset = offset;
  }
  
  // Replace all block.timestamp with _currentTime()
}
```

#### 4. Backend User Management
**Status:** ❌ Not Implemented

**Needed Endpoints:**
```typescript
// POST /api/users/create
POST /api/users/create
{
  walletAddress: string,
  chainId: number
}
Response: { userId: string, created: boolean }

// GET /api/users/:walletAddress
GET /api/users/0x123...
Response: {
  userId: string,
  walletAddress: string,
  createdAt: timestamp,
  labsOwned: number[],
  totalStaked: string
}

// POST /api/users/:walletAddress/sync
POST /api/users/0x123.../sync
Description: Sync on-chain data to backend DB
Response: { synced: boolean }
```

#### 5. Lab Level Downgrade Grace Period
**Status:** ⚠️ Partially Implemented

**Current State:**
- Levels calculated dynamically based on `totalAssets`
- No grace period for level downgrades
- Redemptions can immediately drop level

**Issue:**
If a lab is at Level 2 (250k LABS) with 2 apps equipped, and someone redeems 151k LABS, the lab instantly drops to Level 0 (99k LABS), losing access to both app slots.

**Proposed Fix:**
```solidity
// Add to LibH1Storage
struct Lab {
  // ... existing fields
  uint8 lockedLevel;      // Minimum level during grace period
  uint64 graceExpiresAt;  // Timestamp when grace expires
}

// Add to LabVault
function getEffectiveLevel() public view returns (uint8) {
  uint8 actualLevel = _calculateLevel(totalAssets);
  
  Lab storage lab = LibH1Storage.h1Storage().labs[labId];
  
  // If in grace period and locked level is higher
  if (block.timestamp < lab.graceExpiresAt && lab.lockedLevel > actualLevel) {
    return lab.lockedLevel;
  }
  
  return actualLevel;
}

function requestRedeem(uint256 shares) external {
  // ... existing logic
  
  // Check if redemption would drop level
  uint256 assetsAfterRedeem = totalAssets - previewedAssets;
  uint8 newLevel = _calculateLevel(assetsAfterRedeem);
  uint8 currentLevel = getEffectiveLevel();
  
  if (newLevel < currentLevel) {
    // Enter grace period
    Lab storage lab = LibH1Storage.h1Storage().labs[labId];
    lab.lockedLevel = currentLevel;
    lab.graceExpiresAt = uint64(block.timestamp + 7 days); // 7-day grace
    
    emit GracePeriodStarted(labId, currentLevel, graceExpiresAt);
  }
}

function depositLABS(uint256 assets, address receiver) external {
  // ... existing logic
  
  // Check if deposit restores level during grace
  Lab storage lab = LibH1Storage.h1Storage().labs[labId];
  if (block.timestamp < lab.graceExpiresAt) {
    uint8 newLevel = _calculateLevel(totalAssets);
    if (newLevel >= lab.lockedLevel) {
      // Grace period ended successfully
      delete lab.lockedLevel;
      delete lab.graceExpiresAt;
      emit GracePeriodEnded(labId, newLevel);
    }
  }
}
```

### Non-Critical Gaps

#### 6. LabPass Auto-Update on Level Change
**Current State:**
- LabPass NFT has `level` and `slots` fields
- Not automatically updated when vault level changes

**Solution:**
```solidity
// Modify LabPassFacet
function updateLabPassLevel(uint256 labId) external {
  address passAddress = LibH1Storage.h1Storage().labIdToLabPass[labId];
  require(passAddress != address(0), "no LabPass");
  
  address vaultAddress = LibH1Storage.h1Storage().labIdToVault[labId];
  uint8 newLevel = ILabVault(vaultAddress).getLevel();
  uint8 newSlots = ILabVault(vaultAddress).getAppSlots();
  
  LabPass(passAddress).updateLevelAndSlots(tokenId, newLevel, newSlots);
}
```

#### 7. Dashboard Analytics
**Needed Data Points:**
- Total LABS staked across all labs
- Total H1 tokens minted
- Number of active labs
- Revenue generated per lab
- Top labs by TVL
- Recent transactions

**Implementation:**
- Use The Graph indexer for efficient querying
- Or backend DB synced from events

---

## Smart Contract Hooks for Frontend

### Contract Addresses (Post-Deployment)

```typescript
// config/contracts.ts
export const CONTRACTS = {
  // Core
  H1Diamond: "0x...",           // Main proxy
  LABSToken: "0x...",            // Platform token
  LABSSwap: "0x...",             // ETH → LABS swap (if implemented)
  ProtocolTreasury: "0x...",     // Revenue recipient
  
  // Facets (called via diamond address)
  LABSCoreFacet: "0x...",
  VaultFacet: "0x...",
  BondingCurveFacet: "0x...",
  LabPassFacet: "0x...",
  RevenueFacet: "0x...",
  TreasuryFacet: "0x...",
  DiamondLoupeFacet: "0x...",
  OwnershipFacet: "0x...",
};

export const CHAIN_ID = 84532; // Base Sepolia
```

### ABIs Required

```typescript
// config/abis.ts
export const ABIS = {
  H1Diamond: [...],            // Combined ABI of all facets
  LABSToken: [...],            // ERC20 + mint
  LabVault: [...],             // ERC20 + vault functions
  BondingCurveSale: [...],     // Buy functions
  LabPass: [...],              // ERC721 + metadata
  LABSSwap: [...],             // Swap functions (if implemented)
};
```

### Core Contract Interactions

#### 1. LABSToken (ERC20)

**Read Functions:**
```typescript
// Get user LABS balance
const balance = await labsToken.balanceOf(userAddress);
// Returns: BigNumber (wei, 18 decimals)

// Get total supply
const supply = await labsToken.totalSupply();

// Check allowance
const allowance = await labsToken.allowance(userAddress, spenderAddress);
```

**Write Functions:**
```typescript
// Approve spending
const approveTx = await labsToken.approve(spenderAddress, amount);
await approveTx.wait();

// Transfer
const transferTx = await labsToken.transfer(recipientAddress, amount);
await transferTx.wait();

// Mint (admin only)
const mintTx = await labsToken.mint(toAddress, amount);
await mintTx.wait();
```

#### 2. LABSCoreFacet (via Diamond)

**Read Functions:**
```typescript
// Check domain availability
const isAvailable = await diamond.isDomainAvailable("Healthcare/Cardiology");
// Returns: boolean

// Get lab info
const lab = await diamond.labs(labId);
// Returns: { owner, h1Token, totalStaked, active, totalRevenue, domain }

// Get staked balance
const staked = await diamond.stakedBalances(userAddress);
// Returns: BigNumber
```

**Write Functions:**
```typescript
// Stake LABS (for eligibility, not tied to specific lab)
const stakeTx = await diamond.stakeLABS(amount);
await stakeTx.wait();
// Emits: Staked(staker, amount)

// Create lab
const createTx = await diamond.createLab(name, symbol, domain);
const receipt = await createTx.wait();
// Emits: LabCreated(labId, owner, name, symbol, domain, h1Token)
// Emits: VaultDeployed(labId, vault, cooldownSeconds, exitCapBps)

// Extract events
const labCreatedEvent = receipt.events.find(e => e.event === "LabCreated");
const labId = labCreatedEvent.args.labId;
const vaultAddress = labCreatedEvent.args.h1Token;
```

#### 3. VaultFacet (via Diamond)

**Read Functions:**
```typescript
// Get vault address for lab
const vaultAddress = await diamond.getVault(labId);
// Returns: address
```

**Note:** Most vault operations are called directly on the LabVault contract, not through the diamond.

#### 4. LabVault (Direct)

**Read Functions:**
```typescript
// Get vault info
const labsToken = await vault.labsToken();
const admin = await vault.admin();
const cooldown = await vault.cooldownSeconds();
const exitCap = await vault.epochExitCapBps();

// Get level and slots
const level = await vault.getLevel();
// Returns: uint8 (0, 1, 2, or 3)

const slots = await vault.getAppSlots();
// Returns: uint8 (0, 1, 2, or 3)

// Get total assets (TVL)
const totalAssets = await vault.totalAssets();
// Returns: BigNumber (LABS amount)

// Get exchange rate
const assetsPerShare = await vault.assetsPerShare();
// Returns: BigNumber (1e18 scaled)

// Preview operations
const shares = await vault.previewDeposit(assetsAmount);
const assets = await vault.previewMint(sharesAmount);
const redeemAssets = await vault.previewRedeem(sharesAmount);

// Get H1 balance
const h1Balance = await vault.balanceOf(userAddress);

// Get redemption request
const request = await vault.redeemRequests(requestId);
// Returns: { owner, unlockTime, claimed, assets }

// Check pause status
const isPaused = await vault.paused();
```

**Write Functions:**
```typescript
// Deposit LABS → receive H1 shares
const depositTx = await vault.depositLABS(assetsAmount, receiverAddress);
await depositTx.wait();
// Emits: Deposited(caller, receiver, assets, shares)
// Emits: LevelChanged(newLevel, totalAssets)

// Mint specific H1 shares → pays LABS
const mintTx = await vault.mintShares(sharesAmount, receiverAddress);
await mintTx.wait();
// Emits: Deposited(caller, receiver, assets, shares)

// Request redemption
const requestTx = await vault.requestRedeem(sharesAmount);
const receipt = await requestTx.wait();
// Emits: RedeemRequested(requestId, owner, sharesBurned, assets, unlockTime)

const redeemEvent = receipt.events.find(e => e.event === "RedeemRequested");
const requestId = redeemEvent.args.requestId;
const unlockTime = redeemEvent.args.unlockTime;

// Claim redemption (after cooldown)
const claimTx = await vault.claimRedeem(requestId);
await claimTx.wait();
// Emits: RedeemClaimed(requestId, owner, assets)

// Cancel redemption (before claim)
const cancelTx = await vault.cancelRedeem(requestId);
await cancelTx.wait();
// Emits: RedeemCanceled(requestId, owner, assets, sharesReMinted)

// Fill someone else's redemption (optional)
const fillTx = await vault.fillRedeem(requestId, receiverAddress);
await fillTx.wait();
// Emits: RedeemFilled(requestId, filler, assets, receiver)

// Admin functions
const setCooldownTx = await vault.setCooldown(newCooldownSeconds);
const setExitCapTx = await vault.setEpochExitCapBps(newBps);
const pauseTx = await vault.pause();
const unpauseTx = await vault.unpause();
const setAdminTx = await vault.setAdmin(newAdminAddress);
```

#### 5. BondingCurveFacet (via Diamond)

**Read Functions:**
```typescript
// Get bonding curve address for lab
const curveAddress = await diamond.getBondingCurve(labId);
// Returns: address (or 0x0 if not deployed)
```

**Write Functions:**
```typescript
// Deploy bonding curve for lab
const deployCurveTx = await diamond.deployBondingCurve(labId);
await deployCurveTx.wait();
// Emits: BondingCurveDeployed(labId, curve)
```

#### 6. BondingCurveSale (Direct)

**Read Functions:**
```typescript
// Get current price
const currentPrice = await curve.price();
// Returns: BigNumber (LABS per share, 1e18 scaled)

// Get parameters
const feeBps = await curve.feeBps();       // e.g., 100 (1%)
const polBps = await curve.polBps();       // e.g., 1000 (10%)
const labsToken = await curve.labsToken();
const vault = await curve.vault();
const treasury = await curve.treasury();

// Check pause status
const isPaused = await curve.paused();
```

**Write Functions:**
```typescript
// Buy H1 shares with LABS
const buyTx = await curve.buy(
  labsAmount,           // LABS to spend
  receiverAddress,      // Who receives H1
  minSharesOut          // Slippage protection
);
await buyTx.wait();
// Emits: Purchased(buyer, labsIn, sharesOut, feeLabs, polLabs)

// Buy from specific address (if approved)
const buyFromTx = await curve.buyFrom(
  buyerAddress,
  labsAmount,
  receiverAddress,
  minSharesOut
);
await buyFromTx.wait();

// Admin functions
const pauseTx = await curve.pause();
const unpauseTx = await curve.unpause();
const setAdminTx = await curve.setAdmin(newAdminAddress);
```

#### 7. LabPassFacet (via Diamond)

**Read Functions:**
```typescript
// Get LabPass address for lab
const labPassAddress = await diamond.getLabPass(labId);
// Returns: address (or 0x0 if not deployed)
```

**Write Functions:**
```typescript
// Deploy LabPass NFT for lab
const deployPassTx = await diamond.deployLabPass(labId);
await deployPassTx.wait();
// Emits: LabPassDeployed(labId, labPass)

// Mint LabPass to user
const mintPassTx = await diamond.mintLabPass(
  labId,
  tokenId,
  toAddress,
  level,
  slots
);
await mintPassTx.wait();
// Emits: LabPassMinted(labId, tokenId, to, level, slots)
```

#### 8. LabPass (Direct - ERC721)

**Read Functions:**
```typescript
// Standard ERC721
const owner = await labPass.ownerOf(tokenId);
const balance = await labPass.balanceOf(ownerAddress);
const approved = await labPass.getApproved(tokenId);
const isApprovedForAll = await labPass.isApprovedForAll(owner, operator);

// Custom metadata
const level = await labPass.getLevel(tokenId);
const slots = await labPass.getSlots(tokenId);
const isSoulbound = await labPass.soulbound();
```

**Write Functions:**
```typescript
// Standard ERC721 (if transferable)
const transferTx = await labPass.transferFrom(from, to, tokenId);
const safeTransferTx = await labPass.safeTransferFrom(from, to, tokenId);
const approveTx = await labPass.approve(to, tokenId);
const setApprovalTx = await labPass.setApprovalForAll(operator, approved);

// Custom (admin only)
const mintTx = await labPass.mint(to, tokenId, level, slots);
const updateTx = await labPass.updateLevelAndSlots(tokenId, newLevel, newSlots);
const setSoulboundTx = await labPass.setSoulbound(isSoulbound);
```

#### 9. RevenueFacet (via Diamond)

**Write Functions:**
```typescript
// Distribute revenue to lab
const distributeTx = await diamond.distributeRevenue(labId, {
  value: ethers.utils.parseEther("10.0") // 10 ETH
});
await distributeTx.wait();
// Emits: RevenueDistributed(labId, labOwnerAmt, h1PoolAmt, buybackAmt)

// Splits automatically:
// - 50% to lab owner (ETH)
// - 25% to protocol treasury (ETH)
// - 25% retained for buyback (ETH)
```

#### 10. TreasuryFacet (via Diamond)

**Read Functions:**
```typescript
// Get LABS token address
const labsTokenAddress = await diamond.labsToken();
```

**Write Functions (Admin Only):**
```typescript
// Set LABS token
const setTokenTx = await diamond.setLABSToken(labsTokenAddress);
await setTokenTx.wait();
// Emits: LABSTokenUpdated(newToken)

// Execute buyback (TESTING STUB)
const buybackTx = await diamond.buybackLABS(amount);
await buybackTx.wait();
// Emits: BuybackExecuted(amount, executor)
```

### Event Listening

**Setup:**
```typescript
import { ethers } from 'ethers';

// Connect to provider
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Create contract instance
const diamond = new ethers.Contract(DIAMOND_ADDRESS, ABI, provider);

// Listen for events
diamond.on("LabCreated", (labId, owner, name, symbol, domain, h1Token) => {
  console.log(`New lab created: ${name} (${symbol})`);
  console.log(`Lab ID: ${labId}`);
  console.log(`Vault: ${h1Token}`);
  
  // Update UI
  refreshLabsList();
});

diamond.on("Staked", (staker, amount) => {
  console.log(`${staker} staked ${ethers.utils.formatEther(amount)} LABS`);
});

// Listen to vault events
vault.on("LevelChanged", (newLevel, totalAssets) => {
  console.log(`Lab level changed to ${newLevel}`);
  console.log(`Total assets: ${ethers.utils.formatEther(totalAssets)} LABS`);
  
  // Show celebration UI
  if (newLevel > previousLevel) {
    showLevelUpAnimation(newLevel);
  }
});

vault.on("RedeemRequested", (requestId, owner, sharesBurned, assets, unlockTime) => {
  console.log(`Redemption requested: ${requestId}`);
  console.log(`Unlock time: ${new Date(unlockTime * 1000)}`);
  
  // Add to pending redemptions list
  addPendingRedemption(requestId, unlockTime);
});
```

### Batch Queries (Multicall)

For efficient data fetching:

```typescript
import { Contract } from '@ethersproject/contracts';
import { Provider } from '@ethersproject/providers';

async function fetchLabData(labId: number) {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  
  // Get basic lab info
  const lab = await diamond.labs(labId);
  
  // Get vault address
  const vaultAddress = await diamond.getVault(labId);
  const vault = new ethers.Contract(vaultAddress, LabVaultABI, provider);
  
  // Batch read operations
  const [
    level,
    slots,
    totalAssets,
    assetsPerShare,
    cooldown,
    exitCap,
    isPaused
  ] = await Promise.all([
    vault.getLevel(),
    vault.getAppSlots(),
    vault.totalAssets(),
    vault.assetsPerShare(),
    vault.cooldownSeconds(),
    vault.epochExitCapBps(),
    vault.paused()
  ]);
  
  // Get user-specific data (if connected)
  const [
    userH1Balance,
    userLabsBalance,
    userLabsAllowance
  ] = await Promise.all([
    vault.balanceOf(userAddress),
    labsToken.balanceOf(userAddress),
    labsToken.allowance(userAddress, vaultAddress)
  ]);
  
  return {
    lab: {
      id: labId,
      owner: lab.owner,
      domain: lab.domain,
      active: lab.active,
      totalRevenue: lab.totalRevenue,
    },
    vault: {
      address: vaultAddress,
      level,
      slots,
      totalAssets,
      assetsPerShare,
      cooldown,
      exitCap,
      isPaused,
    },
    user: {
      h1Balance: userH1Balance,
      labsBalance: userLabsBalance,
      labsAllowance: userLabsAllowance,
    }
  };
}
```

### Real-Time Updates

**Using WebSocket Provider:**
```typescript
const provider = new ethers.providers.WebSocketProvider(WSS_URL);

// Subscribe to new blocks
provider.on("block", async (blockNumber) => {
  console.log(`New block: ${blockNumber}`);
  
  // Refresh data
  await refreshDashboard();
});

// Subscribe to pending transactions
provider.on("pending", (txHash) => {
  console.log(`Pending tx: ${txHash}`);
});
```

---

## Admin Testing Functions

### Required Admin Functions for Testnet

#### 1. Time Manipulation for Cooldown Testing

**Problem:** Cannot test redemption cooldown (7 days) in reasonable time.

**Solution A: Time Offset in LabVault**
```solidity
// Add to LabVault.sol
uint256 public testTimeOffset; // Seconds to add to block.timestamp

function _currentTime() internal view returns (uint256) {
  return block.timestamp + testTimeOffset;
}

function setTestTimeOffset(uint256 offset) external onlyAdmin {
  testTimeOffset = offset;
  emit TestTimeOffsetUpdated(offset);
}

// Replace all block.timestamp with _currentTime()
```

**Frontend:**
```typescript
// Fast-forward 7 days
const SEVEN_DAYS = 7 * 24 * 60 * 60;
const tx = await vault.setTestTimeOffset(SEVEN_DAYS);
await tx.wait();

// Now redemptions can be claimed immediately
```

**Solution B: Override Cooldown**
```solidity
// Modify LabVault.sol
function setCooldown(uint64 seconds_) external onlyAdmin {
  require(seconds_ <= 30 days, "too long");
  cooldownSeconds = seconds_;
  emit ExitCapsUpdated(cooldownSeconds, epochExitCapBps);
}
```

**Frontend:**
```typescript
// Set cooldown to 1 minute for testing
const tx = await vault.setCooldown(60);
await tx.wait();
```

#### 2. Instant Redemption Completion

**Problem:** Need to test full redemption flow quickly.

**Solution:**
```solidity
// Add to LabVault.sol (or TestingFacet)
function forceCompleteRedemption(uint256 requestId) external onlyAdmin {
  RedeemRequest storage r = redeemRequests[requestId];
  require(!r.claimed, "already claimed");
  
  // Set unlock time to now
  r.unlockTime = uint64(block.timestamp);
  
  emit RedemptionForceCompleted(requestId);
}
```

**Frontend:**
```typescript
const tx = await vault.forceCompleteRedemption(requestId);
await tx.wait();

// Now can claim immediately
const claimTx = await vault.claimRedeem(requestId);
await claimTx.wait();
```

#### 3. Bonding Curve Parameter Modification

**Current State:** Parameters set at deployment, cannot be changed.

**Solution:**
```solidity
// Add to BondingCurveSale.sol
function setFeeBps(uint16 newFeeBps) external onlyAdmin {
  require(newFeeBps <= MAX_FEE_BPS, "fee too high");
  feeBps = newFeeBps;
  emit FeeUpdated(newFeeBps);
}

function setPolBps(uint16 newPolBps) external onlyAdmin {
  require(newPolBps <= MAX_POL_BPS, "pol too high");
  polBps = newPolBps;
  emit PolUpdated(newPolBps);
}
```

**Frontend:**
```typescript
// Change fee to 0.5%
const tx = await curve.setFeeBps(50);
await tx.wait();

// Change POL to 5%
const tx2 = await curve.setPolBps(500);
await tx2.wait();
```

#### 4. Manual Level Override

**Use Case:** Test app equipping without depositing full amounts.

**Solution:**
```solidity
// Add to LabVault.sol (TESTNET ONLY)
bool public testMode;
uint8 public overrideLevel;

function enableTestMode(bool enabled) external onlyAdmin {
  testMode = enabled;
  emit TestModeChanged(enabled);
}

function setOverrideLevel(uint8 level) external onlyAdmin {
  require(level <= 3, "invalid level");
  overrideLevel = level;
  emit OverrideLevelSet(level);
}

function getLevel() public view returns (uint8 level) {
  if (testMode && overrideLevel > 0) {
    return overrideLevel;
  }
  
  // Normal calculation
  uint256 a = totalAssets;
  if (a >= LEVEL3) return 3;
  if (a >= LEVEL2) return 2;
  if (a >= LEVEL1) return 1;
  return 0;
}
```

**Frontend:**
```typescript
// Enable test mode
const tx1 = await vault.enableTestMode(true);
await tx1.wait();

// Set level to 3
const tx2 = await vault.setOverrideLevel(3);
await tx2.wait();

// Now vault.getLevel() returns 3 regardless of actual assets
```

#### 5. Instant LABS Minting

**Current State:** Only owner can mint.

**Solution:** Already implemented in LABSToken.

**Frontend:**
```typescript
// Admin mints LABS to user
const tx = await labsToken.mint(
  userAddress,
  ethers.utils.parseEther("1000000") // 1M LABS
);
await tx.wait();
```

#### 6. Reset Epoch for Exit Cap Testing

**Use Case:** Test exit cap limits without waiting 24 hours.

**Solution:**
```solidity
// Add to LabVault.sol
function resetEpoch() external onlyAdmin {
  epochStart = uint64(block.timestamp);
  epochExitedAssets = 0;
  emit EpochRolled(epochStart);
}
```

**Frontend:**
```typescript
// Reset epoch to allow more exits
const tx = await vault.resetEpoch();
await tx.wait();
```

### Comprehensive Testing Facet

**Create new facet for all testing functions:**

```solidity
// contracts/facets/TestingFacet.sol
contract TestingFacet {
  event TestingParametersUpdated(string parameter, uint256 value);
  
  // Only callable by diamond owner
  modifier onlyOwner() {
    LibDiamond.enforceIsContractOwner();
    _;
  }
  
  // Override vault cooldown
  function overrideVaultCooldown(address vault, uint64 seconds_) external onlyOwner {
    LabVault(vault).setCooldown(seconds_);
    emit TestingParametersUpdated("vaultCooldown", seconds_);
  }
  
  // Override vault exit cap
  function overrideVaultExitCap(address vault, uint16 bps) external onlyOwner {
    LabVault(vault).setEpochExitCapBps(bps);
    emit TestingParametersUpdated("vaultExitCap", bps);
  }
  
  // Fast-forward vault time
  function setVaultTimeOffset(address vault, uint256 offset) external onlyOwner {
    LabVault(vault).setTestTimeOffset(offset);
    emit TestingParametersUpdated("vaultTimeOffset", offset);
  }
  
  // Force complete redemption
  function forceCompleteRedemption(address vault, uint256 requestId) external onlyOwner {
    LabVault(vault).forceCompleteRedemption(requestId);
  }
  
  // Reset vault epoch
  function resetVaultEpoch(address vault) external onlyOwner {
    LabVault(vault).resetEpoch();
  }
  
  // Set vault test mode
  function setVaultTestMode(address vault, bool enabled) external onlyOwner {
    LabVault(vault).enableTestMode(enabled);
  }
  
  // Override vault level
  function overrideVaultLevel(address vault, uint8 level) external onlyOwner {
    LabVault(vault).setOverrideLevel(level);
  }
  
  // Mint LABS to address
  function mintLABS(address to, uint256 amount) external onlyOwner {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    LABSToken(hs.labsToken).mint(to, amount);
  }
  
  // Update bonding curve fee
  function setCurveFee(address curve, uint16 feeBps) external onlyOwner {
    BondingCurveSale(curve).setFeeBps(feeBps);
  }
  
  // Update bonding curve POL
  function setCurvePol(address curve, uint16 polBps) external onlyOwner {
    BondingCurveSale(curve).setPolBps(polBps);
  }
}
```

**Frontend Admin Panel:**
```typescript
// components/AdminPanel.tsx
function AdminPanel() {
  const { address } = useAccount();
  const isAdmin = address === ADMIN_ADDRESS;
  
  if (!isAdmin) return null;
  
  return (
    <div className="admin-panel">
      <h2>Admin Testing Tools</h2>
      
      <section>
        <h3>LABS Token</h3>
        <button onClick={() => mintLABS(userAddress, "1000000")}>
          Mint 1M LABS to User
        </button>
      </section>
      
      <section>
        <h3>Vault Testing</h3>
        <button onClick={() => setVaultCooldown(vaultAddress, 60)}>
          Set Cooldown to 1 Minute
        </button>
        <button onClick={() => setVaultTimeOffset(vaultAddress, SEVEN_DAYS)}>
          Fast-Forward 7 Days
        </button>
        <button onClick={() => setVaultTestMode(vaultAddress, true)}>
          Enable Test Mode
        </button>
        <button onClick={() => overrideVaultLevel(vaultAddress, 3)}>
          Override Level to 3
        </button>
        <button onClick={() => resetVaultEpoch(vaultAddress)}>
          Reset Exit Cap Epoch
        </button>
      </section>
      
      <section>
        <h3>Bonding Curve</h3>
        <button onClick={() => setCurveFee(curveAddress, 0)}>
          Set Fee to 0%
        </button>
        <button onClick={() => setCurvePol(curveAddress, 0)}>
          Set POL to 0%
        </button>
      </section>
      
      <section>
        <h3>Redemption</h3>
        <input type="number" placeholder="Request ID" />
        <button onClick={() => forceCompleteRedemption(vaultAddress, requestId)}>
          Force Complete Redemption
        </button>
      </section>
    </div>
  );
}
```

---

## Backend Integration Points

### Required Backend Endpoints

#### 1. User Management

```typescript
// POST /api/users/create
POST /api/users/create
Body: {
  walletAddress: string,
  chainId: number
}
Response: {
  userId: string,
  walletAddress: string,
  createdAt: timestamp
}

// GET /api/users/:walletAddress
GET /api/users/0x123...
Response: {
  userId: string,
  walletAddress: string,
  createdAt: timestamp,
  labsOwned: number[],
  totalStaked: string,
  totalH1Holdings: string
}

// POST /api/users/:walletAddress/sync
POST /api/users/0x123.../sync
Description: Sync on-chain data to backend
Response: { synced: boolean }
```

#### 2. Lab Discovery

```typescript
// GET /api/labs
GET /api/labs?domain=Healthcare&level=2&sort=tvl&limit=20
Response: {
  labs: [
    {
      labId: number,
      name: string,
      symbol: string,
      domain: string,
      owner: string,
      vaultAddress: string,
      level: number,
      slots: number,
      totalAssets: string,
      h1Price: string,
      createdAt: timestamp
    }
  ],
  total: number
}

// GET /api/labs/:labId
GET /api/labs/1
Response: {
  labId: number,
  name: string,
  symbol: string,
  domain: string,
  owner: string,
  vaultAddress: string,
  curveAddress: string,
  labPassAddress: string,
  level: number,
  slots: number,
  totalAssets: string,
  h1Price: string,
  totalRevenue: string,
  equippedApps: string[],
  stats: {
    totalDepositors: number,
    totalWithdrawals: string,
    averageStakeDuration: number
  },
  createdAt: timestamp
}
```

#### 3. Analytics

```typescript
// GET /api/analytics/platform
GET /api/analytics/platform
Response: {
  totalLabs: number,
  totalLabsStaked: string,
  totalH1Minted: string,
  totalRevenue: string,
  totalUsers: number,
  topLabsByTVL: [
    { labId: number, name: string, tvl: string }
  ]
}

// GET /api/analytics/lab/:labId
GET /api/analytics/lab/1
Response: {
  tvlHistory: [
    { timestamp: number, tvl: string }
  ],
  h1PriceHistory: [
    { timestamp: number, price: string }
  ],
  depositHistory: [
    { timestamp: number, amount: string, user: string }
  ],
  revenueHistory: [
    { timestamp: number, amount: string, source: string }
  ]
}
```

#### 4. Transaction History

```typescript
// GET /api/transactions/:walletAddress
GET /api/transactions/0x123...?type=deposit&limit=50
Response: {
  transactions: [
    {
      txHash: string,
      type: "deposit" | "withdraw" | "lab_create" | "revenue" | "buy",
      labId: number,
      amount: string,
      timestamp: number,
      status: "confirmed" | "pending" | "failed"
    }
  ]
}
```

#### 5. Testnet Faucet

```typescript
// POST /api/faucet/claim
POST /api/faucet/claim
Body: {
  walletAddress: string,
  amount: string
}
Response: {
  txHash: string,
  amount: string,
  timestamp: number
}

// GET /api/faucet/status/:walletAddress
GET /api/faucet/status/0x123...
Response: {
  lastClaim: timestamp,
  nextClaimAvailable: timestamp,
  dailyLimit: string,
  amountClaimed: string
}
```

### Event Indexing

**Use The Graph or backend event listener:**

```typescript
// Event listener service
import { ethers } from 'ethers';

const provider = new ethers.providers.WebSocketProvider(WSS_URL);
const diamond = new ethers.Contract(DIAMOND_ADDRESS, ABI, provider);

// Listen for lab creation
diamond.on("LabCreated", async (labId, owner, name, symbol, domain, h1Token) => {
  await db.labs.create({
    labId: labId.toString(),
    owner,
    name,
    symbol,
    domain,
    h1Token,
    createdAt: Date.now()
  });
  
  console.log(`Indexed new lab: ${name}`);
});

// Listen for deposits
const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, provider);

vault.on("Deposited", async (caller, receiver, assets, shares) => {
  await db.deposits.create({
    labId: vault.labId,
    caller,
    receiver,
    assets: assets.toString(),
    shares: shares.toString(),
    timestamp: Date.now()
  });
});

// Listen for level changes
vault.on("LevelChanged", async (newLevel, totalAssets) => {
  await db.labs.update(
    { vaultAddress: vault.address },
    {
      level: newLevel,
      totalAssets: totalAssets.toString(),
      updatedAt: Date.now()
    }
  );
});
```

---

## MVP Checklist

### Smart Contracts

#### Core Contracts ✅
- [x] H1Diamond (EIP-2535 proxy)
- [x] LABSToken (ERC20)
- [x] LabVault (ERC20 + ERC4626-style)
- [x] BondingCurveSale
- [x] LabPass (ERC721)

#### Facets ✅
- [x] LABSCoreFacet (lab creation, staking)
- [x] VaultFacet (vault deployment)
- [x] BondingCurveFacet (curve deployment)
- [x] LabPassFacet (NFT deployment)
- [x] RevenueFacet (revenue distribution)
- [x] TreasuryFacet (LABS token management)
- [x] DiamondCutFacet (upgrades)
- [x] DiamondLoupeFacet (introspection)
- [x] OwnershipFacet (owner management)

#### Missing Contracts ❌
- [ ] LABSSwap (ETH → LABS conversion)
- [ ] AppManagementFacet (app equipping system)
- [ ] TestingFacet (admin testing functions)

#### Missing Features in Existing Contracts ⚠️
- [ ] Time offset in LabVault for cooldown testing
- [ ] Test mode & level override in LabVault
- [ ] Grace period for level downgrades
- [ ] LabPass auto-update on level change
- [ ] Bonding curve parameter setters

### Frontend

#### Pages ✅ (According to docs/4-h_1_labs_frontend_prototype.md)
- [x] Home (vision & hero)
- [x] Dashboard (lab marketplace)
- [x] Staking interface
- [x] App Store (mock)
- [x] About/Vision
- [x] Profile
- [x] Whitepaper
- [x] Settings

#### Missing Pages/Features ❌
- [ ] Lab Detail Page (individual lab dashboard)
- [ ] Lab Creation Flow (wizard)
- [ ] My Labs (owned labs management)
- [ ] Vault Interface (deposit/redeem)
- [ ] Bonding Curve Interface (buy H1)
- [ ] Redemption Queue (track pending redemptions)
- [ ] Admin Panel (testing tools)

#### Smart Contract Integration ❌
- [ ] Wallet connection (Base Account)
- [ ] Contract instances setup
- [ ] Read contract data
- [ ] Write transactions (approve, deposit, etc.)
- [ ] Event listening
- [ ] Transaction status tracking
- [ ] Error handling

### Backend

#### Infrastructure ❌
- [ ] Database setup
- [ ] API server
- [ ] Event indexer
- [ ] WebSocket server (real-time updates)

#### Endpoints ❌
- [ ] User management
- [ ] Lab discovery
- [ ] Analytics
- [ ] Transaction history
- [ ] Testnet faucet

### Deployment

#### Testnet Deployment ❌
- [ ] Deploy all contracts to Base Sepolia
- [ ] Verify contracts on BaseScan
- [ ] Deploy subgraph (if using The Graph)
- [ ] Deploy backend services
- [ ] Deploy frontend to hosting (Vercel/Netlify)

#### Configuration ❌
- [ ] Contract addresses in frontend config
- [ ] RPC URLs
- [ ] Chain ID configuration
- [ ] Environment variables

### Documentation

#### Technical Docs ✅
- [x] Architecture document
- [x] Smart contract structure
- [x] Lab creation and vaults doc
- [x] Frontend prototype spec
- [ ] **User flow for testnet** (THIS DOCUMENT)

#### User Guides ❌
- [ ] How to create a lab
- [ ] How to stake LABS
- [ ] How to buy H1 via bonding curve
- [ ] How to redeem from vault
- [ ] How to equip apps

### Testing

#### Smart Contract Tests ❌
- [ ] Unit tests for all facets
- [ ] Integration tests for full flows
- [ ] Edge case testing (exit caps, cooldowns, etc.)
- [ ] Gas optimization tests

#### Frontend Tests ❌
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)

#### Manual Testing Checklist ❌
- [ ] Admin deploys contracts
- [ ] User connects wallet
- [ ] User acquires LABS
- [ ] User creates lab
- [ ] User deposits to vault
- [ ] Lab reaches Level 1, 2, 3
- [ ] User equips apps
- [ ] User buys H1 via bonding curve
- [ ] User requests redemption
- [ ] User claims redemption after cooldown
- [ ] Revenue distribution works
- [ ] Admin testing functions work

---

## Summary of Key Findings

### What's Working ✅

1. **Core Diamond Architecture**
   - EIP-2535 proxy pattern implemented
   - All standard facets deployed
   - Storage libraries properly structured

2. **Lab Creation Flow**
   - Users can create labs with custom names/symbols
   - LabVault auto-deploys on lab creation
   - Domain uniqueness enforced

3. **Vault Operations**
   - Deposit LABS → receive H1 shares
   - Redemption with cooldown period
   - Level calculation based on TVL
   - Exit caps enforced

4. **Bonding Curve**
   - Bootstrap mechanism for H1 purchases
   - Fee and POL allocation
   - Slippage protection

5. **Revenue Distribution**
   - Automatic 50/25/25 split
   - Reentrancy protection

### What's Missing ❌

1. **ETH → LABS Swap**
   - No mechanism for users to acquire LABS with ETH
   - Need simple swap contract or DEX integration

2. **App Equipping System**
   - No smart contract for app management
   - No enforcement of slot limits
   - Need `AppManagementFacet`

3. **Admin Testing Functions**
   - Cannot fast-forward time for cooldown testing
   - Cannot override parameters easily
   - Need `TestingFacet` or test mode in contracts

4. **Grace Period for Level Downgrades**
   - Redemptions can instantly drop lab level
   - Need grace period + backfill mechanism

5. **Frontend Integration**
   - No smart contract hooks implemented yet
   - Need to build all transaction flows
   - Need event listeners for real-time updates

6. **Backend Services**
   - No user profile database
   - No event indexing
   - No analytics API
   - No testnet faucet

### Critical Path for MVP

**Phase 1: Core Contracts (1-2 weeks)**
1. Implement LABSSwap for ETH → LABS
2. Implement AppManagementFacet
3. Add testing functions to contracts (time offset, level override, etc.)
4. Deploy all contracts to Base Sepolia
5. Verify on BaseScan

**Phase 2: Frontend Integration (2-3 weeks)**
1. Setup wallet connection (Base Account)
2. Implement lab creation flow
3. Implement vault deposit/redeem interface
4. Implement bonding curve interface
5. Implement admin panel
6. Add event listeners
7. Build lab detail pages

**Phase 3: Backend Services (1-2 weeks)**
1. Setup database
2. Implement user API
3. Implement lab discovery API
4. Setup event indexer
5. Implement testnet faucet
6. Deploy backend services

**Phase 4: Testing & Launch (1 week)**
1. Manual testing of full flow
2. Fix bugs
3. Write user guides
4. Deploy frontend
5. Public testnet launch

**Total Estimated Time:** 5-8 weeks for complete MVP

---

## Next Steps

1. **Immediate Actions:**
   - [ ] Review this document with team
   - [ ] Prioritize missing features
   - [ ] Create implementation plan
   - [ ] Assign tasks

2. **Contract Development:**
   - [ ] Implement LABSSwap contract
   - [ ] Implement AppManagementFacet
   - [ ] Add testing functions to existing contracts
   - [ ] Write tests
   - [ ] Deploy to Base Sepolia

3. **Frontend Development:**
   - [ ] Setup project structure
   - [ ] Implement wallet connection
   - [ ] Build core user flows
   - [ ] Integrate with contracts
   - [ ] Add real-time updates

4. **Backend Development:**
   - [ ] Design database schema
   - [ ] Implement API server
   - [ ] Setup event indexer
   - [ ] Deploy services

5. **Documentation:**
   - [ ] Write deployment guide
   - [ ] Write user guides
   - [ ] Create API documentation
   - [ ] Record video tutorials

---

## Conclusion

The H1 Labs smart contract architecture is solid and well-designed. The core functionality for lab creation, vault operations, and bonding curves is implemented and working.

**Key Gaps:**
1. ETH → LABS swap mechanism
2. App equipping system
3. Admin testing functions
4. Frontend integration (not started)
5. Backend services (not started)

**Recommended Approach:**
1. Implement missing smart contracts (LABSSwap, AppManagementFacet, TestingFacet)
2. Deploy to Base Sepolia
3. Build frontend with smart contract integration
4. Setup backend services
5. Test full flow end-to-end
6. Launch testnet

With focused development, the MVP can be ready in 5-8 weeks.

---

*End of Document*

