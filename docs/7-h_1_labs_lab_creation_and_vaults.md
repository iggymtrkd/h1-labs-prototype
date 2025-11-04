## H1 Labs — Lab Creation, LabPass, LabVault, and Bonding Curve
> Status: Aligned with smart contracts as of 2025-10-19

This document explains, at a high level, how a new Lab is created, how its H1 token is initialized, how levels/app slots work, and how a simple bonding curve bootstrap can be used. It is intentionally simple and implementation‑agnostic, matching the style of the other files.

---

# 1. Overview

Labs are onchain containers for human‑in‑the‑loop data work. Each Lab has:

- **LabVault (H1 Token):** An ERC‑4626‑style vault that accepts $LABS deposits and issues transferable H1 shares. H1 represents a pro‑rata claim on a Lab’s backing (staked $LABS and reserves).
- **LabPass (ERC‑721):** A non‑transferable (by default) NFT that represents the Lab’s identity and capability level. Levels determine how many app slots the Lab can operate.

---

# 2. Lab Creation Flow (Simple)

1. The Lab owner calls `createLab(name, symbol, domain)`.
2. A new **Lab** entry is created and marked active.
3. A **LabVault** is automatically deployed with the chosen H1 token `name` and `symbol`.
4. The Lab’s H1 token address is set to the newly deployed vault (auto-wired at creation).
5. Optionally, a **LabPass** NFT can be deployed and minted by the lab owner via `LabPassFacet`.

Result: The Lab is live with an H1 token (the vault’s share token). Anyone who deposits $LABS mints H1; anyone who redeems H1 receives $LABS (subject to cooldown and caps).

---

# 3. Levels and App Slots

Levels are determined by total staked $LABS in the Lab’s vault. They control the number of app slots (front‑end/back‑end) that a Lab can run.

| Level | Threshold (LABS) | App Slots |
|-------|-------------------|-----------|
| L1 | 100,000 | 1 |
| L2 | 250,000 | 2 |
| L3 | 500,000 | 3 |

Rules (simple):
- If total assets rise above a threshold, the Lab’s derived level increases and gains slots.
- If total assets fall below a threshold, level reflects the current assets; there is no explicit grace/downgrade routine on-chain. Cooldown and epoch exit caps throttle exits.

---

# 4. LabVault (H1 Token) — Simple Model

The LabVault is conceptually similar to ERC‑4626:

- **Deposit $LABS → Mint H1** at the current exchange rate (assets per share).
- **Request Redeem H1 → Claim $LABS** after a cooldown (and within epoch exit caps).
- **Exchange Rate** increases as the Lab accrues revenue (buybacks, fees, reserves).

Key properties (draft):
- Cooldown (e.g., 7 days) before a redeem can be claimed.
- Epoch exit caps (e.g., max 10–20% of TVL per day) to prevent sudden drains.
- Optional “fill redeem” flow: third parties can backfill pending exits by depositing, preserving the Lab’s level.

Example flow:
```
Deposit LABS → Mint H1 → Participate in Lab economics →
Request Redeem → Cooldown/Grace → Claim LABS (or get backfilled)
```

---

# 5. LabPass (ERC‑721) — Identity and Level

The LabPass is a simple NFT that tracks the Lab’s **level** and **app slots**. In the draft, it is soulbound (non‑transferable) by default and can be made transferable later by governance. The LabPass is intended for:

- Displaying Lab identity/level in UIs
- Gating operational permissions (e.g., how many apps can run)
- Linking to governance (future: the Lab’s DAO or multisig may hold the LabPass)

---

# 6. Bonding Curve Bootstrap (Pump‑Style, Simple)

A lightweight bonding curve can help bootstrap early participation:

1. Users send $LABS to a curve contract.
2. The contract deposits $LABS into the LabVault.
3. The buyer receives H1 shares (optionally at a small premium over NAV).
4. A small **fee** goes to the protocol treasury.
5. An optional **POL allocation** (protocol‑owned liquidity) is reserved to create/lock LP.

Simple curve pricing (example):
```
price = NAV * (1 + 0.5%)
```

Notes:
- POL and LP lock (e.g., 3–6 months) help ensure market depth during early phases.
- After bootstrap, trading continues normally; H1 remains backed by vault assets.

---

# 7. Fees, Revenue, and Buybacks (current implementation)

- The platform’s `RevenueFacet` accepts payable ETH and splits: 50% to lab owner, 25% to protocol treasury (H1 pool custody), 25% retained for future buyback.
- No automatic buyback or automatic vault top-up is performed yet.
- Over time, buybacks/reserves can be implemented to increase H1’s exchange rate.

---

# 8. Safeguards (Minimal Set)

- **Cooldown + Caps:** Redemptions respect a time delay and per‑epoch exit limits.
- **Grace + Downgrade:** If redemptions would breach a level, the system applies grace; if unfilled, the Lab auto‑downgrades.
- **Circuit Breakers:** If backing falls below safety thresholds, pause further exits until healthy.

---

# 9. API Pointers (Names Only, Draft)

- Lab creation: `createLab(name, symbol, domain)` (auto‑deploys LabVault)
- Vault core: `depositLABS`, `mintShares`, `requestRedeem`, `claimRedeem`, `assetsPerShare`
- Levels: `getLevel`, `getAppSlots`
- Curve (optional): `buy(labsAmount, receiver)` (routes LABS → vault, mints H1)

---

# 10. Visual Quick Reference

```
Create Lab
  │
  ▼
Deploy LabVault (H1 token) ──> Set Lab H1 address
  │
  ▼
Deposit LABS → Mint H1 → Earn via revenue/buybacks
  │
  ├─ Request Redeem → Cooldown → Claim LABS (or backfilled)
  │
  └─ Bonding Curve (bootstrap): LABS → Vault → H1 (fee + POL)
```

---

# 11. Summary

- Labs launch with an auto‑deployed **LabVault** that mints H1 shares against $LABS deposits.
- **Levels** map total stake to **app slots** (L1/L2/L3 = 1/2/3 apps).
- A simple **bonding curve** can bootstrap participation with fees and POL for stability.
- Cooldowns, caps, and downgrade rules provide safety and predictability.

---

# 12. Examples (Concrete Parameters and Flows)

This section provides simple numeric examples. Values are illustrative.

## Example A — Create a Lab with Custom Ticker

Inputs:
- Name: "MedVault Cardio"
...
1. Call `createLab("MedVault Cardio", "H1CARD", "Healthcare/Cardiology")`.
2. Lab created and `LabVault` auto‑deployed; H1 token = vault shares with name "MedVault Cardio" and symbol "H1CARD".
3. Lab is active; app slots determined by level once deposits arrive.

## Example B — Deposit and Redeem with Cooldown

Assumptions at T0:
- Vault total assets = 0 LABS, total H1 supply = 0 → exchange rate = 1.0 LABS/share

Deposit:
1. Alice deposits 100,000 LABS → mints 100,000 H1 at 1:1.
2. Level becomes L1 (≥ 100,000) → app slots = 1.

Revenue Accrual:
3. Lab earns revenue; reserves increase such that exchange rate becomes 1.02 LABS/share.

Redeem (cooldown):
4. Alice requests redeem 10,000 H1 → preview = 10,200 LABS owed.
5. After 7 days cooldown (and within daily 20% cap), Alice claims → receives 10,200 LABS.

## Example C — Bonding Curve Bootstrap (Fee + POL)

Parameters:
- Protocol fee = 1% of LABS sent
- POL allocation = 10% of LABS sent (reserved for LP)

Flow:
1. Bob sends 10,000 LABS to the curve.
2. Fee = 100 LABS to treasury; POL = 1,000 LABS reserved; 8,900 LABS deposited to vault.
3. Bob receives H1 at current vault rate for the 8,900 LABS deposited.
4. POL will be used to seed and lock LP for a period (e.g., 3–6 months).

## Example D — Level Upgrade and Downgrade

Upgrade:
1. Vault grows from 240,000 to 255,000 LABS → crosses 250,000 threshold.
2. Level upgrades from L1 to L2 → app slots increase from 1 to 2.

Downgrade (grace if exits push below threshold):
3. Pending exits would drop assets from 255,000 to 245,000.
4. Grace/cooldown starts; others can deposit during grace to refill.
5. If not refilled by claim time, vault completes exits and auto‑downgrades to L1 → app slots reduce to 1.

## Example E — Fee/Revenue Split (current)

Inputs:
- Dataset sale sends 20 ETH into the Lab’s revenue function.
- Split: 50% lab owner (ETH), 25% to protocol treasury (ETH), 25% retained in contract for future buyback.

Flow:
1. 10 ETH sent to lab owner.
2. 5 ETH sent to protocol treasury (custody for H1 pool/ops).
3. 5 ETH retained in the revenue contract pending future buyback execution.


