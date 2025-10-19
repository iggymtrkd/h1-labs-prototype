// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ERC20Base
/// @notice Gas-optimized ERC20 base implementation with assembly optimizations
/// @dev Uses assembly for critical path operations to minimize gas costs
abstract contract ERC20Base {
  string private _name;
  string private _symbol;
  uint8 private _decimals;
  uint256 private _totalSupply;

  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  constructor(string memory name_, string memory symbol_, uint8 decimals_) {
    _name = name_;
    _symbol = symbol_;
    _decimals = decimals_;
  }

  function name() public view returns (string memory) { return _name; }
  function symbol() public view returns (string memory) { return _symbol; }
  function decimals() public view returns (uint8) { return _decimals; }
  function totalSupply() public view returns (uint256) { return _totalSupply; }
  function balanceOf(address account) public view returns (uint256) { return _balances[account]; }
  function allowance(address owner, address spender) public view returns (uint256) { return _allowances[owner][spender]; }

  function transfer(address to, uint256 amount) public returns (bool) {
    _transfer(msg.sender, to, amount);
    return true;
  }

  function approve(address spender, uint256 amount) public returns (bool) {
    _approve(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address from, address to, uint256 amount) public returns (bool) {
    uint256 currentAllowance = _allowances[from][msg.sender];
    require(currentAllowance >= amount, "ERC20: insufficient allowance");
    unchecked { _approve(from, msg.sender, currentAllowance - amount); }
    _transfer(from, to, amount);
    return true;
  }

  /// @notice Internal transfer function with assembly optimization
  /// @dev Uses assembly for gas-efficient balance updates
  /// @param from Address to transfer from
  /// @param to Address to transfer to
  /// @param amount Amount to transfer
  function _transfer(address from, address to, uint256 amount) internal {
    require(from != address(0) && to != address(0), "ERC20: zero address");
    
    // Assembly optimized balance operations
    assembly {
      // Load balance storage slot for 'from'
      mstore(0x00, from)
      mstore(0x20, _balances.slot)
      let fromBalanceSlot := keccak256(0x00, 0x40)
      let fromBalance := sload(fromBalanceSlot)
      
      // Check sufficient balance
      if lt(fromBalance, amount) {
        mstore(0x00, 0x08c379a000000000000000000000000000000000000000000000000000000000) // Error selector
        mstore(0x04, 0x20)
        mstore(0x24, 27)
        mstore(0x44, "ERC20: transfer exceeds balance")
        revert(0x00, 0x64)
      }
      
      // Update from balance
      sstore(fromBalanceSlot, sub(fromBalance, amount))
      
      // Load and update balance storage slot for 'to'
      mstore(0x00, to)
      let toBalanceSlot := keccak256(0x00, 0x40)
      let toBalance := sload(toBalanceSlot)
      sstore(toBalanceSlot, add(toBalance, amount))
    }
    
    emit Transfer(from, to, amount);
  }

  function _approve(address owner, address spender, uint256 amount) internal {
    require(owner != address(0) && spender != address(0), "ERC20: zero address");
    _allowances[owner][spender] = amount;
    emit Approval(owner, spender, amount);
  }

  function _mint(address to, uint256 amount) internal {
    require(to != address(0), "ERC20: mint to zero");
    _totalSupply += amount;
    _balances[to] += amount;
    emit Transfer(address(0), to, amount);
  }

  function _burn(address from, uint256 amount) internal {
    uint256 fromBal = _balances[from];
    require(fromBal >= amount, "ERC20: burn exceeds balance");
    unchecked { _balances[from] = fromBal - amount; }
    _totalSupply -= amount;
    emit Transfer(from, address(0), amount);
  }

  /// @notice Batch transfer tokens to multiple recipients (gas optimized)
  /// @dev Useful for airdrops and mass distributions
  /// @param recipients Array of recipient addresses
  /// @param amounts Array of amounts to transfer
  /// @return success True if all transfers succeeded
  function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) public returns (bool success) {
    uint256 length = recipients.length;
    require(length == amounts.length, "ERC20: length mismatch");
    
    for (uint256 i; i < length; ) {
      _transfer(msg.sender, recipients[i], amounts[i]);
      unchecked { ++i; }
    }
    
    return true;
  }
}


