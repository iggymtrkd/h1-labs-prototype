# **H1 Labs — Litepaper**  
> Status: Aligned with smart contracts as of 2025-10-19

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

### **Lab Lifecycle**

Creating a Lab unlocks three stages:

**Stage 1: Initialization**  
Lab creator stakes $LABS → auto-deploys isolated LabVault (H1 token) → domain registered uniquely.

**Stage 2: Growth via Deposits**  
$LABS deposits → converted to H1 shares at NAV → unlock progressive **Levels** based on TVL:
- **L1** ($10K–$50K): 1 app slot
- **L2** ($50K–$250K): 2 app slots  
- **L3** ($250K+): 3 app slots

Each level unlocks additional app deployment rights, creating natural scaling incentives.

**Stage 3: Bootstrap via Bonding Curve (Optional)**  
Labs deploy **BondingCurveSale** for capital raise. Price formula: `NAV × 1.005` (0.5% premium). Fee structure routes treasury fees to protocol, POL to liquidity reserve, remainder deposited to vault at fair value.

---

## 6. $LABS and H1 — Relationship, Mechanics, and the Economic Flywheel

- **$LABS (singleton ERC‑20):** Platform governance/staking asset. Set via `TreasuryFacet.setLABSToken`.  
- **H1 (per‑lab ERC‑20 shares):** Each Lab's `LabVault` is its own H1 token. Depositing $LABS mints H1 shares at NAV; redemptions return $LABS subject to cooldown and exit caps.  
- **Bonding Curve (optional):** `BondingCurveSale` buys H1 at NAV + 0.5% premium, routing fees/POL to treasury and depositing net $LABS to the lab's vault.  
- **Levels & App Slots:** LabVault tracks total assets to derive levels (L1/L2/L3) unlocking 1/2/3 app slots.  
- **Revenue Split (current implementation):** 50% to lab owner, 25% to protocol treasury (H1 pool custody), 25% retained for future buyback execution.

Economic intent: AI demand for verified datasets drives onchain payments that flow to Labs and treasury, with retained buyback budgets enabling future buy pressure mechanisms without dividend semantics.

---

### 6.5 Staking & Validator Rewards

**$LABS serves three functions:**
1. **Lab Creation:** Stake $LABS → mint H1 → unlock app slots and dataset economy
2. **Validation Rewards:** Contribute to datasets → earn $LABS grants + lab-specific H1 tokens
3. **Governance:** Hold $LABS → vote on protocol upgrades (future DAO)

**Validator Economics:**  
When a dataset sells (e.g., $100K), validators earn through:
- **Lab Revenue Share** (50% of sale): Proportionally split among validators → paid in lab-native H1 tokens
- **Protocol Grants** (25% of sale): Drawn from treasury → paid in $LABS for outstanding contributions
- **Buyback Pressure** (25% of sale): Retained for token repurchases → benefits all H1 holders via scarcity

This aligns incentives: more valuable contributions → higher rewards; increased lab success → increased validator payouts.

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
Auto-adjusting price pegged to vault NAV eliminates ICO-style pricing risks. Buyers pay 0.5% premium; protocol captures 2–3% fees; remainder enters vault proportionally.

**Formula:** `price_per_share = vault_NAV × 1.005`

**Example — Robotics Lab Launch:**

```
Day 1: Lab created with $100K deposit
├─ H1-Robotics NAV: $1.00/share
├─ Curve price: $1.005/share
└─ Level 1 unlocked

Day 7: $250K total capital raised via curve
├─ Treasury receives: $5K fees + $7.5K POL
├─ LabVault receives: $237.5K (deposited at NAV)
├─ New TVL: $337.5K
├─ New NAV: $1.125/share
└─ Reaches Level 2

Safety Features:
├─ Price bounds: [0.001, 1,000,000]
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

```
Labs created + capital staked
        │
        ▼
Validators enrich/validate datasets
        │
        ▼
AI companies purchase verified data
        │
        ▼
Revenue flows: 50% labs, 25% treasury, 25% buyback
        │
        ▼
Buyback execution → H1 supply decreases
        │
        ▼
H1 token price appreciates (lower supply + increasing NAV)
        │
        ▼
New labs incentivized (higher token value)
        │
        └──→ Cycle repeats at larger scale
```

**Financial Model (Y1-Y3):**

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Total TVL** | $5M | $50M | $250M |
| **Annual Dataset Revenue** | $2M | $20M | $100M |
| **$LABS Buyback Budget** | $500K | $5M | $25M |
| **Validator Payouts** | $1M | $10M | $50M |
| **Protocol Treasury** | $500K | $5M | $25M |

**Key Mechanic for Investors:** Revenue-driven buybacks create sustained upward pressure on $LABS and H1 tokens without dividend semantics. Unlike stake-reward models, H1's value comes from dataset sales — creating external, real demand.

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


