// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20Base } from "./ERC20Base.sol";

contract LABSToken is ERC20Base {
  address private _owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  modifier onlyOwner() {
    require(msg.sender == _owner, "Ownable: caller is not the owner");
    _;
  }

  constructor(address initialOwner) ERC20Base("LABS", "LABS", 18) {
    _owner = initialOwner;
  }

  function owner() external view returns (address) { return _owner; }

  function transferOwnership(address newOwner) external onlyOwner { 
    require(newOwner != address(0), "Ownable: new owner is the zero address");
    address prev = _owner;
    _owner = newOwner; 
    emit OwnershipTransferred(prev, newOwner);
  }

  function mint(address to, uint256 amount) external onlyOwner { _mint(to, amount); }
}


