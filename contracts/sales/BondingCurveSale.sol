// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILabVaultLike {
  function depositLABS(uint256 assets, address receiver) external returns (uint256 shares);
  function assetsPerShare() external view returns (uint256);
}

interface IERC20Like {
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function transfer(address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);
  function allowance(address owner, address spender) external view returns (uint256);
}

/// @title BondingCurveSale
/// @notice Bonding curve implementation for purchasing lab vault shares
/// @dev Includes slippage protection and fee caps to prevent exploitation
contract BondingCurveSale {
  address public immutable labsToken;
  ILabVaultLike public immutable vault;
  address public immutable treasury;

  uint16 public feeBps;
  uint16 public polBps;
  
  uint16 public constant MAX_FEE_BPS = 1000;  // 10% max fee
  uint16 public constant MAX_POL_BPS = 1000;  // 10% max POL
  uint256 private constant BPS_DENOMINATOR = 10_000;
  uint256 private constant PRICE_PREMIUM_BPS = 1005; // 0.5% premium
  uint256 private constant PRICE_BASE = 1000;
  
  // Price bounds for validation (prevents price manipulation)
  uint256 public constant MIN_PRICE = 1e15;     // 0.001 LABS minimum
  uint256 public constant MAX_PRICE = 1e24;     // 1,000,000 LABS maximum
  uint256 public constant MAX_PRICE_CHANGE_BPS = 5000; // 50% max change per tx

  uint256 private constant NOT_ENTERED = 1;
  uint256 private constant ENTERED = 2;
  uint256 private status = NOT_ENTERED;
  uint256 private lastPrice;

  // Pausable functionality for emergency response
  bool private _paused;
  address public admin;

  event Purchased(address indexed buyer, uint256 labsIn, uint256 sharesOut, uint256 feeLabs, uint256 polLabs);
  event Paused(address indexed account);
  event Unpaused(address indexed account);
  event AdminUpdated(address indexed newAdmin);

  error ReentrancyGuard();
  error InvalidAddress();
  error InvalidAmount();
  error SlippageExceeded();
  error TransferFailed();
  error FeeTooHigh();
  error PriceOutOfBounds();
  error PriceChangeExcessive();
  error ContractPaused();
  error Unauthorized();

  modifier nonReentrant() {
    if (status == ENTERED) revert ReentrancyGuard();
    status = ENTERED;
    _;
    status = NOT_ENTERED;
  }

  modifier whenNotPaused() {
    if (_paused) revert ContractPaused();
    _;
  }

  modifier onlyAdmin() {
    if (msg.sender != admin) revert Unauthorized();
    _;
  }

  constructor(address labsToken_, address vault_, address treasury_, uint16 feeBps_, uint16 polBps_) {
    if (labsToken_ == address(0) || vault_ == address(0) || treasury_ == address(0)) {
      revert InvalidAddress();
    }
    if (feeBps_ > MAX_FEE_BPS) revert FeeTooHigh();
    if (polBps_ > MAX_POL_BPS) revert FeeTooHigh();
    
    labsToken = labsToken_;
    vault = ILabVaultLike(vault_);
    treasury = treasury_;
    feeBps = feeBps_;
    polBps = polBps_;
    admin = msg.sender; // Deployer is initial admin
  }

  /// @notice Returns current price per share with 0.5% premium
  /// @dev Price based on vault's NAV with premium factor and validation
  /// @return Current price per share in LABS tokens
  function price() public view returns (uint256) {
    uint256 nav = vault.assetsPerShare();
    uint256 currentPrice = (nav * PRICE_PREMIUM_BPS) / PRICE_BASE;
    
    // Validate price is within bounds
    if (currentPrice < MIN_PRICE || currentPrice > MAX_PRICE) {
      return MIN_PRICE; // Fallback to minimum safe price
    }
    
    return currentPrice;
  }

  /// @notice Validates price hasn't changed excessively
  /// @dev Prevents price manipulation attacks
  /// @param currentPrice Current price to validate
  function _validatePriceChange(uint256 currentPrice) private {
    if (lastPrice == 0) {
      lastPrice = currentPrice;
      return;
    }
    
    uint256 priceDiff;
    uint256 changePercentBps;
    
    if (currentPrice > lastPrice) {
      priceDiff = currentPrice - lastPrice;
      changePercentBps = (priceDiff * BPS_DENOMINATOR) / lastPrice;
    } else {
      priceDiff = lastPrice - currentPrice;
      changePercentBps = (priceDiff * BPS_DENOMINATOR) / lastPrice;
    }
    
    if (changePercentBps > MAX_PRICE_CHANGE_BPS) revert PriceChangeExcessive();
    lastPrice = currentPrice;
  }

  /// @notice Purchase vault shares with LABS tokens
  /// @dev Includes slippage protection via minSharesOut parameter
  /// @param labsAmount Amount of LABS tokens to spend
  /// @param receiver Address to receive the vault shares
  /// @param minSharesOut Minimum shares to receive (slippage protection)
  /// @return sharesOut Actual amount of shares received
  /// @custom:reverts InvalidAmount if labsAmount is zero
  /// @custom:reverts InvalidAddress if receiver is zero address
  /// @custom:reverts SlippageExceeded if sharesOut < minSharesOut
  /// @custom:reverts TransferFailed if any token transfer fails
  /// @custom:reverts ContractPaused if contract is paused
  function buy(uint256 labsAmount, address receiver, uint256 minSharesOut) external nonReentrant whenNotPaused returns (uint256 sharesOut) {
    if (labsAmount == 0) revert InvalidAmount();
    if (receiver == address(0)) revert InvalidAddress();
    
    // Validate price before purchase
    uint256 currentPrice = price();
    if (currentPrice < MIN_PRICE || currentPrice > MAX_PRICE) revert PriceOutOfBounds();
    _validatePriceChange(currentPrice);
    
    uint256 fee = (labsAmount * feeBps) / BPS_DENOMINATOR;
    uint256 pol = (labsAmount * polBps) / BPS_DENOMINATOR;
    uint256 toDeposit = labsAmount - fee - pol;

    // Transfer tokens from sender
    if (!IERC20Like(labsToken).transferFrom(msg.sender, address(this), labsAmount)) {
      revert TransferFailed();
    }
    
    // Distribute fee to treasury
    if (fee > 0 && !IERC20Like(labsToken).transfer(treasury, fee)) {
      revert TransferFailed();
    }
    // Route POL to treasury as well (protocol-owned liquidity reserve)
    if (pol > 0 && !IERC20Like(labsToken).transfer(treasury, pol)) {
      revert TransferFailed();
    }
    
    // Approve vault to spend tokens using robust allowance pattern
    uint256 currentAllowance = IERC20Like(labsToken).allowance(address(this), address(vault));
    if (currentAllowance < toDeposit) {
      // Some ERC20s require zeroing allowance first
      if (currentAllowance != 0) {
        if (!IERC20Like(labsToken).approve(address(vault), 0)) revert TransferFailed();
      }
      if (!IERC20Like(labsToken).approve(address(vault), toDeposit)) revert TransferFailed();
    }
    
    // Deposit to vault and receive shares
    sharesOut = vault.depositLABS(toDeposit, receiver);
    
    // Slippage protection
    if (sharesOut < minSharesOut) revert SlippageExceeded();
    
    emit Purchased(msg.sender, labsAmount, sharesOut, fee, pol);
  }

  function buyFrom(address buyer, uint256 labsAmount, address receiver, uint256 minSharesOut) external nonReentrant whenNotPaused returns (uint256 sharesOut) {
    if (labsAmount == 0) revert InvalidAmount();
    if (buyer == address(0) || receiver == address(0)) revert InvalidAddress();
    
    // Validate price before purchase
    uint256 currentPrice = price();
    if (currentPrice < MIN_PRICE || currentPrice > MAX_PRICE) revert PriceOutOfBounds();
    _validatePriceChange(currentPrice);
    
    uint256 fee = (labsAmount * feeBps) / BPS_DENOMINATOR;
    uint256 pol = (labsAmount * polBps) / BPS_DENOMINATOR;
    uint256 toDeposit = labsAmount - fee - pol;

    // Transfer tokens from buyer
    if (!IERC20Like(labsToken).transferFrom(buyer, address(this), labsAmount)) {
      revert TransferFailed();
    }
    
    // Distribute fee to treasury
    if (fee > 0 && !IERC20Like(labsToken).transfer(treasury, fee)) {
      revert TransferFailed();
    }
    // Route POL to treasury as well
    if (pol > 0 && !IERC20Like(labsToken).transfer(treasury, pol)) {
      revert TransferFailed();
    }
    
    // Approve vault to spend tokens using robust allowance pattern
    uint256 currentAllowance = IERC20Like(labsToken).allowance(address(this), address(vault));
    if (currentAllowance < toDeposit) {
      if (currentAllowance != 0) {
        if (!IERC20Like(labsToken).approve(address(vault), 0)) revert TransferFailed();
      }
      if (!IERC20Like(labsToken).approve(address(vault), toDeposit)) revert TransferFailed();
    }
    
    // Deposit to vault and receive shares
    sharesOut = vault.depositLABS(toDeposit, receiver);
    
    // Slippage protection
    if (sharesOut < minSharesOut) revert SlippageExceeded();
    
    emit Purchased(buyer, labsAmount, sharesOut, fee, pol);
  }

  /// @notice Emergency pause of bonding curve operations
  /// @dev Only callable by admin to halt trading in security incidents
  function pause() external onlyAdmin {
    _paused = true;
    emit Paused(msg.sender);
  }

  /// @notice Unpause bonding curve operations
  /// @dev Only callable by admin after security incident is resolved
  function unpause() external onlyAdmin {
    _paused = false;
    emit Unpaused(msg.sender);
  }

  /// @notice Returns pause status
  /// @return True if paused, false otherwise
  function paused() external view returns (bool) {
    return _paused;
  }

  /// @notice Updates the admin address
  /// @dev Only callable by current admin
  /// @param newAdmin Address of new admin
  function setAdmin(address newAdmin) external onlyAdmin {
    if (newAdmin == address(0)) revert InvalidAddress();
    admin = newAdmin;
    emit AdminUpdated(newAdmin);
  }
}


