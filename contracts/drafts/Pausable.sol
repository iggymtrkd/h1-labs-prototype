// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Pausable
/// @notice Emergency pause functionality for critical operations
/// @dev Allows pausing of contract functions in case of security incidents
abstract contract Pausable {
  bool private _paused;
  address public pauser;
  address public admin;

  event Paused(address indexed account);
  event Unpaused(address indexed account);
  event PauserUpdated(address indexed newPauser);
  event AdminUpdated(address indexed newAdmin);

  error ContractPaused();
  error ContractNotPaused();
  error Unauthorized();
  error InvalidAddress();

  constructor() {
    _paused = false;
    admin = msg.sender;
    pauser = msg.sender;
  }

  /// @notice Returns current pause status
  /// @return True if paused, false otherwise
  function paused() public view returns (bool) {
    return _paused;
  }

  /// @notice Modifier to make a function callable only when not paused
  modifier whenNotPaused() {
    if (_paused) revert ContractPaused();
    _;
  }

  /// @notice Modifier to make a function callable only when paused
  modifier whenPaused() {
    if (!_paused) revert ContractNotPaused();
    _;
  }

  /// @notice Modifier for pauser-only functions
  modifier onlyPauser() {
    if (msg.sender != pauser && msg.sender != admin) revert Unauthorized();
    _;
  }

  /// @notice Modifier for admin-only functions
  modifier onlyAdmin() {
    if (msg.sender != admin) revert Unauthorized();
    _;
  }

  /// @notice Emergency pause of contract functions
  /// @dev Can be called by pauser or admin
  function pause() external onlyPauser whenNotPaused {
    _paused = true;
    emit Paused(msg.sender);
  }

  /// @notice Unpause contract functions
  /// @dev Can only be called by admin (not pauser) to prevent accidental unpause
  function unpause() external onlyAdmin whenPaused {
    _paused = false;
    emit Unpaused(msg.sender);
  }

  /// @notice Updates the pauser address
  /// @param newPauser Address of new pauser
  function setPauser(address newPauser) external onlyAdmin {
    if (newPauser == address(0)) revert InvalidAddress();
    pauser = newPauser;
    emit PauserUpdated(newPauser);
  }

  /// @notice Updates the admin address
  /// @param newAdmin Address of new admin
  function setAdmin(address newAdmin) external onlyAdmin {
    if (newAdmin == address(0)) revert InvalidAddress();
    admin = newAdmin;
    emit AdminUpdated(newAdmin);
  }
}

