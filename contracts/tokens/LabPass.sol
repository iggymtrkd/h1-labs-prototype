// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC165 { function supportsInterface(bytes4 interfaceId) external view returns (bool); }

interface IERC721 is IERC165 {
  event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
  event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
  event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
  function balanceOf(address owner) external view returns (uint256);
  function ownerOf(uint256 tokenId) external view returns (address);
  function safeTransferFrom(address from, address to, uint256 tokenId) external;
  function transferFrom(address from, address to, uint256 tokenId) external;
  function approve(address to, uint256 tokenId) external;
  function getApproved(uint256 tokenId) external view returns (address);
  function setApprovalForAll(address operator, bool approved) external;
  function isApprovedForAll(address owner, address operator) external view returns (bool);
  function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
}

contract LabPass is IERC721 {
  string public name = "LabPass";
  string public symbol = "LBP";
  bool public transferable;

  struct PassData { uint8 level; uint8 appSlots; }

  mapping(uint256 => address) private _ownerOf;
  mapping(address => uint256) private _balanceOf;
  mapping(uint256 => address) private _approvals;
  mapping(address => mapping(address => bool)) private _operatorApproval;
  mapping(uint256 => PassData) public passData;

  event TransferabilitySet(bool transferable);

  function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
    return interfaceId == 0x80ac58cd || interfaceId == 0x01ffc9a7;
  }

  function balanceOf(address owner) external view override returns (uint256) { return _balanceOf[owner]; }
  function ownerOf(uint256 tokenId) public view override returns (address) { return _ownerOf[tokenId]; }
  function getApproved(uint256 tokenId) external view override returns (address) { return _approvals[tokenId]; }
  function isApprovedForAll(address owner, address operator) external view override returns (bool) { return _operatorApproval[owner][operator]; }

  function setTransferable(bool t) external { transferable = t; emit TransferabilitySet(t); }

  function mint(address to, uint256 tokenId, uint8 level, uint8 slots) external {
    require(_ownerOf[tokenId] == address(0), "exists");
    _ownerOf[tokenId] = to;
    _balanceOf[to] += 1;
    passData[tokenId] = PassData({ level: level, appSlots: slots });
    emit Transfer(address(0), to, tokenId);
  }

  function setLevel(uint256 tokenId, uint8 level, uint8 slots) external { passData[tokenId].level = level; passData[tokenId].appSlots = slots; }
  function approve(address to, uint256 tokenId) external override { _approvals[tokenId] = to; emit Approval(ownerOf(tokenId), to, tokenId); }
  function setApprovalForAll(address operator, bool approved) external override { _operatorApproval[msg.sender][operator] = approved; emit ApprovalForAll(msg.sender, operator, approved); }

  function transferFrom(address from, address to, uint256 tokenId) public override {
    require(transferable, "soulbound");
    require(ownerOf(tokenId) == from, "not owner");
    _ownerOf[tokenId] = to;
    _balanceOf[from] -= 1;
    _balanceOf[to] += 1;
    emit Transfer(from, to, tokenId);
  }

  function safeTransferFrom(address from, address to, uint256 tokenId) external override { transferFrom(from, to, tokenId); }
  function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata) external override { transferFrom(from, to, tokenId); }
}


