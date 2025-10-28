H1Diamond at 0x29a7297e84df485aff8def2d27e467f3a37619c0
DiamondCutFacet at 0x0c21433be788016a7bf7471308dbf3918b827f9e
DiamondLoupeFacet at 0x94c4868d99590e247ff48de19cd7be385a2b5e58
OwnershipFacet at 0xb49b55fa025b4bc0a7e5c5a35d42acdebaabe2b9
SecurityFacet at 0x330c418951a0237d4c28685c0a7dbdb5b42eb441
RevenueFacet at 0xbe14097af4ad6f9ffd9ec39b404121ab44a5b112
LABSCoreFacet at 0xdf972c8cf5b1757d133aebbce1a704aeb65a2b29 (✅ REMOVED: domain requirements)
LabVaultDeploymentFacet at 0x9ddd73544d0b13acd4bba6741ae9cbfa9ce111a7 (✅ DEPLOYED: setVaultFactory + createLabStep1) 
LabDistributionFacet at 0xfb7c840eb842e99837fd13aa957d499f5ad223df ✅ 
VaultFacet at 0xVaultFacetAddress (if still needed)
BondingCurveFacet at 0x90c81d864d4d71af2449153091733cb1249706c6
LabPassFacet at 0x799cb349e8feec8ce0155abe0a2f258307a66834
TreasuryFacet at 0x65c38321d60b3e2fdbf30a474ff7063eadc9f509
H1VestingFacet at 0x084c94e1f226393df32a6662abb4fdb75b3da54b (✅ DEPLOYED 2025-10-23: Manages H1 vesting schedules)

0x34662d29c5995890cc24c3020a41ea1379da7669

DataValidationFacet at 0xb607b954ed414bcdba321a02f487991518a795c0
CredentialFacet at 0x3ffab9fa9568c68bf60c88891f238556f8d99387

TestingFacet at 0xb44e262cb6039689873e9a721c1495fa1028cbbb (✅ UPDATED: With defaults + init function)
ConfigurationFacet at TBD (ready to deploy for mainnet)

LABSToken at 0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd

FAUCET wallet 

CONFIGURATION NEEDED:
- setLABSToken() in TreasuryFacet ✅ NOT YET CALLED
- initializeDefaults(treasury) ✅ READY - call this once to set all defaults
- setDefaultCooldown() ✅ NOW OPTIONAL - use initializeDefaults() instead
- setDefaultExitCap() ✅ NOW OPTIONAL - use initializeDefaults() instead
- setProtocolTreasury() ✅ NOW OPTIONAL - set in initializeDefaults()
- setCurveFeeBps() ✅ NOW OPTIONAL - use initializeDefaults() instead
- setCurvePolBps() ✅ NOW OPTIONAL - use initializeDefaults() instead

New Defaults System Deployed:
✅ Hardcoded defaults (1 day cooldown, 20% exit cap, 5% fees)
✅ initializeDefaults(treasury) - One call to set all defaults
✅ Override functions available: setCooldown(), setExitCap(), etc.

NEW TOKENOMICS SYSTEM (2025-10-23):
✅ H1VestingFacet deployed at 0x084c94e1f226393df32a6662abb4fdb75b3da54b
   - Manages vesting schedules for H1 tokens
   - Functions: createVestingSchedule(), claimVestedTokens(), getClaimableAmount()
   - Owner vesting: 6 months with weekly unlocks
   - Scholar/Dev vesting: Instant when earned

⏳ NEXT STEPS:
   1. ✅ LABSCoreFacet deployed at 0x4345a4ae14a1111b921a74868033d90f268c24bb
   2. ⏳ Deploy LabCreationFacet (lab creation logic separated for size optimization)
   3. ⏳ Add both facets to Diamond via diamondCut
   
   Run: node scripts/update-labs-facets.js (after deploying LabCreationFacet)

UNISWAP V3 (Base Sepolia):
WETH: 0x4200000000000000000000000000000000000006
Factory: 0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24
Position Manager: 0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2
LABS/WETH Pool: TBD (need to create)

See DEPLOYMENT_WITH_DEFAULTS.md for detailed instructions.

---

OLD ADDRESSES (IGNORE):
OLD H1Diamond 0x42b4f2612cdd49cf91b4a9cc1ffe47f21bcb8717
OLD 0xce811df811e198379ccc98d1cee5527ff602f1b0
OLD RevenueFacet at 0x7047002e807e4aaa0dcb79b74017775d9fdbe65b
OLD LABScoreFacet 0x07bdea6e6665156ee1d1d14cf81e03566244c14d
OLD LABScoreFacet 0x913c667ac9df73e3d3db920bce156feaf0179d60 ( UPDATED: Now with onchain level validation)
OLD BondingCurveFacet at 0x400b47355be05bbe21f5660016b50b93ab6c9267
OLD LABScoreFacet at 0x878fb60580c6e8c764ad78ca222ea0c670c6064a
OLD LabDistributionFacet at 0x34662d29c5995890cc24c3020a41ea1379da7669
OLD LABSCoreFacet 0x4345a4ae14a1111b921a74868033d90f268c24bb ( DEPLOYED: Staking + Queries, 14KB)
OLD LabVaultDeploymentFacet 0x60320c6afd8118dd374a6407babc690fd5bcb599 
OLD LabVaultDeploymentFacet 0x8910f280fc5B43e77D28ac94CD63E606Bf81048e
OLD LabVaultDeploymentFacet 0xb92e4ebcc7721201f60fc89858311b42bcca63d1 (✅ REMOVED: domain requirements) 