pragma solidity ^0.5.11;

import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./CitizenRole.sol";
import "./CandidateRole.sol";

contract Election is CitizenRole, CandidateRole, Pausable {
    event votedEvent (address indexed _candidate, address indexed _voter);
    event candidateEligible(address indexed _applicant, string _addedParty);
    event candidateWithdrawn(address indexed _candidate, string _removedParty);

    struct Candidate {
        address account;
        string name;
        uint voteCount;
    }

    mapping(address => Candidate) public candidates;
    mapping(address => bool) public applicants;
    mapping(address => bool) public voters;

    function vote (address _candidate) external onlyCitizen whenNotPaused {
        require(!voters[msg.sender], "You have already voted");
        require(applicants[_candidate], "This candidate is not currently running for the election");
        voters[msg.sender] = true;
        _vote(_candidate);
    }

    function _vote (address _candidate) internal {
        candidates[_candidate].voteCount ++;
        emit votedEvent(_candidate, msg.sender);
    }

    function standForElections(string calldata _name) external onlyCandidate whenPaused {
        require(bytes(_name).length > 0, "Enter a valid name");
        require(!applicants[msg.sender], "You have already run for elections");
        applicants[msg.sender] = true;
        _standForElections(_name);
    }

    function _standForElections(string memory _name) internal {
        candidates[msg.sender] = Candidate(msg.sender, _name, 0);
        emit candidateEligible(msg.sender, _name);
    }

    function withdrawFromElections() external onlyCandidate whenPaused {
        require(applicants[msg.sender], "You are not running for the election");
        applicants[msg.sender] = false;
        _withdrawFromElections();
    }

    function _withdrawFromElections() internal {
        emit candidateWithdrawn(msg.sender, candidates[msg.sender].name);
    }

    function scrutiny(address _candidate) external view onlyCitizen whenPaused returns (uint256) {
        require(applicants[_candidate], "This candidate is not currently running for the election");
        return candidates[_candidate].voteCount;
    }
}