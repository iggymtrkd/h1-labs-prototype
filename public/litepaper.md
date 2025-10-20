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

## 2.5 Competitive Positioning — H1 vs The Field

H1 Labs uniquely combines **verified human intelligence, provenance, and compliance**. Unlike peers that focus on compute (Gensyn), model training (Bittensor), or data liquidity (Ocean), H1 targets regulated and semi-regulated markets with enterprise-grade trust.

| Dimension | H1 Labs | Bittensor | Scale AI | Ocean | Gensyn |
|-----------|---------|------------|----------|--------|---------|
| **Focus** | Human-validated datasets | Model training | Centralized data | Data liquidity | Compute network |
| **Compliance** | HIPAA, GDPR, C2PA, EU AI Act | None | Corporate | Optional | None |
| **Credentialing** | Verified NFTs + KYC | None | Manual | None | None |
| **Provenance** | Full onchain audit trail | None | Internal | Metadata only | None |
| **Revenue Model** | Onchain splits + buybacks | Inflationary | Fiat only | Stake-reward | Stake-reward |
| **Target Market** | Healthcare, Legal, Defense, Finance | General AI | Enterprise labeling | General data | ML infrastructure |

**Why it matters for investors:** H1's compliance-first approach opens regulated markets (healthcare TAM ~$200B+ in data licensing) that competitors cannot access.

**Why it matters for developers:** Programmable compliance means SDKs can launch in regulated sectors without custom legal wrangling.

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

## 5. Architecture (Lite)

### Diamond Standard Design (EIP-2535)

H1 uses the **Diamond Standard (EIP-2535)** as its core proxy pattern: a single proxy routes to modular **facets** (logic contracts) while maintaining a unified storage layer. This enables upgradeability without state migration and extensibility without redeployment.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          H1 LABS PLATFORM ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                             DIAMOND PROXY LAYER                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  H1Diamond.sol (EIP-2535 Proxy)                                        │  │
│  │  • Fallback routing to facets via function selectors                   │  │
│  │  • Immutable singleton (1 instance for entire platform)                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                     │                                         │
│                                     ├──────┐                                 │
│                ┌────────────────────┴──┐   └────────────────────┐            │
│                ▼                       ▼                         ▼            │
│  ┌──────────────────────┐  ┌─────────────────────┐  ┌────────────────────┐  │
│  │ Diamond Standard     │  │  Storage Library    │  │  Platform Facets   │  │
│  │ Management Facets    │  │                     │  │                    │  │
│  ├──────────────────────┤  ├─────────────────────┤  ├────────────────────┤  │
│  │ • DiamondCutFacet   │  │ • LibDiamond.sol    │  │ • LABSCoreFacet    │  │
│  │ • DiamondLoupeFacet │  │ • LibH1Storage.sol  │  │ • VaultFacet       │  │
│  │ • OwnershipFacet    │  │                     │  │ • BondingCurveFacet│  │
│  │ • SecurityFacet     │  │ Diamond Storage:    │  │ • LabPassFacet     │  │
│  └──────────────────────┘  │ - labs mapping      │  │ • RevenueFacet     │  │
│                             │ - nextLabId         │  │ • TreasuryFacet    │  │
│                             │ - labsToken addr    │  └────────────────────┘  │
│                             │ - vault mappings    │                          │
│                             │ - config params     │                          │
│                             └─────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        PER-LAB DEPLOYED CONTRACTS                            │
│         (Each Lab gets its own isolated instances of these contracts)        │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Lab #1 Ecosystem                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  LabVault.sol (ERC20 + ERC4626-style)                            │  │  │
│  │  │  • IS THE H1 TOKEN for this lab                                  │  │  │
│  │  │  • Accepts $LABS deposits → mints H1 shares                      │  │  │
│  │  │  • Level tracking (L1/L2/L3) based on TVL                        │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                              │                                         │  │
│  │  ┌──────────────────────────┴──────────────────────────────────────┐  │  │
│  │  │  BondingCurveSale.sol (Bootstrap)                                │  │  │
│  │  │  • Buy H1 shares with LABS at NAV + 0.5% premium                 │  │  │
│  │  │  • Protocol fees + POL for liquidity                             │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                         │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │  LabPass.sol (ERC721)                                             │  │  │
│  │  │  • NFT representing lab identity & credential level               │  │  │
│  │  │  • Soulbound (non-transferable) by default                        │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Lab #2, Lab #3... (N Labs, each isolated)                             │  │
│  │  • Same structure, independent state & contracts per lab               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why Diamond Pattern?**
- **Upgradeability**: Add new compliance facets (GDPR, HIPAA, C2PA) without redeploying storage
- **Modularity**: Clean separation of concerns; each facet handles one domain
- **Gas Efficiency**: Shared storage; single proxy overhead scales to thousands of labs
- **Security**: Approved initializer whitelist prevents malicious upgrades

```
H1Diamond (EIP‑2535) ── routes to facets
  • DiamondCut / Loupe / Ownership / Security
  • Platform Facets: LABSCore, Vault, BondingCurve, LabPass, Revenue, Treasury

Singleton Token
  • LABSToken (ERC‑20): governance, staking, platform utility

Per‑Lab Contracts (deployed per lab)
  • LabVault (ERC‑20 shares, ERC‑4626‑style) = H1 token for that lab
  • BondingCurveSale (optional bootstrap)
  • LabPass (ERC‑721, identity & level)
```

Key storage (LibH1Storage): `labs`, `nextLabId`, `labsToken`, cooldown/exit caps, `protocolTreasury`, curve params, `reentrancyStatus`, and per‑lab addresses (`labIdToVault`, `labIdToLabPass`, `labIdToCurve`).

---

## 6. $LABS and H1 — Relationship, Mechanics, and the Economic Flywheel

- **$LABS (singleton ERC‑20):** Platform governance/staking asset. Set via `TreasuryFacet.setLABSToken`.  
- **H1 (per‑lab ERC‑20 shares):** Implemented by each Lab’s `LabVault`. Depositing $LABS mints H1 shares; redemptions return $LABS subject to cooldown and exit caps.  
- **Bonding Curve (optional):** `BondingCurveSale` buys H1 at NAV + small premium, routing fees/POL to treasury and depositing net $LABS to the lab’s vault.  
- **Levels & App Slots:** LabVault tracks total assets to derive levels (e.g., L1/L2/L3) unlocking 1/2/3 app slots.  
- **Revenue Split (current implementation):** 50% to lab owner, 25% to protocol treasury (H1 pool custody), 25% retained for future buyback execution.

Economic intent: AI demand for verified datasets drives onchain payments that flow to Labs and treasury, with retained buyback budgets enabling future buy pressure mechanisms without dividend semantics.

---

### Economic Flywheel: How Value Accumulates

The H1 economy is designed as a **closed loop** that continuously strengthens as adoption increases:

```
Data Creation
     │
     ▼
Validation (Human-in-loop)
     │
     ▼
Onchain Proof (Provenance Facet logs enrichment)
     │
     ▼
Dataset Sale / Access (AI firms purchase verified data)
     │
     ▼
Revenue Split (50% lab owner, 25% treasury custody, 25% buyback budget)
     │
     ▼
Buyback Execution (reverts buyback budget into H1/LABS from liquidity pools)
     │
     ▼
Token Appreciation (lower supply, sustained demand)
     │
     ▼
New Labs Formed (higher token price incentivizes new creators)
     │
     └──→ Cycle repeats at larger scale
```

**Key mechanic for investors:** Revenue-driven buybacks create sustained upward pressure on $LABS and H1 tokens without dividend semantics. Unlike stake-reward models (Bittensor, Ocean), H1's value comes from dataset sales — creating external, real demand.

---

## 7. Technical Features (Selected)

- **Reentrancy Guards:** Shared via `LibH1Storage.reentrancyStatus` where needed (e.g., `RevenueFacet`).  
- **Upgradeable by Facet:** New domains or policy changes can be added without migrating state.  
- **Guardian Controls:** Cooldowns, daily exit caps, and pause mechanisms at the vault level.  
- **Security & Introspection:** Standard Diamond Loupe, Ownership, Security facets.

---

## 7.5 Why Blockchain Matters for H1

Blockchain is not ornament — it is the enforcement layer for provenance, compliance, and fair economics. Here's why each matters:

| Challenge | Blockchain Benefit | H1 Implementation | Result |
|-----------|-------------------|-------------------|---------|
| **Data Provenance** | Immutable audit trail | ProvenanceFacet logs enrichment, validators, timestamps | Regulators can verify dataset lineage |
| **Validator Integrity** | Cryptographic proof of contribution | Credentials NFT + onchain XP/Credits | Enterprise clients trust who validated data |
| **Compliance Enforcement** | Programmable legal constraints | ComplianceFacet binds HIPAA/GDPR/C2PA rules | AI firms know data is legally compliant |
| **Transparent Economics** | All payments recorded & verifiable | RevenueFacet splits logged per dataset sale | No opacity in revenue distribution |
| **Security & Trust** | Prevents tampering & fraud | Reentrancy guards, access control, audit logs | Protected against data theft & spoofing |

---

## 8. Credentialing Portal & Compliance-as-Code

### Credential Lifecycle

H1 verifies professionals before they contribute to sensitive datasets:

```
Apply (ID + License Upload)
        ↓
Verify (KYC-lite, resume check, domain validation)
        ↓
Mint Credential NFT (onchain proof of expertise)
        ↓
Validate / Enrich Data (only credentialed wallets can gate-access)
        ↓
Earn Rewards + Build Reputation (per-dataset payouts tracked)
        ↓
Renew / Upgrade Credentials (periodic refresh for compliance)
```

**For investors:** Credentialing creates moat — enterprise clients will only trust data validated by verified professionals. This is table-stakes for regulated markets.

**For developers:** SDK integrates credential checks automatically:
```javascript
if (H1SDK.Credential.verify(wallet, 'HIPAA_Clinician')) {
   allowDataEnrichment(dataset);
}
```

### Compliance-as-Code Framework

Every Lab declares its domain (Healthcare, Legal, Robotics, etc.) at creation. The platform automatically enforces:

| Domain | Compliance Standards | Contract Enforcement |
|--------|----------------------|----------------------|
| **Healthcare** | HIPAA, GDPR, EU AI Act | De-identification required; audit logs immutable; credentialed clinicians only |
| **Legal** | Attorney-Client Privilege, Data Residency | Whitelisted lawyer credentials; encrypted case files; regional constraints |
| **Defense** | ITAR, EAR, CMMC | Identity gating; zero-knowledge access; on-prem mirrors |
| **Finance** | AML/KYC, Basel III, MiFID II | Onchain identity linking; transaction screening; audit trails |

**For investors:** Programmable compliance opens markets that competitors cannot access (healthcare data licensing alone is $200B+).

**For developers:** Add new compliance domains via governance without code changes.

---

## 9. Developer SDK (At a Glance)

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

```mermaid
flowchart LR
  subgraph App["Your app (via H1 SDK)"]
    SDK[H1 SDK]
    AGENT[Agent]
    HUMAN[Credentialed Human]
  end

  subgraph Models["Base model options"]
    P1[(Partner LLM A)]
    P2[(Partner LLM B)]
    BYO[(Bring Your Own Model)]
  end

  SDK --> AGENT
  SDK --> HUMAN
  AGENT -->|inference| P1
  AGENT -->|inference| P2
  AGENT -->|inference| BYO
  AGENT --> OUT[Model output]
  HUMAN -->|review + sign‑off| OUT
  OUT -->|compute Δ (vs base)| DELTA[Delta‑Gain (new knowledge)]

  DELTA --> PROV[Onchain provenance + attribution]
  PROV --> BUNDLE[H1 Dataset Bundle]
  BUNDLE --> SALE[Sale / Licensing]

  SALE --> SPLITS{RevenueFacet policy}
  SPLITS -->|Lab share + buyback budget| LAB[Lab Vault (H1)]
  SPLITS --> TREAS[Treasury / Protocol]
  LAB -->|buybacks create buy pressure| HOLDERS[H1 token holders of that Lab]
```

---

## 10. Tokenomics (Lite)

### Roles
- **$LABS holders**: Stake, govern, seed labs, and participate in platform‑level value.  
- **H1 holders (per lab)**: Hold fractional shares of a lab’s backing and exposure to its dataset economy.  

### Flows
```
Stake/Deposit $LABS → Mint H1 → Enrich/Validate → Dataset Sale →
RevenueFacet Split (50/25/25) → Treasury custody + Buyback budget
```

Notes (current state):  
- Revenue is accepted as ETH and split immediately; buybacks are not automated yet (treasury event stubs exist).  
- Lab creation does not burn $LABS; scarcity accrues via demand, treasury custody, and future buyback execution.

---

## 11. Use Cases (Initial)

- **Healthcare**: Scrubber (de‑identification), Second Opinion+ (AI‑human consultation), Imaging annotation.  
- **Creative & Gaming**: Provenance frameworks for art and game assets (C2PA‑aligned), attribution and licensing onchain.  
- **Robotics & Industrial**: Motion/vision datasets with validated safety metadata.

---

## 12. Roadmap (Condensed)

| Phase | Milestone | Highlights |
|------|-----------|------------|
| Prototype | Testnet diamond + UI demo | LABS set, createLab, auto‑vault, deposits/redemptions |
| MVP | Provenance + Revenue flows | Credential gating, RevenueFacet splits, initial SDK hooks |
| Post‑MVP | Governance + Credits | DAO/Compliance upgrades, Credit mode, explorer & analytics |

---

## 13. Risks & Mitigations (Brief)

- **Regulatory**: Programmable compliance facets; credential gating; audit logs.  
- **Liquidity**: POL/treasury custody and buyback budget design; exit caps and cooldowns.  
- **Security**: Standard diamond controls, guards, and progressive audits.

---

## 14. Closing

H1 Labs unites verifiable human expertise with transparent token economics. By making provenance, credentialing, and compliance the substrate for AI data, we unlock trustworthy, enterprise‑grade datasets — and a sustainable crypto economy that rewards the people who create real intelligence.



