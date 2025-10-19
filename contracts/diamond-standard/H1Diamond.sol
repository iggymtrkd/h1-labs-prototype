// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
H1 Labs Diamond (EIP-2535)
************************************
     vooooooz                st
    vaVVVVVVp              tsst
    pVVVVVVau           stsshss
    hVVVVVVi          tssjhhis 
   saVVVVVVo        tssihhhhis 
   kVVVVVVaq      tsshhhhhhist 
   bVVVVVVj     tsjihhhhhhhhs  
  rXVVVVVUZ  stsgihhhhhhhhiit  
  jVVVVVVQZsttkkkkmoihhhhhis   
 lbVVVVVV7         sihhhhhit   
 nWVVVVVYe         sihhhhhss   
 iVVVVVVd          sihhhhht    
qbVVVVVVl         tsihhhhht    
nWVVVVVav         sihhhhhss    
zpooooov          tttttttt     
************************************
*/

import { LibDiamond } from "./libraries/LibDiamond.sol";
import { IDiamondCut } from "./interfaces/IDiamondCut.sol";

contract H1Diamond {
  error InvalidOwner();

  constructor(address _contractOwner, address _diamondCutFacet) {
    if (_contractOwner == address(0)) revert InvalidOwner();
    LibDiamond.setContractOwner(_contractOwner);

    // Bootstrap: add DiamondCutFacet.diamondCut selector so future cuts are possible
    bytes4[] memory selectors = new bytes4[](1);
    selectors[0] = IDiamondCut.diamondCut.selector;

    IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](1);
    cut[0] = IDiamondCut.FacetCut({
      facetAddress: _diamondCutFacet,
      action: IDiamondCut.FacetCutAction.Add,
      functionSelectors: selectors
    });

    LibDiamond.diamondCut(cut, address(0), "");
  }

  fallback() external payable {
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    address facet = ds.selectorToFacetAndPosition[msg.sig].facetAddress;
    require(facet != address(0), "Diamond: Function not found");
    assembly {
      calldatacopy(0, 0, calldatasize())
      let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
      returndatacopy(0, 0, returndatasize())
      switch result
        case 0 { revert(0, returndatasize()) }
        default { return(0, returndatasize()) }
    }
  }

  receive() external payable {}
}