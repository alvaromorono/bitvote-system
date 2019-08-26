pragma solidity ^0.5.11;

import "./SystemManager.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract Election is SystemManager, Pausable {
    event votedEvent (address indexed _candidate, address _voter);
    event candidateEligible(address indexed _applicant);
    event candidateWithdrawn(address indexed _candidate);

    struct Candidate {
        address account;
        string name;
        uint voteCount;
    }
    // Stores candidates' votes
    mapping(address => Candidate) public candidates;
    // Stores candidates that have applied to be eligible
    mapping(address => bool) public applicants;
    // Store accounts that have voted
    mapping(address => bool) public voters;


    function vote (address _candidate) public onlyCitizen onlyCandidate whenNotPaused {
        // require that they haven't voted before
        require(!voters[msg.sender], "You have already voted");
        // require candidate is eligible
        require(applicants[_candidate], "This candidate is not currently running for the election");
        // record that the voter has voted
        voters[msg.sender] = true;
        _vote(_candidate);
    }

    function _vote (address _candidate) internal {
        // update candidate vote count
        candidates[_candidate].voteCount ++;
        // trigger voted event
        emit votedEvent(_candidate, msg.sender);
    }

    function standForElections(string memory _name) public onlyCandidate whenPaused {
        require(!applicants[msg.sender], "You have already run for elections");
        applicants[msg.sender] = true;
        _standForElections(_name);
    }

    // msg.sender could show unexpected behaviour. msg.sender could be function
    function _standForElections(string memory _name) internal {
        candidates[msg.sender] = Candidate(msg.sender, _name, 0);
        emit candidateEligible(msg.sender);
    }

    function withdrawFromElection() public onlyCandidate whenPaused {
        require(applicants[msg.sender], "You are not running for the election");
        applicants[msg.sender] = false;
        _withdrawFromElection();
    }

    function _withdrawFromElection() internal {
        emit candidateWithdrawn(msg.sender);
    }
}