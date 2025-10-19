// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { H1Token } from "./tokens/H1Token.sol";

contract H1TokenFactory {
  event H1TokenCreated(address indexed token, string name, string symbol, address indexed owner);

  error InvalidAddress();
  error InvalidString();

  function createH1Token(string calldata name_, string calldata symbol_, address owner_) external returns (address token) {
    if (owner_ == address(0)) revert InvalidAddress();
    if (bytes(name_).length == 0 || bytes(name_).length > 50) revert InvalidString();
    if (bytes(symbol_).length == 0 || bytes(symbol_).length > 10) revert InvalidString();
    
    H1Token h1 = new H1Token(name_, symbol_, owner_);
    token = address(h1);
    emit H1TokenCreated(token, name_, symbol_, owner_);
  }
}



