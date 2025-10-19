// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Timelock
/// @notice Time-delayed execution for critical operations to prevent malicious changes
/// @dev Provides 48-hour delay for parameter changes with cancellation capability
contract Timelock {
  uint256 public constant MINIMUM_DELAY = 48 hours;
  uint256 public constant MAXIMUM_DELAY = 30 days;
  uint256 public constant GRACE_PERIOD = 14 days;

  address public admin;
  address public pendingAdmin;
  uint256 public delay;

  mapping(bytes32 => bool) public queuedTransactions;

  event NewAdmin(address indexed newAdmin);
  event NewPendingAdmin(address indexed newPendingAdmin);
  event NewDelay(uint256 indexed newDelay);
  event QueueTransaction(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta);
  event CancelTransaction(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta);
  event ExecuteTransaction(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta);

  error Unauthorized();
  error InvalidDelay();
  error TransactionNotQueued();
  error TransactionAlreadyQueued();
  error TimelockNotMet();
  error TransactionStale();
  error ExecutionReverted();

  constructor(address admin_, uint256 delay_) {
    if (delay_ < MINIMUM_DELAY || delay_ > MAXIMUM_DELAY) revert InvalidDelay();
    admin = admin_;
    delay = delay_;
  }

  modifier onlyAdmin() {
    if (msg.sender != admin) revert Unauthorized();
    _;
  }

  receive() external payable {}

  /// @notice Sets a new delay period
  /// @param delay_ New delay in seconds
  function setDelay(uint256 delay_) external onlyAdmin {
    if (delay_ < MINIMUM_DELAY || delay_ > MAXIMUM_DELAY) revert InvalidDelay();
    delay = delay_;
    emit NewDelay(delay_);
  }

  /// @notice Accepts admin transfer
  function acceptAdmin() external {
    if (msg.sender != pendingAdmin) revert Unauthorized();
    admin = msg.sender;
    pendingAdmin = address(0);
    emit NewAdmin(admin);
  }

  /// @notice Sets pending admin for transfer
  /// @param pendingAdmin_ Address of new admin
  function setPendingAdmin(address pendingAdmin_) external onlyAdmin {
    pendingAdmin = pendingAdmin_;
    emit NewPendingAdmin(pendingAdmin_);
  }

  /// @notice Queues a transaction for delayed execution
  /// @param target Target contract address
  /// @param value ETH value to send
  /// @param signature Function signature
  /// @param data Encoded function arguments
  /// @param eta Estimated time of execution (must be > block.timestamp + delay)
  /// @return txHash Hash of the queued transaction
  function queueTransaction(
    address target,
    uint256 value,
    string memory signature,
    bytes memory data,
    uint256 eta
  ) external onlyAdmin returns (bytes32 txHash) {
    if (eta < block.timestamp + delay) revert TimelockNotMet();

    txHash = keccak256(abi.encode(target, value, signature, data, eta));
    if (queuedTransactions[txHash]) revert TransactionAlreadyQueued();

    queuedTransactions[txHash] = true;
    emit QueueTransaction(txHash, target, value, signature, data, eta);
  }

  /// @notice Cancels a queued transaction
  /// @param target Target contract address
  /// @param value ETH value
  /// @param signature Function signature
  /// @param data Encoded function arguments
  /// @param eta Estimated time of execution
  function cancelTransaction(
    address target,
    uint256 value,
    string memory signature,
    bytes memory data,
    uint256 eta
  ) external onlyAdmin {
    bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
    if (!queuedTransactions[txHash]) revert TransactionNotQueued();

    queuedTransactions[txHash] = false;
    emit CancelTransaction(txHash, target, value, signature, data, eta);
  }

  /// @notice Executes a queued transaction after timelock period
  /// @param target Target contract address
  /// @param value ETH value
  /// @param signature Function signature
  /// @param data Encoded function arguments
  /// @param eta Estimated time of execution
  /// @return returnData Return data from executed call
  function executeTransaction(
    address target,
    uint256 value,
    string memory signature,
    bytes memory data,
    uint256 eta
  ) external onlyAdmin returns (bytes memory returnData) {
    bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
    if (!queuedTransactions[txHash]) revert TransactionNotQueued();
    if (block.timestamp < eta) revert TimelockNotMet();
    if (block.timestamp > eta + GRACE_PERIOD) revert TransactionStale();

    queuedTransactions[txHash] = false;

    bytes memory callData;
    if (bytes(signature).length == 0) {
      callData = data;
    } else {
      callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
    }

    (bool success, bytes memory result) = target.call{value: value}(callData);
    if (!success) revert ExecutionReverted();

    emit ExecuteTransaction(txHash, target, value, signature, data, eta);
    return result;
  }
}

