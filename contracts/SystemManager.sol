pragma solidity ^0.5.11;

import "./AdminRole.sol";
import "./CandidateRole.sol";
import "./CitizenRole.sol";

contract SystemManager /*is AdminRole /*CandidateRole**/ /*CitizenRole**/ {

    struct Candidate {
        address account;
        string name;
        uint voteCount;
    }
    mapping(address => Candidate) public _candidates;

    //uint256 population;
    address admin;
    constructor() public {
        admin = msg.sender;
    }
}