# **H1 Labs — Litepaper**  
> Status: Updated 2025-10-24 | Main body: 1,203 lines | Appendix: 108 lines | Total: 1,311 lines | Condensed & organized with TOC

### Advancing AI through provable, human‑validated data — powered by blockchain.

---

## Table of Contents

### Main Sections
1. [The Problem It Solves](#1-the-problem-it-solves)
2. [Technical Architecture](#2-technical-architecture)
   - 2.1 [Credentialing & Data Validation](#21-credentialing--data-validation)
   - 2.2 [Smart Contract Architecture](#22-smart-contract-architecture)
   - 2.3 [Lab Creation & Growth Mechanics](#23-lab-creation--growth-mechanics)
   - 2.4 [Technical Features & Security](#24-technical-features--security)
   - 2.5 [Reading Lab Data On-Chain](#25-reading-lab-data-on-chain)
   - 2.6 [Prototype Testing Workflow](#26-prototype-testing-workflow)
3. [Developer SDK](#3-developer-sdk)
4. [Tokenomics & Economic Model](#4-tokenomics--economic-model)
   - 4.1 [Automatic H1 Distribution](#41-automatic-h1-distribution-on-lab-creation)
   - 4.2 [Revenue Distribution Model](#42-revenue-distribution-model)
   - 4.3 [Staking & Scholar Rewards](#43-staking--scholar-rewards)
   - 4.4 [H1 Tokens — Per-Lab Economies](#44-h1-tokens--per-lab-economies)
   - 4.5 [Bonding Curves](#45-bonding-curves--automatic-deployment--bootstrap-mechanics)
   - 4.6 [H1 Swap Fees](#46-h1-swap-fees--staking--unstaking-costs)
   - 4.7 [Unstaking Flow](#47-unstaking-flow--overview)
5. [Economic Flywheel](#5-economic-flywheel)
6. [Roadmap](#6-roadmap-condensed)
7. [Dataset Marketplace](#7-dataset-marketplace)
8. [Closing](#8-closing)

### Appendix
- [A. Our Edge — Strengths at a Glance](#a-our-edge--strengths-at-a-glance)
- [B. What You Can Do on H1](#b-what-you-can-do-on-h1)
- [C. Competitive Positioning](#c-competitive-positioning--h1-vs-the-field)
- [D. Risks & Mitigations](#d-risks--mitigations)
- [E. User Flows](#e-user-flows)
- [F. Use Cases & Scenarios](#f-use-cases--scenarios)
- [G. Micro Flywheel: Healthcare Lab Year 1](#g-micro-flywheel-healthcare-lab-year-1-detailed-example)
- [K. Healthcare Lab H1 Token Appreciation (Year 1)](#k-healthcare-lab-h1-token-appreciation-year-1)

---

## 1. The Problem It Solves

**H1 Labs makes AI training data trustworthy, compliant, and economically fair** — solving the provenance crisis that puts companies at legal, compliance, and financial risk.

### What You Can Use It For

- **Prove Compliance to Regulators**: Generate immutable audit trails showing credentialed experts validated your training data — critical for HIPAA (healthcare), GDPR (privacy), ITAR (defense), and emerging AI regulations
- **Verify Data Quality Before Buying**: Every dataset comes with on-chain proof of who created it, who validated it, and what quality improvement they achieved — no more blind purchases
- **Monetize Your Expertise**: Domain experts (doctors, engineers, compliance officers) earn fair revenue shares by validating data — staking credentials once creates passive yield across all datasets they validate
- **Build Compliant AI Products Faster**: Use the H1 SDK to add credential verification and audit trails to your app without rebuilding compliance infrastructure from scratch

### How It Makes Things Easier and Safer

Instead of today's broken system where:
- Data provenance is unknowable (safety risk)
- Middlemen capture 80-90% of value (economic risk)
- No audit trail exists for regulators (legal risk)
- Quality is unverifiable before purchase (financial risk)

H1 Labs gives you:
- **Cryptographic proof** of every contributor and validator's identity and credentials
- **Automatic revenue splits** enforced by smart contracts (no brokers, no delays)
- **Immutable audit trails** for regulatory compliance in healthcare, finance, defense, and legal markets
- **Quality scores** (Δ-gain) proving measurable improvement, recorded on-chain

This is especially critical in **regulated markets** (Healthcare, Finance, Defense) where compliance violations mean fines, shutdowns, and criminal liability, and **semi-regulated markets** (Legal, Robotics, Art) where companies operate in legal gray zones with massive future enforcement risk.

### Our Solution: Aligned Incentives Through Tokenized Ownership

H1 Labs creates a fair data economy by combining three breakthroughs:

**1. Dual-Intelligence SDK:** AI speed + human expertise
   - AI agents handle heavy lifting (fast, cheap)
   - Credentialed experts validate quality (trustworthy, compliant)
   - Both sign on-chain = verifiable provenance

**2. On-Chain Provenance:** Every action recorded with cryptographic proof
   - Who created the data (verified credential)
   - Who validated it (verified credential in matching domain)
   - Quality improvement achieved (Δ-gain score)
   - Immutable audit trail for buyers and regulators

**3. Automatic Revenue Splits:** Smart contracts enforce fair economics
   - Data Creators: 20% | Validators: 20% | Developers: 15% | H1 Buyback: 40% | Treasury: 5%
   - No middlemen, no delays, no manual invoicing
   - Buyback distributes proportionally to all H1 holders (hold = gain, sell = miss appreciation)
   - Contributors earn based on verified quality, not broker negotiations

### Why Now

**The Cost of Not Solving This:**
- 85% of enterprise AI projects fail due to compliance issues
- Companies spend $500K–$2M annually on data ops and compliance lawyers
- When sued, weak data provenance becomes exhibit A against you

H1 Labs provides the cryptographic proof, regulatory defensibility, and fair economics that the AI industry desperately needs. We target regulated markets (healthcare, finance, defense) where compliance is non-negotiable and expand to semi-regulated markets (legal, robotics, creative) where rules are evolving.

---

## 2. Technical Architecture

### 2.1 Credentialing & Data Validation

> **The Chain of Trust**: From verified identity → credentialed contributions → provable datasets → fair revenue distribution.

### **Credentialing System: On-Chain Identity**

Before contributing to regulated datasets, users must create **on-chain credentials** with verified expertise:

```
STEP 1: User Identity
  User calls: createUserId(address, "medical")
  On-chain result: userId = 42
  
STEP 2: Credential Issuance
  Organization issues: issueCredential(userId=42, "physician", "medical", ipfsHash)
  On-chain result: credentialId = 100 (status = PENDING)
  
STEP 3: Credential Verification
  Organization verifies: verifyCredential(credentialId=100)
  On-chain result: credentialId = 100 (status = VERIFIED)
  
User now has:
  ✓ Persistent on-chain identity
  ✓ Verified domain expertise (medical)
  ✓ Credential linked to data operations
```

**Key Features**:
- **Off-Chain Verification**: Credential documents stored on IPFS; only hash on-chain for privacy
- **Domain Tagging**: Medical experts, engineers, lawyers each have tagged credentials
- **Revocation Support**: Credentials can be revoked for misconduct; blocks future operations
- **Immutable History**: All credential actions (issue, verify, revoke) recorded as events

### **Dataset Validation: Proof of Provenance**

Once credentialed, users create and validate datasets with **proof of provenance** on-chain:

```
PHASE 1: DATA CREATION (Creator with verified credential)
  Creator calls: createData(
    labId, 
    dataHash,        // IPFS content pointer
    "medical",       // domain
    0xGPT4,         // base model
    credentialId=42  // verified credential linkage
  )
  Result: dataId = 100 (PENDING)
  
PHASE 2: REVIEW SUBMISSION (Domain-matched supervisor)
  Creator calls: submitForReview(
    dataId=100,
    0xPhysician,           // supervisor address
    supervisorCredentialId=101  // must be domain-matching
  )
  On-chain validation:
    ✓ supervisor has verified credential
    ✓ supervisor domain = data domain ("medical" == "medical")
    ✓ prevents unqualified reviewers
  
PHASE 3: OFF-CHAIN REVIEW
  Supervisor downloads from IPFS using dataHash
  Supervisor reviews for quality/compliance
  Supervisor computes Δ-Gain: (92% - 85%) / 85% = 824 bps (8.24% improvement)
  
PHASE 4: ON-CHAIN APPROVAL
  Supervisor calls: approveData(
    dataId=100,
    deltaGainScore=824,
    approvalSignature
  )
  Result:
    ✓ dataId = 100 (APPROVED)
    ✓ Proof of provenance recorded on-chain
    ✓ Attribution created for revenue splits
    ✓ Event log: creator, supervisor, score, timestamp

Flow Diagram:
  Creator (Credential 42) → Create Data → Submit to Supervisor
                                              ↓
                    Supervisor (Credential 101, same domain)
                         ↓
                    Review offline (IPFS)
                         ↓
                    Approve with Δ-Gain (824)
                         ↓
                    Immutable Provenance On-Chain
                         ↓
                    Ready for Monetization
```

### **Attribution & Revenue Distribution**

Approved datasets carry **immutable attribution** that enables fair revenue splits:

```
When dataset sells for $100K:
├─ Identify creator & supervisor from on-chain Attribution
├─ Calculate delta-gain: 824 bps (8.24% improvement)
├─ Distribute revenue:
│  ├─ Creator: 40% = $40K
│  │  (Baseline 25% + delta-gain bonus 15%)
│  ├─ Supervisor: 10% = $10K
│  │  (Baseline 5% + delta-gain bonus 5%)
│  └─ Lab: 50% = $50K
├─ All payouts traceable to credentials
└─ All splits verified on-chain
```

**Why it matters**:
- Credentials tied to revenue = incentive for quality
- Delta-gain measured against base model = objective quality metric
- On-chain attribution = transparent, verifiable splits
- Immutable history = regulatory compliance

---

### **Credentialing + Validation Flow Diagram**

```
┌────────────────────────────────────────────────────────────────┐
│              H1 Labs: Credentialing → Validation               │
└────────────────────────────────────────────────────────────────┘

TIER 1: IDENTITY & CREDENTIALING (CredentialFacet)
  
  User Address (0xResearcher)
        │
        ├─ createUserId("medical")
        │        │
        │        └─ userId = 5
        │
        ├─ [Organization] issueCredential(5, "physician", "medical", 0xIPFS)
        │        │
        │        └─ credentialId = 42 (PENDING)
        │
        └─ [Organization] verifyCredential(42)
                 │
                 └─ credentialId = 42 (VERIFIED) ✅

─────────────────────────────────────────────────────────────

TIER 2: DATA CREATION & VALIDATION (DataValidationFacet)

  Creator (0xResearcher, credential 42✅)
        │
        ├─ createData(lab, hash, "medical", model, credential=42)
        │        │
        │        └─ dataId = 100 (PENDING)
        │
        ├─ submitForReview(dataId=100, supervisor, credential=43✅)
        │  [Domain match: "medical" == "medical" ✓]
        │        │
        │        └─ dataId = 100 (PENDING_REVIEW)
        │
        │  [Supervisor reviews offline]
        │
        └─ approveData(dataId=100, deltaGain=824, signature)
                 │
                 ├─ dataId = 100 (APPROVED) ✅
                 ├─ Attribution stored on-chain
                 │  └─ creator, supervisor, lab, delta-gain
                 └─ Ready for monetization

─────────────────────────────────────────────────────────────

TIER 3: REVENUE ATTRIBUTION

  $100K Dataset Sale
        │
        ├─ Query Attribution for dataId=100
        ├─ Split based on credentials + delta-gain
        │
        ├─ Creator (credential 42): $40K (40%)
        ├─ Supervisor (credential 43): $10K (10%)
        └─ Lab: $50K (50%)

  All splits traceable to credentials on-chain ✅
```

---

### 2.2 Smart Contract Architecture

### **Global Architecture: Diamond Pattern (EIP-2535)**

The H1 Labs protocol uses the **Diamond Pattern** for modular, upgradeable smart contracts:

```
H1Diamond (Proxy Router)
    ├─ DiamondCutFacet (add/remove facets)
    ├─ DiamondLoupeFacet (inspect facet functions)
    ├─ OwnershipFacet (admin controls)
    ├─ SecurityFacet (access control)
    ├─ LABSCoreFacet (LABS token staking)
    ├─ LabVaultDeploymentFacet (Step 1: create lab + deploy vault)
    ├─ LabDistributionFacet (Step 2: deploy bonding curve + distribute H1)
    ├─ LabPassFacet (deploy per-lab passes)
    ├─ BondingCurveFacet (bonding curve deposits)
    ├─ CredentialFacet (user credentials & identity)
    ├─ DataValidationFacet (dataset validation with delta-gain)
    ├─ RevenueFacet (revenue distribution splits)
    └─ TreasuryFacet (protocol treasury management)
```

All facets share state via **LibH1Storage** (centralized storage library), enabling seamless upgrades without data migration.

### **Credentialing & Validation Facets**

The credentialing and validation systems are implemented as **Diamond facets** (EIP-2535):

| Component | Location | Purpose |
|-----------|----------|---------|
| **CredentialFacet** | `/contracts/facets/CredentialFacet.sol` | User identity, issue/verify/revoke credentials |
| **DataValidationFacet** | `/contracts/facets/DataValidationFacet.sol` | Data creation, review submission, approval with delta-gain |
| **LibH1Storage** | `/contracts/libraries/LibH1Storage.sol` | Shared state: Credential struct, UserProfile, DataRecord, Attribution |
| **H1Diamond** | `/contracts/H1Diamond.sol` | Router: delegates calls to appropriate facet |

**Key Data Structures**:

```solidity
Credential:
  ├─ credentialId: unique ID
  ├─ holder: user address
  ├─ userId: link to user profile
  ├─ issuer: organization address
  ├─ credentialType: "physician", "engineer", etc.
  ├─ domain: "medical", "robotics", "finance"
  ├─ status: 0=PENDING, 1=VERIFIED, 2=REVOKED
  └─ offChainVerificationHash: IPFS document hash

DataRecord:
  ├─ dataId: unique ID
  ├─ creator: creator address (has credential)
  ├─ supervisor: approver address (has matching credential)
  ├─ dataHash: IPFS/Arweave pointer
  ├─ domain: "medical", "robotics", etc.
  ├─ status: 0=PENDING, 1=APPROVED, 2=REJECTED
  ├─ deltaGainScore: 0-10000 basis points (quality metric)
  └─ timestamps: createdAt, approvedAt

Attribution:
  ├─ creator: who created data
  ├─ supervisor: who approved data
  ├─ labId: which lab owns dataset
  ├─ deltaGainScore: quality measure
  └─ revenueShare: allocated to creator + supervisor
```

### **Per-Lab Vault & Pass Architecture (Deployed on Demand)**

While facets are **global and deployed once** to the H1Diamond, each Lab gets its own **isolated vault and pass contracts**:

#### **Distinction: Facet vs Per-Lab Contract**

| Component | Facet (Global) | Per-Lab Contract |
|-----------|--|--|
| **VaultFacet** | ✅ Deployed once; calls via H1Diamond | — |
| **LabVault** | — | ✅ **Deployed per lab** when lab is created |
| **LabPassFacet** | ✅ Deployed once; calls via H1Diamond | — |
| **LabPass** | — | ✅ **Deployed per lab** when requested |
| **Scope** | All labs use the same facet code | Each lab has isolated vault + pass |
| **State** | Shared global state via LibH1Storage | Independent ERC20/ERC721 state |

#### **How It Works: Per-Lab Deployment Flow**

**When a user creates a lab (Two-Step Process):**

**Step 1: Lab Creation + Vault Deployment**
```
User calls: createLabStep1("MediTrust", "MEDI", "medical")
     ↓
LabVaultDeploymentFacet.createLabStep1() (global facet on H1Diamond)
     ├─ Validates: name, symbol, domain, minimum 100K LABS staked
     ├─ Creates Lab record (stored in LibH1Storage)
     │  └─ Assigns labId, owner, domain, level (based on stake)
     ├─ Deploys NEW LabVault contract
     │  └─ Location: /contracts/vaults/LabVault.sol
     │  └─ Instance: 0xABC123... (unique per lab)
     │  └─ Contains: ERC20-style H1 token logic, deposit/redemption mechanics
     │  └─ Features: Cooldown periods, exit caps, level tracking, fee management
     └─ Stores addresses: labIdToVault[labId] = LabVault

Result: Lab created with vault, ready for Step 2
```

**Step 2: Bonding Curve + H1 Distribution**
```
User calls: createLabStep2(labId)
     ↓
LabDistributionFacet.createLabStep2() (global facet on H1Diamond)
     ├─ Retrieves vault from Step 1
     ├─ Deploys NEW BondingCurveSale contract
     │  └─ Location: /contracts/sales/BondingCurveSale.sol
     │  └─ Enables: Immediate H1 trading with 0.5% premium
     │  └─ Pre-allocated: 10% of initial H1 supply
     └─ Distributes H1 tokens automatically:
        ├─ 30% → Lab Owner (vested, 6 months)
        ├─ 10% → Bonding Curve (liquid immediately)
        ├─ 40% → Scholar Reserve (vested)
        ├─ 15% → Dev Reserve (vested)
        └─ 5% → Protocol Treasury (instant)

Result: Lab fully operational with bonding curve and H1 distributed
```

**When LabPassFacet.deployLabPass() is called:**

```
User calls: deployLabPass(labId)
     ↓
LabPassFacet.deployLabPass() (global facet on H1Diamond)
     ├─ Deploys NEW LabPass contract
     │  └─ Location: /contracts/tokens/LabPass.sol
     │  └─ Instance: 0xDEF456... (unique per lab)
     │  └─ Type: ERC721 NFT (soulbound or transferable)
     │  └─ Features: Level-based membership, app slot allocation
     ├─ Sets LabPassFacet as minter
     │  └─ Enables: mintLabPass() to create NFTs for members
     └─ Stores address: labIdToLabPass[labId] = LabPass

Result: Lab now has LabPass NFT system for membership
```

#### **LabVault Contract Details**

Each **LabVault** is an independent ERC20-style contract that:

```solidity
contract LabVault {
  // Immutable config (set at deployment)
  address immutable labsToken;      // $LABS token address
  address public labOwner;          // Lab creator (receives fees)
  address public treasury;          // Protocol treasury
  
  // Dynamic config (managed by admin)
  uint64 cooldownSeconds;           // Redemption cooldown (e.g., 7 days)
  uint16 epochExitCapBps;           // Max % that can exit per epoch (e.g., 20%)
  uint16 depositFeeLabOwnerBps;     // 1.5% to lab owner
  uint16 depositFeeTreasuryBps;     // 1% to protocol treasury
  uint16 redemptionFeeLabOwnerBps;  // 1.5% to lab owner
  uint16 redemptionFeeTreasuryBps;  // 1% to protocol treasury
  
  // Vault state
  uint256 totalAssets;              // $LABS locked in vault
  uint256 pendingExitAssets;        // $LABS waiting cooldown
  uint256 epochExitedAssets;        // $LABS exited this epoch
  
  // ERC20 shares
  mapping(address => uint256) balanceOf;  // H1 shares per user
  uint256 totalSupply;              // Total H1 in circulation
  
  // Level tracking
  uint256 LEVEL1 = 100_000e18;      // Unlock 1 app slot
  uint256 LEVEL2 = 250_000e18;      // Unlock 2 app slots
  uint256 LEVEL3 = 500_000e18;      // Unlock 3 app slots
}
```

**Key Methods:**
- `deposit(amount)`: Lock $LABS, mint H1 shares at current NAV
- `requestRedemption(shares)`: Request to exit (starts cooldown)
- `claimRedemption(requestId)`: Claim $LABS after cooldown
- `getCurrentLevel()`: Check level based on TVL
- `setFees()`: Adjust fee structure (admin only)

#### **LabPass Contract Details**

Each **LabPass** is an independent ERC721 NFT contract that:

```solidity
contract LabPass is ERC721 {
  // Metadata
  string name = "LabPass";
  string symbol = "LBP";
  
  // Soulbound config
  bool transferable;                // Admin can toggle soulbinding
  address minter;                   // Facet that can mint
  address admin;                    // Lab owner
  
  // NFT data per token
  struct PassData {
    uint8 level;                    // 1-10 (membership tier)
    uint8 appSlots;                 // Number of app slots user can use
  }
  mapping(uint256 => PassData) passData;
  
  // Standard ERC721 state
  mapping(uint256 => address) ownerOf;
  mapping(address => uint256) balanceOf;
}
```

**Key Methods:**
- `mint(to, tokenId, level, slots)`: Create membership NFT (minter only)
- `burn(tokenId)`: Revoke membership
- `setTransferable(bool)`: Toggle soulbound mode
- `updatePassData(tokenId, level, slots)`: Update tier/slots

#### **Why Per-Lab Contracts?**

✅ **Isolation**: Each lab's vault is independent; a bug or exploit doesn't affect others  
✅ **Scalability**: No shared state bottleneck; can scale to millions of labs  
✅ **Customization**: Each lab can configure fees, cooldowns, and parameters independently  
✅ **Gas Efficiency**: Only deploy what's needed; users don't pay for unused features  
✅ **Regulatory Compliance**: Each lab's financial state is independently auditable  

---

### 2.3 Lab Creation & Growth Mechanics

### **Lab Lifecycle & Ownership**

Creating a Lab unlocks automatic tokenomics with built-in distribution:

**Stage 1: Lab Creation & Automatic H1 Distribution** ✨ **NEW - Two-Step Process**  
Lab creator calls `createLabStep1(name, symbol, domain)` then `createLabStep2(labId)` with **minimum 100,000 LABS staked**. The system automatically:

1. **Step 1 - Creates Lab & Deploys LabVault** (H1 token contract)
2. **Step 2 - Deploys Bonding Curve** (enables immediate H1 trading)
3. **Mints H1 tokens** (1:1 with staked LABS, capped at 500,000 H1 per lab)
4. **Distributes H1 automatically**:

```
Example: Creator stakes 100,000 LABS → 100,000 H1 minted

Automatic Distribution:
├─ 30% → Lab Owner (30,000 H1) - VESTED over 6 months, weekly unlocks
├─ 10% → Bonding Curve (10,000 H1) - LIQUID, tradeable immediately
├─ 40% → Scholar Reserve (40,000 H1) - VESTED, paid as validation completes
├─ 15% → Dev Reserve (15,000 H1) - VESTED, paid as development completes
└─ 5% → Protocol Treasury (5,000 H1) - INSTANT distribution

Total: 100% allocated at creation
```

**Key Changes from Previous System:**
- ❌ **OLD**: Creator had to manually deploy bonding curve, no H1 received
- ✅ **NEW**: Bonding curve auto-deployed, creator receives 30% H1 (vested)

**Vesting Schedule for Lab Owner:**
- **Duration**: 26 weeks (6 months)
- **Cliff**: 1 week (first unlock after 1 week)
- **Frequency**: Weekly unlocks (linear vesting)
- **Example Timeline**:
  - Week 0: 30,000 H1 allocated, 0 claimable
  - Week 1: ~1,154 H1 claimable (1/26 of total)
  - Week 13: ~15,000 H1 claimable (50% of total)
  - Week 26: 30,000 H1 fully claimable (100% of total)

**Level Unlocking (Based on Staked LABS at Creation):**

| Level | LABS Staked | App Slots | H1 Minted | Implications |
|-------|-------------|-----------|-----------|--------------|
| **L1** | 100K–250K | 1 | 100K–250K H1 | Can run 1 backend/frontend app pair |
| **L2** | 250K–500K | 2 | 250K–500K H1 | Can run 2 app slots in parallel |
| **L3** | 500K+ | 3 | 500K H1 (capped) | Can run 3 app slots in parallel |

---

### **Lab Creation Flow — Visual Overview**

```
STEP 1: Creator Preparation
├─ Wallet Connected
├─ 100K+ LABS Available
└─ Decision: Name, Symbol, Domain

           ↓

STEP 2: Create Lab (Step 1)
├─ Calls: createLabStep1()
├─ Action: Deploys LabVault (H1 token contract)
└─ Result: Lab ID assigned

           ↓

STEP 3: Determine Level
├─ 100K–250K LABS → Level 1 (1 app slot)
├─ 250K–500K LABS → Level 2 (2 app slots)
└─ 500K+ LABS → Level 3 (3 app slots)

           ↓

STEP 4: Deploy Curve & Distribute (Step 2)
├─ Calls: createLabStep2()
├─ Deploys: Bonding Curve contract
└─ Mints: H1 tokens

           ↓

STEP 5: Automatic H1 Allocation (from 100K example)
├─ 30% → Lab Owner (vested 6 months, weekly unlocks)
├─ 10% → Bonding Curve (liquid, tradeable immediately)
├─ 40% → Scholar Reserve (vested)
├─ 15% → Dev Reserve (vested)
└─ 5% → Protocol Treasury (instant)

           ↓

STEP 6: Lab Live
├─ Creator: Can claim vested H1 from week 1
├─ Community: Can buy H1 on bonding curve
├─ Optional: Deploy LabPass for membership
└─ Ready: For data creation & monetization
```

**Key Outcome:** Complete lab setup in 2 transactions, H1 tradeable from day 1, no manual setup required.

---

**Stage 2: Immediate Trading via Bonding Curve**  
With 10% of H1 automatically allocated to the bonding curve at creation, users can immediately:
- **Buy H1** with LABS at `NAV × 1.005` (0.5% premium)
- **Price discovery** starts immediately
- **No manual deployment needed** - curve is live from day 1

**Stage 3: Growth via Additional Deposits**  
After initial distribution, additional users can:
- **Buy from bonding curve** (if available supply)
- **Deposit directly to vault** (if vault allows additional deposits)
- **Trade on secondary markets** (once H1 is listed)

Ownership becomes fractional as more users participate:
```
Example Timeline:
├─ T0 (Creation): Creator owns 30% vested + vault holds 55% for future distribution
├─ T1 (Week 1): Creator claims 1,154 H1, starts trading on curve
├─ T2 (Month 3): Community buys 50K H1 from bonding curve
├─ Total H1 supply: 100K original + any additional minted via vault deposits
└─ Creator's ownership: Diluted but NAV increases with community participation
```

### **Revenue Accrual & NAV Growth**

As the lab generates revenue from dataset sales, the vault's total assets increase, which increases the NAV (assets per share) for all H1 holders:

```
Ownership Dilution & Value Growth Example:

Time T0 (Lab Creation):
├─ Creator deposits: $100K
├─ Creator's H1: 100K shares (100% ownership)
├─ Lab assets: $100K
├─ NAV: $1.00/share
└─ Creator's value: $100K

Time T1 (After Bonding Curve - 200K raise):
├─ New investors deposit: $200K via bonding curve
├─ Fee + POL allocated: $30K
├─ New vault assets: $100K + $170K = $270K
├─ Total H1 supply: ~270K shares
├─ Creator's ownership: 100K/270K = 37% of lab
├─ New NAV: $270K/270K = $1.00/share
└─ Creator's value: 100K × $1.00 = $100K (same, but now owns 37% instead of 100%)

Time T2 (After $100K Dataset Revenue):
├─ Dataset sale: $100K
├─ Lab owner/Scholars: $50K (flows to vault)
├─ Treasury: $25K (protocol custody)
├─ Buyback reserve: $25K
├─ New vault assets: $270K + $50K = $320K
├─ Total H1 supply: ~270K shares (pre-buyback)
├─ New NAV: $320K/270K = $1.185/share
└─ Creator's value: 100K × $1.185 = $118.5K (+18.5% appreciation)

Time T3 (After Buyback Execution):
├─ Buyback reserves: $25K used to repurchase H1 at market
├─ H1 supply reduced: 270K → ~260K shares (assuming $0.96 average price)
├─ Vault assets: $320K (unchanged)
├─ New NAV: $320K/260K = $1.231/share
└─ Creator's value: 100K × $1.231 = $123.1K (+23.1% total appreciation)
```

**Key Mechanic**: H1 holders don't receive new tokens; instead, their existing shares increase in value as (1) vault backing grows from revenue and (2) buybacks reduce total supply. This aligns incentives for lab success without dilution.

---

### 2.4 Technical Features & Security

- **Reentrancy Guards:** Shared via `LibH1Storage.reentrancyStatus` where needed (e.g., `RevenueFacet`).  
- **Upgradeable by Facet:** New domains or policy changes can be added without migrating state.  
- **Guardian Controls:** Cooldowns, daily exit caps, and pause mechanisms at the vault level.  
- **Security & Introspection:** Standard Diamond Loupe, Ownership, Security facets.
- **Price Bounds Protection:** Bonding curve prevents price manipulation via MIN/MAX bounds and 50% max change per tx.
- **Pause Mechanism:** Emergency admin controls for security incidents.

---

### 2.5 Reading Lab Data On-Chain

**All lab and vault information is publicly queryable on the blockchain at any time, with no gas costs.** This enables transparency for investors, developers, and analysts without relying on external indexers or APIs.

#### **What Information Is Available?**

```
Lab Information
├─ Name, symbol, domain
├─ Owner address and creation date
├─ Current level and app slots
├─ Vault contract address
├─ Bonding curve contract address
└─ All queryable from H1Diamond

Vault State (Real-Time)
├─ Total TVL (LABS locked in vault)
├─ Total H1 supply (shares outstanding)
├─ Current NAV (LABS per H1 share)
├─ Pending redemptions and their unlock times
├─ Current level and app slots
└─ All queryable from LabVault

H1 Token (ERC-20)
├─ Token name and symbol
├─ Total supply and user balances
├─ Transfer history (on-chain)
├─ Exchange rate (NAV)
└─ All standard ERC-20 functions

User Position
├─ Your H1 balance
├─ Your redemption requests and status
├─ Your projected value (balance × NAV)
├─ Your ownership percentage
└─ All queryable by your address
```

#### **Data Availability at a Glance**

| Information | Where to Query | Refresh Rate | Cost |
|---|---|---|---|
| Lab metadata | H1Diamond contract | Real-time | Free (view function) |
| H1 distribution (allocation %) | H1Diamond contract | Fixed at creation | Free |
| Bonding curve price | H1Diamond contract | On each trade | Free |
| Vault TVL & NAV | LabVault contract | On each transaction | Free |
| User H1 balance | LabVault contract | Real-time | Free |
| Lab level & app slots | LabVault contract | When TVL changes | Free |
| Transaction history | Blockscout/Etherscan | On-chain | Free |

**Key Point:** Zero reliance on third-party indexers. All data comes directly from smart contracts on the blockchain, ensuring 100% accuracy and censorship-resistance.

#### **How Developers Use This**

Developers can build applications that:
- **Display live lab dashboards** (TVL, H1 supply, NAV)
- **Show user portfolios** (H1 balances across labs)
- **Calculate projected returns** (NAV appreciation + buyback impact)
- **Alert users to level changes** (app slot unlocks)
- **Track redemption queues** (time until funds available)

All without running an indexer or database. Smart contracts are the single source of truth.

#### **For Investors & Analysts**

Track any lab's performance:
```
Healthcare Lab (H1HC)
├─ Created: Oct 20, 2025
├─ TVL: $500K LABS (Level 2)
├─ H1 Supply: 500K shares
├─ NAV: $1.00 per share
├─ Time to Level 3: 2 more deposits of 125K each
├─ Datasets created: 12
├─ Datasets sold: 3 ($30K revenue)
└─ Current NAV: $1.06 per share (+6% from launch)
```

Everything above is queryable and verifiable on-chain. No trust required, only math.

---

### 2.6 Prototype Testing Workflow

**Testing the H1 Labs platform follows a natural progression from setup through full economic simulation.**

#### **Phase 1: Lab Creation & Setup**

```
TEST GOAL: Can we create a lab and deploy vault + curve?

┌─────────────────────────────────────────────────────┐
│ 1. Mint test LABS to creator wallet                 │
│ 2. Creator calls createLabStep1()                   │
│ 3. Verify: Lab record created, LabVault deployed   │
│ 4. Creator calls createLabStep2()                   │
│ 5. Verify: H1 tokens minted, bonding curve live    │
│ 6. Check: Distribution splits (30/10/40/15/5)      │
└─────────────────────────────────────────────────────┘

EXPECTED RESULTS:
✓ Lab ID assigned and vault address stored
✓ H1 tokens match staked LABS (1:1)
✓ Creator sees 30% H1 allocation (vested)
✓ Bonding curve shows 10% H1 available
✓ NAV starts at 1.00 LABS per share
```

#### **Phase 2: H1 Token Interactions**

```
TEST GOAL: Can users buy, hold, and trade H1?

┌─────────────────────────────────────────────────────┐
│ 1. Give test users LABS from faucet                │
│ 2. User A buys H1 on bonding curve                 │
│ 3. Verify: H1 balance updated correctly            │
│ 4. Verify: NAV unchanged (new deposit = new shares) │
│ 5. Verify: Creator's ownership diluted             │
│ 6. User B deposits directly to vault               │
│ 7. Verify: H1 minted at current NAV                │
└─────────────────────────────────────────────────────┘

EXPECTED RESULTS:
✓ 50K LABS deposit → ~50K H1 shares at $1.00 NAV
✓ Vault TVL increased to $50K
✓ Creator's % ownership diluted (but value unchanged)
✓ Bonding curve price still $1.005 (NAV + 0.5%)
✓ Can query H1 balances on-chain anytime
```

#### **Phase 3: Redemption & Exit Testing**

```
TEST GOAL: Can users safely exit with cooldown & caps?

┌─────────────────────────────────────────────────────┐
│ 1. User A requests redemption for 25K H1          │
│ 2. Verify: Shares burned immediately               │
│ 3. Verify: Request ID issued with unlock time     │
│ 4. Wait: 7-day cooldown period (fast-forward)      │
│ 5. User A claims redemption                        │
│ 6. Verify: LABS returned (minus 0.375% fee)       │
│ 7. Verify: Fits within daily exit cap (20% TVL)   │
└─────────────────────────────────────────────────────┘

EXPECTED RESULTS:
✓ Redemption request accepted with lock timestamp
✓ H1 shares burned from total supply
✓ Cannot claim before cooldown (reverts)
✓ After cooldown: Claim succeeds
✓ Amount = (shares × NAV) - redemption fee
✓ Can't exceed daily exit cap without backfill
```

#### **Phase 4: NAV Growth Simulation**

```
TEST GOAL: Does NAV increase when revenue flows in?

┌─────────────────────────────────────────────────────┐
│ 1. Vault TVL: 500K LABS, 500K H1, NAV $1.00      │
│ 2. Simulate dataset sale: $10K revenue            │
│ 3. Protocol sends 50% ($5K) to vault              │
│ 4. Vault TVL now: $505K                            │
│ 5. Query new NAV: 505K / 500K = $1.01 per share  │
│ 6. Verify: All H1 holders gain 1% value          │
└─────────────────────────────────────────────────────┘

EXPECTED RESULTS:
✓ NAV increases as vault assets grow
✓ All H1 holders benefit equally (proportional)
✓ Total H1 supply unchanged (no dilution)
✓ Creator's vested H1 also worth more
✓ Compounding visible over multiple revenue events
```

#### **Phase 5: Buyback & Scarcity Effect**

```
TEST GOAL: Do buybacks reduce supply and increase NAV?

┌─────────────────────────────────────────────────────┐
│ 1. Vault: 505K LABS, 500K H1, NAV $1.01          │
│ 2. Reserve 25% of revenue ($2.5K) for buybacks    │
│ 3. Buyback bot repurchases H1 at $0.99 average   │
│ 4. Buys ~2,525 H1 and burns them                  │
│ 5. New H1 supply: 497,475 shares                  │
│ 6. NAV: 505K / 497.5K = $1.015 per share        │
└─────────────────────────────────────────────────────┘

EXPECTED RESULTS:
✓ H1 supply decreases (scarcity)
✓ Vault assets stay same (or grow from more revenue)
✓ NAV increases from buyback alone
✓ Combined effect: NAV growth + supply reduction = exponential appreciation
✓ Early holders benefit most
```

#### **Phase 6: Multi-Lab Portfolio**

```
TEST GOAL: Can users hold H1 from multiple labs?

PORTFOLIO SCENARIO:

┌──────────────────────────────────────────────────────┐
│ Lab 1: Healthcare (H1HC)                             │
│ ├─ Your Balance: 50K H1                              │
│ ├─ NAV: $1.06                                        │
│ └─ Value: $53K                                       │
│                                                      │
│ Lab 2: Robotics (H1ROB)                              │
│ ├─ Your Balance: 30K H1                              │
│ ├─ NAV: $1.02                                        │
│ └─ Value: $30.6K                                     │
│                                                      │
│ Lab 3: Legal (H1LEG)                                 │
│ ├─ Your Balance: 25K H1                              │
│ ├─ NAV: $1.00                                        │
│ └─ Value: $25K                                       │
│                                                      │
│ TOTAL PORTFOLIO: $108.6K                             │
│ (Initial investment: $105K)                          │
└──────────────────────────────────────────────────────┘

TESTING:
✓ Can deposit to multiple labs independently
✓ Each lab H1 trades separately on bonding curve
✓ NAV appreciation tracked per lab
✓ Users can rotate between labs (tactical trading)
✓ Buybacks on one lab don't affect others
```

#### **Phase 7: Level Unlocking**

```
TEST GOAL: Do app slots unlock at correct thresholds?

┌──────────────────────────────────────────────────────┐
│ STARTING STATE:                                      │
│ ├─ TVL: $150K LABS                                   │
│ ├─ Level: 1 (100K–250K range)                       │
│ └─ App Slots: 1                                      │
│                                                      │
│ EVENT: $100K+ new deposits                           │
│ ├─ TVL: $250K LABS                                   │
│ ├─ Level: Still 1 (at threshold)                    │
│                                                      │
│ EVENT: $1K more deposits                             │
│ ├─ TVL: $251K LABS                                   │
│ ├─ Level: 2 (250K–500K range)                       │
│ └─ App Slots: Unlocked to 2                          │
│                                                      │
│ EVENT: $250K+ more deposits                          │
│ ├─ TVL: $500K+ LABS                                  │
│ ├─ Level: 3 (500K+ range)                           │
│ └─ App Slots: Unlocked to 3                          │
└──────────────────────────────────────────────────────┘

TESTING:
✓ Level determined at lab creation
✓ Level increases when TVL crosses threshold
✓ App slots unlock correctly
✓ Level can't decrease (monotonic)
```

#### **Full Testing Checklist**

```
☐ Phase 1: Lab creation completes in 2 steps
☐ Phase 2: H1 balances update on deposits
☐ Phase 3: Redemptions respect 7-day cooldown + exit caps
☐ Phase 4: NAV increases with dataset revenue
☐ Phase 5: Buybacks reduce supply + increase NAV
☐ Phase 6: Portfolio works across multiple labs
☐ Phase 7: Levels unlock at correct TVL thresholds
☐ All events emitted correctly
☐ All state transitions valid
☐ No reentrancy issues
☐ Edge cases handled (zero NAV, cap exceeded, etc.)
```

---

## 3. Developer SDK

The H1 SDK enables developers to build compliant, provenance-aware applications quickly by integrating AI agents with human validators.

**Why Build on H1:**
- **Instant Compliance**: HIPAA/GDPR/FDA rules enforced at protocol layer
- **Credential Verification**: Only verified experts can validate data in their domain
- **Revenue Automation**: Smart contracts handle all payments and splits
- **Audit Trails**: Every action recorded on-chain for regulators

**Quick Start Example:**

```typescript
import { H1SDK } from '@h1-labs/sdk';

// Initialize SDK
const sdk = new H1SDK(signer);

// Step 1: Create dataset with AI enrichment
const dataset = await sdk.createDataset({
  labId: 1,
  domain: "healthcare",
  baseModel: "mistral-7b",
  data: ecgReadings  // Your raw data
});

// Step 2: AI agent processes (automatic or custom)
const aiEnrichment = await sdk.agents.enrich(dataset, {
  model: "mistral-7b",
  prompt: "Analyze ECG for abnormalities"
});

// Step 3: Submit for human expert review
await sdk.validation.submitForReview(dataset.id, {
  supervisor: expertAddress,  // Board-certified cardiologist
  credentialId: 42            // Verified MD credential
});

// Step 4: Expert approves (done by validator)
await sdk.validation.approve(dataset.id, {
  deltaGain: 850,              // 8.5% improvement vs base model
  signature: expertSignature   // Cryptographic proof
});

// Step 5: Dataset is now verified and monetizable
const provenance = await sdk.getProvenance(dataset.id);
// Returns: { aiModel, humanExpert, credentials, signatures, deltaGain }
```

### 3.1 SDK Features

- **Dual‑Intelligence Orchestration (Agent + Human)**: Built‑in co‑workflow primitives (assignment, handoff, review), human sign‑off, and audit trails.  
- **Identity & Credential**: Integrate credential checks for validators.  
- **Compliance**: Bind HIPAA/GDPR/AEH/C2PA policies per dataset/lab for regulated and semi‑regulated markets.  
- **Provenance Hooks**: Record enrichment/validation events onchain.  
- **Revenue & Splits**: Simple APIs aligned with `RevenueFacet`.  
- **Credit Mode**: Fiat‑friendly abstraction that still settles onchain.

### 3.2 Dual‑Intelligence Dataflow (Δ‑Gain → Bundles → Buybacks)

1) App selects a base model (partner or BYO) via SDK adapters.  
2) Agent executes; credentialed human reviews and signs.  
3) SDK computes **Δ‑Gain** (supervised improvement vs declared base) and records provenance + attribution.  
4) H1 aggregates Δ‑Gain into dataset bundles and sells/licenses them.  
5) Revenue triggers buybacks that route to the originating Labs per policy, creating buy pressure for their H1 tokens.

---

## 4. Tokenomics & Economic Model

This section provides detailed mechanics of how $LABS and H1 interact within the platform's economic flywheel.

### Key Definitions:

- **$LABS (Singleton ERC‑20)**: Platform governance, staking, and lab creation asset. Stake to govern and seed labs.
- **H1 (Per‑Lab ERC‑20 Shares)**: Each Lab's `LabVault` is its own H1 token. Depositing $LABS mints H1 shares at NAV; redemptions return $LABS subject to cooldown and exit caps.  
- **Bonding Curve (Automatic)**: `BondingCurveSale` deployed automatically with each lab, providing instant liquidity with 10% of H1 supply.
- **Levels & App Slots**: LabVault tracks total assets to derive levels (L1/L2/L3) unlocking 1/2/3 app slots.

### 4.1 Automatic H1 Distribution on Lab Creation

When a lab is created (minimum 100K $LABS staked), H1 tokens are **automatically minted and distributed** (1:1 with staked LABS, max 500K):

| Recipient | Allocation | Vesting | Purpose |
|-----------|-----------|---------|---------|
| **Lab Owner** | **30%** | 6 months, weekly unlocks | Incentive for lab creation & management |
| **Bonding Curve** | **10%** | Liquid immediately | Trading liquidity, price discovery |
| **Scholar Reserve** | **40%** | Paid as work completes | Rewards for data validators |
| **Dev Reserve** | **15%** | Paid as work completes | Rewards for developers |
| **Protocol Treasury** | **5%** | Instant | Protocol operations & grants |
| **TOTAL** | **100%** | - | Complete allocation at creation |

**Lab Creation Flow:**
```
Stake 100K+ LABS → Create Lab → Automatic:
  ├─ Deploy LabVault (H1 token)
  ├─ Deploy Bonding Curve (trading)
  ├─ Mint 100K-500K H1 (1:1 with LABS)
  └─ Distribute: 30% owner + 10% curve + 40% scholars + 15% devs + 5% treasury
  
After Creation:
  ├─ Week 1+: Owner claims vested H1 (weekly unlocks)
  ├─ Day 1: Community trades H1 on bonding curve
  ├─ Ongoing: Scholars/Devs receive H1 as work completes
  └─ Revenue: Dataset sales → RevenueFacet Split → Buyback + NAV growth
```

### 4.2 Revenue Distribution Model

**Per-Dataset Sale Split:**
- **20%** → Data Creators (direct payment to contributors)
- **20%** → Scholars (direct payment to credentialed experts who enrich/validate data)
- **15%** → App Developers (SDK/app builders)
- **40%** → H1 Buyback (repurchases H1, distributed proportionally to all holders)
- **5%** → Protocol Treasury (operations & infrastructure)

> **Note on "Scholars":** In the H1 ecosystem, Scholars are credentialed domain experts who contribute to datasets in two ways: (1) **Data Creators** who collect and annotate raw data, and (2) **Enrichers/Validators** who review, validate, and improve data quality. Both roles require verified credentials matched to the domain they work in.

All payments automated via smart contract; transparent and auditable on-chain.

**Key Principle:** The 40% buyback repurchases H1 tokens from the market and distributes them proportionally to all H1 holders (including vested stakes). Hold H1 = benefit from appreciation. Sell H1 = miss future gains.

Economic intent: AI demand for verified datasets drives onchain payments that flow to Labs, creating sustainable revenue-driven economics.

---

### 4.3 Staking & Scholar Rewards

**$LABS serves three functions:**
1. **Lab Creation & Deposits**: Stake $LABS → mint H1 shares → unlock app slots and dataset economy
2. **Scholar Rewards**: Contribute to datasets → earn $LABS grants + lab-specific H1 tokens
3. **Governance**: Hold $LABS → vote on protocol upgrades (future DAO)

**Scholar Economics: Revenue Distribution Model**

When a dataset sells (e.g., $100K), revenue is split as follows:

```
$100K Dataset Sale → Revenue Distribution (100% Allocation)

├─ H1 Buyback (40% = $40K)
│  └─ Sent to buyback wallet
│     └─ Buyback bot repurchases H1 tokens from market
│     └─ H1 distributed proportionally to ALL H1 holders
│     └─ Benefits: Lab owner (staked), validators (staked), investors, anyone holding H1
│     └─ Example: If you hold 2% of H1 supply, you get 2% of buyback benefit
│        ├─ Lab owner with 30% vested stake: receives 30% of buyback ($12K)
│        ├─ Early investor with 10% stake: receives 10% of buyback ($4K)
│        ├─ Validator who staked 5%: receives 5% of buyback ($2K)
│        └─ Hold H1 = participate in appreciation | Sell H1 = miss future gains
│
├─ Data Creators (20% = $20K)
│  └─ Sent to creator pool wallet
│     └─ Distributed proportionally to Scholars who collected/enriched data
│     └─ Example: 50 data collectors share $20K based on contribution quality
│        ├─ High-quality contributor (10% of work): $2,000
│        ├─ Medium contributor (5% of work): $1,000
│        └─ All contributions tracked on-chain
│
├─ Scholars - Enrichers/Validators (20% = $20K)
│  └─ Sent to scholar pool wallet
│     └─ Distributed proportionally to credentialed Scholars who validated
│     └─ Example: Board-certified clinicians earn based on rigor of approval
│        ├─ Primary supervisor (60% of validation): $12,000
│        ├─ Secondary reviewer (40% of validation): $8,000
│        └─ All tracked via CredentialFacet
│
├─ App Developers (15% = $15K)
│  └─ Sent to developer wallet
│     └─ Rewards SDK builders, app creators
│     └─ Example: Team that built Scrubber app for healthcare
│
└─ Protocol Treasury (5% = $5K)
   └─ Sent to treasury wallet
      └─ Protocol operations, audits, infrastructure, grants
```

**Key Principle:**
Contributors, validators, and developers receive **direct payment** based on verified on-chain attribution. H1 holders benefit **proportionally** through buyback distribution—not by role, but by stake size. This aligns incentives: hold H1 long-term → maximize gains from all future dataset sales.

**Contributor Roles & Reward Streams**

|| Role | Function | Reward Mechanism | Payment Token | Examples |
||------|----------|------------------|---------------|----------|
|| **H1 Holders** | Stake $LABS to fund lab operations, provide liquidity | 40% of dataset sale revenue via buyback (proportional to stake) | H1 token appreciation (hold = gain, sell = miss) | Lab owner with 30% vested stake; early investors; Scholars who staked in their domain |
|| **Scholars (Data Creators)** | Collect, enrich, and annotate dataset entries | 20% of dataset sale revenue, proportional to contribution quality | Direct payment via smart contract | Healthcare startup collects de-identified records; robotics team gathers motion data |
|| **Scholars (Enrichers/Validators)** | Review, validate, and approve dataset for compliance | 20% of dataset sale revenue, quality-bonus multiplier for rigorous oversight | Direct payment via smart contract | Board-certified radiologist approves imaging dataset; roboticist signs off on safety data |
|| **App Developers** | Build apps using H1 SDK, integrate compliance | 15% of dataset sale revenue for SDK/app builders | Direct payment via smart contract | Team that built Scrubber app; robotics firm integrates DataValidationFacet |
|| **Data Buyers** | Purchase datasets, integrate into production models | Access to verified, compliant data with onchain provenance proof | Pay in ETH, USDC, or $LABS | AI company downloads healthcare dataset with full audit trail for FDA defense |

**Attribution & Credentialing**

Scholar contribution attribution is tracked through:
- **Credentialing Portal**: Verify domain expertise (medical licenses, legal credentials, certifications)
- **Onchain Provenance**: ProvenanceFacet logs each validator's enrichment/validation actions with timestamp
- **Quality Scoring**: Off-chain reputation system (future: onchain governance) scores contributions
- **Payment Distribution**: Treasury oracle aggregates contribution scores and distributes rewards proportionally

**Key Insight**: Scholar rewards are **real, proportional to contribution**, and **sustainable** because they're funded by actual dataset sales, not token inflation. Scarcity pressure from buybacks further benefits all contributors who hold H1.

This aligns incentives: more valuable contributions → higher reward tier; increased lab success → increased Scholar payouts; platform growth → sustained buyback pressure → all H1 holders gain.

---

### 4.4 H1 Tokens — Per-Lab Economies

**What is H1?**  
H1 is **not a single token.** Each lab deploys its own H1 token (LabVault shares) representing:
- Fractional ownership of that lab's treasury
- Claim on future dataset sale revenue
- Participation in that domain's ecosystem

> **📊 Detailed Example**: For Healthcare Lab H1 Token Appreciation (Year 1) and comparison with traditional stake-reward models, see **Appendix K**.

---

### 4.5 Bonding Curves — Automatic Deployment & Bootstrap Mechanics

**✨ NEW: Automatic Deployment on Lab Creation**

Every lab now gets a bonding curve automatically deployed at creation with **10% of initial H1 supply** pre-allocated for immediate trading:

```
Lab Creation Example (100K LABS staked):
├─ Total H1 Minted: 100,000 H1
├─ Bonding Curve Allocation: 10,000 H1 (10%)
├─ Initial Liquidity: Available immediately for trading
└─ Price: Starts at vault NAV × 1.005 (0.5% premium)
```

**Why Bonding Curves?**  
Auto-adjusting price pegged to vault NAV eliminates ICO-style pricing risks. The bonding curve:
- **Enables immediate trading** - No waiting for manual deployment
- **Provides price discovery** - Market finds fair value from day 1
- **Creates liquid market** - 10% supply available for buy/sell
- **Prevents manipulation** - Price tied to vault NAV, not speculation

**Formula:** `price_per_share = vault_NAV × 1.005`

**Initial Supply Breakdown:**
```
100,000 H1 Total Minted:
├─ 10,000 H1 (10%) → Bonding Curve (LIQUID)
│   └─ Available for immediate purchase
├─ 30,000 H1 (30%) → Lab Owner (VESTED, 6 months)
├─ 40,000 H1 (40%) → Scholar Reserve (VESTED)
├─ 15,000 H1 (15%) → Dev Reserve (VESTED)
└─ 5,000 H1 (5%) → Protocol Treasury (INSTANT)
```

**Fee Breakdown for Additional Purchases (Configurable)**  
When users buy MORE H1 beyond the initial 10% via bonding curve, the split is:
- **0-10% Protocol Fee**: Routed to treasury (configurable per lab, typically 5%)
- **0-10% POL Reserve**: Reserved for liquidity provisioning (configurable per lab, typically 5%)
- **Remainder (~80-90%)**: Deposited to vault at NAV, minting NEW H1 shares

**Trading Mechanics:**
1. **Initial 10% Supply**: First 10,000 H1 traded from pre-allocated supply
2. **After Initial Supply**: Bonding curve mints NEW H1 by depositing LABS to vault
3. **Price Increases**: As vault TVL grows, NAV increases, so does H1 price
4. **Slippage Protection**: minSharesOut parameter prevents frontrunning

**Redemption & Cooldown Mechanics**  
H1 shares purchased via bonding curve can be redeemed like any other H1:
- **Request Redemption**: Burn H1 shares, enter 7-day cooldown queue
- **Cooldown Period**: Default 7 days before $LABS can be claimed
- **Exit Caps**: Daily redemption limit (~20% of vault TVL per day) prevents sudden drains
- **Grace Period**: If redemptions exceed caps, system waits for next epoch or allows backfilling by new deposits

**Bonding Curve Advantages:**
✅ **Immediate Liquidity**: 10% supply tradeable from day 1  
✅ **Fair Pricing**: Tied to vault NAV, not arbitrary  
✅ **No Manual Setup**: Automatically deployed on lab creation  
✅ **Price Discovery**: Market determines fair value organically  
✅ **Anti-Manipulation**: NAV-based pricing prevents pumps/dumps

---

### 4.6 H1 Swap Fees — Staking & Unstaking Costs

**Fee Structure (Hardcoded Defaults + Admin-Configurable)**

When you **stake $LABS** (deposit to mint H1) or **unstake** (redeem H1 to get $LABS back), H1 Labs charges modest fees split between the lab owner and H1 protocol:

**Staking Fees (Deposits):**
```
User deposits: $1,000 LABS
├─ Lab Owner Fee: 1.5% = $15
├─ H1 Treasury Fee: 1% = $10
└─ Into Vault (Net): $975
   └─ H1 shares minted: ~975 at NAV
```

**Unstaking Fees (Redemptions):**
```
User redeems after 7-day cooldown: $1,000 LABS
├─ Lab Owner Fee: 1.5% = $15
├─ H1 Treasury Fee: 1% = $10
└─ User Receives (Net): $975
```

**Total Effective Cost:**
- **Per transaction**: 2.5% (1.5% + 1%)
- **For round-trip** (stake + unstake): ~4.9% (after rounding)
- **Comparable to**: Uniswap (0.3-1%), traditional brokerage fees (1-2%)

**Why These Fees?**

| Recipient | Allocation | Purpose |
|-----------|-----------|---------|
| **Lab Owner** | 1.5% | Incentivizes lab creation & management; funds operational costs |
| **H1 Treasury** | 1% | Protocol development, audits, infrastructure, and ecosystem grants |

**Configurability**

Labs can adjust fees (within limits) via admin function:
```solidity
setFees(
  depositLabOwnerBps,      // e.g., 150 (1.5%)
  depositTreasuryBps,      // e.g., 100 (1%)
  redemptionLabOwnerBps,   // e.g., 150 (1.5%)
  redemptionFeeTreasuryBps // e.g., 100 (1%)
)
```

**Examples:**
- Conservative labs: 1% + 0.5% = 1.5% total
- Growth labs: 2% + 1% = 3% total (maximum safe within best practices)
- Institutional labs: Custom per governance

---

### 4.7 Unstaking Flow — Overview

To prevent bank run risks where 100% of stakeholders exit simultaneously, H1 uses a **three-phase redemption flow** with grace periods and backfill mechanics:

**Phase 1: Request Redemption**  
- Call `requestRedeem(h1_shares)` → H1 shares burned immediately, LABS locked for 7-day cooldown
- Exit cap enforced: Max 20% of TVL per day prevents sudden drains
- Receive `requestId` for later claiming

**Phase 2: Grace Period (7 Days)**  
- Your LABS reserved in vault (marked "pending exit")
- Can cancel redemption if you change your mind
- New stakers can deposit via bonding curve during this time

**Phase 3: Claim or Backfill**  
- **Normal Claim**: After 7 days, call `claimRedeem(requestId)` → receive LABS minus ~0.5% fee
- **Backfill**: New stakers can call `fillRedeem(requestId)` to provide your LABS immediately (before Day 7), earning H1 shares at NAV + 0.5% premium

**Why This Works:**  
- Prevents panic exits that would collapse the vault
- Allows new capital to provide liquidity to existing unstakers  
- Protects long-term holders from sudden dilution
- Exit caps (20% TVL/day) + cooldowns (7 days default, configurable) ensure smooth, predictable exits

> **📘 Full Technical Documentation**: For detailed mechanics, backfill incentives, exit cap resets, and configuration options, see `/docs/REDEMPTION_GUIDE.md`

---

## 5. Economic Flywheel

The H1 economy is designed as a **closed loop** that continuously strengthens as adoption increases:

```
Lab Creation Phase
├─ Founder deposits $LABS → creates Lab with LabVault (H1 token)
├─ Founder receives initial H1 shares (100% if sole depositor)
└─ Lab reaches Level 1 when TVL ≥ $100K

Community Growth Phase
├─ Others deposit $LABS into vault at current NAV
├─ They receive H1 shares, ownership dilutes proportionally
└─ Lab reaches Level 2/L3 as capital accumulates ($250K/$500K+)

Dataset Monetization Phase
├─ App generates dataset, validators enrich/validate
├─ Dataset sells to AI company (e.g., $100K)
└─ Revenue triggers proportional distribution

Distribution Phase
├─ Lab Owner + Scholars: $50K (50% of sale)
│  └─ Split proportionally by contribution score
│  └─ Paid in lab-native H1 tokens → increases vault assets
├─ Protocol Treasury: $25K (25% of sale)
│  └─ Held for grants, protocol ops, infrastructure
└─ Buyback Reserve: $25K (25% of sale)
   └─ Retained for future supply reduction

Token Appreciation Phase
├─ Lab's TVL grows: $100K → $150K (from $50K lab revenue)
├─ H1 NAV increases: more assets backing each share
├─ Buyback execution: $25K used to repurchase H1
├─ H1 supply decreases → scarcity increases value
└─ Early H1 holders gain from:
   ├─ NAV appreciation (dataset sale revenue)
   ├─ Supply reduction (buybacks)
   └─ Compounding effect (higher NAV × lower supply)

Flywheel Acceleration
├─ H1 tokens now worth more → attracts new founders
├─ New labs created with $LABS → platform activity increases
├─ More Scholars → higher quality data → higher sale prices
└─ Cycle repeats at larger scale with higher velocity
```

### **Key Mechanics**

1. **Ownership is Fractional**: H1 shares represent % ownership of lab treasury; dilutes with new deposits
2. **Buyback Benefits All Holders**: 40% of revenue → buyback → distributed proportionally to all H1 holders (not by role)
3. **Direct Payments by Role**: Creators (20%), Scholars (20%), Developers (15%), Treasury (5%) paid immediately via smart contract
4. **Hold Incentive**: Hold H1 = participate in all future buybacks; Sell H1 = miss appreciation
5. **Compounding Growth**: NAV ↑ + Supply ↓ = exponential appreciation
6. **Sustainability Loop**: Real dataset sales → real revenue → real token appreciation (no inflation)

> **📊 Detailed Example**: For a month-by-month breakdown of a healthcare lab's Year 1 performance (44.1% ROI), see **Appendix G**.

---

## 6. Roadmap (Condensed)

| Phase | Milestone | Highlights |
|------|-----------|------------|
| Prototype | Testnet diamond + UI demo | LABS set, createLab, auto‑vault, deposits/redemptions |
| MVP | Provenance + Revenue flows | Credential gating, RevenueFacet splits, initial SDK hooks |
| Post‑MVP | Governance + Credits | DAO/Compliance upgrades, Credit mode, explorer & analytics |

---

## 7. Dataset Marketplace

> **For AI Companies & Data Buyers**: The Dataset Marketplace enables enterprise and AI firms to discover, evaluate, and purchase verified datasets with transparent, on-chain revenue distribution.

### **The Marketplace Experience**

**Browse Verified Datasets:**
- Filter by domain (Healthcare, Finance, Legal, Robotics, Art)
- Sort by quality score, delta-gain, price, or availability
- Search by dataset name, creator, or compliance standard
- View full provenance: creator, supervisor, regulatory approvals

**Evaluate Before Buying:**
```
Each dataset displays:
├─ Quality Score (80-99%)
├─ Delta-Gain vs. GPT-4 baseline (e.g., +8.24%)
├─ Creator Name & Credential ID
├─ Supervisor Name & Credential ID
├─ Compliance Standards (HIPAA, GDPR, FDA, C2PA, etc.)
├─ Data Points (10K, 50K, 100K+)
├─ Revenue History (transparent pricing)
└─ On-Chain Provenance (IPFS hash, creator address, supervisor address)
```

**Bulk Purchase & Batch Discount:**
```
1 dataset:    Full price (e.g., $2,500)
2 datasets:   Full price
3+ datasets:  5% bulk discount applies automatically
Example:      3 × $2,500 = $7,500 → 5% off = $7,125 total
```

**Pay with Multiple Assets:**
- **ETH** (primary, recommended)
- **USDC / USDT** (stablecoins)
- **$LABS** (protocol token at current rate)

### **Revenue Distribution Model: Per-Dataset, Per-Lab**

When a dataset is purchased, the revenue is distributed **per-dataset to that specific dataset's lab owner** according to the following model:

```
Purchase Price: $X
Distribution (per RevenueFacet.sol):

├─ H1 Buyback:         40% ($0.40X)        → Buyback wallet (distributed proportionally to all H1 holders)
├─ Data Creators:      20% ($0.20X)        → Creator pool wallet (direct payment to Scholars who create data)
├─ Scholars (Enrichers/Validators): 20% ($0.20X) → Scholar pool wallet (direct payment to Scholars who validate)
├─ App Developers:     15% ($0.15X)        → Developer wallet (SDK/app builders)
└─ Protocol Treasury:   5% ($0.05X)        → Treasury wallet (operations & infrastructure)
                       ─────────────
Total:                 100% ($1.00X)

All payments automated, transparent, and auditable on-chain.

**Key:** Buyback benefits all H1 holders proportionally (not by role). Hold H1 = earn from all sales.
```

> **📋 Detailed Examples**: For step-by-step examples of $10K dataset purchase, bulk purchase mechanics, and payout timelines, see **Appendix H**.

### **Per-Dataset, Per-Lab Mechanics**

**Key Principle:** Each dataset is linked to exactly one lab. Revenue flows to that lab's owner and vault.

```
Dataset ID    Lab ID    Lab Owner              Purchase Price    Lab Receives
─────────────────────────────────────────────────────────────────────────────
ds_001        1         Cleveland Clinic       $4,500           $2,250 (50%)
ds_002        2         Mayo Cardiology        $3,500           $1,750 (50%)
ds_003        1         Cleveland Clinic       $2,000           $1,000 (50%)
              
Lab 1 Total Revenue: $3,250 (from 2 datasets)
Lab 2 Total Revenue: $1,750 (from 1 dataset)
```

**Why Per-Lab?**
- Each lab has its own economics and staking pool
- Datasets are created within a specific domain lab
- Lab owners directly benefit from their own datasets being purchased
- Incentivizes labs to produce high-quality, marketable datasets

### **Transparency & On-Chain Verification**

Every dataset purchase emits events that can be verified on the blockchain:

```solidity
event RevenueDistributed(
  uint256 indexed datasetId,
  uint256 indexed labId,
  uint256 buybackAmount,      // 40% - H1 buyback (proportional to all holders)
  uint256 developerAmount,    // 15% - App/SDK developers
  uint256 creatorAmount,      // 20% - Data creators/collectors
  uint256 scholarAmount,      // 20% - Validators/supervisors
  uint256 treasuryAmount      // 5% - Protocol treasury
)
```

**Users can verify:**
✓ Transaction hash on Etherscan  
✓ Lab owner address received correct amount  
✓ Exact breakdown of all payments  
✓ Link to dataset provenance (IPFS hash)  
✓ Creator and supervisor credentials on-chain  

### **Why This Model Works**

| Stakeholder | Incentive |
|-------------|-----------|
| **H1 Holders** | 40% buyback distributed proportionally; hold = earn from all sales, sell = miss gains |
| **Data Creators (Scholars)** | Direct 20% of revenue; reputation and payment tied to dataset quality & sales |
| **Enrichers/Validators (Scholars)** | Direct 20% of revenue; incentivized to approve only high-quality, compliant data |
| **Developers** | Direct 15% of revenue; rewards for building apps/SDK that generate dataset sales |
| **Buyers** | Bulk discounts, transparent pricing, on-chain provenance verification |
| **Protocol** | 5% treasury ensures sustainable operations; no inflationary tokenomics |

### **Compliance & Auditability**

Every dataset purchase is:
- ✓ **On-chain**: Transaction recorded immutably
- ✓ **Transparent**: Revenue split visible to all parties
- ✓ **Traceable**: Links to creator credentials, supervisor credentials, and lab ownership
- ✓ **Auditable**: Enterprise customers can verify revenue destination
- ✓ **Compliant**: Enforced HIPAA/GDPR/FDA/C2PA rules per domain

---

## 8. Closing

H1 Labs unites verifiable human expertise with transparent token economics. By making provenance, credentialing, and compliance the substrate for AI data, we unlock trustworthy, enterprise‑grade datasets — and a sustainable crypto economy that rewards the people who create real intelligence.

The dual-token model ($LABS + H1), combined with revenue-driven buybacks and level-based app slots, creates a self-reinforcing flywheel where early adopters and high-quality validators are rewarded proportionally. This is not speculative tokenomics — it is provable economics tied to real dataset sales in regulated markets.

---

# APPENDIX

## A. Our Edge — Strengths at a Glance

- **Provenance by Design**: Every enrichment and validation emits an onchain trace (who, when, what).  
- **Credentialed Humans**: Domain experts verified via the Credentialing Portal; no anonymous crowdwork for regulated data.  
- **Programmable Compliance**: Domain rules are enforced at the contract layer (HIPAA, GDPR, AEH, C2PA).  
- **Dual‑Intelligence SDK (Agent + Human)**: Apps pair an agent with credentialed human oversight for compliant workflows in regulated and semi‑regulated markets.  
- **Two‑Token Model ($LABS ↔ H1)**: $LABS governs and stakes; each Lab's H1 token is its vault share, enabling per‑lab economies.  
- **Modular Diamond Architecture**: EIP‑2535 facets make the system upgradeable, auditable, and extensible.  
- **Enterprise‑friendly UX**: SDK credit mode abstracts blockchain for Web2‑style apps.

---

## B. What You Can Do on H1

- **Create a Lab**: Stake and launch a domain Lab with its own H1 token (vault shares).  
- **Enrich & Validate**: Contribute to datasets; validators with credentials approve quality.  
- **Buy/Access Data**: AI firms purchase verified datasets; payments route transparently to stakeholders.  
- **Build Apps**: Use the H1 SDK to ship compliant, provenance‑aware applications quickly.

---

## C. Competitive Positioning — H1 vs The Field

H1 Labs uniquely combines **verified human intelligence, provenance, and compliance**. Unlike peers that focus on compute (Gensyn), model training (Bittensor), or data liquidity (Ocean), H1 targets regulated and semi-regulated markets with enterprise-grade trust.

**Why it matters:** H1's compliance-first approach opens regulated markets (healthcare TAM ~$200B+ in data licensing) that competitors cannot access. Programmable compliance means SDKs launch in regulated sectors without custom legal wrangling.

---

## D. Risks & Mitigations

- **Regulatory**: Programmable compliance facets; credential gating; audit logs.  
- **Liquidity**: POL/treasury custody and buyback budget design; exit caps and cooldowns.  
- **Security**: Standard diamond controls, guards, and progressive audits.
- **Adoption**: Scholar network effects + partnership incentives; credentialing portal lowers barriers.

---

## E. User Flows

1) **Lab Founder**  
\`\`\`
Connect Wallet → Stake 100K+ LABS
Step 1: createLabStep1(name, symbol, domain) → deploys LabVault
Step 2: createLabStep2(labId) → deploys BondingCurve + distributes H1
Result: Lab operational with vault, curve, and H1 distributed
Optional: deployLabPass(labId) for membership NFTs
\`\`\`

2) **Contributor / Scholar (Data Creator or Enricher/Validator)**  
\`\`\`
Sign up → Credentialing Portal (license/ID) → whitelisted for domain
Contribute/validate via apps (Scrubber, Second Opinion+, etc.)
Onchain provenance + rewards tracked to wallet
\`\`\`

3) **AI Buyer / Enterprise**  
\`\`\`
Discover datasets → purchase/license via RevenueFacet‑integrated flows
Revenue split: 20% Creators | 20% Scholars | 15% Developers | 40% H1 Buyback | 5% Treasury
Auditable provenance & compliance artifacts for due diligence
\`\`\`

---

## F. Use Cases & Scenarios

**H1 Labs enables verified data creation across multiple domains:**

- **Healthcare**: Scrubber (de‑identification), Second Opinion+ (AI‑human consultation), Imaging annotation
- **Creative & Gaming**: Provenance frameworks for art and game assets (C2PA‑aligned), attribution and licensing onchain
- **Robotics & Industrial**: Motion/vision datasets with validated safety metadata
- **Legal & Financial**: Compliance-verified datasets (GDPR, AML/KYC aligned)
- **Education & Research**: FERPA-compliant educational datasets with attribution

---

## K. Healthcare Lab H1 Token Appreciation (Year 1)

**Example — Healthcare Lab after Year 1:**

```
Initial: $5M TVL, 1M H1 shares, $5.00/share
├─ Dataset revenue: $5M annually (50 datasets sold)
├─ Buyback budget deployed: $1.25M (25% of revenue)
├─ Lab revenue retained: $2.5M (50%)
├─ New TVL: ~$8.5M
├─ New NAV: $8.50/share (+70%)
└─ If buybacks reduce supply 5%: $8.88/share (+77.6% total)

Result: Early H1 holders gain from:
✓ Increasing NAV (more datasets sold)
✓ Supply reduction (buybacks)
✓ Sustainable token economy (real revenue, not inflation)
```

**Why H1 ≠ Traditional Stake-Reward Models:**

| Mechanic | H1 Labs | Competitors (Bittensor, Ocean) |
|----------|---------|--------|
| **Value Source** | Real dataset sales | Inflationary rewards |
| **Supply** | Decreases (buybacks) | Increases (new issuance) |
| **Price Pressure** | Buy pressure from revenue | Sell pressure from inflation |
| **Sustainability** | Revenue-driven (durable) | Reward-dependent (temporary) |

---

## L. Frequently Asked Questions — On-Chain Data & Querying

### **On-Chain Data & Querying**

**Q: How do I query the H1 token info after deployment?**

A: Every H1 token (LabVault) is a standard ERC-20 contract on the blockchain. You can view its information anytime:

- **Token name** (e.g., "Healthcare Lab H1")
- **Token symbol** (e.g., "H1HC")
- **Total supply** (all H1 shares in circulation)
- **Your balance** (how many H1 shares you own)
- **Exchange rate** (LABS per share = NAV)

All readable directly from the blockchain with zero cost. See **Section 2.5: Reading Lab Data On-Chain** for complete list of available data points.

---

**Q: How do I check lab level and app slots?**

A: Lab level is based on **total vault TVL at the time of creation**, but can increase if the vault grows:

| Level | TVL Range | App Slots |
|-------|-----------|-----------|
| L1 | 100K–250K LABS | 1 |
| L2 | 250K–500K LABS | 2 |
| L3 | 500K+ LABS | 3 |

**Example:** A lab created with 200K LABS starts at Level 1. If community deposits push TVL to 300K, it automatically unlocks to Level 2 (2 app slots). This is tracked on-chain and queryable from the vault contract.

---

**Q: How do I read vault state on-chain?**

A: Every LabVault stores the following information you can read anytime (no gas cost):

**Core Metrics:**
- Total TVL (LABS locked in vault)
- Total H1 supply (shares outstanding)
- Current NAV (LABS per H1 share)
- Current level (1, 2, or 3)

**Safety Settings:**
- Redemption cooldown (e.g., 7 days)
- Daily exit cap (e.g., 20% of TVL per day)

**Your Position:**
- Your H1 balance
- Your pending redemptions and unlock times
- Your projected value (balance × NAV)

All queryable directly from the blockchain. No indexer needed, 100% truth from smart contracts. Historical data available via Blockscout block explorer.

---
