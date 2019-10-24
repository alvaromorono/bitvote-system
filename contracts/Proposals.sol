pragma solidity ^0.5.11;

import "./CitizenRole.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract Proposals is CitizenRole, Pausable {
    event votedForEvent(address indexed _voter, uint indexed _proposal);
    event votedAgainstEvent(address indexed _voter, uint indexed _proposal);
    event votedAbstentionEvent(address indexed _voter, uint indexed _proposal);
    event proposalCreatedEvent(address indexed _author, uint indexed _proposalIdentifier);

    struct Law {
        uint identifier;
        string proposalType;
        string title;
        string body;
        //string afectedSectors;
        string predictions;
        address author;
        uint votesFor;
        uint votesAgainst;
        uint abstentions;
        bool approved;
        mapping(address => bool) voters;
    }

    //mapping(address => bool) public voters; // observar comportamiento comentando esta linea
    mapping(uint => Law) public BOE;

    uint counter = 0;

    function _getLawVoters(uint _identifier, address _voter) public view returns(bool) {
        Law storage l = BOE[_identifier];
        return (l.voters[_voter]);
    }

    function _countLawVote(uint _identifier, address _voter) internal {
        Law storage l = BOE[_identifier];
        l.voters[_voter] = true;
    }

    function voteFor(uint _identifier) external onlyCitizen whenNotPaused {
        require(!_getLawVoters(_identifier, msg.sender), "You have already voted");
        //require(!voters[msg.sender], "You have already voted");
        require(!BOE[_identifier].approved, "The proposal is not registered in the BOE or has already been voted");
        _countLawVote(_identifier, msg.sender);
        //voters[msg.sender] = true;
        _voteFor(_identifier);
    }

    function _voteFor(uint _identifier) internal {
        BOE[_identifier].votesFor ++;
        emit votedForEvent(msg.sender, _identifier);
    }

    function voteAgainst(uint _identifier) external onlyCitizen whenNotPaused {
        require(!_getLawVoters(_identifier, msg.sender), "You have already voted");
        //require(!voters[msg.sender], "You have already voted");
        require(!BOE[_identifier].approved, "The proposal is not registered in the BOE or has already been voted");
        _countLawVote(_identifier, msg.sender);
        //voters[msg.sender] = true;
        _voteAgainst(_identifier);
    }

    function _voteAgainst(uint _identifier) internal {
        BOE[_identifier].votesAgainst ++;
        emit votedAgainstEvent(msg.sender, _identifier);
    }

    function voteAbstention(uint _identifier) external onlyCitizen whenNotPaused {
        require(!_getLawVoters(_identifier, msg.sender), "You have already voted");
        //require(!voters[msg.sender], "You have already voted");
        require(!BOE[_identifier].approved, "The proposal is not registered in the BOE or has already been voted");
        _countLawVote(_identifier, msg.sender);
        //voters[msg.sender] = true;
        _voteAbstention(_identifier);
    }

    function _voteAbstention(uint _identifier) internal {
        BOE[_identifier].abstentions ++;
        emit votedAbstentionEvent(msg.sender, _identifier);
    }

    function createProposal(string calldata _proposalType, string calldata _title, string calldata _body, string calldata _predictions)
            external
            onlyCitizen
            whenNotPaused
        {
            // Considerense lo "require" necesarios
            _createProposal(_proposalType, _title, _body, _predictions);
        }

    function _createProposal(string memory _proposalType, string memory _title, string memory _body, string memory _predictions) internal {
        counter ++;
        BOE[counter] = Law(counter, _proposalType, _title, _body, _predictions, msg.sender, 0, 0, 0, false);
        emit proposalCreatedEvent(msg.sender, counter);
    }
}