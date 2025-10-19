// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC165 { function supportsInterface(bytes4 interfaceId) external view returns (bool); }

interface IERC721Receiver {
  function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
}

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
  address public minter;
  address public admin;

  struct PassData { uint8 level; uint8 appSlots; }

  mapping(uint256 => address) private _ownerOf;
  mapping(address => uint256) private _balanceOf;
  mapping(uint256 => address) private _approvals;
  mapping(address => mapping(address => bool)) private _operatorApproval;
  mapping(uint256 => PassData) public passData;

  event TransferabilitySet(bool transferable);
  event MinterUpdated(address indexed newMinter);
  event AdminUpdated(address indexed newAdmin);

  error Unauthorized();
  error TokenNotFound();
  error InvalidAddress();
  error InvalidApproval();
  error TokenAlreadyExists();
  error UnsafeRecipient();

  constructor() {
    admin = msg.sender;
    minter = msg.sender;
  }

  modifier onlyMinter() {
    if (msg.sender != minter) revert Unauthorized();
    _;
  }

  modifier onlyAdmin() {
    if (msg.sender != admin) revert Unauthorized();
    _;
  }

  function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
    return interfaceId == 0x80ac58cd || interfaceId == 0x01ffc9a7;
  }

  function balanceOf(address owner) external view override returns (uint256) { 
    if (owner == address(0)) revert InvalidAddress();
    return _balanceOf[owner]; 
  }
  
  function ownerOf(uint256 tokenId) public view override returns (address) { 
    address owner = _ownerOf[tokenId];
    if (owner == address(0)) revert TokenNotFound();
    return owner; 
  }
  
  function getApproved(uint256 tokenId) external view override returns (address) { 
    if (_ownerOf[tokenId] == address(0)) revert TokenNotFound();
    return _approvals[tokenId]; 
  }
  
  function isApprovedForAll(address owner, address operator) external view override returns (bool) { 
    return _operatorApproval[owner][operator]; 
  }

  function setMinter(address newMinter) external onlyAdmin {
    if (newMinter == address(0)) revert InvalidAddress();
    minter = newMinter;
    emit MinterUpdated(newMinter);
  }

  function setAdmin(address newAdmin) external onlyAdmin {
    if (newAdmin == address(0)) revert InvalidAddress();
    admin = newAdmin;
    emit AdminUpdated(newAdmin);
  }

  function setTransferable(bool t) external onlyAdmin { 
    transferable = t; 
    emit TransferabilitySet(t); 
  }

  function mint(address to, uint256 tokenId, uint8 level, uint8 slots) external onlyMinter {
    if (to == address(0)) revert InvalidAddress();
    if (_ownerOf[tokenId] != address(0)) revert TokenAlreadyExists();
    if (level > 10) revert InvalidApproval(); // Max level 10
    if (slots > 10) revert InvalidApproval(); // Max slots 10
    
    _ownerOf[tokenId] = to;
    _balanceOf[to] += 1;
    passData[tokenId] = PassData({ level: level, appSlots: slots });
    emit Transfer(address(0), to, tokenId);
  }

  function setLevel(uint256 tokenId, uint8 level, uint8 slots) external onlyAdmin { 
    if (_ownerOf[tokenId] == address(0)) revert TokenNotFound();
    if (level > 10) revert InvalidApproval();
    if (slots > 10) revert InvalidApproval();
    passData[tokenId].level = level; 
    passData[tokenId].appSlots = slots; 
  }

  function approve(address to, uint256 tokenId) external override { 
    address owner = ownerOf(tokenId);
    if (msg.sender != owner && !_operatorApproval[owner][msg.sender]) revert Unauthorized();
    _approvals[tokenId] = to; 
    emit Approval(owner, to, tokenId); 
  }

  function setApprovalForAll(address operator, bool approved) external override { 
    if (operator == address(0)) revert InvalidAddress();
    _operatorApproval[msg.sender][operator] = approved; 
    emit ApprovalForAll(msg.sender, operator, approved); 
  }

  function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
    address owner = ownerOf(tokenId);
    return (spender == owner || _approvals[tokenId] == spender || _operatorApproval[owner][spender]);
  }

  function transferFrom(address from, address to, uint256 tokenId) public override {
    if (!transferable) revert Unauthorized();
    if (!_isApprovedOrOwner(msg.sender, tokenId)) revert Unauthorized();
    if (ownerOf(tokenId) != from) revert Unauthorized();
    if (to == address(0)) revert InvalidAddress();
    
    delete _approvals[tokenId];
    _balanceOf[from] -= 1;
    _balanceOf[to] += 1;
    _ownerOf[tokenId] = to;
    emit Transfer(from, to, tokenId);
  }

  function safeTransferFrom(address from, address to, uint256 tokenId) external override { 
    transferFrom(from, to, tokenId); 
    _checkOnERC721Received(from, to, tokenId, "");
  }

  function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external override { 
    transferFrom(from, to, tokenId);
    _checkOnERC721Received(from, to, tokenId, data);
  }

  function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) private {
    if (to.code.length > 0) {
      try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
        if (retval != IERC721Receiver.onERC721Received.selector) revert UnsafeRecipient();
      } catch {
        revert UnsafeRecipient();
      }
    }
  }
}


