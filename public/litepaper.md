# **H1 Labs — Litepaper**  
> Status: Updated 2025-10-24 | SDK section moved before Tokenomics | Revenue splits corrected to 20%/20%/15%/40%/5%

### Advancing AI through provable, human‑validated data — powered by blockchain.

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

## 2. User Flows

1) Lab Founder  
```
Connect Wallet → createLab(name, symbol, domain) → auto‑deploys LabVault (H1)
Deposit $LABS → mint H1 shares → reach Level thresholds → unlock app slots
Optional: deploy BondingCurve for bootstrap; deploy LabPass for identity
```

2) Contributor / Validator  
```
Sign up → Credentialing Portal (license/ID) → whitelisted for domain
Contribute/validate via apps (Scrubber, Second Opinion+, etc.)
Onchain provenance + rewards tracked to wallet
```

3) AI Buyer / Enterprise  
```
Discover datasets → purchase/license via RevenueFacet‑integrated flows
Revenue split: 20% Creators | 20% Validators | 15% Developers | 40% H1 Buyback | 5% Treasury
Auditable provenance & compliance artifacts for due diligence
```

---

## 3. Technical Architecture

### 3.1 Credentialing & Data Validation

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

### 3.2 Smart Contract Architecture

### **Global Architecture: Diamond Pattern (EIP-2535)**

The H1 Labs protocol uses the **Diamond Pattern** for modular, upgradeable smart contracts:

```
H1Diamond (Proxy Router)
    ├─ DiamondCutFacet (add/remove facets)
    ├─ DiamondLoupeFacet (inspect facet functions)
    ├─ OwnershipFacet (admin controls)
    ├─ SecurityFacet (access control)
    ├─ LABSCoreFacet (create labs)
    ├─ VaultFacet (deploy per-lab vaults)
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

**When a user creates a lab:**

```
User calls: createLab("MediTrust", "MEDI", "medical")
     ↓
LABSCoreFacet.createLab() (global facet on H1Diamond)
     ├─ Creates Lab record (stored in LibH1Storage)
     ├─ Deploys NEW LabVault contract
     │  └─ Location: /contracts/vaults/LabVault.sol
     │  └─ Instance: 0xABC123... (unique per lab)
     │  └─ Contains: ERC20-style H1 token logic, deposit/redemption mechanics
     │  └─ Features: Cooldown periods, exit caps, level tracking, fee management
     ├─ Deploys NEW BondingCurveSale contract (optional)
     │  └─ Location: /contracts/sales/BondingCurveSale.sol
     │  └─ Enables: Accelerated capital raise with 0.5% premium
     └─ Stores addresses: labIdToVault[labId] = LabVault, labIdToPass[labId] = null

Result: Lab now has its own vault + optional bonding curve
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

### 3.3 Lab Creation & Growth Mechanics

### **Lab Lifecycle & Ownership**

Creating a Lab unlocks automatic tokenomics with built-in distribution:

**Stage 1: Lab Creation & Automatic H1 Distribution** ✨ **NEW**  
Lab creator calls `createLab(name, symbol, domain)` with **minimum 100,000 LABS staked**. The system automatically:

1. **Deploys LabVault** (H1 token contract)
2. **Deploys Bonding Curve** (enables immediate H1 trading)
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
├─ Lab owner/validators: $50K (flows to vault)
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

### 3.4 Technical Features & Security

- **Reentrancy Guards:** Shared via `LibH1Storage.reentrancyStatus` where needed (e.g., `RevenueFacet`).  
- **Upgradeable by Facet:** New domains or policy changes can be added without migrating state.  
- **Guardian Controls:** Cooldowns, daily exit caps, and pause mechanisms at the vault level.  
- **Security & Introspection:** Standard Diamond Loupe, Ownership, Security facets.
- **Price Bounds Protection:** Bonding curve prevents price manipulation via MIN/MAX bounds and 50% max change per tx.
- **Pause Mechanism:** Emergency admin controls for security incidents.

---

## 4. Developer SDK

The H1 SDK enables developers to build compliant, provenance-aware applications quickly by integrating AI agents with human validators.

**Why Build on H1:**
- **Instant Compliance**: HIPAA/GDPR/FDA rules enforced at protocol layer
- **Credential Verification**: Only verified experts can validate data in their domain
- **Revenue Automation**: Smart contracts handle all payments and splits
- **Audit Trails**: Every action recorded on-chain for regulators

### 4.1 SDK Features

- **Dual‑Intelligence Orchestration (Agent + Human)**: Built‑in co‑workflow primitives (assignment, handoff, review), human sign‑off, and audit trails.  
- **Identity & Credential**: Integrate credential checks for validators.  
- **Compliance**: Bind HIPAA/GDPR/AEH/C2PA policies per dataset/lab for regulated and semi‑regulated markets.  
- **Provenance Hooks**: Record enrichment/validation events onchain.  
- **Revenue & Splits**: Simple APIs aligned with `RevenueFacet`.  
- **Credit Mode**: Fiat‑friendly abstraction that still settles onchain.

### 4.2 Dual‑Intelligence Dataflow (Δ‑Gain → Bundles → Buybacks)

1) App selects a base model (partner or BYO) via SDK adapters.  
2) Agent executes; credentialed human reviews and signs.  
3) SDK computes **Δ‑Gain** (supervised improvement vs declared base) and records provenance + attribution.  
4) H1 aggregates Δ‑Gain into dataset bundles and sells/licenses them.  
5) Revenue triggers buybacks that route to the originating Labs per policy, creating buy pressure for their H1 tokens.

---

## 5. Tokenomics & Economic Model

This section provides detailed mechanics of how $LABS and H1 interact within the platform's economic flywheel.

### Key Definitions:

- **$LABS (Singleton ERC‑20)**: Platform governance, staking, and lab creation asset. Stake to govern and seed labs.
- **H1 (Per‑Lab ERC‑20 Shares)**: Each Lab's `LabVault` is its own H1 token. Depositing $LABS mints H1 shares at NAV; redemptions return $LABS subject to cooldown and exit caps.  
- **Bonding Curve (Automatic)**: `BondingCurveSale` deployed automatically with each lab, providing instant liquidity with 10% of H1 supply.
- **Levels & App Slots**: LabVault tracks total assets to derive levels (L1/L2/L3) unlocking 1/2/3 app slots.

### 5.1 Automatic H1 Distribution on Lab Creation

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

### 5.2 Revenue Distribution Model

**Per-Dataset Sale Split:**
- **20%** → Data Creators (direct payment to contributors)
- **20%** → Validators/Supervisors (direct payment to credentialed experts)
- **15%** → App Developers (SDK/app builders)
- **40%** → H1 Buyback (repurchases H1, distributed proportionally to all holders)
- **5%** → Protocol Treasury (operations & infrastructure)

All payments automated via smart contract; transparent and auditable on-chain.

**Key Principle:** The 40% buyback repurchases H1 tokens from the market and distributes them proportionally to all H1 holders (including vested stakes). Hold H1 = benefit from appreciation. Sell H1 = miss future gains.

Economic intent: AI demand for verified datasets drives onchain payments that flow to Labs, creating sustainable revenue-driven economics.

---

### 5.3 Staking & Validator Rewards

**$LABS serves three functions:**
1. **Lab Creation & Deposits**: Stake $LABS → mint H1 shares → unlock app slots and dataset economy
2. **Validation Rewards**: Contribute to datasets → earn $LABS grants + lab-specific H1 tokens
3. **Governance**: Hold $LABS → vote on protocol upgrades (future DAO)

**Validator Economics: Revenue Distribution Model**

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
│     └─ Distributed proportionally to contributors who collected/enriched data
│     └─ Example: 50 data collectors share $20K based on contribution quality
│        ├─ High-quality contributor (10% of work): $2,000
│        ├─ Medium contributor (5% of work): $1,000
│        └─ All contributions tracked on-chain
│
├─ Validators/Supervisors (20% = $20K)
│  └─ Sent to scholar pool wallet
│     └─ Distributed proportionally to credentialed experts who validated
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
|| **H1 Holders** | Stake $LABS to fund lab operations, provide liquidity | 40% of dataset sale revenue via buyback (proportional to stake) | H1 token appreciation (hold = gain, sell = miss) | Lab owner with 30% vested stake; early investors; validators who staked in their domain |
|| **Data Creators** | Collect, enrich, and annotate dataset entries | 20% of dataset sale revenue, proportional to contribution quality | Direct payment via smart contract | Healthcare startup collects de-identified records; robotics team gathers motion data |
|| **Validators/Supervisors** | Review, validate, and approve dataset for compliance | 20% of dataset sale revenue, quality-bonus multiplier for rigorous oversight | Direct payment via smart contract | Board-certified radiologist approves imaging dataset; roboticist signs off on safety data |
|| **App Developers** | Build apps using H1 SDK, integrate compliance | 15% of dataset sale revenue for SDK/app builders | Direct payment via smart contract | Team that built Scrubber app; robotics firm integrates DataValidationFacet |
|| **Data Buyers** | Purchase datasets, integrate into production models | Access to verified, compliant data with onchain provenance proof | Pay in ETH, USDC, or $LABS | AI company downloads healthcare dataset with full audit trail for FDA defense |

**Attribution & Credentialing**

Validator contribution attribution is tracked through:
- **Credentialing Portal**: Verify domain expertise (medical licenses, legal credentials, certifications)
- **Onchain Provenance**: ProvenanceFacet logs each validator's enrichment/validation actions with timestamp
- **Quality Scoring**: Off-chain reputation system (future: onchain governance) scores contributions
- **Payment Distribution**: Treasury oracle aggregates contribution scores and distributes rewards proportionally

**Key Insight**: Validator rewards are **real, proportional to contribution**, and **sustainable** because they're funded by actual dataset sales, not token inflation. Scarcity pressure from buybacks further benefits all contributors who hold H1.

This aligns incentives: more valuable contributions → higher reward tier; increased lab success → increased validator payouts; platform growth → sustained buyback pressure → all H1 holders gain.

---

### 5.4 H1 Tokens — Per-Lab Economies

**What is H1?**  
H1 is **not a single token.** Each lab deploys its own H1 token (LabVault shares) representing:
- Fractional ownership of that lab's treasury
- Claim on future dataset sale revenue
- Participation in that domain's ecosystem

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

### 5.5 Bonding Curves — Automatic Deployment & Bootstrap Mechanics

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

### 5.6 H1 Swap Fees — Staking & Unstaking Costs

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

### 5.7 Unstaking Flow — The Three Phases & Backfill Mechanism

> **⚠️ Note:** This section contains extensive technical details about redemption mechanics. For a high-level overview, see Section 6.92. Full documentation will be moved to `/docs/REDEMPTION_GUIDE.md` in a future update.

**Why the Three-Phase Flow?**

Simple unstaking (deposit → immediate redemption) creates bank run risks. If 100% of stakeholders exit at once, the vault collapses and all benefits disappear. H1 uses a **three-phase redemption flow** with **grace periods** and **backfill mechanics** to:
- Prevent panic exits
- Preserve lab economics during exits
- Allow new stakers to provide liquidity to existing unstakers
- Protect long-term holders from sudden dilution

---

**Phase 1: Request Redemption (Immediate, but Queued)**

When you want to unstake:

```
Call: requestRedeem(h1_shares)

What Happens:
├─ Your H1 shares are burned immediately
├─ LABS amount calculated at current NAV
├─ Redemption request created with unique requestId
├─ unlockTime = current_time + 7 days (default cooldown)
├─ Assets marked as "pending exit" in vault accounting
└─ Exit cap checked: (if exit + others exceed cap, rejected)

You Receive:
└─ requestId to use for later claiming
```

**Key Point**: Your shares are gone immediately, but your LABS are **locked for 7 days**. This is not a delay—it's a **grace period** that protects the lab.

**Exit Cap Check** (Happens at Request Time):
```
Lab TVL: $1,000,000
Daily Exit Cap: 20% = $200,000/day (resets every 24 hours)

Day 1, Scenario:
├─ Alice requests: 50K LABS  → Approved (50K ≤ 200K)
├─ Bob requests: 100K LABS   → Approved (150K ≤ 200K)
├─ Carol requests: 60K LABS  → REJECTED (210K > 200K)
│                                 │
│                                 └─ Error: "epoch cap exceeded"
│                                    Must wait for tomorrow's epoch
└─ Carol can try again in 24 hours
```

---

**Phase 2: Grace Period / Cooldown (7 Days of Waiting)**

During the cooldown:

```
Timeline:

Day 0 (Request):     Your shares burned, LABS locked
Days 1-6 (Grace):    Waiting period... you CAN still:
                     ├─ Change your mind: Cancel redemption
                     │  └─ H1 shares re-minted at current NAV
                     └─ Check market: See if bonding curve is raising capital
Day 7 (Eligible):    Unlock time reached ✓
                     Now you can either:
                     ├─ Claim LABS (normal path)
                     └─ Get backfilled (automatic path)
```

**Why 7 Days?**
- Gives lab time to attract new capital via bonding curve
- Allows arbitrage: savvy stakers see redemptions → deposit via curve → backfill unstakers
- Prevents flash-loan attacks
- Smooths outflows over time

**What About Your Assets During Grace?**
- Your LABS are **held in vault** but marked as "pending exit"
- They **cannot be touched** by you or anyone
- The lab **cannot use them** for new investments
- They're "reserved" for you to claim

---

**Phase 3: Claim or Get Backfilled**

After 7 days, **two paths**:

#### **Path A: Normal Claim (You Get Your LABS Back)**

```
Call: claimRedeem(requestId)

What Happens:
├─ Cooldown check passed ✓
├─ Your LABS transferred to your wallet
├─ Redemption fee deducted (0.25-0.5% default)
├─ "Pending exit" cleared from vault
└─ NAV potentially updated (vault shrinks)

You Receive:
└─ LABS - fee back to wallet
```

**Example:**
- Requested: 100 H1 shares (= ~100 LABS at NAV $1.00)
- After 7 days, NAV = $1.10
- Claim value: 100 × $1.10 = $110 LABS
- Fee (0.5%): ~$0.55
- You get: ~$109.45 LABS

#### **Path B: Backfill (Someone Else Fills Your Order)**

This is where the **bonding curve connects to unstaking**:

```
Scenario:
├─ You requested redemption on Day 0
├─ On Day 3: New investor (Bob) deposits via bonding curve
│  ├─ Bob sends $LABS via BondingCurveSale
│  ├─ Gets H1 shares + small premium
│  ├─ Protocol fees/POL deducted
│  └─ Remainder goes to vault (grows TVL)
│
├─ Bob notices your pending redemption request
├─ Bob calls: fillRedeem(your_requestId)
│  ├─ Bob sends your_redeem_amount directly to you
│  ├─ You receive LABS immediately (no wait!)
│  ├─ Bob keeps his H1 shares
│  └─ Your redemption marked "claimed"
│
└─ Result: You get LABS before Day 7, Bob provides liquidity
```

**Code Level (What Happens)**:
```javascript
fillRedeem(requestId, receiver) {
  // Bob sends LABS directly to the original redeemer (you)
  transfer(labsToken, bob, you, assets);
  
  // Mark your redemption as fulfilled
  redeemRequests[requestId].claimed = true;
  
  // Remove from pending exit queue
  pendingExitAssets -= assets;
}
```

**Incentives for Backfilling:**
- Bob deposits at bonding curve price (NAV + 0.5% premium)
- Bob gets H1 shares to hold/trade
- Bob can immediately backfill pending redemptions
- If NAV appreciates, Bob's shares are worth more
- Bob's action helps other unstakers (social good)

---

**Putting It Together: Full Unstaking Timeline**

```
┌──────────────────────────────────────────────────────────────────┐
│ NORMAL UNSTAKING (No Backfill)                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ Day 0:  Alice stakes 100K LABS                                   │
│         ├─ Gets 100K H1 shares (NAV = $1.00)                    │
│         └─ Labs TVL: $1,000,000                                  │
│                                                                   │
│ Month 6: Alice wants to exit                                     │
│          ├─ NAV now $1.25 (revenue accrued)                     │
│          ├─ H1 value: 100K × $1.25 = $125K                     │
│          └─ Calls: requestRedeem(100K)                          │
│             └─ Receives: requestId = #42                        │
│                LABS locked: $125K                                │
│                unlockTime: now + 7 days                          │
│                                                                   │
│ Days 1-6: Grace period (exit cap = 20% = $200K/day)             │
│           ├─ No exits hit cap today                              │
│           └─ Alice can cancel if she changes mind                │
│                                                                   │
│ Day 7:    Alice claims                                           │
│           ├─ Call: claimRedeem(42)                              │
│           ├─ Fee deducted: $125K × 0.5% = $625                 │
│           └─ Alice receives: ~$124,375 LABS ✓                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ BACKFILLED UNSTAKING (With New Capital)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ Day 0:  Alice stakes 100K LABS                                   │
│         └─ Gets 100K H1 shares                                   │
│                                                                   │
│ Month 6: Alice requests redemption                               │
│          ├─ requestRedeem(100K)                                  │
│          ├─ LABS locked: $125K                                  │
│          └─ requestId: #42                                       │
│                                                                   │
│ Day 2:   Bob sees opportunity                                    │
│          ├─ Deposits $200K via bonding curve                    │
│          ├─ Curve price: $1.25 × 1.005 = $1.25625              │
│          ├─ Gets: ~159.2K H1 shares                             │
│          ├─ Fees/POL: $10K reserved                             │
│          └─ Remaining: $190K to vault                            │
│                                                                   │
│ Day 2, Later: Bob backsand liquidity by calling fillRedeem()    │
│          ├─ Notices Alice's pending redemption                   │
│          ├─ fillRedeem(requestId=42, receiver=bob)              │
│          │  └─ Bob sends $125K LABS directly to Alice          │
│          │     Alice receives funds IMMEDIATELY ✓                │
│          ├─ Alice's redemption marked claimed                    │
│          └─ Result:                                              │
│             ├─ Alice: Got LABS on Day 2 (5 days early!) ✓       │
│             ├─ Bob: Holds 159.2K H1 shares (his investment)     │
│             └─ Lab: Received new capital ($190K), TVL intact    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

**What if No One Backfills? (Standard Path)**

Even without backfilling, redemptions still work:

```
├─ Exit cap throttles redemptions (20% per day)
├─ Cooldown ensures grace period for recovery
├─ After 7 days: Normal claim pathway available
└─ Result: Smooth, predictable exit timeline
```

---

**Exit Cap Resets**

```javascript
Epoch Duration: 24 hours (resets automatically)

Lab with $1M TVL:
├─ Hour 0-23 (Day 1): Max exit = $200K
│                      ├─ $150K exits approved
│                      └─ Remaining capacity: $50K
│
├─ Hour 24 (Day 2): EPOCH RESETS
│                    └─ Capacity resets to $200K
│                       (Even if Day 1 didn't use full cap)
│
└─ Sliding window prevents bank runs
```

---

**Cooldown Parameters (Configurable)**

Lab admins can adjust redemption parameters:

| Parameter | Default | Max | Purpose |
|-----------|---------|-----|---------|
| **Cooldown Period** | 7 days | 30 days | Grace period before claiming |
| **Exit Cap %** | 20% TVL/day | 100% TVL/day | Daily redemption limit |
| **Redemption Fee** | 0.5% | 1% | Incentivizes long-term holding |

Example: A mature lab with $10M TVL might set:
- Cooldown: 3 days (faster exits)
- Exit Cap: 25% ($2.5M/day)
- Fee: 0.25% (attracts large unstakers)

---

**Visual Summary: When Can You Exit?**

```
│ Status              │ Can Unstake? │ Can Claim? │ Can Cancel? │
├────────────────────┼──────────────┼───────────┼─────────────┤
│ Staked, Day 0      │ YES ✓        │ NO        │ N/A         │
│ Requested, Day 1-6 │ NO           │ NO        │ YES ✓       │
│ Requested, Day 7+  │ NO           │ YES ✓     │ NO          │
│ Claimed            │ N/A          │ N/A       │ N/A         │
│ Backfilled         │ N/A          │ YES (auto)│ NO          │
└────────────────────┴──────────────┴───────────┴─────────────┘
```

---

**Why This Design Prevents Disasters**

```
WITHOUT grace periods + exit caps:
  Day 1: $1M TVL, 1000 stakers each with 1000 H1
  Day 2: Market panic → Everyone unstakes
         └─ All 1000 call requestRedeem()
  Day 3: All 1000 claim → $1M drained to $0
         └─ Lab level collapses, TVL → 0
         └─ Validators lose income, buyers lose credibility
         └─ Lab is DEAD

WITH grace periods + exit caps + backfill:
  Day 1: $1M TVL
  Day 2: 50 call requestRedeem (limit: 20% = $200K)
         └─ Cap allows: 40 exits at $5K each
         └─ 10 requesters rejected, try tomorrow
  Day 3: Bonding curve attracts new capital
         └─ New stakers backfill yesterday's queue
         └─ TVL stable or growing
  Day 4-7: Remaining exits absorbed gradually
           └─ Lab continues operating normally
```

This is the **key difference** between fragile systems and robust ones.

---

## 6. Economic Flywheel

The H1 economy is designed as a **closed loop** that continuously strengthens as adoption increases:

### **Macro Flywheel: Platform Level**

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
├─ Lab Owner + Validators: $50K (50% of sale)
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
├─ More validators → higher quality data → higher sale prices
└─ Cycle repeats at larger scale with higher velocity
```

### **Micro Flywheel: Healthcare Lab Year 1 (Detailed Example)**

```
MONTH 1: Lab Creation & Initial Staking

Day 1: Founder creates Health-Lab
├─ Founder deposits: $50,000 $LABS
├─ Founder receives: 50,000 H1 shares (100% ownership)
├─ Lab assets: $50,000
├─ H1 NAV: $50K / 50K shares = $1.00/share
├─ Founder's stake value: $50,000
└─ Level: L0 (below $100K threshold)


MONTH 1-2: Community Growth via Deposits

Day 15: Validator 1 deposits $25K
├─ Receives: 25,000 H1 shares at $1.00/share
├─ Lab assets: $75,000
├─ Total H1 supply: 75,000 shares
├─ Founder's ownership: 50,000 / 75,000 = 66.7% (-33.3% dilution)
├─ Validator 1's ownership: 25,000 / 75,000 = 33.3%
├─ Founder's new value: 50K shares × $1.00 = $50K (same nominal, ownership diluted)
└─ NAV: still $1.00/share (no profit yet)

Day 25: Early Investors via Bonding Curve
├─ Raise target: $125K additional
├─ Curve price: $1.005/share (0.5% premium to NAV)
├─ Fee/POL: $12.5K allocated (10% of raise)
├─ Net to vault: $112.5K
├─ Lab assets: $75K + $112.5K = $187.5K
├─ Total H1 supply: 75K + 112.5K = 187.5K shares
├─ Founder's ownership: 50K / 187.5K = 26.7% (-40% from original 100%)
├─ Founder's value: 50K × ($187.5K / 187.5K) = 50K shares × $1.00 = $50K
│  (Still $50K nominal value, but only 26.7% of lab)
└─ Level: L1 reached ($187.5K ≥ $100K → 1 app slot unlocked)


MONTHS 3-6: Dataset Revenue Phase

Month 3: First Dataset Sale
├─ Dataset sold: $50,000
├─ Revenue split (per smart contract):
│  ├─ H1 Buyback: $20K (40%)
│  │  └─ Distributed proportionally to all H1 holders (including vested)
│  ├─ Data Creators: $10K (20%)
│  │  └─ Split among contributors by contribution score (paid directly)
│  ├─ Validators/Supervisors: $10K (20%)
│  │  └─ Split among validators by validation work (paid directly)
│  ├─ App Developers: $7.5K (15%)
│  │  └─ Paid to SDK/app builders
│  └─ Protocol Treasury: $2.5K (5%)
│     └─ Operations & infrastructure
├─ Lab assets now (from buyback): $187.5K + $20K = $207.5K
├─ H1 NAV now: $207.5K / 187.5K = $1.107/share (+10.7% appreciation)
├─ Founder's value: 50K shares × $1.107 = $55,350 (+$5,350 gain from buyback)
├─ Validator 1's value: 25K shares × $1.107 = $27,675 (+$2,675 gain from buyback)
└─ Plus: Validator 1 earned direct payment from 20% validators pool ($10K)

Month 4: Buyback Execution (optional, protocol-controlled)
├─ Buyback budget: $8K accumulated (40% of $20K lab revenue)
├─ Market price of H1: ~$1.10/share
├─ H1 repurchased: $8K / $1.10 = 7,273 shares burned
├─ New H1 supply: 187.5K - 7.273K = 180.227K shares
├─ Lab assets: still $207.5K (unchanged)
├─ New NAV: $207.5K / 180.227K = $1.151/share (+4% from buyback scarcity)
├─ Founder's new value: 50K × $1.151 = $57,550 (+$4,550 total from NAV + buyback)
└─ Validator 1's new value: 25K × $1.151 = $28,775 (+$2,275 total from NAV + buyback)

Month 5: Second Dataset Sale
├─ Dataset sold: $75,000 (higher value, more validators)
├─ Revenue split (per smart contract):
│  ├─ H1 Buyback: $30K (40%)
│  │  └─ Distributed proportionally to all H1 holders
│  ├─ Data Creators: $15K (20%)
│  │  └─ Split among contributors (paid directly)
│  ├─ Validators/Supervisors: $15K (20%)
│  │  └─ Split among validators (paid directly)
│  ├─ App Developers: $11.25K (15%)
│  │  └─ Paid to SDK/app builders
│  └─ Protocol Treasury: $3.75K (5%)
│     └─ Operations & infrastructure
├─ Lab assets: $207.5K + $30K = $237.5K
├─ NAV: $237.5K / 180.227K = $1.318/share (+14.5% appreciation from Month 4)
├─ Founder's value: 50K × $1.318 = $65,900 (+$8,350 from Month 4 buyback)
├─ Validator 1's value: 25K × $1.318 = $32,950 (+$4,175 from Month 4 buyback)
└─ Plus: Validator 1 earned from 20% validators pool ($15K shared)

Month 6: Buyback Round 2
├─ Cumulative buyback budget: $8K (Month 3) + $12K (Month 5) = $20K
├─ Market price: ~$1.30/share
├─ H1 repurchased: $20K / $1.30 = 15,385 shares burned
├─ New supply: 180.227K - 15.385K = 164.842K shares
├─ NAV: $237.5K / 164.842K = $1.441/share (+9.3% scarcity gain from Month 5)
├─ Founder's value: 50K × $1.441 = $72,050 (+$6,150 from Month 5)
└─ Validator 1's value: 25K × $1.441 = $36,025 (+$3,075 from Month 5)


YEAR 1 SUMMARY: Compounding Effects

Cumulative Performance:
├─ Founder's investment: $50K initial
├─ Founder's value after Year 1: $72,050
├─ Total gain: +$22,050 (+44.1% ROI)
├─ Breakdown:
│  ├─ NAV appreciation: From $1.00 → $1.441 per share = +44.1%
│  ├─ Ownership dilution: 100% → 30.3% of lab (from community growth)
│  └─ Counterbalance: Buybacks reduce supply, offsetting dilution
│
├─ Validator 1's investment: $25K (Month 1)
├─ Validator 1's value after Year 1: $36,025
├─ Total gain: +$11,025 (+44.1% ROI, same rate as founder)
└─ Proportional rewards apply to all stakeholders

H1-Healthcare Lab Status (End of Year 1):
├─ Total TVL: $237.5K
├─ H1 NAV: $1.441/share
├─ H1 Supply: 164,842 shares (reduced from 187,500 via buybacks)
├─ Revenue generated: $125K total (2 datasets sold at $50K and $75K)
├─ Revenue distribution (per smart contract):
│  ├─ H1 Buyback: $50K (40%) → distributed proportionally to all holders
│  ├─ Data Creators: $25K (20%) → paid directly to contributors
│  ├─ Validators: $25K (20%) → paid directly to credentialed experts
│  ├─ Developers: $18.75K (15%) → paid to SDK/app builders
│  └─ Treasury: $6.25K (5%) → protocol operations
├─ Level: L2 approaching ($237.5K approaching $250K → 2 app slots soon)
├─ Next milestone: $250K TVL → L2, then $500K TVL → L3 (3 app slots)
└─ Platform metrics:
   ├─ Validators participating: 500+
   ├─ Apps deployed: 2 active
   └─ Compliance: HIPAA auditable, verified data
```

### **Key Mechanics at Work**

1. **Ownership is Fractional**: H1 shares represent % ownership of lab treasury; dilutes with new deposits
2. **Buyback Benefits All Holders**: 40% of revenue → buyback → distributed proportionally to all H1 holders (not by role)
3. **Direct Payments by Role**: Creators (20%), Validators (20%), Developers (15%), Treasury (5%) paid immediately via smart contract
4. **Hold Incentive**: Hold H1 = participate in all future buybacks; Sell H1 = miss appreciation
5. **Compounding Growth**: NAV ↑ + Supply ↓ = exponential appreciation (44.1% Year 1 shown above)
6. **Sustainability Loop**: Real dataset sales → real revenue → real token appreciation (no inflation)

---

## 7. Roadmap (Condensed)

| Phase | Milestone | Highlights |
|------|-----------|------------|
| Prototype | Testnet diamond + UI demo | LABS set, createLab, auto‑vault, deposits/redemptions |
| MVP | Provenance + Revenue flows | Credential gating, RevenueFacet splits, initial SDK hooks |
| Post‑MVP | Governance + Credits | DAO/Compliance upgrades, Credit mode, explorer & analytics |

---

## 8. Dataset Marketplace

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
├─ Data Creators:      20% ($0.20X)        → Creator pool wallet (direct payment to contributors)
├─ Validators:         20% ($0.20X)        → Scholar pool wallet (direct payment to credentialed experts)
├─ App Developers:     15% ($0.15X)        → Developer wallet (SDK/app builders)
└─ Protocol Treasury:   5% ($0.05X)        → Treasury wallet (operations & infrastructure)
                       ─────────────
Total:                 100% ($1.00X)

All payments automated, transparent, and auditable on-chain.

**Key:** Buyback benefits all H1 holders proportionally (not by role). Hold H1 = earn from all future sales.
```

### **Example: $10,000 Dataset Purchase**

```
DATASET: "Medical Imaging Annotations"
Creator: Cleveland Clinic (Lab ID: 1)
Supervisor: ACR Standards Board
Purchase Price: $10,000

Revenue Breakdown (per RevenueFacet.sol):
├─ H1 Buyback (40%):                     $4,000 → Buyback wallet
│  └─ Repurchases H1 tokens from market
│     └─ Distributes proportionally to all H1 holders (including vested)
│     └─ Example: Lab owner (30% stake) gets 30% × $4K = $1,200 worth
│              Early investor (10% stake) gets 10% × $4K = $400 worth
│              Validator (5% stake) gets 5% × $4K = $200 worth
│
├─ Data Creators (20%):                  $2,000 ✓ Paid directly via smart contract
│  └─ Distributed to contributors who collected/enriched data
│
├─ Validators/Supervisors (20%):         $2,000 ✓ Paid directly via smart contract
│  └─ Distributed to credentialed experts who validated
│
├─ App Developers (15%):                 $1,500 ✓ Paid directly via smart contract
│  └─ Paid to SDK/app builders
│
└─ Protocol Treasury (5%):                 $500 ✓ Paid to treasury wallet
   └─ Protocol operations & infrastructure

H1 Holder Impact:
├─ All H1 holders benefit from buyback (proportional to stake)
├─ Hold H1 = participate in this + all future dataset sales
└─ Sell H1 = miss future appreciation
```

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

### **Bulk Purchase Example: 3 Datasets**

```
BUYER: Acme AI (purchases for $12,000 before discount)
DATASETS:
  1. Cardiovascular Records ($4,500) from Lab 1
  2. Legal Document Corpus ($3,500) from Lab 3  
  3. Robotics Motion Data ($2,000) from Lab 4

Step 1: Bulk Discount Applied
Total: $12,000 → 5% off → $11,400 final price

Step 2: Single On-Chain Transaction
Revenue Distribution (per-dataset, per-lab):

Dataset 1 ($4,500 to Lab 1):
├─ H1 Buyback (40%):      $1,800 → Buyback wallet (proportional to all Lab 1 H1 holders)
├─ Creators (20%):          $900 → Direct payment
├─ Validators (20%):        $900 → Direct payment
├─ Developers (15%):        $675 → Direct payment
└─ Treasury (5%):          $225 → Treasury wallet

Dataset 2 ($3,500 to Lab 3):
├─ H1 Buyback (40%):      $1,400 → Buyback wallet (proportional to all Lab 3 H1 holders)
├─ Creators (20%):          $700 → Direct payment
├─ Validators (20%):        $700 → Direct payment
├─ Developers (15%):        $525 → Direct payment
└─ Treasury (5%):          $175 → Treasury wallet

Dataset 3 ($2,000 to Lab 4):
├─ H1 Buyback (40%):        $800 → Buyback wallet (proportional to all Lab 4 H1 holders)
├─ Creators (20%):          $400 → Direct payment
├─ Validators (20%):        $400 → Direct payment
├─ Developers (15%):        $300 → Direct payment
└─ Treasury (5%):          $100 → Treasury wallet

Bulk Discount Applied:
├─ Total before discount: $12,000
├─ 5% bulk savings:        -$600
├─ Final amount sent:    $11,400
└─ Savings distributed proportionally to each dataset

Step 3: Automatic H1 Impact

Lab 1 H1 Holders:
├─ Buyback allocation: $1,800 (40% of Lab 1 dataset revenue)
├─ Distributed proportionally: All Lab 1 H1 holders benefit based on stake %
├─ Example: Holder with 15% of Lab 1 H1 → gets 15% × $1,800 = $270 worth
└─ Effect: All Lab 1 H1 holders increase in value automatically

Lab 3 H1 Holders:
├─ Buyback allocation: $1,400 (40% of Lab 3 dataset revenue)
├─ Distributed proportionally: All Lab 3 H1 holders benefit based on stake %
├─ Example: Holder with 10% of Lab 3 H1 → gets 10% × $1,400 = $140 worth
└─ Effect: All Lab 3 H1 holders increase in value automatically

Lab 4 H1 Holders:
├─ Buyback allocation: $800 (40% of Lab 4 dataset revenue)
├─ Distributed proportionally: All Lab 4 H1 holders benefit based on stake %
├─ Example: Holder with 20% of Lab 4 H1 → gets 20% × $800 = $160 worth
└─ Effect: All Lab 4 H1 holders increase in value automatically

Direct Payments (Automated via Smart Contract):
├─ Total creators paid: $2,000 (20% × $10K total, distributed proportionally)
├─ Total validators paid: $2,000 (20% × $10K total, distributed proportionally)
├─ Total developers paid: $1,500 (15% × $10K total)
├─ Total treasury: $500 (5% × $10K total)
└─ All payments traceable on-chain via CredentialFacet attribution
```

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

### **From Purchase to Payout Timeline**

```
Day 0: User purchases $10,000 dataset
├─ H1 Buyback wallet receives: $4,000 (40%)
├─ Creators receive: $2,000 immediately (20%)
├─ Validators receive: $2,000 immediately (20%)
├─ Developers receive: $1,500 immediately (15%)
└─ Treasury receives: $500 (5%)

Day 0-1: Attribution & Distribution
├─ DataValidationFacet identifies: Which creators/validators/developers contributed
├─ Attribution records: Retrieved from on-chain credential records
├─ Smart contract executes: Automatic proportional distribution
├─ Buyback wallet: Prepares H1 repurchase from market
└─ All payments: Traceable on-chain via transaction hash

Day 1-14: Buyback Execution
├─ Buyback bot: Repurchases H1 tokens from market using $4,000
├─ H1 distribution: Proportionally to all H1 holders (including vested)
├─ Example breakdown (if 200K H1 outstanding):
│  ├─ Lab owner (60K H1, 30%) gets: 30% × $4K = $1,200 worth
│  ├─ Early investor (20K H1, 10%) gets: 10% × $4K = $400 worth
│  └─ Validators (10K H1, 5%) get: 5% × $4K = $200 worth
└─ Effect: All H1 holders gain value automatically (no action needed)

Ongoing: Compounding Value
├─ More datasets sold: More buyback allocations → more H1 distributed
├─ Hold H1: Participate in all future dataset sale buybacks
├─ Sell H1: Miss all future appreciation opportunities
└─ Incentive: Long-term holding maximizes gains from compounding revenue
```

### **Why This Model Works**

| Stakeholder | Incentive |
|-------------|-----------|
| **H1 Holders** | 40% buyback distributed proportionally; hold = earn from all sales, sell = miss gains |
| **Data Creators** | Direct 20% of revenue; reputation and payment tied to dataset quality & sales |
| **Validators** | Direct 20% of revenue; incentivized to approve only high-quality, compliant data |
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

## 9. Closing

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

| Dimension | H1 Labs | Bittensor | Scale AI | Ocean | Gensyn |
|-----------|---------|------------|----------|--------|---------|
| **Focus** | Human-validated datasets | Model training | Centralized data | Data liquidity | Compute network |
| **Compliance** | HIPAA, GDPR, C2PA, EU AI Act | None | Corporate | Optional | None |
| **Credentialing** | Verified NFTs + KYC | None | Manual | None | None |
| **Provenance** | Full onchain audit trail | None | Internal | Metadata only | None |
| **Revenue Model** | Onchain splits + buybacks | Inflationary | Fiat only | Stake-reward | Stake-reward |
| **Target Market** | Healthcare, Legal, Defense, Finance | General AI | Enterprise labeling | General data | ML infrastructure |
| **Value Driver** | Real dataset sales | Token inflation | Labor cost | Access licensing | Compute capacity |

**Why it matters:** H1's compliance-first approach opens regulated markets (healthcare TAM ~$200B+ in data licensing) that competitors cannot access. Programmable compliance means SDKs launch in regulated sectors without custom legal wrangling.

---

## D. Risks & Mitigations

- **Regulatory**: Programmable compliance facets; credential gating; audit logs.  
- **Liquidity**: POL/treasury custody and buyback budget design; exit caps and cooldowns.  
- **Security**: Standard diamond controls, guards, and progressive audits.
- **Adoption**: Validator network effects + partnership incentives; credentialing portal lowers barriers.

---

## E. Use Cases & Scenarios

**H1 Labs enables verified data creation across multiple domains:**

- **Healthcare**: Scrubber (de‑identification), Second Opinion+ (AI‑human consultation), Imaging annotation
- **Creative & Gaming**: Provenance frameworks for art and game assets (C2PA‑aligned), attribution and licensing onchain
- **Robotics & Industrial**: Motion/vision datasets with validated safety metadata
- **Legal & Financial**: Compliance-verified datasets (GDPR, AML/KYC aligned)
- **Education & Research**: FERPA-compliant educational datasets with attribution

### **Detailed Scenarios**

#### **Scenario 1: Healthcare Startup Launches De-Identification Lab**

```
Month 1: $50K staking → Lab created → Level 1 (1 app slot)

Month 1-2: Bonding curve bootstrap
├─ 50 angels purchase H1-Healthcare shares
├─ Raise: $250K total
├─ Curve price: $1.005 → $2.50
└─ Reach Level 2

Month 3-6: Revenue acceleration
├─ 10K patient records de-identified via Scrubber
├─ Sold to AI company: $100K
├─ Revenue split: $50K lab owner, $25K treasury, $25K buyback
├─ 500 validator clinicians earn: $100 each in H1
└─ H1 price appreciates to $2.75

Year 1 Outcome:
├─ 50 datasets sold ($5M revenue)
├─ TVL grows: $5M → $8.5M
├─ H1-Healthcare: $1.00 → $8.88/share (+788%)
├─ Early validator earning: $100 → $888
└─ Scrubber becomes industry standard for HIPAA compliance
```

#### **Scenario 2: Robotics Consortium Validates Safety Data**

```
Week 1: $100K staking, 1,000 motion videos collected

Week 2-4: Validation with ISO-26262 experts
├─ SafetyFacet compliance enforcement
├─ Reach Level 2 ($250K capital)
└─ ProvenanceFacet records all validators/approvals

Month 2-3: Monetization
├─ OEM purchases dataset: $50K
├─ 100 validators earn: $250 each in H1
├─ Lab owner gains directional equity
└─ Dataset becomes certified standard

6-Month Outlook:
├─ 100 robotics companies subscribe
├─ $500K recurring revenue
├─ H1 holders gain 400%+ returns
└─ Protocol treasury funds industry audits
```

#### **Scenario 3: Creative Studio Tokenizes Art Assets**

```
Week 1-3: 5,000 game assets collected, validated by senior artists

Month 2: License to AI development studio
├─ License fee: $25K
├─ Revenue split: $12.5K studio, $6.25K protocol, $6.25K buyback
├─ 50 artists earn: $125 each in H1-ArtForge
└─ C2PA provenance ensures legal compliance

Ongoing:
├─ Every game using dataset generates proper attribution
├─ Artists earn recurring royalties (transparent splits)
├─ Studios get legal provenance for AI training
└─ H1 holders benefit from recurring licensing revenue
```

---


