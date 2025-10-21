// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LibLabRegistry
 * @dev Library for managing H1 token ownership registry across all labs
 * 
 * This library provides a centralized way to track which H1 tokens (labs)
 * each user holds, enabling wallets and dashboards to auto-discover and
 * display a user's H1 positions across all labs without scanning events.
 */
library LibLabRegistry {
  // Storage slot for registry data
  bytes32 private constant REGISTRY_SLOT = 
    keccak256("h1labs.storage.registry");

  struct RegistryStorage {
    /// @dev Maps user address => array of lab vault addresses they hold H1 in
    mapping(address user => address[] labVaults) userLabPositions;
    /// @dev Maps (user, labVault) => true if user has position (for quick lookup)
    mapping(address user => mapping(address lab => bool hasPosition)) userLabPosition;
    /// @dev Tracks total unique labs a user holds
    mapping(address user => uint256 count) userLabCount;
  }

  /**
   * @dev Get the registry storage struct
   */
  function registryStorage() internal pure returns (RegistryStorage storage rs) {
    bytes32 slot = REGISTRY_SLOT;
    assembly {
      rs.slot := slot
    }
  }

  /**
   * @notice Record that a user now holds H1 in a specific lab
   * @param user The user address
   * @param labVault The lab vault (H1 token) address
   */
  function recordH1Position(address user, address labVault) internal {
    RegistryStorage storage rs = registryStorage();
    
    // Only record if user doesn't already have a position in this lab
    if (!rs.userLabPosition[user][labVault]) {
      rs.userLabPositions[user].push(labVault);
      rs.userLabPosition[user][labVault] = true;
      rs.userLabCount[user]++;
    }
  }

  /**
   * @notice Get all labs where a user holds H1 tokens
   * @param user The user address
   * @return Array of lab vault addresses where user holds H1
   */
  function getUserLabPositions(address user) internal view returns (address[] memory) {
    RegistryStorage storage rs = registryStorage();
    return rs.userLabPositions[user];
  }

  /**
   * @notice Check if user holds H1 in a specific lab
   * @param user The user address
   * @param labVault The lab vault address
   * @return True if user holds H1 in that lab
   */
  function hasUserPositionInLab(address user, address labVault) internal view returns (bool) {
    RegistryStorage storage rs = registryStorage();
    return rs.userLabPosition[user][labVault];
  }

  /**
   * @notice Get total number of unique labs where user holds H1
   * @param user The user address
   * @return Number of labs with user's H1 positions
   */
  function getUserLabCount(address user) internal view returns (uint256) {
    RegistryStorage storage rs = registryStorage();
    return rs.userLabCount[user];
  }

  /**
   * @notice Get a specific lab position by index
   * @param user The user address
   * @param index The index in the user's lab array
   * @return The lab vault address at that index
   */
  function getUserLabByIndex(address user, uint256 index) internal view returns (address) {
    RegistryStorage storage rs = registryStorage();
    require(index < rs.userLabPositions[user].length, "Index out of bounds");
    return rs.userLabPositions[user][index];
  }
}

/**
 * INTEGRATION GUIDE:
 * 
 * 1. In H1Diamond or LABSCoreFacet, add this import:
 *    import { LibLabRegistry } from "../libraries/LibLabRegistry.sol";
 * 
 * 2. Call LibLabRegistry.recordH1Position() in LabVault.depositLABS():
 *    
 *    function depositLABS(uint256 assets, address receiver) 
 *      external nonReentrant whenNotPaused returns (uint256 shares) 
 *    {
 *      // ... existing deposit logic ...
 *      
 *      // Record user's position in this lab
 *      LibLabRegistry.recordH1Position(receiver, address(this));
 *      
 *      return shares;
 *    }
 * 
 * 3. Create a public facet to expose the registry:
 *    
 *    contract LabRegistryFacet {
 *      function getUserLabPositions(address user) 
 *        external view returns (address[] memory) 
 *      {
 *        return LibLabRegistry.getUserLabPositions(user);
 *      }
 *      
 *      function getUserLabCount(address user) 
 *        external view returns (uint256) 
 *      {
 *        return LibLabRegistry.getUserLabCount(user);
 *      }
 *      
 *      function hasUserPositionInLab(address user, address labVault) 
 *        external view returns (bool) 
 *      {
 *        return LibLabRegistry.hasUserPositionInLab(user, labVault);
 *      }
 *    }
 * 
 * 4. Frontend usage:
 *    
 *    // Auto-discover user's H1 holdings
 *    const userLabAddresses = await h1Diamond.getUserLabPositions(userAddress);
 *    
 *    // For each lab, get metadata
 *    for (const labVault of userLabAddresses) {
 *      const labVaultInstance = new ethers.Contract(labVault, H1_ABI);
 *      const balance = await labVaultInstance.balanceOf(userAddress);
 *      const name = await labVaultInstance.name();
 *      // Display in portfolio
 *    }
 */

