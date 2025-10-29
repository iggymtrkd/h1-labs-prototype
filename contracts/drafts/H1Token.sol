// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { ERC20Base } from "../tokens/ERC20Base.sol";

interface IH1TokenRevenue {
  function transferRevenue(uint256 amount) external returns (bool);
}

contract H1Token is ERC20Base, IH1TokenRevenue {
  address private _owner;

  event RevenueTransferred(uint256 amount);

  modifier onlyOwner() {
    require(msg.sender == _owner, "Ownable: caller is not the owner");
    _;
  }

  constructor(string memory name_, string memory symbol_, address owner_) ERC20Base(name_, symbol_, 18) {
    _owner = owner_;
  }

  function owner() external view returns (address) { return _owner; }

  function transferOwnership(address newOwner) external onlyOwner { _owner = newOwner; }

  function mint(address to, uint256 amount) external onlyOwner { _mint(to, amount); }

  function transferRevenue(uint256 amount) external override returns (bool) {
    emit RevenueTransferred(amount);
    return true;
  }
}


