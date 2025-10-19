// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

contract LabVault is ERC20Base {
  address public immutable labsToken;
  string public labDisplayName;
  address public admin;

  uint256 public constant LEVEL1 = 100_000e18;
  uint256 public constant LEVEL2 = 250_000e18;
  uint256 public constant LEVEL3 = 500_000e18;
  uint16 public constant MAX_EXIT_CAP_BPS = 10_000; // 100%

  uint64 public cooldownSeconds;
  uint16 public epochExitCapBps;
  uint64 public epochStart;

  uint256 public totalAssets;
  uint256 public pendingExitAssets;
  uint256 public epochExitedAssets;

  uint256 private constant NOT_ENTERED = 1;
  uint256 private constant ENTERED = 2;
  uint256 private status = NOT_ENTERED;

  modifier nonReentrant() {
    require(status == NOT_ENTERED, "reentrancy");
    status = ENTERED;
    _;
    status = NOT_ENTERED;
  }

  // Optimized struct packing: 2 storage slots instead of 4
  struct RedeemRequest {
    address owner;      // 20 bytes
    uint64 unlockTime;  // 8 bytes  
    bool claimed;       // 1 byte
    // Total: 29 bytes in slot 1 (3 bytes padding)
    uint256 assets;     // 32 bytes in slot 2
  }

  uint256 public nextRequestId;
  mapping(uint256 => RedeemRequest) public redeemRequests;

  event Deposited(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);
  event RedeemRequested(uint256 indexed requestId, address indexed owner, uint256 sharesBurned, uint256 assets, uint64 unlockTime);
  event RedeemClaimed(uint256 indexed requestId, address indexed owner, uint256 assets);
  event RedeemCanceled(uint256 indexed requestId, address indexed owner, uint256 assets, uint256 sharesReMinted);
  event LevelChanged(uint8 newLevel, uint256 totalAssets);
  event ExitCapsUpdated(uint64 cooldownSeconds, uint16 epochExitCapBps);
  event EpochRolled(uint64 newEpochStart);
  event RedeemFilled(uint256 indexed requestId, address indexed filler, uint256 assets, address receiver);
  event AdminUpdated(address indexed newAdmin);
  event Paused(address indexed account);
  event Unpaused(address indexed account);

  error Unauthorized();
  error InvalidAddress();
  error InvalidAmount();
  error InvalidParameter();
  error ContractPaused();

  bool private _paused;

  modifier onlyAdmin() {
    if (msg.sender != admin) revert Unauthorized();
    _;
  }

  modifier whenNotPaused() {
    if (_paused) revert ContractPaused();
    _;
  }

  constructor(
    address labsToken_,
    string memory h1Name_,
    string memory h1Symbol_,
    string memory labDisplayName_,
    uint64 cooldownSeconds_,
    uint16 epochExitCapBps_,
    address admin_
  ) ERC20Base(h1Name_, h1Symbol_, 18) {
    require(labsToken_ != address(0), "labs token = 0");
    require(bytes(h1Name_).length > 0 && bytes(h1Name_).length <= 50, "invalid name");
    require(bytes(h1Symbol_).length > 0 && bytes(h1Symbol_).length <= 10, "invalid symbol");
    require(epochExitCapBps_ <= MAX_EXIT_CAP_BPS, "exit cap > 100%");
    
    labsToken = labsToken_;
    labDisplayName = labDisplayName_;
    cooldownSeconds = cooldownSeconds_;
    epochExitCapBps = epochExitCapBps_;
    epochStart = uint64(block.timestamp);
    admin = admin_;
  }

  function assetsPerShare() public view returns (uint256) {
    uint256 supply = totalSupply();
    if (supply == 0) return 1e18;
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

  function depositLABS(uint256 assets, address receiver) external nonReentrant whenNotPaused returns (uint256 shares) {
    require(assets > 0, "zero assets");
    shares = previewDeposit(assets);
    require(IERC20(labsToken).transferFrom(msg.sender, address(this), assets), "transferFrom fail");
    totalAssets += assets;
    _mint(receiver, shares);
    _maybeEmitLevelChange();
    emit Deposited(msg.sender, receiver, assets, shares);
  }

  function mintShares(uint256 shares, address receiver) external nonReentrant whenNotPaused returns (uint256 assets) {
    require(shares > 0, "zero shares");
    assets = previewMint(shares);
    require(IERC20(labsToken).transferFrom(msg.sender, address(this), assets), "transferFrom fail");
    totalAssets += assets;
    _mint(receiver, shares);
    _maybeEmitLevelChange();
    emit Deposited(msg.sender, receiver, assets, shares);
  }

  function requestRedeem(uint256 shares) external nonReentrant whenNotPaused returns (uint256 requestId, uint256 assets) {
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
    pendingExitAssets -= r.assets;
    r.claimed = true;
    totalAssets -= r.assets;
    require(IERC20(labsToken).transfer(r.owner, r.assets), "transfer fail");
    _maybeEmitLevelChange();
    emit RedeemClaimed(requestId, r.owner, r.assets);
  }

  function fillRedeem(uint256 requestId, address receiver) external nonReentrant returns (uint256 sharesMinted) {
    RedeemRequest storage r = redeemRequests[requestId];
    require(!r.claimed, "claimed");
    _rollEpochIfNeeded();
    uint256 assets = r.assets;
    require(IERC20(labsToken).transferFrom(msg.sender, r.owner, assets), "fill xfer fail");
    pendingExitAssets -= assets;
    r.claimed = true;
    sharesMinted = 0;
    emit RedeemFilled(requestId, msg.sender, assets, receiver);
  }

  function setAdmin(address newAdmin) external onlyAdmin {
    if (newAdmin == address(0)) revert InvalidAddress();
    admin = newAdmin;
    emit AdminUpdated(newAdmin);
  }

  function setCooldown(uint64 seconds_) external onlyAdmin {
    if (seconds_ > 30 days) revert InvalidParameter();
    cooldownSeconds = seconds_;
    emit ExitCapsUpdated(cooldownSeconds, epochExitCapBps);
  }

  function setEpochExitCapBps(uint16 bps) external onlyAdmin {
    if (bps > MAX_EXIT_CAP_BPS) revert InvalidParameter();
    epochExitCapBps = bps;
    emit ExitCapsUpdated(cooldownSeconds, epochExitCapBps);
  }

  /// @notice Emergency pause of vault operations
  /// @dev Only callable by admin
  function pause() external onlyAdmin {
    _paused = true;
    emit Paused(msg.sender);
  }

  /// @notice Unpause vault operations
  /// @dev Only callable by admin
  function unpause() external onlyAdmin {
    _paused = false;
    emit Unpaused(msg.sender);
  }

  /// @notice Returns pause status
  function paused() external view returns (bool) {
    return _paused;
  }

  function _maybeEmitLevelChange() internal {
    emit LevelChanged(getLevel(), totalAssets);
  }

  function _rollEpochIfNeeded() internal {
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


