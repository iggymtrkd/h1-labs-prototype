# **H1 SDK Demo Portal — Product Specification**

> **Status:** Product Specification for Implementation  
> **Focus:** Developer Onboarding & "Plug & Play" App Building  
> **Last Updated:** October 2025

---

## **Overview**

Build the **H1 SDK Demo Portal**, an interactive sandbox that lets developers configure their H1 app visually, understand the Dual-Intelligence architecture, and generate production-ready code in 15 minutes.

**Core Value Prop:**
- Devs see the architecture **live**
- AI-powered code generation as they configure
- Copy-paste ready SDK integration examples
- No blockchain knowledge required to start
- "Make your own H1 app" plug-and-play experience

**Target Users:**
- Healthcare app developers (radiologists, clinicians)
- ML engineers building medical AI
- Web2 developers entering blockchain
- Enterprise product managers evaluating H1 Labs

---

## **Page Architecture & Layout**

### **Option 1: Three-Column Layout (Desktop Optimized — RECOMMENDED)**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    H1 SDK — Build Your App                          │
│                                                                      │
│  ┌────────────────┐  ┌─────────────────────────┐  ┌──────────────┐ │
│  │   ARCHITECTURE │  │   APP CONFIG & CODE    │  │  AI ASSISTANT│ │
│  │     DIAGRAM    │  │       GENERATOR        │  │    CHAT      │ │
│  │                │  │                         │  │              │ │
│  │ ┌────────────┐ │  │ Step 1: Choose Model  │  │ "Hi! I'm    │ │
│  │ │ H1 SDK     │ │  │ ☐ Mistral 7B         │  │  ready to   │ │
│  │ │    ↓       │ │  │ ☐ LLaMA 3            │  │  help you   │ │
│  │ │ ┌────────┐ │ │  │ ☐ OpenAI             │  │  build your │ │
│  │ │ │  App   │ │ │  │ ☐ Bring Your Own     │  │  H1 app!    │ │
│  │ │ └─┬──┬───┘ │ │  │                       │  │             │ │
│  │ │   │  │     │ │  │ [Generate Hook Code] │  │ What domain │ │
│  │ │ AI 1st    │ │  │                       │  │ are you in? │ │
│  │ │ MD 2nd    │ │  │ Step 2: Compliance   │  │             │ │
│  │ │           │ │  │ ☐ HIPAA              │  │ [Options]   │ │
│  │ └───────────┘ │  │ ☐ GDPR               │  │             │ │
│  │               │  │ ☐ C2PA               │  │ [Send]      │ │
│  │ Δ-Gain Flow   │  │                       │  │             │ │
│  │ ↓             │  │ Step 3: Generated Code│  └──────────────┘ │
│  │ Attribution   │  │ ┌─────────────────────┐ │
│  │ ↓             │  │ │ const app = new    │ │
│  │ Compliance ✓  │  │ │ H1App({            │ │
│  │               │  │ │   baseModel:...    │ │
│  │ [Copy Code]   │  │ │   compliance:...   │ │
│  │ [Deploy]      │  │ │ })                 │ │
│  └────────────────┘  │ [Copy to Clipboard] │ │
│                      │ [Deploy to Testnet] │ │
│                      │ [View Full Docs]    │ │
│                      └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Layout Strategy:**
- **Left (25%):** Interactive Dual-Intelligence Architecture Diagram
- **Middle (50%):** Step-by-step Configuration Wizard + Code Preview
- **Right (25%):** AI Assistant Chat Panel

**Responsive Behavior:**
- **Desktop:** Full three-column
- **Tablet:** Two-column (diagram+config left | chat right, swappable tabs)
- **Mobile:** Stacked with collapsible AI panel at bottom

---

## **Left Column: Interactive Architecture Diagram**

### **Visual Design:**

Interactive SVG diagram that **UPDATES in real-time** as user configures:

#### **Initial State:**
```
┌──────────────┐
│   H1 SDK     │
└──────┬───────┘
       ↓
   ┌─────────┐
   │  App    │
   └─┬────┬──┘
     │    │
  AI │    │ MD
  1st│    │ 2nd
     │    │
   ┌─┴────┴┐
   │        │
   ▼        ▼
[Model]  [Validator]
```

#### **After User Selects "Healthcare + Cardiology":**

```
┌────────────────────────────────────────┐
│   H1 SDK                               │
│   ├─ Compliance: HIPAA ✓              │
│   ├─ Domain: Healthcare                │
│   └─ Specialty: Cardiology             │
└──────┬────────────────────────────────┘
       ↓
   ┌──────────────────┐
   │  CardioApp       │
   │  (Your App Name) │
   └─┬───────────────┬┘
     │               │
  Agent (Mistral 7B)│Clinician (MD)
     │               │
   ┌─┴───────────────┴┐
   │                  │
   ▼                  ▼
[Model Inference]  [Review & Approval]
     │                  │
     └──────┬───────────┘
            ↓
      Δ-Gain Asset
      ├─ Supervised Diff
      ├─ Attribution
      ├─ Compliance Proof
      └─ Ready for Sale

Legend:
├─ Green: Configured ✓
├─ Yellow: In Progress
├─ Gray: Not Selected
└─ Interactive: Click nodes for details
```

### **Interactive Features:**

| Feature | Behavior |
|---------|----------|
| **Click Nodes** | Tooltip explains component, shows function |
| **Hover Over Flows** | Shows data that moves through that pipe |
| **Highlight on Config** | Show affected components glow/highlight |
| **Animation** | Data flowing through pipes when step completes |
| **Color Coding** | Status (configured/pending/error) |
| **Responsive** | Scales down on tablet/mobile, becomes collapsible |

### **Node Details (Expandable):**

When user clicks "AI First" node:
```
┌──────────────────────────────────────┐
│ 🤖 Agent (First Intelligence)        │
├──────────────────────────────────────┤
│ Type: Mistral 7B LLM                │
│ Endpoint: api.mistral.ai/v1/chat   │
│                                      │
│ Purpose:                             │
│ "Generates initial response to      │
│  medical input. Executes workflow   │
│  autonomously based on parameters." │
│                                      │
│ Performance:                         │
│ • Latency: ~500ms per inference    │
│ • Cost: ~$0.001 per call           │
│ • Accuracy baseline: [metrics]     │
│                                      │
│ [View Configuration] [Edit]         │
│ [View API Docs]                     │
└──────────────────────────────────────┘
```

---

## **Middle Column: Configuration Wizard & Code Generator**

### **Progressive Disclosure Pattern:**

Show 5-step wizard with ability to jump between steps:

```
Step Indicators (Top):
1️⃣  Model    2️⃣  Config    3️⃣  Compliance    4️⃣  Validators    5️⃣  Review

Current Progress: [████████░░] Step 3 of 5
```

---

### **STEP 1: Choose Your Base Model**

```
Section: "Choose Your Base Model"
Subheading: "What AI model powers your app's first intelligence?"

┌─ ☐ Mistral 7B (RECOMMENDED for healthcare)
│  ├─ Icon: 🚀 (lightning bolt)
│  ├─ Performance: Fast, 7B parameters
│  ├─ Use Cases: Real-time diagnostics, medical chat
│  ├─ Cost: ~$0.001 per 1000 tokens
│  ├─ License: Apache 2.0 (self-host or API)
│  └─ Badge: "Popular for medical" ⭐⭐⭐⭐⭐
│
├─ ☐ LLaMA 3 (Most Powerful)
│  ├─ Icon: 🧠
│  ├─ Performance: 70B parameters, best reasoning
│  ├─ Use Cases: Complex medical reasoning, research
│  ├─ Cost: ~$0.002 per 1000 tokens
│  ├─ License: Community / Commercial
│  └─ Badge: "Best for complex logic" ⭐⭐⭐⭐⭐
│
├─ ☐ OpenAI GPT-4 (Most Accurate)
│  ├─ Icon: 🔮
│  ├─ Performance: Highest accuracy, multimodal
│  ├─ Use Cases: High-stakes clinical decisions
│  ├─ Cost: ~$0.03 per 1000 tokens
│  ├─ License: Commercial (requires API key)
│  ├─ Requires: OpenAI API Key [input field]
│  └─ Badge: "Enterprise choice" ⭐⭐⭐⭐⭐
│
└─ ☐ Bring Your Own Model (Custom Deployment)
   ├─ Icon: 🛠️
   ├─ Endpoint: [text input]
   ├─ Auth: [dropdown: None / Bearer Token / API Key]
   ├─ Model Architecture: [dropdown: Transformer / Llama / Other]
   └─ Note: "Your model stays in your infrastructure"

Selected: Mistral 7B ✓

[Compare Models] [Learn More About Models] [Continue →]
```

---

### **STEP 2: Configure Your App**

```
Section: "Configure Your Application"

App Identity:
├─ App Name: [Input: "CardioLab"] ✓
│  └─ "Human-friendly name for your lab"
├─ App Symbol: [Input: "CARDIO"] ✓
│  └─ "4-6 chars, used for H1 token ticker"
└─ App Description: [Textarea]
   "AI-assisted ECG interpretation with cardiologist review"

Domain Selection:
├─ Domain: [Dropdown: Healthcare ▼] ✓
│  └─ "Primary use case"

Specialty (Healthcare):
├─ [Multi-select Checkboxes]
│  ├─ ☑ Cardiology (PRIMARY)
│  ├─ ☐ Oncology
│  ├─ ☐ Radiology
│  ├─ ☐ Internal Medicine
│  ├─ ☐ Emergency Medicine
│  └─ ☐ Other [text input]
│
└─ Sub-Specialty (optional): [Text input]
   "Interventional Cardiology"

Icon/Logo (Optional):
├─ [Drag & Drop or Upload]
├─ "Square 512x512 PNG recommended"
└─ Preview: [Shows uploaded icon]

[Back] [Continue →]
```

---

### **STEP 3: Compliance & Legal Binding**

```
Section: "Compliance & Regulatory Framework"
Subheading: "Which regulations apply to your domain?"

┌─ ☑ HIPAA (US Healthcare) [CHECKED BY DEFAULT]
│  ├─ Icon: 🔒
│  ├─ Description: "US law protecting patient health data"
│  ├─ Enforced Rules:
│  │  ├─ De-identification: [Toggle: ON ✓]
│  │  │  └─ "Remove all PHI before storing"
│  │  ├─ Audit Logging: [Toggle: ON ✓]
│  │  │  └─ "Record all data access events"
│  │  └─ Max Data Retention: [Dropdown: 30 days ▼]
│  │
│  └─ [Learn More about HIPAA]
│
├─ ☑ GDPR (EU Users) [If EU targeting]
│  ├─ Icon: 🇪🇺
│  ├─ Description: "EU data protection regulation"
│  ├─ Enforced Rules:
│  │  ├─ Right to Erasure: [Toggle: ON ✓]
│  │  │  └─ "Users can request data deletion"
│  │  ├─ Data Residency: [Dropdown: EU ▼]
│  │  │  └─ "Data stays in EU (not exported to US)"
│  │  └─ Consent Required: [Toggle: ON ✓]
│  │
│  └─ [Learn More about GDPR]
│
├─ ☑ EU AI Act (Enterprise Requirement)
│  ├─ Icon: 🚨
│  ├─ Description: "EU regulation for high-risk AI"
│  ├─ Enforced Rules:
│  │  ├─ Risk Classification: [Dropdown: Limited Risk ▼]
│  │  │  └─ Options: Minimal / Limited / High / Prohibited
│  │  └─ Model Explainability: [Toggle: ON ✓]
│  │     └─ "Model must explain its reasoning"
│  │
│  └─ [Learn More about EU AI Act]
│
├─ ☐ C2PA (Content Provenance)
│  ├─ Icon: 🎨
│  ├─ Description: "Provenance for creative/media content"
│  ├─ Status: "Available for: Art, Gaming, Media domains"
│  └─ [Learn More about C2PA]
│
└─ ☐ Other (Custom Compliance Rule)
   ├─ Name: [Text input]
   ├─ Description: [Textarea]
   └─ [Add Rule]

Compliance Summary:
┌──────────────────────────────────────┐
│ ✓ HIPAA: Enabled (de-id + audit)    │
│ ✓ GDPR: Enabled (right to erasure)  │
│ ✓ EU AI Act: Limited risk category  │
│                                      │
│ Impact: Validators can access PHI   │
│ and earn 3x multiplier rewards      │
│ for handling regulated data         │
└──────────────────────────────────────┘

[Back] [Continue →]
```

---

### **STEP 4: Validator Credentialing**

```
Section: "Validator Requirements"
Subheading: "Who reviews the AI outputs?"

Validator Type:
├─ Primary Validator: [Dropdown]
│  ├─ MD / DO (Doctor of Medicine)
│  ├─ PA-C (Physician Assistant)
│  ├─ NP (Nurse Practitioner)
│  ├─ Domain Expert (AI Researcher)
│  └─ Credentialed Other
│
└─ Selected: MD / DO ✓

Credential Requirements (Auto-filtered by type):
├─ ☑ Active Medical License (required)
│  └─ State Board Verification via API
│
├─ ☑ Board Certification (recommended)
│  └─ e.g., ABIM, ABOM for specialties
│
├─ ☑ Malpractice Insurance (recommended)
│  └─ Proof of active coverage
│
├─ ☑ Background Check (required)
│  └─ FCRA-compliant screening
│
└─ ☐ Published Research (optional)
   └─ Peer-reviewed publications boost credibility

Earning Structure (Automatic Calculation):
┌─────────────────────────────────────────┐
│ Per Dataset Validation:                 │
│                                         │
│ Base Reward: 1 H1 token                │
│ Credentialed Multiplier: +3x = 3 H1   │
│ Board Cert Bonus: +0.5x = 0.5 H1       │
│ Published Research Bonus: +0.25x = 0.25│
│                                         │
│ TOTAL: 3.75 H1 tokens per validation  │
│                                         │
│ (Compared to unverified: 1 H1 token)   │
└─────────────────────────────────────────┘

Validator Pool (Optional):
├─ Allow multiple validators: [Toggle: ON]
│  └─ "Consensus validation increases quality"
├─ Minimum approvals required: [Slider: 1 - 5]
│  └─ Suggested: 2 for high-stakes decisions
└─ Quorum size: [Dropdown]
   ├─ 50% unanimous
   ├─ 66% majority
   └─ 100% consensus

[Back] [Continue →]
```

---

### **STEP 5: Generated Code & Deployment**

```
Section: "Generated SDK Integration Code"

Your H1 SDK Setup:

┌─────────────────────────────────────────────────────────┐
│ // cardiolab-app.tsx                                   │
│ import { H1SDK } from '@h1/sdk';                       │
│                                                         │
│ const app = new H1SDK({                                │
│   name: 'CardioLab',                                   │
│   symbol: 'CARDIO',                                    │
│   domain: 'healthcare',                                │
│   specialty: ['cardiology'],                           │
│   description: 'AI-assisted ECG interpretation...',   │
│                                                         │
│   baseModel: {                                         │
│     provider: 'mistral',                              │
│     modelId: 'mistral-7b',                            │
│     endpoint: 'https://api.mistral.ai/v1/chat',       │
│   },                                                   │
│                                                         │
│   compliance: {                                        │
│     hipaa: {                                           │
│       enabled: true,                                   │
│       deIdentify: true,                                │
│       auditLog: true,                                  │
│       retention: 2592000 // 30 days                    │
│     },                                                 │
│     gdpr: {                                            │
│       enabled: true,                                   │
│       rightToErasure: true,                            │
│       dataResidency: 'EU'                              │
│     },                                                 │
│     euAIAct: {                                         │
│       riskCategory: 'limited',                         │
│       explainability: true                             │
│     }                                                  │
│   },                                                   │
│                                                         │
│   validators: {                                        │
│     type: 'credentialed_md',                           │
│     requirements: [                                    │
│       'active_license',                                │
│       'board_cert',                                    │
│       'insurance',                                     │
│       'background_check'                               │
│     ],                                                 │
│     minApprovals: 2,                                   │
│     quorumType: 'unanimous'                            │
│   }                                                    │
│ });                                                    │
│                                                         │
│ // Dual-Intelligence Workflow:                        │
│ app.registerWorkflow({                                │
│   step1: 'agent_inference',                           │
│   step2: 'validator_review',                          │
│   step3: 'deltaGain_compute',                         │
│   step4: 'provenance_log',                            │
│   step5: 'dataset_bundle'                             │
│ });                                                    │
│                                                         │
│ export default app;                                    │
└─────────────────────────────────────────────────────────┘

Action Buttons:
[📋 Copy Code]  [📥 Download as File]  [🔗 Copy NPM Install]

[🚀 Deploy to Testnet]
├─ Creates Lab on Base Sepolia
├─ Deploys LabVault (H1 token)
├─ Mints LabPass NFT
└─ Redirects to Dashboard

[📚 View Full Documentation]
[💬 Ask AI Questions]
[🔄 Edit Configuration]

---

Preview Your Dataflow:
┌──────────────────────────────────────────────┐
│ Input: Medical case (ECG data)               │
│        ↓                                     │
│ Step 1: Mistral 7B inference                 │
│        "Possible atrial fibrillation"        │
│        ↓                                     │
│ Step 2: Cardiologist review                  │
│        "Confirmed AFib, EAR recommended"     │
│        ↓                                     │
│ Step 3: Δ-Gain computation                   │
│        "Clinical enrichment vs. baseline"    │
│        ↓                                     │
│ Step 4: Provenance logged                    │
│        "Hash + validator + timestamp onchain"│
│        ↓                                     │
│ Step 5: Ready for dataset sale               │
│        "Enterprise can license bundled data" │
└──────────────────────────────────────────────┘
```

---

## **Right Column: AI Assistant Chat Panel**

### **Purpose:**
Help developers understand H1 SDK, answer questions, suggest configurations, generate advanced code.

### **Conversational Flow Examples:**

#### **Example 1: Healthcare Radiology**

```
User: "I'm building a medical app for radiology imaging"

AI: "Great! Building for radiology imaging? 
    Here's what I recommend:

    🏥 Domain: Healthcare
    📸 Specialty: Radiology (+ Interventional if applicable)
    
    🤖 Base Model: LLaMA 3
       Why: Excels at image description tasks and 
            complex medical reasoning about imaging findings
    
    🔒 Compliance: HIPAA + GDPR + EU AI Act
       Why: Imaging is highly sensitive PHI
    
    👨‍⚕️ Validators: Board-certified radiologists
       Why: Only radiologists can credibly validate imaging AI
    
    💰 Earning Potential: 3.75 H1 per study
       Radiologists love this: High quality + high pay
    
    Special Feature: Support for DICOM files
    (Medical imaging standard)

    Would you like me to:
    1. Generate the full SDK config?
    2. Show code examples for DICOM upload?
    3. Explain Δ-Gain in radiology context?
    4. Calculate earning potential for your use case?"

User clicks: "Generate the full SDK config"

AI: Autofills the config form, updates diagram in real-time.
    Highlights: LLaMA 3, Radiology specialty, HIPAA enforcement.
```

#### **Example 2: Understanding Δ-Gain**

```
User: "What's delta-gain? How does it work?"

AI: "Excellent question! Δ-Gain (Delta-Gain) is the core of 
    H1's economic model. Here's how it works:

    📊 Delta-Gain = Supervised Improvement

    Example (Radiology):
    ├─ Base Model Output: 
    │  'Possible consolidation in RLL'
    │
    ├─ Your App Output:
    │  'Consolidation in RLL, likely pneumonia,
    │   recommend CT follow-up, consider antibiotics'
    │
    └─ Δ-Gain:
       'The clinical enrichment & context added'

    Why it matters:
    ✓ AI companies pay premium $ for enriched data
    ✓ Your validators earn 3x multiplier
    ✓ Provenance recorded onchain forever
    ✓ Revenue flows back to your Lab via buybacks

    Revenue Example:
    ├─ Dataset sold for $1000
    ├─ 50% to your Lab: $500
    ├─ 25% to protocol treasury: $250
    ├─ 25% for buybacks: $250
    │
    └─ Result: Your H1 (lab token) appreciates
       as buyback pressure increases

    Real-world earning:
    • 100 enriched datasets per month
    • $1000 average sale price
    • = $50,000 monthly revenue to your Lab

    Want to see the revenue distribution algorithm?"

User clicks: "Show revenue distribution algorithm"

AI: Displays smart contract pseudocode showing splits.
```

#### **Example 3: Deployment Help**

```
User: "How do I test this locally?"

AI: "Perfect! Here's the quickstart:

    1️⃣  Install H1 SDK:
    npm install @h1-labs/sdk

    2️⃣  Get testnet LABS:
    Visit https://h1labs.com/faucet
    Claim 1000 LABS (resets every 24 hours)

    3️⃣  Create your first Lab:
    const lab = await app.createLab({
      name: 'CardioLab',
      domain: 'healthcare',
      symbol: 'CARDIO'
    })

    4️⃣  Deploy optional components:
    // Bonding curve for bootstrap
    await lab.deployBondingCurve()
    
    // NFT for identity/level
    await lab.deployLabPass()

    5️⃣  Start submitting data:
    await app.submitDataset({
      data: ecgData,
      baseModel: 'mistral-7b',
      validator: validatorAddress
    })

    6️⃣  Monitor your Lab:
    Visit h1labs.com/dashboard
    See earnings, validators, datasets

    Common issues?
    • 'Provider not set': Add your wallet provider
    • 'Base Sepolia RPC error': Check network connection
    • 'Insufficient gas': Testnet ETH from faucet
    • Other issues?

    [View Troubleshooting Guide] [View Code Examples]"

User clicks: "View Code Examples"

AI: Links to GitHub examples in `/examples` folder.
```

#### **Example 4: Custom Compliance**

```
User: "Can I add custom compliance for my specific use case?"

AI: "Absolutely! Custom compliance is powerful for specialized domains.

    Example: 'Require explicit patient consent for ECG data'

    Step 1: Define the rule
    ├─ Rule name: 'cardiology_patient_consent'
    ├─ Enforcement: 'block_upload_if_no_consent'
    └─ Evidence: 'consent_signature_hash'

    Step 2: Add to your config
    app.compliance.addCustomRule({
      name: 'cardiology_patient_consent',
      description: 'Require patient consent for ECG',
      enforcement: 'block_upload_if_no_consent',
      evidence: 'consent_signature_hash',
      penalty: 'dataset_rejection'
    })

    Step 3: Smart contract encoding
    ├─ Validates consent hash at upload time
    ├─ Blocks upload if missing
    ├─ Logs rejection onchain
    └─ Validators only see consented data

    Benefits:
    ✓ Regulatory compliance (automated)
    ✓ Patient privacy (enforced)
    ✓ Trust for enterprise buyers
    ✓ Audit trail (immutable)

    Want me to generate the full custom rule?"

User clicks: "Generate full custom rule"

AI: Shows complete Solidity pseudocode for custom compliance facet.
```

### **AI Capabilities:**

| Capability | How It Works |
|-----------|-------------|
| **Context Awareness** | Remembers user's model, domain, specialty choices |
| **Code Generation** | Auto-generates SDK integration code, contract code |
| **Configuration Help** | Suggests compliance settings per domain |
| **Troubleshooting** | Helps debug common issues, links to docs |
| **Documentation** | Links to relevant guides, examples, API docs |
| **Real-Time Updates** | Changes in chat update diagram + config form |
| **Suggestions** | Proposes optimizations based on domain |

### **Quick-Action Buttons After Each Response:**

```
[Generate Config] [Show Code] [Learn More] [Open Docs] [Ask Different Question]
```

---

## **Backend Integration Points**

### **API Endpoints Needed:**

```typescript
// Configuration & Code Generation
POST /api/sdk-demo/generate-config
  Params: { model, domain, specialty, compliance, validators }
  Returns: { config: object, code: string, estimatedEarnings: number }

POST /api/sdk-demo/generate-code
  Params: { config }
  Returns: { tsxCode: string, contractCode: string, exampleCode: string }

// AI Assistant
POST /api/sdk-demo/chat
  Params: { message, context: { selectedModel, domain, etc } }
  Returns: { response: string, suggestedActions: array }

// Deployment
POST /api/sdk-demo/deploy-testnet
  Params: { walletAddress, config }
  Returns: { labId: string, txHash: string, labVaultAddress: string }

// Template Library
GET /api/sdk-demo/templates
  Returns: [{ name, domain, baseModel, compliance, description }]

POST /api/sdk-demo/fork-template
  Params: { templateId }
  Returns: { config: object, code: string }
```

### **AI Backend Integration:**

```
Frontend → POST /api/sdk-demo/chat
          → LLM (Claude/GPT-4)
          → Context: User config, selected options
          → Tools: Code generation, config validation, 
                   compliance checking, revenue calculation
          → Response → Frontend
```

---

## **State Management**

```typescript
interface SDKDemoState {
  // Wizard progression
  currentStep: 1 | 2 | 3 | 4 | 5;
  completedSteps: number[];
  
  // User configuration
  config: {
    appName: string;
    appSymbol: string;
    description: string;
    domain: 'healthcare' | 'legal' | 'defense' | 'finance' | 'robotics';
    specialty: string[];
    baseModel: {
      provider: string;
      modelId: string;
      endpoint?: string;
      apiKey?: string;
    };
    compliance: {
      hipaa: { enabled: boolean; deIdentify: boolean; auditLog: boolean; retention: number };
      gdpr: { enabled: boolean; rightToErasure: boolean; dataResidency: string };
      euAIAct: { riskCategory: string; explainability: boolean };
      custom?: any[];
    };
    validators: {
      type: string;
      requirements: string[];
      minApprovals: number;
      quorumType: string;
    };
  };
  
  // Generated outputs
  generatedCode: {
    tsx: string;
    contract: string;
    example: string;
  };
  
  // AI Chat
  chatHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  
  // UI state
  selectedDiagramNode: string | null;
  chatPanelOpen: boolean;
  codePreviewExpanded: boolean;
}
```

---

## **"Plug & Play" Experience**

### **End-to-End Developer Journey (15-20 minutes):**

```
Developer lands on /sdk-demo
    ↓
Sees hero: "Build Your H1 App in 15 Minutes"
    ↓
1. Chooses base model (Mistral 7B)
   [Diagram updates: Shows Mistral connection]
    ↓
2. Configures app (CardioLab, Cardiology)
   [Diagram updates: AppName changes, specialty shows]
    ↓
3. Selects compliance (HIPAA + GDPR)
   [Diagram highlights: Compliance layer enforces]
    ↓
4. Sets validators (MD only, min 2 approvals)
   [Diagram updates: Shows validator node]
    ↓
5. Reviews generated code
   [Diagram shows complete flow with all components]
    ↓
Clicks "Deploy to Testnet"
    ↓
Backend creates:
├─ Lab on Base Sepolia
├─ LabVault (H1 token: CARDIO)
├─ BondingCurve (optional)
└─ LabPass NFT
    ↓
Receives:
├─ Ready-to-copy SDK initialization code
├─ Example workflow code
├─ Link to GitHub repo template
├─ Dashboard link to manage Lab
└─ Invite to #h1-developers Slack
    ↓
Developer:
✓ Copies code → Adds to their React project
✓ Installs @h1-labs/sdk npm package
✓ Runs locally on testnet
✓ Starts validating data
✓ Earns H1 tokens
```

---

## **MVP (Minimal Viable Product) Scope**

### **Phase 1: Week 1-2 (Launch MVP)**

```
Core Features:
├─ Configuration form (5 steps)
├─ Static diagram (or simple animated)
├─ Code generator (template-based)
├─ Copy-to-clipboard + download
├─ Deploy to testnet button
└─ Link to full docs

Excluded from MVP:
├─ AI chat (add in Phase 2)
├─ Interactive diagram (add in Phase 2)
├─ Community templates (add in Phase 2)
└─ Analytics/insights (add in Phase 2)
```

### **Phase 2: Week 3-4 (Enhanced Version)**

```
Additional Features:
├─ AI chat assistant
├─ Interactive diagram with real-time updates
├─ Community template library
├─ Usage analytics
├─ Suggested optimizations from AI
└─ Integration with app marketplace
```

---

## **Design & UX Best Practices**

### **Color Coding:**
- **Green**: Configured ✓
- **Yellow**: In progress ⏳
- **Blue**: AI suggestions 💡
- **Gray**: Optional/Not selected ⚪

### **Typography:**
- **Hero section**: Large, bold (36px)
- **Section headers**: 24px, semibold
- **Form labels**: 14px, medium weight
- **Code blocks**: Monospace, syntax highlighting

### **Spacing & Layout:**
- **Columns**: 25% | 50% | 25% (desktop)
- **Gutters**: 24px between columns
- **Card padding**: 16px
- **Button padding**: 12px 24px

### **Responsive Breakpoints:**
- **Desktop** (1200px+): Full three-column
- **Tablet** (768px-1199px): Two-column, swappable tabs
- **Mobile** (<768px): Single column, collapsible panels

---

## **Success Metrics & Analytics**

Track:
- **Completion rate** by step (where do devs drop off?)
- **Time to complete** (target: <15 minutes)
- **Model selection distribution** (which models most popular?)
- **Domain selection** (which domains most requested?)
- **Code copy rate** (% clicking "copy code"?)
- **Deployment rate** (% clicking "deploy to testnet"?)
- **Chat engagement** (avg messages per session?)
- **Follow-through** (% completing Lab creation after leaving demo?)

---

## **Key Features for "Plug & Play"**

| Feature | Benefit |
|---------|---------|
| **Pre-built Templates** | Choose from Healthcare, Legal, Defense samples |
| **Auto-Generated Code** | Copy-paste ready; no manual setup needed |
| **One-Click Deploy** | Deploy to testnet instantly |
| **No Crypto Knowledge** | AI explains everything; SDK handles complexity |
| **Live Diagram Updates** | See config reflected instantly visually |
| **Export Everything** | Download config + code as files |
| **Tutorial Mode** | Step-by-step for first-time builders |
| **Community Templates** | Fork & customize existing apps |

---

## **Success Looks Like**

```
Developer spends 15 minutes on /sdk-demo
    ↓
Clicks "Deploy to Testnet"
    ↓
Creates Lab with custom H1 token
    ↓
Adds validator credentials
    ↓
Submits first dataset
    ↓
Sees earnings accrue in real-time
    ↓
Loves it → Builds more complex workflows
    ↓
Becomes core H1 Labs developer
```
