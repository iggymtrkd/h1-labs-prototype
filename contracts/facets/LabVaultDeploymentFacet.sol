// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LibBondingCurveFactory } from "../libraries/LibBondingCurveFactory.sol";
import { LibH1Distribution } from "../libraries/LibH1Distribution.sol";

contract LabVaultDeploymentFacet {
    event LabVaultDeployed(uint256 indexed labId, address indexed owner, address vault, string name, string symbol, string domain);
    event LabDistributionComplete(uint256 indexed labId, address indexed curve);
    error InvalidInput();
    error InsufficientStake();
    error FactoryNotSet();
    error VaultDeploymentFailed(string reason);
    error InvalidVaultAddress();

    function setVaultFactory(address factory) external {
        require(factory != address(0), "Invalid factory");
        LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
        hs.vaultFactory = factory;
    }

    /// @notice Create a complete lab in ONE transaction (both Step 1 & 2)
    /// @param name Lab name
    /// @param symbol H1 token symbol
    /// @param domain Lab domain
    function createLab(
        string calldata name,
        string calldata symbol,
        string calldata domain
    ) external returns (uint256 labId, address vault, address curve) {
        // --- Input validation ---
        if (bytes(name).length == 0 || bytes(name).length > 50) revert InvalidInput();
        if (bytes(symbol).length == 0 || bytes(symbol).length > 10) revert InvalidInput();
        if (bytes(domain).length == 0 || bytes(domain).length > 100) revert InvalidInput();

        LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();

        if (hs.stakedBalances[msg.sender] < 100_000e18) revert InsufficientStake();
        if (hs.vaultFactory == address(0)) revert FactoryNotSet();

        // STEP 1: Create lab entry
        labId = hs.nextLabId++;
        hs.labs[labId].owner = msg.sender;
        hs.labs[labId].domain = domain;
        hs.labs[labId].active = true;
        hs.labs[labId].level = _calcLevel(hs.stakedBalances[msg.sender]);

        // Deploy vault
        vault = _deployVault(hs.vaultFactory, name, symbol, domain, hs);
        if (vault == address(0)) revert InvalidVaultAddress();

        hs.labIdToVault[labId] = vault;
        hs.labs[labId].h1Token = vault;

        emit LabVaultDeployed(labId, msg.sender, vault, name, symbol, domain);

        // STEP 2: Deploy curve and distribute H1
        curve = LibBondingCurveFactory.deployBondingCurve(
            hs.labsToken,
            vault,
            hs.protocolTreasury,
            hs.curveFeeBps,
            hs.curvePolBps
        );
        hs.labIdToCurve[labId] = curve;

        // Distribute H1 tokens
        LibH1Distribution.distribute(labId, vault, curve, hs.stakedBalances[msg.sender], msg.sender);

        emit LabDistributionComplete(labId, curve);
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

    function _deployVault(address factory, string calldata name, string calldata symbol, string calldata domain, LibH1Storage.H1Storage storage hs)
        private
        returns (address)
    {
        // Step 1: Create vault with metadata only
        (bool ok1, bytes memory data1) = factory.call(
            abi.encodeWithSignature(
                "createVault(string,string,string)",
                name,
                symbol,
                domain
            )
        );
        
        if (!ok1) {
            if (data1.length > 0) {
                assembly {
                    let returndata_size := mload(data1)
                    revert(add(32, data1), returndata_size)
                }
            }
            revert VaultDeploymentFailed("Factory createVault call failed");
        }
        
        address vault = abi.decode(data1, (address));
        
        // Step 2: Finalize vault with configuration
        (bool ok2, bytes memory data2) = factory.call(
            abi.encodeWithSignature(
                "finalizeVault(address,address,uint64,uint16,address,address,address,address)",
                vault,
                hs.labsToken,
                hs.defaultCooldown,
                hs.defaultExitCapBps,
                msg.sender,
                msg.sender,
                hs.protocolTreasury,
                address(this)
            )
        );
        
        if (!ok2) {
            if (data2.length > 0) {
                assembly {
                    let returndata_size := mload(data2)
                    revert(add(32, data2), returndata_size)
                }
            }
            revert VaultDeploymentFailed("Factory finalizeVault call failed");
        }
        
        return vault;
    }
}
