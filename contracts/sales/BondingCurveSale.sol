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
}

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

  uint256 private constant NOT_ENTERED = 1;
  uint256 private constant ENTERED = 2;
  uint256 private status = NOT_ENTERED;

  event Purchased(address indexed buyer, uint256 labsIn, uint256 sharesOut, uint256 feeLabs, uint256 polLabs);

  error ReentrancyGuard();
  error InvalidAddress();
  error InvalidAmount();
  error SlippageExceeded();
  error TransferFailed();
  error FeeTooHigh();

  modifier nonReentrant() {
    if (status == ENTERED) revert ReentrancyGuard();
    status = ENTERED;
    _;
    status = NOT_ENTERED;
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
  }

  function price() public view returns (uint256) {
    uint256 nav = vault.assetsPerShare();
    return (nav * PRICE_PREMIUM_BPS) / PRICE_BASE;
  }

  function buy(uint256 labsAmount, address receiver, uint256 minSharesOut) external nonReentrant returns (uint256 sharesOut) {
    if (labsAmount == 0) revert InvalidAmount();
    if (receiver == address(0)) revert InvalidAddress();
    
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
    
    // Approve vault to spend tokens
    if (!IERC20Like(labsToken).approve(address(vault), toDeposit)) {
      revert TransferFailed();
    }
    
    // Deposit to vault and receive shares
    sharesOut = vault.depositLABS(toDeposit, receiver);
    
    // Slippage protection
    if (sharesOut < minSharesOut) revert SlippageExceeded();
    
    emit Purchased(msg.sender, labsAmount, sharesOut, fee, pol);
  }

  function buyFrom(address buyer, uint256 labsAmount, address receiver, uint256 minSharesOut) external nonReentrant returns (uint256 sharesOut) {
    if (labsAmount == 0) revert InvalidAmount();
    if (buyer == address(0) || receiver == address(0)) revert InvalidAddress();
    
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
    
    // Approve vault to spend tokens
    if (!IERC20Like(labsToken).approve(address(vault), toDeposit)) {
      revert TransferFailed();
    }
    
    // Deposit to vault and receive shares
    sharesOut = vault.depositLABS(toDeposit, receiver);
    
    // Slippage protection
    if (sharesOut < minSharesOut) revert SlippageExceeded();
    
    emit Purchased(buyer, labsAmount, sharesOut, fee, pol);
  }
}


