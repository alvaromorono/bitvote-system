pragma solidity ^0.5.11;

import "./CitizenRole.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract Election is CitizenRole, Pausable {
    event votedEvent(address indexed _candidate, address indexed _voter);
    event candidateEligible(address indexed _applicant, string _addedParty);
    event candidateWithdrawn(address indexed _candidate, string _removedParty);
    event votersResetEvent(address indexed _admin);
    event scrutinyEvent(address indexed _candidate, uint _votes);

    struct Candidate {
        address account;
        string name;
        uint voteCount;
    }

    mapping(address => Candidate) public candidates;
    mapping(address => bool) public applicants;
    mapping(address => bool) public voters;
    mapping(uint => address) public votersList;

    uint counter = 0;

    function resetVoters() external onlyAdmin whenPaused {
        require(counter > 0,"There are no voters");
        require(voters[votersList[counter]],"Voters already reset");
        _resetVoters();
    }

    function _resetVoters() internal {
        for (uint i = 1; i <= counter; i++){
            voters[votersList[i]] = false;
        }
        emit votersResetEvent(msg.sender);
    }

    function vote (address _candidate) external onlyCitizen whenNotPaused {
        require(!voters[msg.sender], "You have already voted");
        require(applicants[_candidate], "This candidate is not currently running for the election");
        voters[msg.sender] = true;
        _vote(_candidate);
    }

    function _vote (address _candidate) internal {
        counter ++;
        votersList[counter] = msg.sender;
        candidates[_candidate].voteCount ++;
        emit votedEvent(_candidate, msg.sender);
    }

    function standForElections(address _candidate, string calldata _name) external onlyAdmin whenPaused {
        require(bytes(_name).length > 0, "Enter a valid name");
        require(!applicants[_candidate], "This candidate is already running for elections");
        applicants[_candidate] = true;
        _standForElections(_candidate, _name);
    }

    function _standForElections(address _candidate, string memory _name) internal {
        candidates[_candidate] = Candidate(_candidate, _name, 0);
        emit candidateEligible(_candidate, _name);
    }

    function withdrawFromElections(address _candidate) external onlyAdmin whenPaused {
        require(applicants[_candidate], "This candidate is not currently running for the elections");
        applicants[_candidate] = false;
        _withdrawFromElections(_candidate);
    }

    function _withdrawFromElections(address _candidate) internal {
        emit candidateWithdrawn(_candidate, candidates[_candidate].name);
    }

    function scrutiny(address _candidate) external onlyAdmin whenPaused {
        require(applicants[_candidate], "This candidate is not currently running for the election");
        _scrutiny(_candidate);
    }

    function _scrutiny(address _candidate) internal {
        emit scrutinyEvent(_candidate, candidates[_candidate].voteCount);
    }
}