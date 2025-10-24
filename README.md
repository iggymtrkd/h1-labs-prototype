# 🧬 H1 Labs
### Making AI Data Legally Defensible

> **The Problem:** AI companies in regulated markets (healthcare, finance, defense) can't prove their training data is compliant. When audited, "we bought data from a vendor" doesn't hold up.

> **Our Solution:** Every dataset is created by an AI agent AND reviewed by a credentialed expert, both signing on-chain. Regulators get an immutable audit trail. Contributors get paid automatically.

---

## 🎯 Why This Matters

AI models are only as good as their training data — but today's data pipelines are fundamentally broken in regulated markets:

**The Core Problems:**
- **No Audit Trail** → Companies can't prove HIPAA/GDPR compliance when regulators ask
- **Anonymous Data** → "Who validated this?" is a question nobody can answer
- **Legal Liability** → Healthcare AI companies face fines and shutdowns for using unverified data
- **Zero Provenance** → No cryptographic proof that a credentialed expert reviewed the data
- **Exploitation** → Data contributors have no stake in the value they create

**The Cost:**
- 85% of enterprise AI projects fail due to compliance issues
- Companies spend $500K–$2M annually on data ops and compliance lawyers
- When sued, weak data provenance becomes exhibit A against you

---

## 💡 How H1 Labs Solves It

We transform data into a **verified, monetizable, compliant asset** through three breakthroughs:

### 1. Dual-Intelligence SDK
Every dataset is created by **AI + Human Expert**, both signing on-chain:
```
Dataset → AI Agent enriches it → Credentialed Expert reviews 
        → Both sign on-chain → Immutable proof → Regulators satisfied
```

- **AI handles heavy lifting** (faster, cheaper)
- **Human validator ensures compliance** (board-certified, licensed)
- **Both signatures on-chain** (regulatory defensibility)

### 2. On-Chain Provenance
Every action is recorded with cryptographic proof:
- Who collected the data (verified credential)
- Who reviewed it (verified credential in matching domain)
- What quality improvement it achieved (Δ-gain score)
- When it was approved (timestamp + signature)

**Result:** Regulators click one link, see full audit trail

### 3. Automated Revenue Sharing
When data sells, smart contracts automatically split payments:
- Creator: 45%
- Validator: 15%
- Lab: 40%

No manual invoicing. No delays. Fair compensation baked into the protocol.

---

## 🏗️ How It Works

```
┌─────────────────────────────────────────────────────────┐
│                   THE H1 FLYWHEEL                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Stake $LABS → Create Lab → Auto-mint H1 tokens    │
│  2. AI Agent enriches data → Expert reviews            │
│  3. Both sign on-chain → Dataset published             │
│  4. Enterprise buys dataset → Revenue splits           │
│  5. Contributors earn → Validators earn → Lab earns    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**For Healthcare AI Companies:**
- Access HIPAA-compliant datasets with on-chain proof
- When FDA asks "who validated this?", you show board-certified radiologist's signature
- Ship products 6 months faster

**For Domain Experts:**
- Stake credentials, earn $50K–$500K annually in passive yield
- Get paid for expertise you already have
- Build reputation on-chain

**For Developers:**
```python
# 10 lines of code = full regulatory compliance
dataset = h1.create_dataset(
    name="Cardiac Imaging",
    domain="healthcare",
    base_model="ResNet-50-v2"
)

agent_output = ai_agent.enrich(dataset)  # AI does the work
expert_review = validator.approve(agent_output)  # Human signs off

# H1 handles: credentialing, on-chain signatures, audit trail, revenue splits
```

---

## 🤖 Dual-Intelligence SDK: How It Works

The H1 SDK orchestrates a **two-stage workflow** where AI and human intelligence collaborate:

### The Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 DUAL-INTELLIGENCE WORKFLOW                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: AI Agent (First Intelligence)                     │
│  ├─ Input: Raw data (ECG, X-ray, financial transaction)   │
│  ├─ Process: Model inference, enrichment, annotation       │
│  ├─ Output: Initial analysis + confidence scores           │
│  └─ Logged: Base model ID, timestamp, output hash          │
│                                                             │
│  Step 2: Human Expert (Second Intelligence)                │
│  ├─ Input: AI output + original data                       │
│  ├─ Process: Expert review, correction, validation         │
│  ├─ Output: Approved/rejected + improvement score          │
│  └─ Logged: Credential ID, signature, Δ-gain               │
│                                                             │
│  Step 3: On-Chain Recording                                │
│  ├─ Both signatures combined                               │
│  ├─ Provenance ledger updated                              │
│  ├─ Attribution created (revenue splits)                   │
│  └─ Dataset ready for sale                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Code Example

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

### Why Dual-Intelligence?

| Challenge | AI Alone | Human Alone | Dual-Intelligence |
|-----------|----------|-------------|-------------------|
| **Speed** | ✅ Fast | ❌ Slow | ✅ Fast (AI does heavy lifting) |
| **Cost** | ✅ Cheap | ❌ Expensive | ✅ Efficient (AI reduces human work) |
| **Quality** | ⚠️ Variable | ✅ High | ✅ Best of both |
| **Compliance** | ❌ Unverified | ✅ Credentialed | ✅ Cryptographically proven |
| **Scalability** | ✅ Unlimited | ❌ Bottleneck | ✅ Scales with validators |
| **Regulatory** | ❌ No audit trail | ⚠️ Manual logs | ✅ Immutable on-chain proof |

### Real-World Example: Healthcare AI

```
Input: ECG reading from patient

AI Agent (Mistral 7B):
├─ "Possible atrial fibrillation detected"
├─ Confidence: 78%
└─ Baseline accuracy: 85%

↓ [Submitted to validator]

Human Expert (Board-certified Cardiologist):
├─ Reviews AI output + raw ECG
├─ Confirms: "AFib with RVR, recommend anticoagulation"
├─ Adds clinical context: "Consider CHA₂DS₂-VASc score"
└─ Signs off with verified credential

↓ [Both recorded on-chain]

Result:
├─ Δ-Gain: 12% improvement (AI: 85% → Final: 92%)
├─ Provenance: Immutable record linking AI model + MD
├─ Compliance: FDA can audit entire chain
└─ Monetizable: Enterprise pays premium for enriched data

Revenue Split:
├─ AI Provider: 10%
├─ MD Validator: 15%
├─ Data Creator: 35%
├─ Lab: 40%
```

### Key Features

✅ **Automatic Compliance**: HIPAA/GDPR/EU AI Act rules enforced at SDK layer  
✅ **Credential Verification**: Only verified experts can approve  
✅ **Domain Matching**: Cardiologists review cardio data, radiologists review imaging  
✅ **Δ-Gain Tracking**: Measures improvement from base model to final output  
✅ **Immutable Audit Trail**: Every step logged on-chain for regulators  
✅ **Revenue Automation**: Smart contracts split payments based on contribution  

**Try it:** [Interactive SDK Demo Portal](https://h1labs.com/sdk-demo) *(coming soon)*

**Learn more:**
- [SDK Integration Guide](docs/DATA_VALIDATION_SDK_INTEGRATION.md) — Full API reference & React hooks
- [SDK Demo Portal Spec](docs/SDK_DEMO_PORTAL_SPEC.md) — Build your app in 15 minutes

---

## 💰 Tokenomics

### Automatic H1 Distribution on Lab Creation

When you create a lab (minimum 100K $LABS staked), H1 tokens are **automatically minted and distributed**:

| Recipient | Allocation | Example (100K LABS) | Status |
|-----------|------------|---------------------|--------|
| **Lab Owner** | 30% | 30,000 H1 | Vested 6 months (weekly unlocks) |
| **Bonding Curve** | 10% | 10,000 H1 | Liquid (trade immediately) |
| **Scholar Reserve** | 40% | 40,000 H1 | Vested (paid as work completes) |
| **Dev Reserve** | 15% | 15,000 H1 | Vested (paid as work completes) |
| **Protocol Treasury** | 5% | 5,000 H1 | Instant distribution |

**Key Features:**
- **1:1 H1 to LABS ratio** (up to 500K max per lab)
- **Bonding curve deployed automatically** (trading enabled from day 1)
- **Owner vesting**: 26 weeks, weekly unlocks after 1-week cliff
- **No dilution**: All labs backed by staked $LABS

### The Economic Model

```
$LABS (Governance + Staking)
    ↓
Stake to Create Lab
    ↓
H1 Tokens Minted (1:1 with LABS, max 500K)
    ↓
Automatic Distribution:
├─ 30% Owner (vested) → Long-term alignment
├─ 10% Bonding Curve → Immediate liquidity
├─ 40% Scholars → Future data validation work
├─ 15% Devs → Future SDK/app development
└─ 5% Treasury → Protocol sustainability
    ↓
Revenue from Dataset Sales
    ↓
Smart Contract Splits to Contributors
    ↓
Validators Earn Passive Yield
```

**Why This Works:**
- **Sustainable**: Revenue-driven, not inflationary
- **Aligned**: Vesting ensures long-term commitment
- **Fair**: Contributors earn based on verified credentials + quality (Δ-gain)
- **Liquid**: 10% in bonding curve enables price discovery

---

## 🚀 Real Use Cases

✅ **Healthcare AI Company** needs HIPAA-compliant cardiac imaging datasets  
→ Uses H1 SDK → Gets datasets reviewed by board-certified cardiologists → Shows FDA on-chain audit trail

✅ **Robotics Firm** building motion-capture validation  
→ Certified engineers sign off on-chain → Safety compliance proven → Liability reduced

✅ **Legal Startup** automating AML/KYC reviews  
→ Credentialed compliance officers attached → Defensible in court

✅ **Artists** monetizing game assets  
→ Provable ownership + royalty chains on-chain

---

## 🏆 What Makes Us Different

| Competitor | Approach | H1 Labs |
|------------|----------|---------|
| **Scale AI** | Crowd workers, no credentials | Credentialed experts, on-chain proof |
| **Bittensor** | AI compute marketplace | Data validation marketplace |
| **Surge AI** | High-quality annotations | Compliance + credentials + provenance |
| **Kaggle** | Community datasets | Expert-validated, auditable |

**Our Moats:**
1. **Credentialed Validators** → Only platform that verifies and pays professional experts
2. **Regulatory Compliance** → On-chain audit trail built for FDA/SEC/GDPR
3. **Full Stack** → Data creation → Validation → Marketplace → Revenue → All in one protocol
4. **Sustainable Economics** → Revenue-funded validator yields, not token inflation

---

## 🧱 Tech Stack

**Smart Contracts:**
- Diamond proxy pattern (EIP-2535) for upgradeability
- 6 facets: Core, Vault, Bonding, Revenue, Treasury, Lab Pass
- Base Sepolia testnet (production-ready)

**Frontend:**
- React + TypeScript + Vite
- TailwindCSS + Framer Motion
- Recharts for data visualizations
- Wagmi + Coinbase Wallet SDK

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL + event indexer
- IPFS for off-chain verification docs

---

## 🧬 Vision

> "Every dataset should have provenance. Every validator should earn yield. Every compliance requirement should be programmable."

We're building the infrastructure layer for the AI economy — where data has verifiable origins, contributors are fairly compensated, and regulatory compliance is automated.

---

## 🤝 Get Involved

**For Investors:** Read the [litepaper](public/litepaper.md) and see [tokenomics](H1_TOKENOMICS_UPGRADE_GUIDE.md)

**For Developers:** Check out the [SDK integration guide](docs/FRONTEND_INTEGRATION_GUIDE.md) and [quick reference](IMPLEMENTATION_QUICK_REFERENCE.md)

**For Domain Experts:** Join as a validator and earn passive yield from your credentials (soon)

**For Enterprise:** Contact us about compliant data access for your AI training pipeline (soon)

---

## 📞 Contact

Built with 💜 by **H1 Labs Core Team**  
Website: [https://h1labs.ai](https://h1labs.ai) (prototype)  
Twitter: [@h1labs](https://twitter.com/h1labs) (coming soon)

---

## 🪙 License

MIT License © 2025 H1 Labs

