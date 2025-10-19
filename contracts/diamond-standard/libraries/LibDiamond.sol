// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import { IERC173 } from "../interfaces/IERC173.sol";

library LibDiamond {
  bytes32 internal constant DIAMOND_STORAGE_POSITION = keccak256("diamond.standard.diamond.storage");

  struct FacetAddressAndPosition {
    address facetAddress;
    uint96 selectorPosition;
  }

  struct FacetFunctionSelectors {
    bytes4[] functionSelectors;
    uint256 facetAddressPosition;
  }

  struct DiamondStorage {
    mapping(bytes4 => FacetAddressAndPosition) selectorToFacetAndPosition;
    mapping(address => FacetFunctionSelectors) facetFunctionSelectors;
    address[] facetAddresses;
    address contractOwner;
    mapping(address => bool) approvedInitializers; // Whitelist for delegatecall
  }

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  event InitializerApproved(address indexed initializer);
  event InitializerRevoked(address indexed initializer);

  error NotContractOwner(address sender, address owner);
  error InitZeroAddress();
  error InitCallFailed(bytes data);
  error InitializerNotApproved(address initializer);

  function diamondStorage() internal pure returns (DiamondStorage storage ds) {
    bytes32 position = DIAMOND_STORAGE_POSITION;
    assembly {
      ds.slot := position
    }
  }

  function setContractOwner(address _newOwner) internal {
    DiamondStorage storage ds = diamondStorage();
    address previousOwner = ds.contractOwner;
    ds.contractOwner = _newOwner;
    emit OwnershipTransferred(previousOwner, _newOwner);
  }

  function enforceIsContractOwner() internal view {
    DiamondStorage storage ds = diamondStorage();
    if (msg.sender != ds.contractOwner) {
      revert NotContractOwner(msg.sender, ds.contractOwner);
    }
  }

  function diamondCut(
    IDiamondCut.FacetCut[] memory _diamondCut,
    address _init,
    bytes memory _calldata
  ) internal {
    uint256 length = _diamondCut.length; // Cache array length for gas optimization
    for (uint256 facetIndex; facetIndex < length; ) {
      IDiamondCut.FacetCutAction action = _diamondCut[facetIndex].action;
      if (action == IDiamondCut.FacetCutAction.Add) {
        addFunctions(_diamondCut[facetIndex].facetAddress, _diamondCut[facetIndex].functionSelectors);
      } else if (action == IDiamondCut.FacetCutAction.Replace) {
        replaceFunctions(_diamondCut[facetIndex].facetAddress, _diamondCut[facetIndex].functionSelectors);
      } else if (action == IDiamondCut.FacetCutAction.Remove) {
        removeFunctions(_diamondCut[facetIndex].facetAddress, _diamondCut[facetIndex].functionSelectors);
      }
      unchecked { ++facetIndex; } // Safe: facetIndex < length
    }
    emit IDiamondCut.DiamondCut(_diamondCut, _init, _calldata);
    initializeDiamondCut(_init, _calldata);
  }

  function addFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
    uint256 length = _functionSelectors.length;
    require(length > 0, "LibDiamond: No selectors to add");
    DiamondStorage storage ds = diamondStorage();
    uint256 selectorPosition = ds.facetFunctionSelectors[_facetAddress].functionSelectors.length;
    if (selectorPosition == 0) {
      addFacet(ds, _facetAddress);
    }
    for (uint256 selectorIndex; selectorIndex < length; ) {
      bytes4 selector = _functionSelectors[selectorIndex];
      address oldFacetAddress = ds.selectorToFacetAndPosition[selector].facetAddress;
      require(oldFacetAddress == address(0), "LibDiamond: Selector already exists");
      addFunction(ds, selector, selectorPosition, _facetAddress);
      unchecked { 
        ++selectorPosition;
        ++selectorIndex;
      } // Safe: bounded by array length
    }
  }

  function replaceFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
    uint256 length = _functionSelectors.length;
    require(length > 0, "LibDiamond: No selectors to replace");
    DiamondStorage storage ds = diamondStorage();
    uint256 selectorPosition = ds.facetFunctionSelectors[_facetAddress].functionSelectors.length;
    if (selectorPosition == 0) {
      addFacet(ds, _facetAddress);
    }
    for (uint256 selectorIndex; selectorIndex < length; ) {
      bytes4 selector = _functionSelectors[selectorIndex];
      address oldFacetAddress = ds.selectorToFacetAndPosition[selector].facetAddress;
      require(oldFacetAddress != _facetAddress, "LibDiamond: Replace facet is same");
      removeFunction(ds, oldFacetAddress, selector);
      addFunction(ds, selector, selectorPosition, _facetAddress);
      unchecked { 
        ++selectorPosition;
        ++selectorIndex;
      } // Safe: bounded by array length
    }
  }

  function removeFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
    require(_facetAddress == address(0), "LibDiamond: Remove facetAddress must be address(0)");
    uint256 length = _functionSelectors.length;
    require(length > 0, "LibDiamond: No selectors to remove");
    DiamondStorage storage ds = diamondStorage();
    for (uint256 selectorIndex; selectorIndex < length; ) {
      bytes4 selector = _functionSelectors[selectorIndex];
      address oldFacetAddress = ds.selectorToFacetAndPosition[selector].facetAddress;
      removeFunction(ds, oldFacetAddress, selector);
      unchecked { ++selectorIndex; } // Safe: bounded by array length
    }
  }

  function addFacet(DiamondStorage storage ds, address _facetAddress) internal {
    require(_facetAddress != address(0), "LibDiamond: Add facet address(0)");
    require(_facetAddress.code.length > 0, "LibDiamond: Add facet has no code");
    ds.facetFunctionSelectors[_facetAddress].facetAddressPosition = ds.facetAddresses.length;
    ds.facetAddresses.push(_facetAddress);
  }

  function addFunction(
    DiamondStorage storage ds,
    bytes4 _selector,
    uint256 _selectorPosition,
    address _facetAddress
  ) internal {
    ds.selectorToFacetAndPosition[_selector].facetAddress = _facetAddress;
    ds.selectorToFacetAndPosition[_selector].selectorPosition = uint96(_selectorPosition);
    ds.facetFunctionSelectors[_facetAddress].functionSelectors.push(_selector);
  }

  function removeFunction(
    DiamondStorage storage ds,
    address _facetAddress,
    bytes4 _selector
  ) internal {
    require(_facetAddress != address(0), "LibDiamond: Remove facet address(0)");
    require(_facetAddress != address(this), "LibDiamond: Can't remove immutable functions");

    uint256 selectorPosition = ds.selectorToFacetAndPosition[_selector].selectorPosition;
    uint256 lastSelectorPosition = ds.facetFunctionSelectors[_facetAddress].functionSelectors.length - 1;

    if (selectorPosition != lastSelectorPosition) {
      bytes4 lastSelector = ds.facetFunctionSelectors[_facetAddress].functionSelectors[lastSelectorPosition];
      ds.facetFunctionSelectors[_facetAddress].functionSelectors[selectorPosition] = lastSelector;
      ds.selectorToFacetAndPosition[lastSelector].selectorPosition = uint96(selectorPosition);
    }
    ds.facetFunctionSelectors[_facetAddress].functionSelectors.pop();
    delete ds.selectorToFacetAndPosition[_selector];

    if (ds.facetFunctionSelectors[_facetAddress].functionSelectors.length == 0) {
      uint256 lastFacetAddressPosition = ds.facetAddresses.length - 1;
      uint256 facetAddressPosition = ds.facetFunctionSelectors[_facetAddress].facetAddressPosition;
      if (facetAddressPosition != lastFacetAddressPosition) {
        address lastFacetAddress = ds.facetAddresses[lastFacetAddressPosition];
        ds.facetAddresses[facetAddressPosition] = lastFacetAddress;
        ds.facetFunctionSelectors[lastFacetAddress].facetAddressPosition = facetAddressPosition;
      }
      ds.facetAddresses.pop();
      delete ds.facetFunctionSelectors[_facetAddress].facetAddressPosition;
    }
  }

  /// @notice Approves an initializer contract for delegatecall
  /// @dev Only callable by contract owner
  /// @param initializer Address of initializer contract to approve
  function approveInitializer(address initializer) internal {
    DiamondStorage storage ds = diamondStorage();
    ds.approvedInitializers[initializer] = true;
    emit InitializerApproved(initializer);
  }

  /// @notice Revokes an initializer contract
  /// @dev Only callable by contract owner
  /// @param initializer Address of initializer contract to revoke
  function revokeInitializer(address initializer) internal {
    DiamondStorage storage ds = diamondStorage();
    ds.approvedInitializers[initializer] = false;
    emit InitializerRevoked(initializer);
  }

  /// @notice Checks if an initializer is approved
  /// @param initializer Address to check
  /// @return True if approved, false otherwise
  function isInitializerApproved(address initializer) internal view returns (bool) {
    DiamondStorage storage ds = diamondStorage();
    return ds.approvedInitializers[initializer];
  }

  function initializeDiamondCut(address _init, bytes memory _calldata) internal {
    if (_init == address(0)) {
      if (_calldata.length > 0) revert InitZeroAddress();
      return;
    }
    
    // Verify initializer is approved for security
    DiamondStorage storage ds = diamondStorage();
    if (!ds.approvedInitializers[_init]) {
      revert InitializerNotApproved(_init);
    }
    
    (bool success, bytes memory error) = _init.delegatecall(_calldata);
    if (!success) revert InitCallFailed(error);
  }
}



