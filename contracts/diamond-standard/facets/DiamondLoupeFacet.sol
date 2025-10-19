// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IDiamondLoupe } from "../interfaces/IDiamondLoupe.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

contract DiamondLoupeFacet is IDiamondLoupe {
  function facets() external view override returns (Facet[] memory facets_) {
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    address[] memory addresses = ds.facetAddresses;
    facets_ = new Facet[](addresses.length);
    for (uint256 i = 0; i < addresses.length; i++) {
      address facetAddress = addresses[i];
      bytes4[] memory selectors = ds.facetFunctionSelectors[facetAddress].functionSelectors;
      facets_[i] = Facet({ facetAddress: facetAddress, functionSelectors: selectors });
    }
  }

  function facetFunctionSelectors(address _facet) external view override returns (bytes4[] memory facetFunctionSelectors_) {
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    facetFunctionSelectors_ = ds.facetFunctionSelectors[_facet].functionSelectors;
  }

  function facetAddresses() external view override returns (address[] memory facetAddresses_) {
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    facetAddresses_ = ds.facetAddresses;
  }

  function facetAddress(bytes4 _functionSelector) external view override returns (address facetAddress_) {
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    facetAddress_ = ds.selectorToFacetAndPosition[_functionSelector].facetAddress;
  }

  function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
    return interfaceId == type(IDiamondLoupe).interfaceId || interfaceId == 0x01ffc9a7; // IERC165
  }
}



