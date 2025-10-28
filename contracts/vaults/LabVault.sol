// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20Base } from "../tokens/ERC20Base.sol";
import { IERC20 } from "../interfaces/IERC20.sol";

contract LabVault is ERC20Base {
  address public immutable labsToken;
  string public labDisplayName;
  address public admin;
  address public labOwner;           // New: Lab owner receives 1.5% of fees
  address public treasury;           // New: H1 treasury receives 1% of fees

  uint256 public constant LEVEL1 = 100_000e18;
  uint256 public constant LEVEL2 = 250_000e18;
  uint256 public constant LEVEL3 = 500_000e18;
  uint16 public constant MAX_EXIT_CAP_BPS = 10_000; // 100%
  uint16 public constant MAX_TOTAL_FEE_BPS = 250;   // 2.5% max total fee (1.5% + 1%)

  uint64 public cooldownSeconds;
  uint16 public epochExitCapBps;
  uint64 public epochStart;
  
  // Fee configuration (basis points) - Total: 2.5% (1.5% + 1%)
  uint16 public depositFeeLabOwnerBps = 150;        // 1.5% to lab owner (default)
  uint16 public depositFeeTreasuryBps = 100;        // 1% to treasury (default)
  uint16 public redemptionFeeLabOwnerBps = 150;     // 1.5% to lab owner (default)
  uint16 public redemptionFeeTreasuryBps = 100;     // 1% to treasury (default)

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
  event DepositFeeCollected(address indexed caller, uint256 labOwnerFee, uint256 treasuryFee);
  event RedeemRequested(uint256 indexed requestId, address indexed owner, uint256 sharesBurned, uint256 assets, uint64 unlockTime);
  event RedemptionFeeCollected(uint256 indexed requestId, address indexed owner, uint256 labOwnerFee, uint256 treasuryFee);
  event RedeemClaimed(uint256 indexed requestId, address indexed owner, uint256 assets);
  event RedeemCanceled(uint256 indexed requestId, address indexed owner, uint256 assets, uint256 sharesReMinted);
  event LevelChanged(uint8 newLevel, uint256 totalAssets);
  event ExitCapsUpdated(uint64 cooldownSeconds, uint16 epochExitCapBps);
  event EpochRolled(uint64 newEpochStart);
  event RedeemFilled(uint256 indexed requestId, address indexed filler, uint256 assets, address receiver);
  event AdminUpdated(address indexed newAdmin);
  event LabOwnerUpdated(address indexed newLabOwner);
  event TreasuryUpdated(address indexed newTreasury);
  event FeesUpdated(uint16 depositLabOwnerBps, uint16 depositTreasuryBps, uint16 redemptionLabOwnerBps, uint16 redemptionTreasuryBps);
  event Paused(address indexed account);
  event Unpaused(address indexed account);
  event InitialMintCompleted(uint256 totalMinted, address indexed diamond);

  error Unauthorized();
  error InvalidAddress();
  error InvalidAmount();
  error InvalidParameter();
  error ContractPaused();
  error InitialMintAlreadyCompleted();

  bool private _paused;
  bool public initialMintCompleted;  // Track if initial H1 distribution happened
  address public immutable diamond;   // H1Diamond address for auth

  // Testing variables (TESTNET ONLY)
  bool public testMode;
  uint8 public overrideLevel;
  uint256 public testTimeOffset;

  // Constructor parameters struct to avoid stack too deep
  struct ConstructorParams {
    address labsToken;
    string h1Name;
    string h1Symbol;
    string labDisplayName;
    uint64 cooldownSeconds;
    uint16 epochExitCapBps;
    address admin;
    address labOwner;
    address treasury;
    address diamond;
  }

  modifier onlyAdmin() {
    if (msg.sender != admin) revert Unauthorized();
    _;
  }

  modifier whenNotPaused() {
    if (_paused) revert ContractPaused();
    _;
  }

  constructor(ConstructorParams memory params) ERC20Base(params.h1Name, params.h1Symbol, 18) {
    require(params.labsToken != address(0), "labs token = 0");
    require(params.labOwner != address(0), "lab owner = 0");
    require(params.treasury != address(0), "treasury = 0");
    require(params.diamond != address(0), "diamond = 0");
    require(bytes(params.h1Name).length > 0 && bytes(params.h1Name).length <= 50, "invalid name");
    require(bytes(params.h1Symbol).length > 0 && bytes(params.h1Symbol).length <= 10, "invalid symbol");
    require(params.epochExitCapBps <= MAX_EXIT_CAP_BPS, "exit cap > 100%");
    
    labsToken = params.labsToken;
    labDisplayName = params.labDisplayName;
    cooldownSeconds = params.cooldownSeconds;
    epochExitCapBps = params.epochExitCapBps;
    admin = params.admin;
    labOwner = params.labOwner;
    treasury = params.treasury;
    diamond = params.diamond;
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

  /// @notice Preview deposit accounting for deposit fee
  function previewDepositWithFee(uint256 assets) public view returns (uint256 shares, uint256 labOwnerFee, uint256 treasuryFee) {
    labOwnerFee = (assets * depositFeeLabOwnerBps) / 10_000;
    treasuryFee = (assets * depositFeeTreasuryBps) / 10_000;
    uint256 netAssets = assets - (labOwnerFee + treasuryFee);
    shares = previewDeposit(netAssets);
  }

  /// @notice Preview redemption accounting for redemption fee
  function previewRedeemWithFee(uint256 shares) public view returns (uint256 assets, uint256 labOwnerFee, uint256 treasuryFee) {
    assets = previewRedeem(shares);
    labOwnerFee = (assets * redemptionFeeLabOwnerBps) / 10_000;
    treasuryFee = (assets * redemptionFeeTreasuryBps) / 10_000;
  }

  function getLevel() public view returns (uint8 level) {
    // If in test mode and override level is set, return it
    if (testMode && overrideLevel > 0) {
      return overrideLevel;
    }
    
    // Normal level calculation
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

  /// @notice Initial H1 mint on lab creation (one-time only)
  /// @dev Called by H1Diamond during lab creation to distribute initial H1 tokens
  /// @param labsAmount Total LABS backing this H1 issuance
  /// @param recipients Array of recipient addresses [owner, curve, vault, vault, treasury]
  /// @param amounts Array of H1 amounts [owner 30%, curve 10%, scholars 40%, devs 15%, treasury 5%]
  /// @return totalH1Minted Total H1 tokens minted
  function initialMint(
    uint256 labsAmount,
    address[] calldata recipients,
    uint256[] calldata amounts
  ) external nonReentrant returns (uint256 totalH1Minted) {
    // Only diamond can call during lab creation
    if (msg.sender != diamond) revert Unauthorized();
    if (initialMintCompleted) revert InitialMintAlreadyCompleted();
    if (recipients.length != 5 || amounts.length != 5) revert InvalidParameter();
    
    // Transfer LABS backing from diamond
    require(
      IERC20(labsToken).transferFrom(msg.sender, address(this), labsAmount),
      "LABS transfer failed"
    );
    
    // Update vault backing (no fees on initial mint)
    totalAssets += labsAmount;
    
    // Mint H1 tokens to recipients
    // recipients[0] = vault (owner vesting holder)
    // recipients[1] = curve (liquid market making)
    // recipients[2] = vault (scholar reserve holder)
    // recipients[3] = vault (dev reserve holder)
    // recipients[4] = treasury (instant distribution)
    for (uint256 i = 0; i < recipients.length; i++) {
      if (amounts[i] > 0) {
        _mint(recipients[i], amounts[i]);
        totalH1Minted += amounts[i];
      }
    }
    
    initialMintCompleted = true;
    emit InitialMintCompleted(totalH1Minted, msg.sender);
  }

  function depositLABS(uint256 assets, address receiver) external nonReentrant whenNotPaused returns (uint256 shares) {
    require(assets > 0, "zero assets");
    
    // Calculate fees
    uint256 labOwnerFee = (assets * depositFeeLabOwnerBps) / 10_000;
    uint256 treasuryFee = (assets * depositFeeTreasuryBps) / 10_000;
    uint256 netAssets = assets - (labOwnerFee + treasuryFee);
    
    shares = previewDeposit(netAssets);
    require(IERC20(labsToken).transferFrom(msg.sender, address(this), assets), "transferFrom fail");
    
    // Distribute fees
    if (labOwnerFee > 0) {
      require(IERC20(labsToken).transfer(labOwner, labOwnerFee), "lab owner fee transfer fail");
    }
    if (treasuryFee > 0) {
      require(IERC20(labsToken).transfer(treasury, treasuryFee), "treasury fee transfer fail");
    }
    
    totalAssets += netAssets;
    _mint(receiver, shares);
    _maybeEmitLevelChange();
    emit DepositFeeCollected(msg.sender, labOwnerFee, treasuryFee);
    emit Deposited(msg.sender, receiver, netAssets, shares);
  }

  function mintShares(uint256 shares, address receiver) external nonReentrant whenNotPaused returns (uint256 assets) {
    require(shares > 0, "zero shares");
    assets = previewMint(shares);
    
    // Calculate fees
    uint256 labOwnerFee = (assets * depositFeeLabOwnerBps) / 10_000;
    uint256 treasuryFee = (assets * depositFeeTreasuryBps) / 10_000;
    uint256 totalRequired = assets + (labOwnerFee + treasuryFee);
    
    require(IERC20(labsToken).transferFrom(msg.sender, address(this), totalRequired), "transferFrom fail");
    
    // Distribute fees
    if (labOwnerFee > 0) {
      require(IERC20(labsToken).transfer(labOwner, labOwnerFee), "lab owner fee transfer fail");
    }
    if (treasuryFee > 0) {
      require(IERC20(labsToken).transfer(treasury, treasuryFee), "treasury fee transfer fail");
    }
    
    totalAssets += assets;
    _mint(receiver, shares);
    _maybeEmitLevelChange();
    emit DepositFeeCollected(msg.sender, labOwnerFee, treasuryFee);
    emit Deposited(msg.sender, receiver, assets, shares);
  }

  function requestRedeem(uint256 shares) external nonReentrant whenNotPaused returns (uint256 requestId, uint256 assets) {
    require(shares > 0, "zero shares");
    assets = previewRedeem(shares);
    
    // Calculate redemption fees
    uint256 labOwnerFee = (assets * redemptionFeeLabOwnerBps) / 10_000;
    uint256 treasuryFee = (assets * redemptionFeeTreasuryBps) / 10_000;
    
    _rollEpochIfNeeded();
    _checkAndAccrueExitCap(assets);
    _burn(msg.sender, shares);
    pendingExitAssets += assets;
    uint64 unlockTime = uint64(_currentTime()) + cooldownSeconds;
    requestId = ++nextRequestId;
    redeemRequests[requestId] = RedeemRequest({ owner: msg.sender, assets: assets, unlockTime: unlockTime, claimed: false });
    emit RedemptionFeeCollected(requestId, msg.sender, labOwnerFee, treasuryFee);
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
    require(_currentTime() >= r.unlockTime, "cooldown");
    pendingExitAssets -= r.assets;
    r.claimed = true;
    totalAssets -= r.assets;
    
    // Calculate and apply fees at claim time
    uint256 labOwnerFee = (r.assets * redemptionFeeLabOwnerBps) / 10_000;
    uint256 treasuryFee = (r.assets * redemptionFeeTreasuryBps) / 10_000;
    uint256 netAssets = r.assets - (labOwnerFee + treasuryFee);
    
    // Distribute fees
    if (labOwnerFee > 0) {
      require(IERC20(labsToken).transfer(labOwner, labOwnerFee), "lab owner fee transfer fail");
    }
    if (treasuryFee > 0) {
      require(IERC20(labsToken).transfer(treasury, treasuryFee), "treasury fee transfer fail");
    }
    
    require(IERC20(labsToken).transfer(r.owner, netAssets), "transfer fail");
    _maybeEmitLevelChange();
    emit RedeemClaimed(requestId, r.owner, netAssets);
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

  function setLabOwner(address newLabOwner) external onlyAdmin {
    if (newLabOwner == address(0)) revert InvalidAddress();
    labOwner = newLabOwner;
    emit LabOwnerUpdated(newLabOwner);
  }

  function setTreasury(address newTreasury) external onlyAdmin {
    if (newTreasury == address(0)) revert InvalidAddress();
    treasury = newTreasury;
    emit TreasuryUpdated(newTreasury);
  }

  /// @notice Set deposit and redemption fees (in basis points)
  /// @dev Both fees must be <= 100 bps (1%)
  function setFees(uint16 depositLabOwnerBps_, uint16 depositTreasuryBps_, uint16 redemptionLabOwnerBps_, uint16 redemptionTreasuryBps_) external onlyAdmin {
    require(depositLabOwnerBps_ <= MAX_TOTAL_FEE_BPS, "deposit lab owner fee too high");
    require(depositTreasuryBps_ <= MAX_TOTAL_FEE_BPS, "deposit treasury fee too high");
    require(redemptionLabOwnerBps_ <= MAX_TOTAL_FEE_BPS, "redemption lab owner fee too high");
    require(redemptionTreasuryBps_ <= MAX_TOTAL_FEE_BPS, "redemption treasury fee too high");
    depositFeeLabOwnerBps = depositLabOwnerBps_;
    depositFeeTreasuryBps = depositTreasuryBps_;
    redemptionFeeLabOwnerBps = redemptionLabOwnerBps_;
    redemptionFeeTreasuryBps = redemptionTreasuryBps_;
    emit FeesUpdated(depositFeeLabOwnerBps, depositFeeTreasuryBps, redemptionFeeLabOwnerBps, redemptionFeeTreasuryBps);
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
    if (_currentTime() >= epochStart + 86400) {
      epochStart = uint64(_currentTime());
      epochExitedAssets = 0;
      emit EpochRolled(epochStart);
    }
  }

  function _checkAndAccrueExitCap(uint256 assets) internal {
    uint256 cap = (totalAssets * epochExitCapBps) / 10_000;
    require(epochExitedAssets + assets <= cap, "epoch cap");
    epochExitedAssets += assets;
  }

  // ============================================
  // TESTING FUNCTIONS (TESTNET ONLY)
  // ============================================
  
  /// @notice Enable/disable test mode
  /// @dev Only admin can call. Test mode allows level override
  function setTestMode(bool enabled) external onlyAdmin {
    testMode = enabled;
  }
  
  /// @notice Set override level (only works in test mode)
  /// @dev Allows testing app slots without full TVL
  function setOverrideLevel(uint8 level) external onlyAdmin {
    require(level <= 3, "invalid level");
    overrideLevel = level;
  }
  
  /// @notice Set time offset for testing
  /// @dev Allows fast-forwarding time to test cooldowns
  function setTestTimeOffset(uint256 offset) external onlyAdmin {
    require(offset <= 365 days, "offset too large");
    testTimeOffset = offset;
  }
  
  /// @notice Reset epoch (allows more exits immediately)
  /// @dev Useful for testing exit caps
  function resetEpoch() external onlyAdmin {
    epochStart = uint64(_currentTime());
    epochExitedAssets = 0;
    emit EpochRolled(epochStart);
  }
  
  /// @notice Force complete a redemption request (bypass cooldown)
  /// @dev TESTNET ONLY - Allows immediate claim for testing
  function forceCompleteRedemption(uint256 requestId) external onlyAdmin {
    RedeemRequest storage r = redeemRequests[requestId];
    require(!r.claimed, "already claimed");
    r.unlockTime = uint64(_currentTime());
  }
  
  /// @notice Get current time with offset applied
  /// @dev Used internally for all time checks
  function _currentTime() internal view returns (uint256) {
    return block.timestamp + testTimeOffset;
  }
}