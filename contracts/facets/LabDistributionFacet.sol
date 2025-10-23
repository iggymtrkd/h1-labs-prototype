// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LibBondingCurveFactory } from "../libraries/LibBondingCurveFactory.sol";
import { LibH1Distribution } from "../libraries/LibH1Distribution.sol";

/// @title LabDistributionFacet
/// @notice Deploys bonding curve and distributes H1 tokens (Step 2 of lab creation)
/// @dev Handles curve deployment and H1 token distribution (~11KB)
contract LabDistributionFacet {
  event LabDistributionComplete(uint256 indexed labId, address indexed curve);
  
  /// @notice Deploy curve and distribute H1 (Step 2 of 2)
  /// @param labId The lab ID from step 1
  function createLabStep2(uint256 labId) external {
    LibH1Storage.H1Storage storage hs = LibH1Storage.h1Storage();
    
    // Get vault from step 1
    address vault = hs.labIdToVault[labId];
    require(vault != address(0), "Step 1 not complete");
    
    // Deploy bonding curve
    address curve = LibBondingCurveFactory.deployBondingCurve(
      hs.labsToken,
      vault,
      hs.protocolTreasury,
      hs.curveFeeBps,
      hs.curvePolBps
    );
    
    hs.labIdToCurve[labId] = curve;
    
    // Distribute H1
    LibH1Distribution.distribute(
      labId,
      vault,
      curve,
      hs.stakedBalances[msg.sender],
      msg.sender
    );
    
    emit LabDistributionComplete(labId, curve);
  }
}

