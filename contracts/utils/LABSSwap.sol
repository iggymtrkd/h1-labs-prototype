// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
  function transfer(address to, uint256 value) external returns (bool);
  function balanceOf(address account) external view returns (uint256);
}

/// @title LABSSwap
/// @notice Simple ETH to LABS token swap for testnet
/// @dev Fixed-rate swap contract with admin controls for testing
contract LABSSwap {
  address public immutable labsToken;
  address public admin;
  
  // Exchange rate: LABS tokens per 1 ETH
  // Default: 1 ETH = 1,000 LABS (rate = 1000e18)
  uint256 public rate;
  
  // Minimum swap amount (0.001 ETH)
  uint256 public constant MIN_SWAP = 0.001 ether;
  
  // Maximum swap amount per transaction (10 ETH)
  uint256 public constant MAX_SWAP = 10 ether;
  
  bool public paused;
  
  event Swapped(address indexed user, uint256 ethIn, uint256 labsOut);
  event RateUpdated(uint256 oldRate, uint256 newRate);
  event AdminUpdated(address indexed oldAdmin, address indexed newAdmin);
  event Paused(address indexed account);
  event Unpaused(address indexed account);
  event ETHWithdrawn(address indexed to, uint256 amount);
  event LABSDeposited(address indexed from, uint256 amount);
  
  error Unauthorized();
  error InvalidAmount();
  error InsufficientLABS();
  error TransferFailed();
  error ContractPaused();
  error InvalidRate();
  
  modifier onlyAdmin() {
    if (msg.sender != admin) revert Unauthorized();
    _;
  }
  
  modifier whenNotPaused() {
    if (paused) revert ContractPaused();
    _;
  }
  
  /// @notice Initialize swap contract
  /// @param labsToken_ Address of LABS token
  /// @param initialRate_ Initial exchange rate (LABS per 1 ETH, 18 decimals)
  constructor(address labsToken_, uint256 initialRate_) {
    require(labsToken_ != address(0), "zero address");
    require(initialRate_ > 0, "zero rate");
    
    labsToken = labsToken_;
    rate = initialRate_;
    admin = msg.sender;
  }
  
  /// @notice Swap ETH for LABS tokens at current rate
  /// @dev Calculates LABS amount based on ETH sent and current rate
  /// @return labsAmount Amount of LABS tokens received
  function swapETHForLABS() external payable whenNotPaused returns (uint256 labsAmount) {
    if (msg.value < MIN_SWAP) revert InvalidAmount();
    if (msg.value > MAX_SWAP) revert InvalidAmount();
    
    // Calculate LABS amount: (ETH * rate) / 1e18
    labsAmount = (msg.value * rate) / 1e18;
    
    // Check contract has enough LABS
    uint256 balance = IERC20(labsToken).balanceOf(address(this));
    if (balance < labsAmount) revert InsufficientLABS();
    
    // Transfer LABS to user
    bool success = IERC20(labsToken).transfer(msg.sender, labsAmount);
    if (!success) revert TransferFailed();
    
    emit Swapped(msg.sender, msg.value, labsAmount);
  }
  
  /// @notice Preview how many LABS tokens user would receive for given ETH
  /// @param ethAmount Amount of ETH to swap
  /// @return labsAmount Amount of LABS that would be received
  function previewSwap(uint256 ethAmount) external view returns (uint256 labsAmount) {
    labsAmount = (ethAmount * rate) / 1e18;
  }
  
  /// @notice Update exchange rate
  /// @dev Only admin can call. Rate is LABS per 1 ETH (18 decimals)
  /// @param newRate New exchange rate
  function setRate(uint256 newRate) external onlyAdmin {
    if (newRate == 0) revert InvalidRate();
    uint256 oldRate = rate;
    rate = newRate;
    emit RateUpdated(oldRate, newRate);
  }
  
  /// @notice Update admin address
  /// @dev Only current admin can call
  /// @param newAdmin New admin address
  function setAdmin(address newAdmin) external onlyAdmin {
    require(newAdmin != address(0), "zero address");
    address oldAdmin = admin;
    admin = newAdmin;
    emit AdminUpdated(oldAdmin, newAdmin);
  }
  
  /// @notice Pause swaps
  /// @dev Only admin can call
  function pause() external onlyAdmin {
    paused = true;
    emit Paused(msg.sender);
  }
  
  /// @notice Unpause swaps
  /// @dev Only admin can call
  function unpause() external onlyAdmin {
    paused = false;
    emit Unpaused(msg.sender);
  }
  
  /// @notice Withdraw ETH from contract
  /// @dev Only admin can call. Used to collect ETH from swaps
  /// @param to Address to send ETH to
  function withdrawETH(address payable to) external onlyAdmin {
    require(to != address(0), "zero address");
    uint256 amount = address(this).balance;
    (bool success, ) = to.call{value: amount}("");
    if (!success) revert TransferFailed();
    emit ETHWithdrawn(to, amount);
  }
  
  /// @notice Check available LABS in contract
  /// @return Available LABS balance
  function availableLABS() external view returns (uint256) {
    return IERC20(labsToken).balanceOf(address(this));
  }
  
  /// @notice Check ETH balance in contract
  /// @return ETH balance
  function ethBalance() external view returns (uint256) {
    return address(this).balance;
  }
  
  /// @notice Receive ETH (for refills)
  receive() external payable {}
}

