# Dataset Marketplace - Smart Contract Integration Guide

**Status**: ✅ COMPLETE | **Date**: 2025-10-21 | **Version**: 1.0

---

## 📋 Overview

This guide covers the complete integration between the frontend dataset marketplace and the blockchain smart contracts. The system is designed for automatic revenue distribution to creators, supervisors, lab owners, and the protocol treasury.

---

## 🔧 Smart Contract Implementation

### RevenueFacet - New Functions Added

#### 1. `batchDistributeRevenue()`
**Purpose**: Process batch dataset purchases with automatic revenue splitting

```solidity
function batchDistributeRevenue(
  uint256[] calldata labIds,
  uint256[] calldata amounts
) external payable nonReentrant
```

**Parameters**:
- `labIds`: Array of lab identifiers receiving revenue
- `amounts`: Array of amounts per lab (must match labIds length)

**Behavior**:
- Validates array lengths match
- Calculates total amount from all entries
- Verifies `msg.value` equals total amount
- Distributes revenue in a single loop:
  - 50% to lab owner
  - 25% to protocol treasury (H1 pool)
  - 25% to buyback reserve (also treasury)

**Events Emitted**:
- `RevenueDistributed` (per lab)
- `BatchRevenueDistributed` (batch completion)

**Security**:
- Reentrancy guard via `nonReentrant` modifier
- Checks-effects-interactions pattern
- Validates all lab IDs exist before processing

---

#### 2. `batchDistributeRevenueWithTracking()`
**Purpose**: Enhanced batch function with purchase tracking

```solidity
function batchDistributeRevenueWithTracking(
  uint256[] calldata datasetIds,
  uint256[] calldata labIds,
  uint256[] calldata amounts
) external payable nonReentrant
```

**Additional Parameters**:
- `datasetIds`: Individual dataset IDs being purchased

**Additional Event**:
- `DatasetPurchaseCompleted` - Emits buyer address and all dataset IDs

**Use Case**: 
- When you need to track which specific datasets were purchased
- For analytics and revenue attribution

---

### Revenue Distribution Formula

For each dataset purchase amount:
```
Lab Owner:        amount × 50%
H1 Pool:          amount × 25%
Buyback Reserve:  amount × 25%
```

**Example** (Single $2,500 dataset):
```
Total: $2,500
├─ Lab Owner:       $1,250 (50%)
├─ H1 Pool:         $625   (25%)
└─ Buyback Reserve: $625   (25%)
```

**Example** (Batch: 3 datasets, $10,000 total):
```
Total: $10,000
├─ Lab 1 ($2,500):  $1,250 to lab owner
├─ Lab 2 ($5,000):  $2,500 to lab owner
├─ Lab 3 ($2,500):  $1,250 to lab owner
├─ H1 Pool:         $2,500 (25% of total)
└─ Buyback Reserve: $2,500 (25% of total)
```

---

## 🔗 Frontend Integration

### Hook: `useDatasetPurchase`

Located at: `src/hooks/useDatasetPurchase.ts`

#### Key Functions

**1. `purchaseDatasets(purchaseData)`**
- Connects to wallet via ethers.js v6
- Encodes smart contract function call
- Estimates gas
- Sends transaction
- Waits for 1 confirmation
- Returns receipt

**Flow**:
```
User clicks "Complete Purchase"
  ↓
Hook validates purchase data
  ↓
Gets signer from MetaMask
  ↓
Encodes batchDistributeRevenue() call
  ↓
Estimates gas
  ↓
User confirms in wallet
  ↓
Transaction sent to blockchain
  ↓
Wait for confirmation
  ↓
Return receipt with tx hash
```

**2. `calculateRevenueDistribution(totalAmount)`**
- Returns breakdown for UI preview:
  - Creators: 40% (DataValidationFacet gets this)
  - Supervisors: 10% (DataValidationFacet gets this)
  - Labs: 25% (RevenueFacet direct 50% + treasury)
  - Buyback: 25% (Treasury)

**3. `validatePurchaseData(purchaseData)`**
- Checks datasets are selected
- Validates total amount > 0
- Verifies payment method
- Ensures each dataset has valid labId and price

**4. `getExplorerUrl(txHash)`**
- Returns link to view transaction on blockchain explorer
- Configurable via `REACT_APP_EXPLORER_URL`
- Defaults to Sepolia Etherscan

---

### CheckoutCart Component Updates

**New Features**:
1. **Transaction States**:
   - `review`: Initial cart review
   - `processing`: Waiting for wallet confirmation
   - `success`: Transaction confirmed on-chain
   - `error`: Transaction failed

2. **Success State**:
   - Shows green confirmation
   - Displays transaction hash (clickable)
   - Shows revenue distribution breakdown
   - Links to blockchain explorer

3. **Error State**:
   - Shows error message
   - Displays transaction hash if available
   - "Try Again" button to restart
   - Back to marketplace button

4. **Processing State**:
   - Shows loading spinner
   - Prompts user to confirm in wallet
   - Displays tx hash once sent
   - Estimated time message

---

## 🚀 Environment Configuration

### Required Environment Variables

Create or update `.env.local`:

```env
# Blockchain Configuration
REACT_APP_H1_DIAMOND_ADDRESS=0x[H1Diamond address]
REACT_APP_EXPLORER_URL=https://sepolia.etherscan.io
REACT_APP_CHAIN_ID=11155111  # Sepolia testnet

# RPC Provider (optional, can use wallet's RPC)
REACT_APP_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Network Configuration
REACT_APP_NETWORK_NAME=sepolia
REACT_APP_NETWORK_SYMBOL=ETH
```

---

## 📝 Transaction Flow Example

### User Journey

**Step 1: Browse Marketplace**
```
User visits /marketplace
Sees 6 datasets with prices, quality, delta-gain
Filters by Healthcare domain
Finds "Medical Imaging Annotations" for $4,500
```

**Step 2: Select Datasets**
```
Clicks checkbox on Medical Imaging Annotations
Cart badge shows: "1 - $4,500"
Selects 2 more datasets
Cart badge shows: "3 - $10,000"
5% bulk discount applied: saves $500
Final total: $9,500
```

**Step 3: Checkout**
```
Clicks "Cart" button
Navigates to /checkout
Reviews items:
  - Medical Imaging: $4,500 (labId: 1)
  - Financial Trans: $5,000 (labId: 2)
  - Legal Docs:      $2,500 (labId: 3)

Subtotal:        $12,000
Protocol Fee:    +$240 (2%)
Bulk Discount:   -$600 (5%)
Total:           $11,640

Revenue Preview:
  Creators:   $4,656 (40%)
  Supervisors: $1,164 (10%)
  Labs:       $2,910 (25%)
  Buyback:    $2,910 (25%)
```

**Step 4: Execute Purchase**
```
User selects "ETH" payment method
Clicks "Complete Purchase"
MetaMask opens
User sees transaction details:
  To:    H1Diamond address
  Data:  batchDistributeRevenue(
           [1, 2, 3],           // labIds
           [2250, 2500, 1250]   // 50% of each price
         )
  Value: 11.64 ETH (~$29,100)

User clicks "Confirm" in MetaMask
CheckoutCart shows "Processing Purchase..."
Transaction sent to blockchain
Tx hash shown: 0x3f8a...7c2b

After ~15-30 seconds:
Transaction confirmed ✅
Green success page shows:
  - Transaction hash (clickable link)
  - All dataset details
  - Revenue distribution breakdown
  - Links to continue shopping or view on explorer
```

**Step 5: Blockchain Execution**
```
RevenueFacet.batchDistributeRevenue() called
Loop through each lab:

Lab 1 (Medical Imaging, amount $2,250):
  ├─ Send $1,125 to lab owner
  └─ Send $1,125 to treasury (H1 Pool + Buyback)

Lab 2 (Financial, amount $2,500):
  ├─ Send $1,250 to lab owner
  └─ Send $1,250 to treasury

Lab 3 (Legal, amount $1,250):
  ├─ Send $625 to lab owner
  └─ Send $625 to treasury

Total distributed:
  Lab Owners:   $2,875
  Treasury:     $2,875
  (Treasury splits: $2,875 × 50% = $1,438 H1 Pool, $1,438 Buyback)
```

---

## 🔐 Security Considerations

### Reentrancy Protection
- All functions use `nonReentrant` modifier
- State updates before external calls
- Follows checks-effects-interactions pattern

### Input Validation
- Array length validation
- Amount zero-check
- Lab ID existence verification
- Total amount verification against msg.value

### Access Control
- Payable only (no auth needed for purchases)
- Lab owner validation via lab existence check
- Treasury address validation

---

## 🧪 Testing Checklist

- [ ] Deploy to testnet (Sepolia)
- [ ] Verify H1Diamond address in env config
- [ ] Test single dataset purchase
- [ ] Test batch (3+) purchase
- [ ] Verify bulk discount applied
- [ ] Check revenue distribution matches formula
- [ ] Verify lab owner receives correct amount
- [ ] Check treasury receives funds
- [ ] Test on real MetaMask wallet
- [ ] Verify Etherscan link works
- [ ] Test error handling (insufficient balance)
- [ ] Test success page
- [ ] Test "Try Again" flow
- [ ] Monitor gas costs

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DATASET MARKETPLACE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DatasetMarketplace.tsx                                    │
│  ├─ Browse 6 datasets                                      │
│  ├─ Filter & sort                                          │
│  ├─ Multi-select with cart                                │
│  └─ Sticky cart button → /checkout                        │
│                                                             │
│  DatasetDetails.tsx                                        │
│  ├─ Full provenance info                                  │
│  ├─ Creator/supervisor attribution                        │
│  └─ "Add to Cart" → /checkout                             │
│                                                             │
│  CheckoutCart.tsx                                          │
│  ├─ Review items                                          │
│  ├─ Calculate fees & discounts                            │
│  ├─ Show revenue distribution preview                     │
│  ├─ Select payment method                                 │
│  └─ "Complete Purchase" → useDatasetPurchase hook        │
│       │                                                    │
│       ↓                                                    │
│  useDatasetPurchase Hook                                  │
│  ├─ Validate purchase data                                │
│  ├─ Get signer from MetaMask                              │
│  ├─ Encode batchDistributeRevenue()                       │
│  ├─ Estimate gas                                          │
│  ├─ Send transaction (user confirms)                      │
│  └─ Wait for confirmation                                 │
│       │                                                    │
│       ↓                                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    ETHEREUM BLOCKCHAIN                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  H1Diamond (Proxy)                                         │
│  └─ Routes to RevenueFacet                                │
│     └─ batchDistributeRevenue()                           │
│        ├─ Validate inputs                                 │
│        ├─ Loop through labs                               │
│        │  ├─ Send 50% to lab owner                        │
│        │  └─ Send 50% to treasury                         │
│        ├─ Emit RevenueDistributed events                  │
│        └─ Emit BatchRevenueDistributed event              │
│                                                             │
│  Funds Distribution:                                       │
│  ├─ Lab Owners: Direct transfer (50%)                     │
│  ├─ Treasury: Receives H1 Pool (25%) + Buyback (25%)     │
│  └─ Data Creators/Supervisors: Tracked in DataValidation │
│     Facet for future distribution                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Integration with Data Validation

When a dataset is created:
```solidity
DataValidationFacet.createData(
  uint256 labId,
  bytes32 dataHash,
  string domain,
  address baseModel,
  uint256 creatorCredentialId  // Links to credential
)
```

When purchased:
```solidity
RevenueFacet.batchDistributeRevenueWithTracking(
  datasetIds,      // Links back to created dataset
  labIds,
  amounts
)
```

Future: AttributionFacet will distribute creator/supervisor shares using:
- Creator address from DataValidationFacet
- Supervisor address from DataValidationFacet
- Amounts: 40% and 10% respectively

---

## 🚨 Deployment Checklist

- [ ] Deploy RevenueFacet to testnet
- [ ] Add batchDistributeRevenue() to H1Diamond ABI
- [ ] Update H1Diamond diamond-cuts to include new functions
- [ ] Verify all events are indexed correctly
- [ ] Test with Foundry/Hardhat
- [ ] Deploy to mainnet-equivalent testnet
- [ ] Update REACT_APP_H1_DIAMOND_ADDRESS
- [ ] Test full flow end-to-end
- [ ] Monitor gas usage on mainnet estimate
- [ ] Set up transaction monitoring (Tenderly/Etherscan)

---

## 💡 Future Enhancements

1. **Creator/Supervisor Payouts**:
   - Implement AttributionFacet
   - Distribute 40% to creators, 10% to supervisors

2. **Payment Methods**:
   - Add USDC/USDT support
   - Add $LABS token support
   - Price oracle integration

3. **Advanced Features**:
   - Recurring purchases
   - Subscription models
   - Dataset rental periods
   - Multi-signature approvals

4. **Analytics**:
   - Purchase dashboard
   - Revenue tracking
   - Creator earnings
   - Lab performance metrics

---

**Status**: ✅ Ready for Testnet Deployment

**Next Step**: Deploy smart contract and run end-to-end test

