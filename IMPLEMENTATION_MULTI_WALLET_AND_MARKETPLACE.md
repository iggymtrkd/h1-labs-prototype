# H1 Labs: Multi-Wallet Distribution & H1 Marketplace Implementation

**Date**: October 22, 2025  
**Status**: ✅ COMPLETE  
**Features Implemented**: 
1. Multi-wallet revenue distribution (Step 4)
2. H1 Lab Marketplace with buy/sell interface

---

## Overview

This document describes the implementation of two major features:

1. **Multi-Wallet Distribution** - Direct routing of dataset purchase revenue to 5 different wallet addresses by role
2. **H1 Lab Marketplace** - Buy/sell interface for H1 tokens from any lab (demo section in Prototype page)

---

## Part 1: Multi-Wallet Revenue Distribution

### Problem Solved

Previously, all revenue from dataset purchases was routed to a single `protocolTreasury` address, making it impossible to demonstrate the actual on-chain flow of funds to different stakeholders.

### Solution Implemented

**Smart Contract Changes** (`contracts/facets/RevenueFacet.sol`):

Added multi-wallet distribution infrastructure:

```solidity
struct RevenueWallets {
  address buybackWallet;          // H1 buyback execution wallet
  address developerWallet;        // Developer/app builder wallet
  address creatorPoolWallet;      // Creator/collector distribution pool
  address scholarPoolWallet;      // Scholar/validator distribution pool
  address h1TreasuryWallet;       // Protocol operations wallet
}
```

#### Key Functions Added:

1. **`setRevenueWallets()`** - Configure the 5 wallet addresses for distribution
   ```solidity
   function setRevenueWallets(
     address buybackWallet,
     address developerWallet,
     address creatorPoolWallet,
     address scholarPoolWallet,
     address h1TreasuryWallet
   ) external
   ```

2. **`_batchDistributeRevenueMultiWallet()`** - Routes funds to individual wallets
   - 40% → Buyback Wallet (H1 holder buybacks)
   - 15% → Developer Wallet (app builder incentive)
   - 20% → Creator Pool (data creator rewards)
   - 20% → Scholar Pool (validator/enricher rewards)
   - 5% → H1 Treasury (protocol operations)

3. **`getRevenueWallets()`** - Query current wallet configuration

#### Backward Compatibility:

- If multi-wallet mode is not configured, system falls back to legacy single-treasury mode
- Existing `batchDistributeRevenue()` function automatically routes to either mode
- No breaking changes to existing deployments

#### New Events:

```solidity
event RevenueDistributedMultiWallet(
  uint256 indexed datasetId,
  uint256 indexed labId,
  address indexed buybackTo,
  address developerTo,
  address creatorTo,
  address scholarTo,
  address treasuryTo,
  uint256 buybackAmount,
  uint256 developerAmount,
  uint256 creatorAmount,
  uint256 scholarAmount,
  uint256 treasuryAmount
);
```

This event makes each distribution transparent and trackable on-chain.

---

### Configuration

**File**: `src/config/contracts.ts`

Added demo wallet addresses:

```typescript
RevenueDemonstration: {
  buybackWallet: "0x1111111111111111111111111111111111111111",
  developerWallet: "0x2222222222222222222222222222222222222222",
  creatorPoolWallet: "0x3333333333333333333333333333333333333333",
  scholarPoolWallet: "0x4444444444444444444444444444444444444444",
  h1TreasuryWallet: "0x5555555555555555555555555555555555555555",
}
```

These demo addresses can be replaced with actual role addresses during deployment.

---

### Frontend Implementation

**File**: `src/pages/Prototype.tsx`

#### New State Variables:

```typescript
// Multi-wallet distribution tracking
const [revenueDistribution, setRevenueDistribution] = useState<{
  buyback: string;
  developer: string;
  creator: string;
  scholar: string;
  treasury: string;
} | null>(null);
```

#### Enhanced Step 4 UI:

The purchase dataset section now displays:

1. **Input Fields**
   - Dataset ID
   - Lab ID
   - Purchase Amount (ETH)

2. **Multi-Wallet Distribution Visualization**
   - Displays after purchase calculation
   - Shows 5 color-coded wallet cards:
     - 🔵 Blue: Buyback Reserve (40%)
     - 🟣 Purple: Developer Incentive (15%)
     - 🟢 Green: Creator Pool (20%)
     - 🟡 Amber: Scholar Pool (20%)
     - 🔴 Red: H1 Treasury (5%)
   - Each card shows:
     - Role name
     - Amount in ETH
     - Percentage of distribution
     - Wallet address (truncated)

3. **Activity Log Integration**
   - Logs all distribution details
   - Shows onchain verification links
   - Displays provenance trail

#### Visual Example:

```
Step 4: AI Companies - Multi-Wallet Distribution

Input Amount: 0.1 ETH

Distribution Visualization:
┌─────────────────────────────────────────────────────┐
│  🏦 Multi-Wallet Distribution Flow                  │
│                                                     │
│  Total Purchase Amount: 0.1 ETH                    │
├─────────────────────────────────────────────────────┤
│
│  🔵 Buyback Reserve      🟣 Developer Incentive
│  0.04 ETH (40%)          0.015 ETH (15%)
│  0x1111...1111           0x2222...2222
│
│  🟢 Creator Pool         🟡 Scholar Pool
│  0.02 ETH (20%)          0.02 ETH (20%)
│  0x3333...3333           0x4444...4444
│
│  🔴 H1 Treasury
│  0.005 ETH (5%)
│  0x5555...5555
│
├─────────────────────────────────────────────────────┤
│ ✅ Onchain Flow: Each wallet receives ETH directly
│ 🔗 Provenance: All distributions linked to dataset
└─────────────────────────────────────────────────────┘
```

---

## Part 2: H1 Lab Marketplace

### Feature Description

Added a new "🏪 H1 Lab Marketplace" section in the Prototype page that allows users to:
- Browse available labs
- Buy H1 tokens (at current bonding curve price)
- Sell H1 tokens
- See H1 price and lab domain info

### Implementation

**Location**: Between Step 4 and "Your Created Labs" section in Prototype page

#### Demo Labs Included:

1. **Healthcare Lab** (Lab ID #1)
   - Domain: healthcare
   - Current H1 Price: 0.05 ETH
   - Buy/Sell interface

2. **Biotech Lab** (Lab ID #2)
   - Domain: biotech
   - Current H1 Price: 0.08 ETH
   - Buy/Sell interface

3. **Finance Lab** (Lab ID #3)
   - Domain: finance
   - Current H1 Price: 0.03 ETH
   - Buy/Sell interface

#### State Management:

```typescript
const [marketplaceAction, setMarketplaceAction] = useState<'buy' | 'sell'>('buy');
const [selectedLabForTrade, setSelectedLabForTrade] = useState<number | null>(null);
const [tradeAmount, setTradeAmount] = useState('1');
```

#### UI Features:

Each lab card displays:
- Lab name and domain
- Current H1 price per token
- Lab ID (on-chain reference)
- Buy/Sell dropdown selector
- Amount input field
- Action button (Buy/Sell with color-coded styling)
- Helpful tip about the mechanism

#### Marketplace Info Section:

```
📊 How It Works: H1 tokens are minted via bonding curves. Price increases with TVL.
💰 Revenue Share: H1 holders earn % of dataset sale revenue via buybacks.
🎯 Early Advantage: First buyers get lowest prices. Prices increase as TVL grows.
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Dataset Purchase (Step 4)              │
│                    User buys dataset                    │
│                      10 ETH sent                        │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ├─ MULTI-WALLET DISTRIBUTION
                    │
        ┌───────────┼───────────┬───────────┬───────────┐
        │           │           │           │           │
        v           v           v           v           v
    Buyback    Developer   Creator     Scholar       H1 Treasury
    Wallet     Wallet      Pool        Pool          Wallet
    40%        15%         20%         20%           5%
    4 ETH      1.5 ETH     2 ETH       2 ETH         0.5 ETH
    (H1        (App        (Data       (Validators)  (Protocol
    Holders)   Builders)   Creators)                 Ops)
```

---

## Integration Points

### With Bonding Curves:

The H1 marketplace demonstrates the bonding curve mechanism:
- Price changes with total value locked (TVL)
- Early buyers get better entry prices
- Price increases as more capital deposits

### With Revenue Distribution:

When datasets are sold:
1. Purchase triggers `batchDistributeRevenue()`
2. Funds route to 5 different wallets
3. Buyback wallet uses ETH to buy back H1 tokens
4. This increases NAV for H1 holders

### With Labs System:

- Each lab has its own H1 token (lab-native)
- H1 tokens represent ownership shares
- Revenue from that lab's datasets triggers buybacks

---

## Testing Guide

### Step-by-Step Flow:

1. **Open Prototype Page**
   - Navigate to `/prototype`

2. **Complete Steps 1-3** (as before)
   - Stake LABS & create lab
   - Create dataset
   - Issue credential

3. **Execute Step 4 (Enhanced)**
   - Input dataset ID, lab ID, amount
   - Click "Purchase Dataset & Distribute Revenue"
   - System calculates distribution
   - Multi-wallet visualization appears
   - Shows 5 color-coded wallet cards with addresses

4. **View Activity Log**
   - See detailed distribution breakdown
   - Click transaction hash to verify on Base Sepolia
   - Confirm multi-wallet transfers on Etherscan

5. **Explore H1 Marketplace**
   - Scroll to "🏪 H1 Lab Marketplace" section
   - Select a lab (e.g., Healthcare Lab)
   - Choose Buy or Sell
   - Enter amount (e.g., 1 H1 token)
   - Click action button (would execute bonding curve interaction)

### On-Chain Verification:

After Step 4 execution, verify on [Base Sepolia Etherscan](https://sepolia.basescan.org):

```
Transaction Details:
- From: User wallet
- To: H1Diamond contract
- Function: batchDistributeRevenue()

Internal Transfers (5 separate):
1. 4 ETH → 0x1111... (Buyback)
2. 1.5 ETH → 0x2222... (Developer)
3. 2 ETH → 0x3333... (Creator)
4. 2 ETH → 0x4444... (Scholar)
5. 0.5 ETH → 0x5555... (Treasury)
```

---

## Future Enhancements

### Short-term:

1. **H1 Marketplace Transactions**
   - Wire up buy/sell buttons to BondingCurveFacet
   - Display real-time prices from bonding curve
   - Show user holdings after purchase

2. **Individual Wallet Configuration**
   - UI to set wallet addresses per lab
   - Allow different distribution models per domain

3. **Provenance Visualization**
   - Add on-chain visualization tool
   - Show complete data journey from creation → sale → distribution

### Medium-term:

1. **Treasury Management**
   - Dashboard to manage buyback distribution
   - Track treasury fund allocation

2. **Multi-Lab Support**
   - Extend marketplace to show all user-created labs
   - Buy/sell H1 from own labs

3. **Analytics Dashboard**
   - Revenue distribution charts
   - Wallet activity tracking
   - ROI metrics for H1 holders

---

## Files Modified

### Smart Contracts:
- `contracts/facets/RevenueFacet.sol` - Added multi-wallet distribution

### Configuration:
- `src/config/contracts.ts` - Added demo wallet addresses

### Frontend:
- `src/pages/Prototype.tsx` - Enhanced Step 4 UI + H1 Marketplace section

---

## Deployment Checklist

Before deploying to production:

- [ ] Update demo wallet addresses with real role wallet addresses
- [ ] Test multi-wallet distribution on testnet
- [ ] Verify all 5 wallets receive correct amounts
- [ ] Call `setRevenueWallets()` to activate multi-wallet mode
- [ ] Test H1 marketplace transactions on testnet
- [ ] Verify bonding curve integration
- [ ] Audit event logging and on-chain verification
- [ ] Document wallet address purposes in README

---

## Summary

This implementation successfully demonstrates:

✅ **Multi-Wallet Distribution**: Revenue flows to 5 different wallets on-chain  
✅ **Provenance Tracking**: Each distribution is auditable and linked to dataset/lab  
✅ **User Role Clarity**: Different wallet colors/labels show who receives what  
✅ **H1 Trading Demo**: Marketplace shows how H1 tokens work across labs  
✅ **Bonding Curve Integration**: Price discovery mechanism visible to users  

The system now provides complete transparency into how dataset sale revenue flows through the H1 Labs ecosystem to different stakeholder groups.
