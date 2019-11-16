pragma solidity ^0.5.11;

import "./CitizenRole.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract Proposals is CitizenRole, Pausable {
    event votedForEvent(uint indexed _proposalIdentifier, address indexed _voter);
    event votedAgainstEvent(uint indexed _proposalIdentifier, address indexed _voter);
    event votedAbstentionEvent(uint indexed _proposalIdentifier, address indexed _voter);
    event proposalCreatedEvent(
        uint indexed _proposalIdentifier,
        string _proposalType,
        string _title,
        string _body,
        string _predictions,
        address indexed _author
    );
    event proposalVotedEvent(
        uint indexed _proposalIdentifier,
        uint _votesFor,
        uint _votesAgainst,
        uint _abstentions,
        bool _approved,
        uint _majorityType
    );

    struct Law {
        uint identifier;
        string proposalType;
        string title;
        string body;
        string predictions;
        address author;
        uint votesFor;
        uint votesAgainst;
        uint abstentions;
        bool voted;
        bool approved;
        mapping(address => bool) voters;
    }

    mapping(uint => Law) public BOE;

    uint counter = 0;

    function voteLaw(uint _identifier, uint _majority) external onlyAdmin whenPaused {
        require(_identifier <= counter, "Proposal not in BOE");
        require(!BOE[_identifier].voted, "Proposal already voted");
        require(_majority >= 1, "Select a valid majority type");
        require(_majority <= 4, "Select a valid majority type");
        BOE[_identifier].voted = true;
        _voteLaw(_identifier, _majority);
    }

    function _voteLaw(uint _identifier, uint _majority) internal {
        // mayoria simple
        if (_majority == 1) {
            if (BOE[_identifier].votesFor > BOE[_identifier].votesAgainst){
                BOE[_identifier].approved = true;
            }
        // mayoria absoluta
        } else if (_majority == 2) {
            if ((((BOE[_identifier].votesFor + BOE[_identifier].votesAgainst + BOE[_identifier].abstentions)/2)+1) <= BOE[_identifier].votesFor) {
                BOE[_identifier].approved = true;
            }
        // mayoria de 3/5
        } else if (_majority == 3) {
            if (((BOE[_identifier].votesFor + BOE[_identifier].votesAgainst + BOE[_identifier].abstentions)*3/5) <= BOE[_identifier].votesFor) {
                BOE[_identifier].approved = true;
            }
        // mayoria de 2/3
        } else if (_majority == 4) {
            if (((BOE[_identifier].votesFor + BOE[_identifier].votesAgainst + BOE[_identifier].abstentions)*2/3) <= BOE[_identifier].votesFor) {
                BOE[_identifier].approved = true;
            }
        }
        emit proposalVotedEvent(
            _identifier,
            BOE[_identifier].votesFor,
            BOE[_identifier].votesAgainst,
            BOE[_identifier].abstentions,
            BOE[_identifier].approved,
            _majority
        );
    }

    function _getLawVoters(uint _identifier, address _voter) internal view returns(bool) {
        Law storage l = BOE[_identifier];
        return (l.voters[_voter]);
    }

    function _countLawVote(uint _identifier, address _voter) internal {
        Law storage l = BOE[_identifier];
        l.voters[_voter] = true;
    }

    function voteFor(uint _identifier) external onlyCitizen whenNotPaused {
        require(!_getLawVoters(_identifier, msg.sender), "You have already voted");
        require(_identifier<=counter, "The proposal is not registered in the BOE");
        require(!BOE[_identifier].voted,"The proposal has already been voted");
        _countLawVote(_identifier, msg.sender);
        _voteFor(_identifier);
    }

    function _voteFor(uint _identifier) internal {
        BOE[_identifier].votesFor ++;
        emit votedForEvent(_identifier, msg.sender);
    }

    function voteAgainst(uint _identifier) external onlyCitizen whenNotPaused {
        require(!_getLawVoters(_identifier, msg.sender), "You have already voted");
        require(_identifier<=counter, "The proposal is not registered in the BOE");
        require(!BOE[_identifier].voted,"The proposal has already been voted");
        _countLawVote(_identifier, msg.sender);
        _voteAgainst(_identifier);
    }

    function _voteAgainst(uint _identifier) internal {
        BOE[_identifier].votesAgainst ++;
        emit votedAgainstEvent(_identifier, msg.sender);
    }

    function voteAbstention(uint _identifier) external onlyCitizen whenNotPaused {
        require(!_getLawVoters(_identifier, msg.sender), "You have already voted");
        require(_identifier<=counter, "The proposal is not registered in the BOE");
        require(!BOE[_identifier].voted,"The proposal has already been voted");
        _countLawVote(_identifier, msg.sender);
        _voteAbstention(_identifier);
    }

    function _voteAbstention(uint _identifier) internal {
        BOE[_identifier].abstentions ++;
        emit votedAbstentionEvent(_identifier, msg.sender);
    }

    function createProposal(string calldata _proposalType, string calldata _title, string calldata _body, string calldata _predictions)
            external
            onlyCitizen
            whenPaused
        {
            require(bytes(_proposalType).length > 0, "Enter a valid proposal type");
            require(bytes(_title).length > 0, "Enter a valid title");
            require(bytes(_body).length > 0, "Enter a valid body");
            require(bytes(_predictions).length > 0, "Enter valid predictions");
            _createProposal(_proposalType, _title, _body, _predictions);
        }

    function _createProposal(string memory _proposalType, string memory _title, string memory _body, string memory _predictions) internal {
        counter ++;
        BOE[counter] = Law(counter, _proposalType, _title, _body, _predictions, msg.sender, 0, 0, 0, false, false);
        emit proposalCreatedEvent(counter, _proposalType, _title, _body, _predictions, msg.sender);
    }
}