// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// DRAFT: Lab Vault inspired by ERC-4626 vaults.
// - Asset: LABS (ERC20)
// - Shares: H1 (ERC20 via ERC20Base)
// - Deposit LABS -> mint H1 shares at current exchange rate
// - Request redeem shares -> cooldown -> claim LABS
// - Enforces level floors to maintain app slots (1/2/3)

import { ERC20Base } from "../tokens/ERC20Base.sol";

interface IERC20 {
  function totalSupply() external view returns (uint256);
  function balanceOf(address account) external view returns (uint256);
  function transfer(address to, uint256 value) external returns (bool);
  function allowance(address owner, address spender) external view returns (uint256);
  function approve(address spender, uint256 value) external returns (bool);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract LabVaultDraft is ERC20Base {
  // ---- Immutable configuration ----
  address public immutable labsToken; // LABS ERC20 asset
  string public labDisplayName;

  // ---- Level thresholds (18 decimals) ----
  uint256 public constant LEVEL1 = 100_000e18;
  uint256 public constant LEVEL2 = 250_000e18;
  uint256 public constant LEVEL3 = 500_000e18;

  // ---- Cooldown / exit policy ----
  uint64 public cooldownSeconds; // e.g. 7 days
  uint16 public epochExitCapBps; // e.g. 2000 = 20% per epoch
  uint64 public epochStart; // rolling epoch window start

  // ---- Vault accounting ----
  // Total LABS managed by the vault (contract LABS balance may match in simple models)
  uint256 public totalAssets; // increases on deposit, decreases on claim redeem
  uint256 public pendingExitAssets; // sum of requested assets not yet claimed (epoch control placeholder)
  uint256 public epochExitedAssets; // assets marked for exit in current epoch

  // ---- Reentrancy guard ----
  uint256 private constant NOT_ENTERED = 1;
  uint256 private constant ENTERED = 2;
  uint256 private status = NOT_ENTERED;

  modifier nonReentrant() {
    require(status == NOT_ENTERED, "reentrancy");
    status = ENTERED;
    _;
    status = NOT_ENTERED;
  }

  // ---- Redeem queue ----
  struct RedeemRequest {
    address owner;
    uint256 assets; // LABS amount owed on claim
    uint64 unlockTime;
    bool claimed;
  }

  uint256 public nextRequestId;
  mapping(uint256 => RedeemRequest) public redeemRequests;

  // ---- Events ----
  event Deposited(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);
  event RedeemRequested(uint256 indexed requestId, address indexed owner, uint256 sharesBurned, uint256 assets, uint64 unlockTime);
  event RedeemClaimed(uint256 indexed requestId, address indexed owner, uint256 assets);
  event RedeemCanceled(uint256 indexed requestId, address indexed owner, uint256 assets, uint256 sharesReMinted);
  event LevelChanged(uint8 newLevel, uint256 totalAssets);
  event ExitCapsUpdated(uint64 cooldownSeconds, uint16 epochExitCapBps);
  event EpochRolled(uint64 newEpochStart);
  event RedeemFilled(uint256 indexed requestId, address indexed filler, uint256 assets, address receiver);

  constructor(
    address labsToken_,
    string memory h1Name_,
    string memory h1Symbol_,
    string memory labDisplayName_,
    uint64 cooldownSeconds_,
    uint16 epochExitCapBps_
  ) ERC20Base(h1Name_, h1Symbol_, 18) {
    require(labsToken_ != address(0), "labs token = 0");
    labsToken = labsToken_;
    labDisplayName = labDisplayName_;
    cooldownSeconds = cooldownSeconds_;
    epochExitCapBps = epochExitCapBps_;
    epochStart = uint64(block.timestamp);
  }

  // ---- Views ----
  function assetsPerShare() public view returns (uint256) {
    uint256 supply = totalSupply();
    if (supply == 0) return 1e18; // bootstrap rate = 1:1
    return (totalAssets * 1e18) / supply;
  }

  function previewDeposit(uint256 assets) public view returns (uint256 shares) {
    uint256 rate = assetsPerShare();
    shares = (assets * 1e18) / rate;
  }

  function previewMint(uint256 shares) public view returns (uint256 assets) {
    uint256 rate = assetsPerShare();
    assets = (shares * rate) / 1e18;
  }

  function previewRedeem(uint256 shares) public view returns (uint256 assets) {
    uint256 rate = assetsPerShare();
    assets = (shares * rate) / 1e18;
  }

  function getLevel() public view returns (uint8 level) {
    uint256 a = totalAssets;
    if (a >= LEVEL3) return 3;
    if (a >= LEVEL2) return 2;
    if (a >= LEVEL1) return 1;
    return 0;
  }

  function getAppSlots() external view returns (uint8 slots) {
    uint8 level = getLevel();
    if (level == 3) return 3;
    if (level == 2) return 2;
    if (level == 1) return 1;
    return 0;
  }

  // ---- Core flows ----
  function depositLABS(uint256 assets, address receiver) external nonReentrant returns (uint256 shares) {
    require(assets > 0, "zero assets");
    shares = previewDeposit(assets);
    require(IERC20(labsToken).transferFrom(msg.sender, address(this), assets), "transferFrom fail");
    totalAssets += assets;
    _mint(receiver, shares);
    _maybeEmitLevelChange();
    emit Deposited(msg.sender, receiver, assets, shares);
  }

  function mintShares(uint256 shares, address receiver) external nonReentrant returns (uint256 assets) {
    require(shares > 0, "zero shares");
    assets = previewMint(shares);
    require(IERC20(labsToken).transferFrom(msg.sender, address(this), assets), "transferFrom fail");
    totalAssets += assets;
    _mint(receiver, shares);
    _maybeEmitLevelChange();
    emit Deposited(msg.sender, receiver, assets, shares);
  }

  // Start cooldown-based redemption; shares are burned now, assets reserved for later claim.
  function requestRedeem(uint256 shares) external nonReentrant returns (uint256 requestId, uint256 assets) {
    require(shares > 0, "zero shares");
    assets = previewRedeem(shares);
    _rollEpochIfNeeded();
    _checkAndAccrueExitCap(assets);
    _burn(msg.sender, shares);
    pendingExitAssets += assets;
    uint64 unlockTime = uint64(block.timestamp) + cooldownSeconds;
    requestId = ++nextRequestId;
    redeemRequests[requestId] = RedeemRequest({ owner: msg.sender, assets: assets, unlockTime: unlockTime, claimed: false });
    emit RedeemRequested(requestId, msg.sender, shares, assets, unlockTime);
  }

  function cancelRedeem(uint256 requestId) external nonReentrant returns (uint256 shares) {
    RedeemRequest storage r = redeemRequests[requestId];
    require(r.owner == msg.sender, "not owner");
    require(!r.claimed, "claimed");
    uint256 assets = r.assets;
    delete redeemRequests[requestId];
    pendingExitAssets -= assets;
    shares = previewDeposit(assets);
    _mint(msg.sender, shares);
    emit RedeemCanceled(requestId, msg.sender, assets, shares);
  }

  function claimRedeem(uint256 requestId) external nonReentrant {
    RedeemRequest storage r = redeemRequests[requestId];
    require(!r.claimed, "claimed");
    require(block.timestamp >= r.unlockTime, "cooldown");

    // Level enforcement: prevent claims that would breach a floor unless downgraded
    // NOTE: Draft logic keeps it simple; production should enforce epoch caps and downgrades.
    pendingExitAssets -= r.assets;
    r.claimed = true;
    totalAssets -= r.assets;
    require(IERC20(labsToken).transfer(r.owner, r.assets), "transfer fail");
    _maybeEmitLevelChange();
    emit RedeemClaimed(requestId, r.owner, r.assets);
  }

  // Allow third parties to fill a pending redemption by depositing assets to the vault
  // Assets are sent directly to the requester, preserving level while respecting caps
  function fillRedeem(uint256 requestId, address receiver) external nonReentrant returns (uint256 sharesMinted) {
    RedeemRequest storage r = redeemRequests[requestId];
    require(!r.claimed, "claimed");
    _rollEpochIfNeeded();
    uint256 assets = r.assets;
    // filler transfers LABS to requester, vault keeps accounting neutral by minting shares to receiver
    require(IERC20(labsToken).transferFrom(msg.sender, r.owner, assets), "fill xfer fail");
    pendingExitAssets -= assets;
    r.claimed = true;
    // No change in totalAssets since assets did not enter vault; mint shares at current rate to receiver as incentive (optional)
    // For a neutral fill, set sharesMinted = 0; here we mint equivalent shares to receiver from vault treasury logic in production.
    sharesMinted = 0;
    emit RedeemFilled(requestId, msg.sender, assets, receiver);
  }

  // ---- Admin setters (for draft; production should restrict via governance) ----
  function setCooldown(uint64 seconds_) external {
    cooldownSeconds = seconds_;
    emit ExitCapsUpdated(cooldownSeconds, epochExitCapBps);
  }

  function setEpochExitCapBps(uint16 bps) external {
    require(bps <= 10_000, "bps>100%");
    epochExitCapBps = bps;
    emit ExitCapsUpdated(cooldownSeconds, epochExitCapBps);
  }

  // ---- Internal helpers ----
  function _maybeEmitLevelChange() internal {
    // This emits current level; consumers can track transitions off-chain
    emit LevelChanged(getLevel(), totalAssets);
  }

  function _rollEpochIfNeeded() internal {
    // Simple daily epoch (86400s); production can make configurable
    if (block.timestamp >= epochStart + 86400) {
      epochStart = uint64(block.timestamp);
      epochExitedAssets = 0;
      emit EpochRolled(epochStart);
    }
  }

  function _checkAndAccrueExitCap(uint256 assets) internal {
    uint256 cap = (totalAssets * epochExitCapBps) / 10_000;
    require(epochExitedAssets + assets <= cap, "epoch cap");
    epochExitedAssets += assets;
  }
}


