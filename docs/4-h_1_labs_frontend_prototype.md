## Prompt for Lovable — H1 Labs Frontend Prototype & Roadmap
> Status: Aligned with smart contracts as of 2025-10-19

We are building the **frontend for H1 Labs**, a protocol that advances AI through **provable blockchain training and data enrichment**.

---

### 🎯 **Overall Goal**
Create a sleek, Base-chain integrated web application that:
- Communicates the **vision** of H1 Labs (human-validated AI training onchain).
- Demonstrates **staking, Labs creation, and H1 Token issuance** on Base testnet.
- Provides an **app marketplace and dashboard** for users, validators, and developers.
- Evolves into a full data economy and SDK portal.

Style references: neon green (#8BEF08 or similar) and purple (#722EFC but sometimes lighter) aesthetic, dark theme with shades of gray, modular dashboard design with smooth transitions.
Fonts: Inter + Space Mono for titles
IMPORTANT: ALL text needs to be editable from Lovable live editor, and not from backend.

---

## 💻 **Stage 1: PROTOTYPE (Public Demonstrator)**
**Goal:** Communicate the vision, enable wallet connection, simulate the economy.

### Sections
1. **Home Page – Vision**
   - Hero: “Advancing AI Through Proven Human Intelligence.”
   - Animation or looping diagram showing Labs → Validators → AI Models.
   - Call to action and top right button: “Login with Base Wallet.” Make it work with Base account: javascript https://docs.base.org/base-account/quickstart/web or next.js https://docs.base.org/base-account/quickstart/web-react

2. **Login / Onboarding**
   - Base account (Coinbase Wallet SDK) for Base sepolia testnet.
   - Simple connect button → redirects to dashboard.

3. **Dashboard (Mock)**
   - Top right: amount of owned $LABS 
   - Main: list of H1 Labs tokens for sale. This page should look similar to meme marketplace (or Coingecko or Pump.fun) but in our own style.
   - Bottom bar: three containers:
    - List of owned Labs. If no owned Labs:
    - Mock data: revenue, validators, notifications, total owned H1 supply.
    - Data comsfrom testnet contracts or local JSON.

4. **Staking Interface**
   - Access button at the top. Stake $LABS → unlock ownership of DataLab → issue H1 token.
   - Clicking on a DataLab will show a chat page similar to Discord.
   - Integrates testnet LABS + H1 contracts.

5. **App Store (Mock)**
   - Grid layout of medical + other domain apps.
   - Each card: developer name, how it earns, status (prototype/MVP).
   - Example apps:
     - **Scrubber App** – doctors upload records, de-ID + enrich.
     - **Second Opinion+** – AI + clinician hybrid for diagnosis.
     - **ArtSense** – art dataset verifier.
     - **RoboTrace** – robotics vision dataset trainer.

6. **About / Vision Section**
   - Timeline graphic: MiniWhales → H1 Labs → Atlas Network.
   - Includes short mission statement and roadmap preview.

7. **Profile Page**
   - Personalized dashboard showing wallet stats, token holdings, and gamified achievements.
   - Wallet summary (LABS + H1 balance, total USD value).
   - Lab participation list (owner / validator roles).
   - **Achievements grid:** displays badges and ranks.
   - **Credentials:** Linked NFTs or AEH certifications.
   - **Progress:** XP level, staking duration, validation streak.
   
8. **Whitepaper section**
   - ** Very similar to gitbook, topics on the left side, content on the right
   - ** Add all content from whitepaper (attached) 
---

### 🧬 **Profile Page Details**
```
┌──────────────────────────────────────────┐
│ 🧬  User Profile                         │
├──────────────────────────────────────────┤
│ Wallet: 0x92A...2c9b   [View on BaseScan]│
│ ENS: drsilva.h1labs                      │
│ Joined: March 2025   |   Rank: Level 7   │
├──────────────────────────────────────────┤
│ 💰 Portfolio                             │
│ $LABS: 8,320 (staked: 6,000)             │
│ H1 Tokens: 12,400 across 3 Labs          │
│ Estimated Value: $1,450                  │
├──────────────────────────────────────────┤
│ 🧪 Labs Participation                     │
│ - CardioLab (Healthcare) - Owner         │
│ - ArtProof (Art) - Validator             │
│ - RoboTrace (Robotics) - Contributor     │
├──────────────────────────────────────────┤
│ 🏅 Achievements                           │
│ [🌱 Genesis Holder] [🧠 Data Enricher Lv1] [⚗️ Long-Term Staker] [💡 Innovator]  │
│ [🔬 Science Guardian] [🪩 Memetic Trader] [🔗 Provenance Pioneer] [🧭 Atlas Explorer] │
├──────────────────────────────────────────┤
│ 🧠 Credentials                            │
│ - AEH Certified Clinician (ID #213)      │
│ - Verified Validator (H1 NFT #0012)      │
├──────────────────────────────────────────┤
│ ⏳ Staking Age: 187 days                 │
│ 🔥 Daily Streak: 24 days active          │
│ 📈 Next Reward Tier: “Lab Alchemist”     │
└──────────────────────────────────────────┘
```

**Badges Examples:**
- 🌱 Genesis Holder — early staker.
- ⚗️ Lab Founder — created a Lab.
- 🧠 Data Enricher Lv1–5 — validated X datasets.
- 🔬 Science Guardian — validated in healthcare.
- 🧩 Protocol Pioneer — used multiple facets.
- 🪩 Memetic Trader — traded H1 tokens.
- 🔗 Provenance Pioneer — logged first dataset.
- 🧭 Atlas Explorer — explored 3+ domains.
- 💡 Innovator — deployed SDK app.
- 🪶 Validator Sage — high reputation.

**Long-Term Rewards:** Diamond Hands, Vault Keeper, Temporal Alchemist, Lantern of Proof.

**Gamification Mechanics:** XP levels, NFT profile frames, seasonal rewards.

**Smart Contract Hooks:**
- `getUserAchievements(address)` — fetch progress.
- `issueBadgeNFT(address, badgeId)` — mint badge NFTs.
- `calcXP(address)` — calculate XP level.

---

### Tech Stack
- **Next.js**, **TailwindCSS**, **Framer Motion**
- **Wagmi + OnchainKit** (Base testnet wallet)
- **Recharts for data visualization charts (installed as dependency) and Tailwind CSS animations with the tailwindcss-animate plugin to make it look beautiful
- ** Use react-confetti for leveling up, staking $LABS etc
- **The Graph** for mock data
- **Recharts** for analytics

---

End of prompt for Lovable — generate full interactive frontend design based on this roadmap including profile system, achievements, whitepaper section, and progression mechanics.

