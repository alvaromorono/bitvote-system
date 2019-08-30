pragma solidity ^0.5.11;

import "./SystemManager.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract Election is SystemManager, Pausable {
    event votedEvent (address indexed _candidate, address _voter);
    event candidateEligible(address indexed _applicant, string _politicalParty);
    event candidateWithdrawn(address indexed _candidate, string _politicalParty);

    struct Candidate {
        address account;
        string name;
        uint voteCount;
    }

    mapping(address => Candidate) public candidates;
    mapping(address => bool) public applicants;
    mapping(address => bool) public voters;

    function vote (address _candidate) public onlyCitizen whenNotPaused {
        require(!voters[msg.sender], "You have already voted");
        require(applicants[_candidate], "This candidate is not currently running for the election");
        voters[msg.sender] = true;
        _vote(_candidate);
    }

    function _vote (address _candidate) internal {
        candidates[_candidate].voteCount ++;
        emit votedEvent(_candidate, msg.sender);
    }

    function standForElections(string memory _name, address _candidate) public onlyAdmin whenPaused {
        require(!applicants[_candidate], "This candidate is already running for elections");
        applicants[_candidate] = true;
        _standForElections(_name, _candidate);
    }

    function _standForElections(address _candidate, string memory _name) internal {
        candidates[_candidate] = Candidate(_candidate, _name, 0);
        emit candidateEligible(_candidate, _name);
    }

    function withdrawFromElections(address _candidate) public onlyAdmin whenPaused {
        require(applicants[_candidate], "This candidate is not currently running for the elections");
        applicants[_candidate] = false;
        _withdrawFromElections(_candidate, candidates[_candidate].name);
    }

    function _withdrawFromElections(address _candidate, string memory _name) internal {
        emit candidateWithdrawn(_candidate, _name);
    }

    function scrutiny(address _candidate) public onlyCitizen whenPaused returns (uint256) {
        return candidates[_candidate].voteCount;
    }
}