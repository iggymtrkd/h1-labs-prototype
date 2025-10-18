## Prompt for Lovable — H1 Labs Frontend Prototype & Roadmap

We are building the **frontend for H1 Labs**, a protocol that advances AI through **provable blockchain training and data enrichment**. The frontend must evolve in three stages — **Prototype**, **MVP**, and **Post-MVP** — each reflecting the Diamond-based smart contract architecture already described in the whitepaper.

---

### 🎯 **Overall Goal**
Create a sleek, Base-chain integrated web application that:
- Communicates the **vision** of H1 Labs (human-validated AI training onchain).
- Demonstrates **staking, Labs creation, and H1 Token issuance** on Base testnet.
- Provides an **app marketplace and dashboard** for users, validators, and developers.
- Evolves into a full data economy and SDK portal.

Style references: Base UI aesthetic, futuristic medical tech theme (neon blue/white), modular dashboard design with smooth Framer Motion transitions.

---

## 💻 **Stage 1: PROTOTYPE (Public Demonstrator)**
**Goal:** Communicate the vision, enable wallet connection, simulate the economy.

### Sections
1. **Home Page – Vision**
   - Hero: “Advancing AI Through Proven Human Intelligence.”
   - Animation or looping diagram showing Labs → Validators → AI Models.
   - Call to action: “Login with Base Wallet.”

2. **Login / Onboarding**
   - Coinbase Wallet SDK for Base testnet.
   - Simple connect button → redirects to dashboard.

3. **Labs Dashboard (Mock)**
   - List of owned Labs.
   - Mock data: revenue, validators, H1 supply.
   - Data from testnet contracts or local JSON.

4. **Staking Interface**
   - Stake $LABS → mint LabSlot NFT → issue H1 token.
   - Integrates testnet LABS + H1 contracts.

5. **H1 Tokens Marketplace (Mock)**
   - Meme-market style UI showing tickers, floor price, chart.
   - Recharts or D3.js mock data.

6. **App Store (Mock)**
   - Grid layout of medical + other domain apps.
   - Each card: developer name, how it earns, status (prototype/MVP).
   - Example apps:
     - **Scrubber App** – doctors upload records, de-ID + enrich.
     - **Second Opinion+** – AI + clinician hybrid for diagnosis.
     - **ArtSense** – art dataset verifier.
     - **RoboTrace** – robotics vision dataset trainer.

7. **About / Vision Section**
   - Timeline graphic: MiniWhales → H1 Labs → Atlas Network.
   - Includes short mission statement and roadmap preview.

8. **(Optional)** Static Chat Mockup
   - Placeholder UI for future Worklair SDK chat.

### Tech Stack
- **Next.js** + **Tailwind** + **Framer Motion**
- **Wagmi + OnchainKit** for Base wallet
- **Supabase / The Graph** for mock + contract data
- **Recharts** for token metrics

---

## ⚙️ **Stage 2: MVP (Interactive System)**
**Goal:** Enable real interactions for validators, apps, and Labs.

### Modules
1. **Validator Dashboard** – credential upload + task list + earnings.
2. **Dataset Submission** – upload + hash via ProvenanceFacet.
3. **Provenance Explorer** – visualize dataset lineage.
4. **App Store (Live SDK)** – developers register SDK apps.
5. **H1 Token Analytics** – real metrics, TVL, and price tracking.
6. **Governance Panel** – DAO proposals + voting interface.
7. **Credential Portal** – ID upload + NFT credential mint.

### Design Principles
- Blue/white Base gradient with clean cards.
- Dynamic panels with smooth transitions.
- Developer onboarding section for SDK registration.

---

## 🌍 **Stage 3: POST-MVP (Enterprise + Multi-Domain)**
**Goal:** Build a multi-domain dashboard for the Atlas Network.

### Features
1. **Cross-Domain Dashboard** – MedAtlas, ArtAtlas, GameAtlas tiles.
2. **Fiat Gateway / Credit Adapter UI** – purchase credits → H1 conversion.
3. **Marketplace 2.0** – dataset + app trading with provenance badges.
4. **Provenance Viewer (3D Map)** – visualize data flow across validators.
5. **DAO Control Center** – governance proposals, treasury charts.
6. **AI Demo Page** – MedAtlas-Mistral comparison live demo.

### Integrations
- SDK credit mode for whitelabel partners.
- AEH credentialing portal + NFT verification.
- Integration with Base + Arweave for dataset proofs.

---

## 🧩 **Example UI Flow (ASCII Overview)**
```
User → Wallet Connect → Staking (LABS)
        │                   │
        ▼                   ▼
   Labs Dashboard ←→ Marketplace
        │
        ▼
  App Store → Validator Portal
```

---

## 🧠 **Frontend Deliverables per Phase**
| Stage | Deliverable | Purpose |
|--------|--------------|----------|
| Prototype | Landing page + Base wallet + mock dashboards | Vision + testnet demo |
| MVP | Validator, Dataset, Governance UIs | Functional protocol portal |
| Post-MVP | Multi-domain dashboard + Fiat adapter | Full data economy interface |

---

### 🎨 **Visual Style Notes for Lovable**
- Theme: luminous, medical-futurist, Base-chain blue gradients.
- Typography: Inter + Space Grotesk.
- Use glassmorphism + motion blur.
- Animations hint at data flow: pulsing lines connecting Labs and Validators.
- Hover tooltips explaining key H1 concepts (LABS, H1, Enrichment).
- Build scalable UI components (Cards, Tiles, Modals, Charts).

---

### 🪄 **Tone for Copywriting**
- Confident but scientific.
- Balance between DeSci and crypto tone: *“Proof of Intelligence.”*
- Each section should invite exploration — motion, depth, clarity.

---

End of prompt for Lovable — generate full interactive frontend design based on this roadmap.

