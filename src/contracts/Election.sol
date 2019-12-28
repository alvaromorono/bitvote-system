pragma solidity ^0.5.11;

import "./CitizenRole.sol";
import "./Pausable.sol";

contract Election is CitizenRole, Pausable {
    event votedEvent(uint indexed _id, address indexed _candidate, string _name, address indexed _voter);
    event candidateEligible(uint indexed _id, address indexed _applicant, string _addedParty);
    event candidateWithdrawn(uint indexed _id, address indexed _candidate, string _removedParty);
    event votersResetEvent(address indexed _admin);
    event scrutinyEvent(uint indexed _id, address indexed _candidate, string _name, uint _votes);

    struct Candidate {
        uint id;
        address account;
        string name;
        uint voteCount;
        bool eligible;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    mapping(uint => address) public votersList;

    uint votersCounter = 0;
    uint public counter = 0;

    function resetVoters() external onlyAdmin whenPaused {
        require(votersCounter > 0,"There are no voters");
        require(voters[votersList[votersCounter]],"Voters already reset");
        _resetVoters();
    }

    function _resetVoters() internal {
        for (uint i = 1; i <= votersCounter; i++){
            voters[votersList[i]] = false;
        }
        votersCounter = 0;
        emit votersResetEvent(msg.sender);
    }

    function vote (uint _id) external onlyCitizen whenNotPaused {
        require(!voters[msg.sender], "You have already voted");
        require(_id <= counter, "Candidate does not exist");
        require(_id > 0, "Candidate does not exist");
        require(candidates[_id].eligible, "This candidate is not currently running for the election");
        voters[msg.sender] = true;
        _vote(_id);
    }

    function _vote (uint _id) internal {
        votersCounter ++;
        votersList[votersCounter] = msg.sender;
        candidates[_id].voteCount ++;
        emit votedEvent(_id, candidates[_id].account, candidates[_id].name, msg.sender);
    }

    function standForElections(address _candidate, string calldata _name) external onlyAdmin whenPaused {
        require(bytes(_name).length > 0, "Enter a valid name");
        for (uint ii = 1; ii <= counter; ii++) {
            if (candidates[ii].eligible) {
                for (uint i = 1; i <= counter; i++) {
                    require(candidates[i].account != _candidate, "This candidate is already running for elections");
                }
            }
        }
        candidates[counter + 1].eligible = true;
        _standForElections(_candidate, _name);
    }

    function _standForElections(address _candidate, string memory _name) internal {
        counter++;
        candidates[counter] = Candidate(counter, _candidate, _name, 0, true);
        emit candidateEligible(counter, _candidate, _name);
    }

    function withdrawFromElections(uint _id) external onlyAdmin whenPaused {
        require(candidates[_id].eligible, "This candidate is not currently running for the elections");
        candidates[_id].eligible = false;
        _withdrawFromElections(_id);
    }

    function _withdrawFromElections(uint _id) internal {
        emit candidateWithdrawn(counter, candidates[_id].account, candidates[_id].name);
    }

    function scrutiny(uint _id) external onlyAdmin whenPaused {
        require(candidates[_id].eligible, "This candidate is not currently running for the election");
        _scrutiny(_id);
    }

    function _scrutiny(uint _id) internal {
        emit scrutinyEvent(_id, candidates[_id].account, candidates[_id].name, candidates[_id].voteCount);
    }
}