pragma solidity ^0.5.11;

import "./AdminRole.sol";
import "./CandidateRole.sol";
import "./CitizenRole.sol";

contract SystemManager is AdminRole, CandidateRole, CitizenRole {

    //uint256 population;
    address admin;
    constructor() public {
        admin = msg.sender;
    }
}