## H1 Labs Smart Contract Structure

This document summarizes the complete on-chain scaffolding, explains why each facet exists, outlines every core contract and its functions, and shows how they connect. The diamond-standard (proxy) contracts are covered briefly since they follow EIP-2535 conventions.

---

### Summary Scaffolding Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           H1 LABS ON-CHAIN SCAFFOLDING                       │
└─────────────────────────────────────────────────────────────────────────────┘

DIAMOND (singleton)
  ├─ H1Diamond (proxy, routes to facets)
  ├─ Diamond Standard Facets: DiamondCut, DiamondLoupe, Ownership, Security
  ├─ Storage Libraries: LibDiamond (diamond), LibH1Storage (platform)
  └─ Platform Facets (business logic):
      • LABSCoreFacet         → Create labs, stake LABS, domain registry
      • VaultFacet            → Deploy per‑lab LabVault (H1 token)
      • BondingCurveFacet     → Deploy per‑lab BondingCurveSale
      • LabPassFacet          → Deploy/mint LabPass (ERC‑721)
      • RevenueFacet          → Split incoming ETH revenue
      • TreasuryFacet         → Configure LABS token, admin ops

SINGLETON TOKEN
  • LABSToken (ERC20, name/symbol: LABS/LABS)

PER‑LAB DEPLOYED CONTRACTS (N instances per lab)
  • LabVault (ERC20 shares + ERC4626‑style flows)
      - Accepts LABS deposits → mints H1 shares (the lab’s H1 token)
      - Cooldown + epoch exit caps; pause; level tracking
  • BondingCurveSale
      - Buys H1 at NAV + 0.5% premium; protocol fee + POL routing
  • LabPass (ERC‑721)
      - Identity + level + app slots; non‑transferable by default

KEY STORAGE (LibH1Storage)
  • labs[labId] → { owner, h1Token, totalStaked, active, totalRevenue, domain }
  • nextLabId, labsToken (LABS), protocolTreasury, cooldown/exit caps, curve fees
  • domainTaken, stakedBalances, reentrancyStatus
  • labIdToVault, labIdToLabPass, labIdToCurve
```

---

### Why Each Facet Exists

- LABSCoreFacet: Creates labs, tracks staked LABS, maintains domain availability. Opinionated entrypoint for lab lifecycle with safe defaults.
- VaultFacet: Deploys the lab’s vault which also serves as the H1 ERC20 token. Keeps deployment rights with the lab owner and wires addresses into storage.
- BondingCurveFacet: Deploys a simple curve to bootstrap a lab’s H1 participation with fee/POL routing and price protections.
- LabPassFacet: Deploys the LabPass NFT contract and allows the lab owner to mint identity/permission tokens.
- RevenueFacet: Receives ETH and splits it between lab owner, H1 pool share (routed to treasury for custody), and buyback budget (retained in facet for later use).
- TreasuryFacet: Platform‑level admin for setting the LABS token and stubbing buyback execution (event‑only for now, safe for testing).

The diamond‑standard management facets (DiamondCut, DiamondLoupe, Ownership, Security) provide upgradeability, introspection, ownership control, and initializer safety lists; they are standard EIP‑2535 components.

---

## Contracts and Functions

Below, diamond routing and low‑level forwarding are omitted for brevity.

### 1) LABSCoreFacet
- Events: `LabCreated`, `VaultDeployed`, `Staked`
- Errors: `InvalidString`, `InvalidAmount`, `DomainAlreadyExists`, `LabsTokenNotSet`, `TransferFailed`
- Functions:
  - `stakeLABS(uint256 amount)`
    - Transfers LABS from user to the diamond and increments `stakedBalances[user]` in `LibH1Storage`.
  - `createLab(string name, string symbol, string domain) returns (uint256 labId)`
    - Validates strings and domain availability.
    - Increments `nextLabId`, creates lab entry, sets `owner`, `domain`, `active`.
    - Auto‑deploys a `LabVault` (the H1 token) with default cooldown and exit caps; stores vault address in `labIdToVault` and `labs[labId].h1Token`.
    - Emits `LabCreated` and `VaultDeployed`.
  - `isDomainAvailable(string domain) view returns (bool)`

Connections:
- Reads/writes `LibH1Storage`.
- Requires `labsToken` to be set (LABSToken address via TreasuryFacet).
- Deploys `LabVault` directly.

### 2) VaultFacet
- Events: `VaultDeployed`
- Errors: `Unauthorized`, `InvalidLabId`, `VaultAlreadyExists`, `InvalidString`, `LabsTokenNotSet`
- Functions:
  - `deployVault(uint256 labId, string h1Name, string h1Symbol, string labDisplayName) returns (address vault)`
    - Owner‑only for that lab; deploys `LabVault` and registers it as `labs[labId].h1Token` and `labIdToVault[labId]`.
  - `getVault(uint256 labId) view returns (address)`

Connections:
- Uses `LibH1Storage`.
- Deploys `LabVault` with platform defaults from storage.

### 3) BondingCurveFacet
- Events: `BondingCurveDeployed`
- Errors: `Unauthorized`, `InvalidLabId`, `VaultNotDeployed`, `CurveAlreadyExists`, `TreasuryNotSet`
- Functions:
  - `deployBondingCurve(uint256 labId) returns (address curve)`
    - Owner‑only for that lab; requires a vault and treasury to be set; deploys `BondingCurveSale` and stores in `labIdToCurve[labId]`.
  - `getBondingCurve(uint256 labId) view returns (address)`

Connections:
- Uses `LibH1Storage`.
- Deploys `BondingCurveSale` wired to LABS token, the lab’s `LabVault`, and protocol treasury.

### 4) LabPassFacet
- Events: `LabPassDeployed`, `LabPassMinted`
- Errors: `Unauthorized`, `InvalidAddress`, `LabPassAlreadyExists`, `LabPassNotDeployed`, `InvalidLabId`, `InvalidLevel`, `InvalidSlots`
- Functions:
  - `deployLabPass(uint256 labId) returns (address pass)`
    - Owner‑only for that lab; deploys `LabPass`, stores address in `labIdToLabPass`, and sets the facet as NFT minter.
  - `mintLabPass(uint256 labId, uint256 tokenId, address to, uint8 level, uint8 slots)`
    - Owner‑only for that lab; mints a pass with level and app slot data.
  - `getLabPass(uint256 labId) view returns (address)`

Connections:
- Uses `LibH1Storage` and `LabPass`.

### 5) RevenueFacet
- Constants: `LAB_OWNER_SHARE_BPS=5000`, `H1_POOL_SHARE_BPS=2500`, `BUYBACK_SHARE_BPS=2500`, `BPS_DENOMINATOR=10000`
- Event: `RevenueDistributed(labId, labOwner, h1Pool, buyback)`
- Errors: `ReentrancyGuard`, `InvalidLabId`, `InvalidAmount`, `TransferFailed`
- Functions:
  - `distributeRevenue(uint256 labId) payable nonReentrant`
    - Splits ETH: 50% → lab owner, 25% → treasury (H1 pool share custody), 25% → retained (future buyback logic).
    - Increments `labs[labId].totalRevenue` and emits `RevenueDistributed`.

Connections:
- Uses `LibH1Storage` and its `reentrancyStatus` (shared guard) plus `protocolTreasury`.

### 6) TreasuryFacet
- Events: `LABSTokenUpdated(address)`, `BuybackExecuted(uint256,address)`
- Functions:
  - `setLABSToken(address token)`
    - Owner‑only (diamond owner). Sets global `labsToken` (LABSToken address) used across platform.
  - `buybackLABS(uint256 amount)`
    - Owner‑only. Testing stub that emits an event; no transfers/burning (safe for tests).

Connections:
- Uses `LibDiamond` for access control, and `LibH1Storage`.

---

### 7) LabVault (H1 token for a lab)
- Inherits: `ERC20Base`
- Read State:
  - `labsToken` (LABS ERC20 address), `labDisplayName`, `admin`
  - Cooldown/caps: `cooldownSeconds`, `epochExitCapBps`, `epochStart`
  - Accounting: `totalAssets`, `pendingExitAssets`, `epochExitedAssets`
- Events:
  - `Deposited`, `RedeemRequested`, `RedeemClaimed`, `RedeemCanceled`, `RedeemFilled`
  - `LevelChanged`, `ExitCapsUpdated`, `EpochRolled`, `AdminUpdated`, `Paused`, `Unpaused`
- Errors: `Unauthorized`, `InvalidAddress`, `InvalidAmount`, `InvalidParameter`, `ContractPaused`
- Functions (selected):
  - Views: `assetsPerShare()`, `previewDeposit(assets)`, `previewMint(shares)`, `previewRedeem(shares)`, `getLevel()`, `getAppSlots()`
  - Deposit/Mint: `depositLABS(uint256 assets, address receiver)`, `mintShares(uint256 shares, address receiver)`
  - Exit: `requestRedeem(uint256 shares)`, `cancelRedeem(uint256 requestId)`, `claimRedeem(uint256 requestId)`
  - Ops: `fillRedeem(uint256 requestId, address receiver)`
  - Admin: `setAdmin(address)`, `setCooldown(uint64)`, `setEpochExitCapBps(uint16)`, `pause()`, `unpause()`, `paused()`

Connections:
- Accepts `LABS` transfers; mints/burns ERC20 shares (the H1 token) representing pro‑rata claim on the lab’s backing.
- Enforces cooldown and daily exit caps; tracks level to gate app slots in UI.

---

### 8) BondingCurveSale (per‑lab)
- Immutable wiring: `labsToken` (LABS), `vault` (LabVault), `treasury`
- Params: `feeBps` (≤10%), `polBps` (≤10%), `PRICE_PREMIUM_BPS=1005`
- Guards: Price bounds and max price change per tx; reentrancy; pause; admin ownership
- Events: `Purchased`, `Paused`, `Unpaused`, `AdminUpdated`
- Functions (selected):
  - Pricing: `price()` with premium + bounds checks and last‑price guard
  - Buy flows: `buy(labsAmount, receiver, minSharesOut)`, `buyFrom(buyer, labsAmount, receiver, minSharesOut)`
  - Admin: `pause()`, `unpause()`, `paused()`, `setAdmin(address)`

Connections:
- Pulls LABS from buyer, routes fee + POL to `treasury`, approves `vault`, deposits remainder into `LabVault`, and returns H1 shares to the receiver.

---

### 9) LABSToken (singleton platform ERC20)
- Inherits: `ERC20Base`
- State: `_owner`
- Events: `OwnershipTransferred`
- Functions:
  - `owner() view`
  - `transferOwnership(address)`
  - `mint(address to, uint256 amount)` (owner‑only)

Connections:
- Set once via `TreasuryFacet.setLABSToken`. Used by LABSCore/VaultFacet/LabVault/BondingCurveSale flows.

---

### 10) ERC20Base (shared base)
- Standard ERC20 surface with gas‑optimized `_transfer` (assembly), `_mint`, `_burn`, `_approve`, plus `batchTransfer`.

Connections:
- Inherited by `LABSToken` and `LabVault` (H1 shares per lab).

---

### 11) LabPass (ERC‑721)
- State: `transferable`, `minter`, `admin`, `passData[tokenId] = { level, appSlots }`
- Functions (selected):
  - Admin/minter ops: `setMinter`, `setAdmin`, `setTransferable`
  - Minting: `mint`, `batchMint`
  - Metadata ops: `setLevel(tokenId, level, slots)`
  - ERC‑721: `approve`, `setApprovalForAll`, `transferFrom`, `safeTransferFrom`, `supportsInterface`

Connections:
- Deployed per lab via `LabPassFacet`. Non‑transferable by default until `transferable` is enabled.

---

### 12) LibH1Storage (platform storage)
- `Lab` struct: `{ owner, h1Token, totalStaked, active, totalRevenue, domain }`
- `H1Storage` root:
  - Global config: `labsToken`, `defaultCooldown`, `defaultExitCapBps`, `protocolTreasury`, `curveFeeBps`, `curvePolBps`
  - Global guards: `reentrancyStatus`
  - Domain & staking: `domainTaken`, `stakedBalances`
  - Per‑lab addresses: `labIdToVault`, `labIdToLabPass`, `labIdToCurve`

Connections:
- Central entry point for all facets to share state safely via diamond storage.

---

## Connections Overview

- Platform Token:
  - `TreasuryFacet.setLABSToken(token)` → sets `labsToken` used across flows.

- Lab Creation:
  - `LABSCoreFacet.createLab(...)` → creates lab storage, deploys `LabVault`, maps it to `labId` and sets `labs[labId].h1Token`.
  - Alternatively, `VaultFacet.deployVault(...)` allows explicit vault deployment (owner‑only) and registration.

- Participation / Liquidity:
  - `BondingCurveFacet.deployBondingCurve(labId)` → creates a `BondingCurveSale` bound to LABS, that lab’s `LabVault`, and the protocol treasury.
  - `BondingCurveSale.buy(...)` → transfers LABS in, routes fee + POL to treasury, deposits remainder to `LabVault`, returns H1 shares.

- Vault Mechanics:
  - `LabVault.depositLABS/mintShares` → mints H1 shares; `requestRedeem/claimRedeem/cancelRedeem/fillRedeem` manage exits with cooldown and epoch caps.
  - Levels: `getLevel/getAppSlots` derive app slots from `totalAssets`.

- Identity:
  - `LabPassFacet.deployLabPass/mintLabPass` → deploys and mints `LabPass` NFTs with level and slot metadata.

- Revenue:
  - `RevenueFacet.distributeRevenue(labId)` (payable) → splits ETH into owner payout, H1 pool share to treasury custody, and retained buyback budget (future function may execute buybacks).

---

## Diamond Contracts (Brief)

The diamond uses EIP‑2535:
- `H1Diamond`: Fallback routes calls to facet implementations by selector; receives funds.
- `DiamondCutFacet`: Upgrades (add/replace/remove facet selectors).
- `DiamondLoupeFacet`: Introspection (facets, selectors, addresses).
- `OwnershipFacet`: Diamond owner management.
- `SecurityFacet`: Initializer whitelist for safe delegatecalls.
- `LibDiamond`: Diamond storage and internal helpers.

These are standard components; they mainly enable upgradeability and management without changing storage.

---

## Notes & Guarantees

- LabVault is the H1 token per lab (no separate H1 token contract needed).
- All externalized parameters (cooldowns, exit caps, fees) have bounded validation.
- Reentrancy protection is shared via `LibH1Storage.reentrancyStatus` in facets that use it.
- Admin/owner checks are explicit and narrow in scope.
- Unused/draft contracts were moved to `contracts/drafts/` to reduce surface area.

---

If you want a sequence diagram (lab creation → vault → curve → deposit → redeem), we can add it as a follow‑up.


