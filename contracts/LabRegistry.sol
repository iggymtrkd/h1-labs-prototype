// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LabRegistry {
  struct LabMeta {
    address owner;
    address h1Token;
    string domain;
    bool active;
  }

  mapping(uint256 => LabMeta) public labs;
  mapping(string => bool) public domainExists;
  uint256 public nextLabId;
  address public admin;

  event LabRegistered(uint256 indexed labId, address indexed owner, string domain, address h1Token);
  event AdminUpdated(address indexed newAdmin);
  event LabDeactivated(uint256 indexed labId);

  error Unauthorized();
  error InvalidAddress();
  error InvalidDomain();
  error DomainAlreadyExists();

  constructor() {
    admin = msg.sender;
  }

  modifier onlyAdmin() {
    if (msg.sender != admin) revert Unauthorized();
    _;
  }

  function setAdmin(address newAdmin) external onlyAdmin {
    if (newAdmin == address(0)) revert InvalidAddress();
    admin = newAdmin;
    emit AdminUpdated(newAdmin);
  }

  function registerLab(address owner, string calldata domain, address h1Token) external onlyAdmin returns (uint256 labId) {
    if (owner == address(0)) revert InvalidAddress();
    if (h1Token == address(0)) revert InvalidAddress();
    if (bytes(domain).length == 0 || bytes(domain).length > 100) revert InvalidDomain();
    if (domainExists[domain]) revert DomainAlreadyExists();
    
    labId = nextLabId++;
    labs[labId] = LabMeta({ owner: owner, h1Token: h1Token, domain: domain, active: true });
    domainExists[domain] = true;
    emit LabRegistered(labId, owner, domain, h1Token);
  }

  function deactivateLab(uint256 labId) external onlyAdmin {
    labs[labId].active = false;
    emit LabDeactivated(labId);
  }
}



