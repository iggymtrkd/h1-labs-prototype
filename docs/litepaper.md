# **H1 Labs — Litepaper**  
> Status: Aligned with smart contracts as of 2025-10-19 | **UPDATED 2025-10-20: Enhanced accuracy on level thresholds, ownership mechanics, validator rewards, and detailed economic flywheel example**

### Advancing AI through provable, human‑validated data — powered by blockchain.

---

## 1. Mission, Goals, and Why Now

**Mission**  
H1 Labs is building the human‑first protocol for AI — a decentralized system where verified people enrich, validate, and monetize datasets with onchain provenance, compliance, and transparent economics.
Through our Dual‑Intelligence SDK, every app pairs an agent with a credentialed human, ensuring compliant data for regulated and semi‑regulated markets.

**Goals**  
- Launch a verifiable data economy spanning healthcare, robotics, law, art, and gaming.  
- Align incentives between contributors, validators, labs, and AI buyers through crypto‑native mechanics.  
- Make provenance, credentialing, and compliance default infrastructure for AI.

**Why Now**  
AI models demand trustworthy data. Today’s pipelines are opaque, legally risky, and misaligned with human contributors. H1 Labs merges blockchain guarantees (provenance, payments, programmable policy) with human expertise to create compliant, auditable datasets that enterprises can trust.

We target regulated and semi‑regulated markets — starting with healthcare — and expanding to finance (AML/KYC), legal (privacy/privilege), defense (ITAR/EAR), robotics/industrial (safety standards), and media/creative (C2PA).

---

## 2. Our Edge — Strengths at a Glance

- **Provenance by Design**: Every enrichment and validation emits an onchain trace (who, when, what).  
- **Credentialed Humans**: Domain experts verified via the Credentialing Portal; no anonymous crowdwork for regulated data.  
- **Programmable Compliance**: Domain rules are enforced at the contract layer (HIPAA, GDPR, AEH, C2PA).  
- **Dual‑Intelligence SDK (Agent + Human)**: Apps pair an agent with credentialed human oversight for compliant workflows in regulated and semi‑regulated markets.  
- **Two‑Token Model ($LABS ↔ H1)**: $LABS governs and stakes; each Lab’s H1 token is its vault share, enabling per‑lab economies.  
- **Modular Diamond Architecture**: EIP‑2535 facets make the system upgradeable, auditable, and extensible.  
- **Enterprise‑friendly UX**: SDK credit mode abstracts blockchain for Web2‑style apps.

---

## 3. What You Can Do on H1

- **Create a Lab**: Stake and launch a domain Lab with its own H1 token (vault shares).  
- **Enrich & Validate**: Contribute to datasets; validators with credentials approve quality.  
- **Buy/Access Data**: AI firms purchase verified datasets; payments route transparently to stakeholders.  
- **Build Apps**: Use the H1 SDK to ship compliant, provenance‑aware applications quickly.

---

## 4. User Flows (High‑Level)

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
ETH routed: 50% Lab owner, 25% protocol treasury (H1 pool custody), 25% buyback budget
Auditable provenance & compliance artifacts for due diligence
```

---

## 4.5 Lab Creation & Growth Mechanics

### **Lab Lifecycle & Ownership**

Creating a Lab unlocks three stages:

**Stage 1: Initialization & First Staker**  
Lab creator calls `createLab(name, symbol, domain)` and deposits $LABS into the auto-deployed LabVault. 
- Creator's deposit is converted to H1 shares at 1:1 NAV (initial exchange rate = 1 LABS/share)
- If creator is the only depositor, they own **100% of H1 shares** and thus **100% of the lab**
- **No minimum deposit enforced** (recommended: $10K+ for early viability)

**Stage 2: Growth via Community Deposits**  
Additional users can deposit $LABS into the vault and receive H1 shares at current NAV. Ownership is **fractional and proportional**:
```
Example:
├─ Creator deposits $100K → gets 100K H1 shares (100% ownership)
├─ New staker deposits $50K → gets 50K H1 shares
├─ Total vault now has: 150K H1 shares, $150K assets
├─ Creator's ownership: 100K/150K = 66.7% of lab
└─ New staker's ownership: 50K/150K = 33.3% of lab
```
As the lab generates revenue, all H1 holders gain value proportionally (see NAV growth example below).

**Level Unlocking (Based on Total TVL):**

| Level | TVL Threshold | App Slots | Implications |
|-------|---------------|-----------|---|
| **L0** | < $100K | 0 | Lab exists but no operational apps |
| **L1** | $100K–$250K | 1 | Can run 1 backend/frontend app pair |
| **L2** | $250K–$500K | 2 | Can run 2 app slots in parallel |
| **L3** | $500K+ | 3 | Can run 3 app slots in parallel |

**Stage 3: Bootstrap via Bonding Curve (Optional)**  
Labs can deploy `BondingCurveSale` for accelerated capital raise:
- Users buy H1 shares at `NAV × 1.005` (0.5% premium)
- Fee allocation:
  - **1-2% Protocol Fee**: To treasury (configurable, max 10%)
  - **5-10% POL Reserve**: For liquidity provisioning (configurable, max 10%)
  - **80-90% Net Deposit**: Enters vault at NAV, minting H1 shares
- Bonding curve price increases as more capital flows in, naturally incentivizing early participation

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

## 6. $LABS and H1 — Detailed Mechanics & Economic Flywheel

> 📚 Tokenomics overview: See Section 5 above. For deeper details, see [`docs/8-h_1_tokenomics_distribution.md`](8-h_1_tokenomics_distribution.md)

This section provides detailed mechanics of how $LABS and H1 interact within the platform's economic flywheel.

### Key Definitions:

- **$LABS (Singleton ERC‑20)**: Platform governance, staking, and lab creation asset. Set via `TreasuryFacet.setLABSToken`.  
- **H1 (Per‑Lab ERC‑20 Shares)**: Each Lab’s `LabVault` is its own H1 token. Depositing $LABS mints H1 shares at NAV; redemptions return $LABS subject to cooldown and exit caps.  
- **Bonding Curve (Optional)**: `BondingCurveSale` buys H1 at NAV + 0.5% premium, routing fees/POL to treasury and depositing net $LABS to the lab's vault.  
- **Levels & App Slots**: LabVault tracks total assets to derive levels (L1/L2/L3) unlocking 1/2/3 app slots.  
- **Revenue Split (Current Implementation)**: 50% to lab owner, 25% to protocol treasury (H1 pool custody), 25% retained for future buyback execution.

Economic intent: AI demand for verified datasets drives onchain payments that flow to Labs and treasury, with retained buyback budgets enabling future buy pressure mechanisms without dividend semantics.

---

### 6.5 Staking & Validator Rewards

**$LABS serves three functions:**
1. **Lab Creation & Deposits**: Stake $LABS → mint H1 shares → unlock app slots and dataset economy
2. **Validation Rewards**: Contribute to datasets → earn $LABS grants + lab-specific H1 tokens
3. **Governance**: Hold $LABS → vote on protocol upgrades (future DAO)

**Validator Economics: The Three-Tier Reward Model**

When a dataset sells (e.g., $100K), revenue is split as follows, with contributors earning across multiple tiers:

```
$100K Dataset Sale → Revenue Distribution

├─ Lab Revenue Share (50% = $50K)
│  └─ Distributed to validators/supervisors based on contribution quality score
│     └─ Paid in lab-native H1 tokens
│     └─ Example (500 validators with equal quality):
│        ├─ Each validator: $100 in H1 tokens
│        └─ Total: 500 × $100 = $50K split
│     └─ Example (tiered by quality):
│        ├─ Top 10% validators: $200 each in H1
│        ├─ Middle 50%: $100 each in H1
│        └─ Bottom 40%: $25 each in H1
│
├─ Protocol Grants (25% = $25K)
│  └─ Drawn from treasury based on merit/governance
│     └─ Allocated to validators who have demonstrated exceptional performance
│     └─ Paid in $LABS (platform token) to recognize platform-level excellence
│     └─ Requires proposal/credentialing review (future: DAO vote)
│
└─ Buyback Pressure (25% = $25K)
   └─ Retained for future token repurchases
      └─ Executed by protocol to reduce H1 supply
      └─ Benefits ALL H1 holders (including validators) via increased share value
      └─ Creates passive appreciation: no action needed
```

**Contributor Roles & Reward Streams**

| Role | Function | Reward Mechanism | Payment Token | Examples |
|------|----------|------------------|---------------|----------|
| **Validator** | Enrich/validate dataset entries, ensure quality | Proportional share of 50% lab revenue based on contribution score | Lab-native H1 | Healthcare clinician validates patient records; roboticist approves safety data |
| **Supervisor** | Review validator work, sign-off on final dataset, ensure compliance | Higher tier within validator rewards (quality bonus multiplier) | Lab-native H1 | Senior clinician supervises junior validators; compliance officer approves dataset |
| **Developer** | Build apps using SDK, integrate compliance, manage operations | SDK usage fees + app-specific revenue splits (future) | Protocol-determined (H1 + grants) | Healthcare startup builds Scrubber app; robotics firm integrates SafetyFacet |

**Attribution & Credentialing**

Validator contribution attribution is tracked through:
- **Credentialing Portal**: Verify domain expertise (medical licenses, legal credentials, certifications)
- **Onchain Provenance**: ProvenanceFacet logs each validator's enrichment/validation actions with timestamp
- **Quality Scoring**: Off-chain reputation system (future: onchain governance) scores contributions
- **Payment Distribution**: Treasury oracle aggregates contribution scores and distributes rewards proportionally

**Key Insight**: Validator rewards are **real, proportional to contribution**, and **sustainable** because they're funded by actual dataset sales, not token inflation. Scarcity pressure from buybacks further benefits all contributors who hold H1.

This aligns incentives: more valuable contributions → higher reward tier; increased lab success → increased validator payouts; platform growth → sustained buyback pressure → all H1 holders gain.

---

### 6.75 H1 Tokens — Per-Lab Economies

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

### 6.9 Bonding Curves — Bootstrap Mechanics

**Why Bonding Curves?**  
Auto-adjusting price pegged to vault NAV eliminates ICO-style pricing risks. Buyers receive H1 shares at a 0.5% premium; protocol fees and protocol-owned liquidity (POL) are reserved, with remainder entering vault to grow TVL.

**Formula:** `price_per_share = vault_NAV × 1.005`

**Fee Breakdown (Configurable)**  
Of each $LABS deposit via bonding curve, the split is:
- **0-10% Protocol Fee**: Routed to treasury (configurable per lab, typically 1-2%)
- **0-10% POL Reserve**: Reserved for liquidity provisioning (configurable per lab, typically 5-10%)
- **Remainder (~80-90%)**: Deposited to vault at NAV, minting H1 shares

**Redemption & Cooldown Mechanics**  
H1 shares purchased via bonding curve can be redeemed like any other H1:
- **Request Redemption**: Burn H1 shares, enter 7-day cooldown queue
- **Cooldown Period**: Default 7 days before $LABS can be claimed
- **Exit Caps**: Daily redemption limit (~20% of vault TVL per day) prevents sudden drains
- **Grace Period**: If redemptions exceed caps, system waits for next epoch or allows backfilling by new deposits

**Example — Robotics Lab Launch:**

```
Day 1: Lab created with $100K deposit
├─ H1-Robotics NAV: $1.00/share
├─ Curve price: $1.005/share (0.5% premium)
├─ Protocol fee rate: 1.5%
├─ POL reserve rate: 7.5%
└─ Level 1 unlocked (1 app slot)

Day 7: $250K total capital raised via curve
├─ New deposits: $250K (from 50 early investors)
├─ Protocol fee: $250K × 1.5% = $3.75K → treasury
├─ POL reserve: $250K × 7.5% = $18.75K → treasury
├─ Net deposited to vault: $250K - $22.5K = $227.5K
├─ LabVault now holds: $100K + $227.5K = $327.5K
├─ Total H1 supply: ~327.5K shares (minted at NAV)
├─ New NAV: $327.5K / 327.5K = $1.00/share (stable, POL doesn't inflate)
└─ Reaches Level 2 (2 app slots)

Investor Experience (Example):
├─ Investor sends: 1,000 LABS
├─ Protocol fee: 15 LABS
├─ POL reserve: 75 LABS
├─ Amount deposited: 910 LABS
├─ H1 received: 910 shares at $1.00/share
└─ Early exit available:
   ├─ Day 1-7: Cannot redeem (cooldown active)
   ├─ Day 8+: Can request redemption
   ├─ After 7 days: Claim 910 LABS back (subject to exit caps)
   └─ If labs appreciate: 910 × $2.00 = $1,820 value at exit

Safety Features:
├─ Price bounds: [0.001, 1,000,000] LABS per share
├─ Max 1-tx change: 50% (flash loan protection)
├─ Reentrancy guards + slippage checks
└─ Admin pause mechanism for emergencies
```

---

## 7.5 Why Blockchain Matters for H1

Blockchain is not ornament — it is the enforcement layer for provenance, compliance, and fair economics:

| Challenge | Blockchain Benefit | H1 Implementation | Result |
|-----------|-------------------|-------------------|---------|
| **Data Provenance** | Immutable audit trail | ProvenanceFacet logs enrichment, validators, timestamps | Regulators can verify dataset lineage |
| **Validator Integrity** | Cryptographic proof of contribution | Credentials NFT + onchain records | Enterprise clients trust who validated data |
| **Compliance Enforcement** | Programmable legal constraints | ComplianceFacet binds HIPAA/GDPR/C2PA rules | AI firms know data is legally compliant |
| **Transparent Economics** | All payments recorded & verifiable | RevenueFacet splits logged per dataset sale | No opacity in revenue distribution |
| **Security & Trust** | Prevents tampering & fraud | Reentrancy guards, access control, audit logs | Protected against data theft & spoofing |

---

## 9.5 Use Case Scenarios

### **Use Case 1: Healthcare Startup Launches De-Identification Lab**

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

### **Use Case 2: Robotics Consortium Validates Safety Data**

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

### **Use Case 3: Creative Studio Tokenizes Art Assets**

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

## 10. Economic Flywheel

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
├─ Revenue split:
│  ├─ Lab Owner/Validators: $25K (50% of sale)
│  ├─ Protocol Treasury: $12.5K (25%)
│  └─ Buyback Reserve: $12.5K (25%)
├─ Lab assets now: $187.5K + $25K = $212.5K
├─ H1 NAV now: $212.5K / 187.5K = $1.133/share (+13.3% appreciation)
├─ Founder's value: 50K shares × $1.133 = $56,650 (+$6,650 gain)
└─ Validator 1's value: 25K shares × $1.133 = $28,325 (+$3,325 gain)

Month 4: Buyback Execution (optional, protocol-controlled)
├─ Buyback budget: $12.5K accumulated
├─ Market price of H1: ~$1.10/share
├─ H1 repurchased: $12.5K / $1.10 = 11,364 shares burned
├─ New H1 supply: 187.5K - 11.364K = 176.136K shares
├─ Lab assets: still $212.5K (unchanged)
├─ New NAV: $212.5K / 176.136K = $1.206/share (+6.4% from previous)
├─ Founder's new value: 50K × $1.206 = $60,300 (+$7,300 total)
│  (Gain comes from: $6,650 NAV growth + $1,650 buyback scarcity)
└─ Validator 1's new value: 25K × $1.206 = $30,150 (+$3,650 total)

Month 5: Second Dataset Sale
├─ Dataset sold: $75,000 (higher value, more validators)
├─ Revenue split:
│  ├─ Lab Owner/Validators: $37.5K (50%)
│  │  └─ Split among validators by contribution score (500 validators)
│  ├─ Protocol Treasury: $18.75K (25%)
│  └─ Buyback Reserve: $18.75K (25%)
├─ Lab assets: $212.5K + $37.5K = $250K
├─ NAV: $250K / 176.136K = $1.420/share (+17.7% appreciation)
├─ Founder's value: 50K × $1.420 = $71,000 (+$10,700 from Month 4)
└─ Validator 1's value: 25K × $1.420 = $35,500 (+$5,350 from Month 4)

Month 6: Buyback Round 2
├─ Cumulative buyback budget: $12.5K (Month 3) + $18.75K (Month 5) = $31.25K
├─ Market price: ~$1.35/share
├─ H1 repurchased: $31.25K / $1.35 = 23,148 shares
├─ New supply: 176.136K - 23.148K = 152.988K shares
├─ NAV: $250K / 152.988K = $1.634/share (+15% scarcity gain)
├─ Founder's value: 50K × $1.634 = $81,700 (+$10,700 from Month 5)
└─ Validator 1's value: 25K × $1.634 = $40,850 (+$5,350 from Month 5)


YEAR 1 SUMMARY: Compounding Effects

Cumulative Performance:
├─ Founder's investment: $50K initial
├─ Founder's value after Year 1: $81,700
├─ Total gain: +$31,700 (+63.4% ROI)
├─ Breakdown:
│  ├─ NAV appreciation: From $1.00 → $1.634 per share = +63.4%
│  ├─ Ownership dilution: 100% → 32.7% of lab
│  └─ Counterbalance: Buybacks reduce supply, offsetting dilution
│
├─ Validator 1's investment: $25K (Month 1)
├─ Validator 1's value after Year 1: $40,850
├─ Total gain: +$15,850 (+63.4% ROI, same rate as founder)
└─ Proportional rewards apply to all stakeholders

H1-Healthcare Lab Status (End of Year 1):
├─ Total TVL: $250K
├─ H1 NAV: $1.634/share
├─ H1 Supply: 152,988 shares (reduced from 187,500, 18.4% buyback)
├─ Revenue generated: $125K+ (3 datasets sold)
├─ Level: L2 reached ($250K ≥ $250K → 2 app slots unlocked)
├─ Next milestone: $500K TVL → L3 (3 app slots)
└─ Platform metrics:
   ├─ Validators participating: 500+
   ├─ Apps deployed: 2 active
   └─ Compliance: HIPAA auditable, verified data
```

### **Key Mechanics at Work**

1. **Ownership is Fractional**: H1 shares represent % ownership of lab treasury; dilutes with new deposits
2. **Revenue Drives NAV**: Lab revenue ($50%+) flows to vault → increases backing → increases NAV for all
3. **Buyback Creates Scarcity**: Reserve ($25K per sale) repurchases H1 → reduces supply → increases price
4. **Compounding Growth**: NAV ↑ + Supply ↓ = exponential appreciation (63.4% Year 1 shown above)
5. **Sustainability Loop**: Real dataset sales → real revenue → real token appreciation (no inflation)

---

## 11. Competitive Positioning — H1 vs The Field

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

## 12. Technical Features (Selected)

- **Reentrancy Guards:** Shared via `LibH1Storage.reentrancyStatus` where needed (e.g., `RevenueFacet`).  
- **Upgradeable by Facet:** New domains or policy changes can be added without migrating state.  
- **Guardian Controls:** Cooldowns, daily exit caps, and pause mechanisms at the vault level.  
- **Security & Introspection:** Standard Diamond Loupe, Ownership, Security facets.
- **Price Bounds Protection:** Bonding curve prevents price manipulation via MIN/MAX bounds and 50% max change per tx.
- **Pause Mechanism:** Emergency admin controls for security incidents.

---

## 13. Developer SDK (At a Glance)

- **Dual‑Intelligence Orchestration (Agent + Human)**: Built‑in co‑workflow primitives (assignment, handoff, review), human sign‑off, and audit trails.  
- **Identity & Credential**: Integrate credential checks for validators.  
- **Compliance**: Bind HIPAA/GDPR/AEH/C2PA policies per dataset/lab for regulated and semi‑regulated markets.  
- **Provenance Hooks**: Record enrichment/validation events onchain.  
- **Revenue & Splits**: Simple APIs aligned with `RevenueFacet`.  
- **Credit Mode**: Fiat‑friendly abstraction that still settles onchain.

### Dual‑Intelligence Dataflow (Δ‑Gain → Bundles → Buybacks)
1) App selects a base model (partner or BYO) via SDK adapters.  
2) Agent executes; credentialed human reviews and signs.  
3) SDK computes **Δ‑Gain** (supervised improvement vs declared base) and records provenance + attribution.  
4) H1 aggregates Δ‑Gain into dataset bundles and sells/licenses them.  
5) Revenue triggers buybacks that route to the originating Labs per policy, creating buy pressure for their H1 tokens.

---

## 14. Tokenomics (Lite)

### Roles
- **$LABS holders**: Stake, govern, seed labs, and participate in platform‑level value.  
- **H1 holders (per lab)**: Hold fractional shares of a lab's backing and exposure to its dataset economy.  

### Flows
```
Stake/Deposit $LABS → Mint H1 → Enrich/Validate → Dataset Sale →
RevenueFacet Split (50/25/25) → Treasury custody + Buyback budget
```

Notes (current state):  
- Revenue is accepted as ETH and split immediately; buybacks are not automated yet (treasury event stubs exist).  
- Lab creation does not burn $LABS; scarcity accrues via demand, treasury custody, and future buyback execution.

---

## 15. Use Cases (Initial)

- **Healthcare**: Scrubber (de‑identification), Second Opinion+ (AI‑human consultation), Imaging annotation.  
- **Creative & Gaming**: Provenance frameworks for art and game assets (C2PA‑aligned), attribution and licensing onchain.  
- **Robotics & Industrial**: Motion/vision datasets with validated safety metadata.
- **Legal & Financial**: Compliance-verified datasets (GDPR, AML/KYC aligned).
- **Education & Research**: FERPA-compliant educational datasets with attribution.

---

## 16. Roadmap (Condensed)

| Phase | Milestone | Highlights |
|------|-----------|------------|
| Prototype | Testnet diamond + UI demo | LABS set, createLab, auto‑vault, deposits/redemptions |
| MVP | Provenance + Revenue flows | Credential gating, RevenueFacet splits, initial SDK hooks |
| Post‑MVP | Governance + Credits | DAO/Compliance upgrades, Credit mode, explorer & analytics |

---

## 17. Risks & Mitigations (Brief)

- **Regulatory**: Programmable compliance facets; credential gating; audit logs.  
- **Liquidity**: POL/treasury custody and buyback budget design; exit caps and cooldowns.  
- **Security**: Standard diamond controls, guards, and progressive audits.
- **Adoption**: Validator network effects + partnership incentives; credentialing portal lowers barriers.

---

## 18. Closing

H1 Labs unites verifiable human expertise with transparent token economics. By making provenance, credentialing, and compliance the substrate for AI data, we unlock trustworthy, enterprise‑grade datasets — and a sustainable crypto economy that rewards the people who create real intelligence.

The dual-token model ($LABS + H1), combined with revenue-driven buybacks and level-based app slots, creates a self-reinforcing flywheel where early adopters and high-quality validators are rewarded proportionally. This is not speculative tokenomics — it is provable economics tied to real dataset sales in regulated markets.


