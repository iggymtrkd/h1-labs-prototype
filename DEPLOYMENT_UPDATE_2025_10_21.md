# Deployment Update - October 21, 2025

## 🎯 Summary: Architecture Clarification & Contract Redeployments

This update clarifies the H1 Labs architecture distinction between **global facets** and **per-lab contracts**, documents recent redeployments, and confirms deployment status.

---

## ✅ What Was Done Today

### 1. **Architecture Clarification in Public Litepaper**
📄 **File:** `public/litepaper.md` Section 4.2

Added comprehensive explanation of:
- **Global Facets**: Deployed once on H1Diamond (VaultFacet, LabPassFacet, etc.)
- **Per-Lab Contracts**: Deployed dynamically per lab (LabVault, LabPass, BondingCurveSale)
- **Key Distinction Table**: Shows which are global vs per-lab
- **Deployment Flows**: Visual diagrams showing when contracts are created
- **Contract Details**: Full structs and methods for LabVault and LabPass

**Key Insight:** Users do NOT need to pre-deploy LabVault or LabPass. They're created automatically when:
- Lab is created → LabVault deployed
- Lab calls deployLabPass() → LabPass deployed

---

### 2. **Contract Redeployments**

#### RevenueFacet (Modified & Redeployed)
- **Old Address:** `0x7047002e807e4aaa0dcb79b74017775d9fdbe65b`
- **New Address:** `0xf74a1adb71ab5769836eafac607fc5c31ee83488` ✅
- **Status:** Redeployed and attached to H1Diamond
- **Updated In:** `src/config/contracts.ts`

#### CredentialFacet (Newly Deployed)
- **Status:** ✅ DEPLOYED (address pending fill)
- **Location:** `/contracts/facets/CredentialFacet.sol` (330 lines)
- **Features:** 
  - User identity management
  - Credential issuance, verification, revocation
  - Domain-based credentialing
  - Integration with DataValidationFacet
- **Attached to:** H1Diamond via DiamondCut

#### DataValidationFacet (Newly Deployed)
- **Address:** `0xb607b954ed414bcdba321a02f487991518a795c0` ✅
- **Location:** `/contracts/facets/DataValidationFacet.sol` (210 lines)
- **Features:**
  - Data creation tracking
  - Review submission with supervisor credentials
  - Delta-gain approval (quality metric)
  - Attribution for revenue distribution
- **Attached to:** H1Diamond via DiamondCut
- **Updated In:** `src/config/contracts.ts`, `contracts/Testnet addresses.md`

---

### 3. **Documentation Updates**

#### Updated Files:
1. **`public/litepaper.md`** - Section 4.2 expanded with complete architecture
2. **`src/config/contracts.ts`** - Added new facet addresses and clarification comments
3. **`contracts/Testnet addresses.md`** - 
   - Redeployed addresses updated
   - New section: "PER-LAB CONTRACTS" explaining dynamic deployment
   - Architecture notes added
4. **`DEPLOYMENT_SUMMARY.md`** - 
   - Updated status and dates
   - New "Contract Architecture Reference" section
   - Clarified per-lab vs global contracts

---

## 📊 Current Deployment Status

### Global Facets (All Deployed & Attached)
| Facet | Address | Status |
|-------|---------|--------|
| DiamondCutFacet | `0x0c21433be788016a7bf7471308dbf3918b827f9e` | ✅ |
| DiamondLoupeFacet | `0x94c4868d99590e247ff48de19cd7be385a2b5e58` | ✅ |
| OwnershipFacet | `0xb49b55fa025b4bc0a7e5c5a35d42acdebaabe2b9` | ✅ |
| SecurityFacet | `0x330c418951a0237d4c28685c0a7dbdb5b42eb441` | ✅ |
| LABSCoreFacet | `0x07bdea6e6665156ee1d1d14cf81e03566244c14d` | ✅ |
| VaultFacet | `0xd6157e381ec5c1d06aca995fa77c5d0a388ff512` | ✅ |
| BondingCurveFacet | `0x400b47355be05bbe21f5660016b50b93ab6c9267` | ✅ |
| LabPassFacet | `0x799cb349e8feec8ce0155abe0a2f258307a66834` | ✅ |
| RevenueFacet | `0xf74a1adb71ab5769836eafac607fc5c31ee83488` | ✅ REDEPLOYED |
| TreasuryFacet | `0x65c38321d60b3e2fdbf30a474ff7063eadc9f509` | ✅ |
| CredentialFacet | DEPLOYED | ✅ NEW |
| DataValidationFacet | `0xb607b954ed414bcdba321a02f487991518a795c0` | ✅ NEW |

### Platform Token
| Token | Address | Status |
|-------|---------|--------|
| LABSToken | `0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd` | ✅ |

### Per-Lab Contracts (NOT Pre-Deployed)
These are created automatically when needed:

| Contract | Deployed When | Location |
|----------|---|---|
| LabVault | User calls `createLab()` | `/contracts/vaults/LabVault.sol` |
| BondingCurveSale | Lab creator initiates bootstrap (optional) | `/contracts/sales/BondingCurveSale.sol` |
| LabPass | Lab calls `deployLabPass()` (optional) | `/contracts/tokens/LabPass.sol` |

### Optional/Pending
| Contract | Status | Priority |
|----------|--------|---|
| TestingFacet | NOT DEPLOYED | Optional (recommended for testnet) |
| Uniswap V3 Pool (LABS/WETH) | NOT CREATED | HIGH (needed for liquidity) |

---

## 🔑 Key Architectural Points

### Why Per-Lab Contracts?

Each lab gets **isolated instances** of LabVault and LabPass for:

```
✅ SECURITY ISOLATION
   └─ Bug in one lab's vault ≠ affects other labs
   └─ Each lab's financial state is independent

✅ SCALABILITY
   └─ No central bottleneck
   └─ Can support millions of labs
   └─ Each lab's state in separate contract

✅ CONFIGURATION FLEXIBILITY
   └─ Each lab can set own fees, cooldowns, exit caps
   └─ Lab-specific parameters without global changes
   └─ Per-lab customization

✅ GAS EFFICIENCY
   └─ Only deploy what's needed
   └─ Users don't pay for unused features
   └─ Lazy deployment on first need
```

### Global Facets Handle Coordination

The global facets on H1Diamond coordinate across labs:

```
H1Diamond (Global Router)
    ├─ LABSCoreFacet
    │   └─ Manages lab registry
    │   └─ Deploys new LabVaults
    │
    ├─ LabPassFacet
    │   └─ Deploys new LabPass contracts
    │   └─ Coordinates minting across labs
    │
    ├─ CredentialFacet
    │   └─ Global credential registry
    │   └─ Used across all labs
    │
    └─ DataValidationFacet
        └─ Global data validation
        └─ Credentials linked to data approval
```

---

## 📋 Next Steps

### 1. **CRITICAL: Set LABS Token** (Step 7.1)
```javascript
await diamond.setLABSToken("0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd");
```

### 2. **HIGH: Deploy TestingFacet** (Optional but recommended)
- Makes testnet easier
- Provides mint/override utilities

### 3. **HIGH: Create Uniswap V3 Pool**
- LABS/WETH pool at 0.3% fee tier
- Required for token liquidity

### 4. **Configure Protocol Parameters**
- Default cooldown
- Default exit cap
- Protocol treasury

---

## 📚 Reference Documents

| Document | Purpose | Location |
|----------|---------|----------|
| Litepaper Architecture | Complete system overview with new per-lab explanation | `public/litepaper.md` Section 4.2 |
| Testnet Addresses | Quick reference for all addresses | `contracts/Testnet addresses.md` |
| Deployment Summary | Current status & next actions | `DEPLOYMENT_SUMMARY.md` |
| Contract Config | Frontend contract addresses | `src/config/contracts.ts` |

---

## ✨ What This Means for Development

### For Users Creating Labs
- ✅ Call `createLab()` → automatic LabVault deployment
- ✅ Call `deployLabPass()` → optional LabPass deployment
- ✅ Each lab has isolated, independent vault
- ✅ Can customize fees, cooldowns per lab

### For Frontend
- ✅ All facets callable on single H1Diamond address
- ✅ Use appropriate ABI for each function
- ✅ Per-lab vault addresses obtained via `getLabs()` or `getVault(labId)`
- ✅ New credential/validation flows available

### For Data Operations
- ✅ Credentialing now on-chain via CredentialFacet
- ✅ Data validation with delta-gain tracking
- ✅ Immutable attribution for revenue distribution
- ✅ Supervisor credential verification required

---

**Status:** Ready for Phase 3 Configuration  
**Last Updated:** 2025-10-21  
**Next Action:** Call `setLABSToken()` to initialize diamond
