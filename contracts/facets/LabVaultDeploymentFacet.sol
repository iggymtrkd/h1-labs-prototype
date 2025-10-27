// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";

contract LabVaultDeploymentFacet {
    event LabVaultDeployed(uint256 indexed labId, address indexed owner, address vault, string name, string symbol, string domain);
    error InvalidInput();
    error InsufficientStake();
    error FactoryNotSet();
    error VaultDeploymentFailed(string reason);
    error InvalidVaultAddress();
    
    bool private _locked;

    struct VaultArgs {
        address labsToken;
        string name;
        string symbol;
        string domain;
        uint64 cooldown;
        uint16 exitCapBps;
        address owner;
        address manager;
        address treasury;
        address caller;
    }

    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    function createLabStep1(
        string calldata name,
        string calldata symbol,
        string calldata domain
    ) external nonReentrant returns (uint256 labId, address vault) {
        // --- Input validation ---
        if (bytes(name).length == 0 || bytes(name).length > 50) revert InvalidInput();
        if (bytes(symbol).length == 0 || bytes(symbol).length > 10) revert InvalidInput();
        if (bytes(domain).length == 0 || bytes(domain).length > 100) revert InvalidInput();

        LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();

        if (hs.stakedBalances[msg.sender] < 100_000e18) revert InsufficientStake();
        if (hs.vaultFactory == address(0)) revert FactoryNotSet();

        labId = hs.nextLabId++;
        hs.labs[labId].owner = msg.sender;
        hs.labs[labId].domain = domain;
        hs.labs[labId].active = true;
        hs.labs[labId].level = _calcLevel(hs.stakedBalances[msg.sender]);

        // --- Prepare args struct ---
        VaultArgs memory args = VaultArgs({
            labsToken: hs.labsToken,
            name: name,
            symbol: symbol,
            domain: domain, // FIXED: Use actual domain parameter
            cooldown: hs.defaultCooldown,
            exitCapBps: hs.defaultExitCapBps,
            owner: msg.sender,
            manager: msg.sender,
            treasury: hs.protocolTreasury,
            caller: address(this)
        });

        vault = _deployVault(hs.vaultFactory, args);
        
        if (vault == address(0)) revert InvalidVaultAddress();

        hs.labIdToVault[labId] = vault;
        hs.labs[labId].h1Token = vault;

        emit LabVaultDeployed(labId, msg.sender, vault, name, symbol, domain);
    }
    
    /// @notice Get lab details (domain)
    function getLabDetails(uint256 labId) external view returns (address owner, address h1Token, string memory domain, bool active, uint8 level) {
        LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
        LibH1Storage.Lab storage lab = hs.labs[labId];
        return (lab.owner, lab.h1Token, lab.domain, lab.active, lab.level);
    }

    function _calcLevel(uint256 bal) private pure returns (uint8) {
        return bal >= 500_000e18 ? 3 : (bal >= 250_000e18 ? 2 : 1);
    }

    function _deployVault(address factory, VaultArgs memory args)
        private
        returns (address)
    {
        // Use signature string for clarity and safety
        (bool ok, bytes memory data) = factory.call(
            abi.encodeWithSignature(
                "deployVault(address,string,string,string,uint64,uint16,address,address,address,address)",
                args.labsToken,
                args.name,
                args.symbol,
                args.domain,
                args.cooldown,
                args.exitCapBps,
                args.owner,
                args.manager,
                args.treasury,
                args.caller
            )
        );
        
        if (!ok) {
            // Bubble up revert reason if available
            if (data.length > 0) {
                assembly {
                    let returndata_size := mload(data)
                    revert(add(32, data), returndata_size)
                }
            }
            revert VaultDeploymentFailed("Factory call failed");
        }
        
        return abi.decode(data, (address));
    }
}
