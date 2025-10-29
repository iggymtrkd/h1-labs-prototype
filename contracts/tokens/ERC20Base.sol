// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ERC20Base
/// @notice Gas-optimized ERC20 base implementation
/// @dev Simplified for Remix compilation compatibility
abstract contract ERC20Base {
  string internal _name;
  string internal _symbol;
  uint8 internal _decimals;
  uint256 internal _totalSupply;

  mapping(address => uint256) internal _balances;
  mapping(address => mapping(address => uint256)) internal _allowances;

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

  /// @notice Internal transfer function
  /// @dev Simplified for stack depth compatibility
  /// @param from Address to transfer from
  /// @param to Address to transfer to
  /// @param amount Amount to transfer
  function _transfer(address from, address to, uint256 amount) internal {
    require(from != address(0) && to != address(0), "ERC20: zero address");
    require(_balances[from] >= amount, "ERC20: transfer exceeds balance");
    
    unchecked {
      _balances[from] -= amount;
      _balances[to] += amount;
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

  /// @notice Batch transfer tokens to multiple recipients
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


