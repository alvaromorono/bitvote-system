pragma solidity ^0.5.11;

import "./SystemManager.sol";

contract Election is SystemManager {
    event votedEvent (
        address indexed _candidate
    );



    // Store accounts that have voted
    mapping(address => bool) public voters;


    function vote (address _candidate) public onlyCitizen {
        // require that they haven't voted before
        require(!voters[msg.sender], "You have already voted");
        // record that the voter has voted
        voters[msg.sender] = true;
        // update candidate vote count
        candidates[_candidate].voteCount ++;
        // trigger voted event
        emit votedEvent(address(_candidate));
    }
}