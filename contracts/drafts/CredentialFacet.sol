// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibH1Storage } from "../libraries/LibH1Storage.sol";
import { LibDiamond } from "../diamond-standard/libraries/LibDiamond.sol";

contract CredentialFacet {
  event ValidatorCredentialed(address indexed validator, bool status);

  function setValidatorCredential(address validator, bool status) external {
    LibDiamond.enforceIsContractOwner();
    LibH1Storage.h1Storage().credentialedValidators[validator] = status;
    emit ValidatorCredentialed(validator, status);
  }

  function checkCredential(address validator, string calldata /* domain */) external view returns (bool) {
    return LibH1Storage.h1Storage().credentialedValidators[validator];
  }
}


