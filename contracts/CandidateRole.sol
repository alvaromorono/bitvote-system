pragma solidity ^0.5.11;

import "../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";
import "./AdminRole.sol";

contract CandidateRole is AdminRole {
    using Roles for Roles.Role;

    event CandidateAdded(address indexed account);
    event CandidateRemoved(address indexed account);

    Roles.Role private _candidates;

    modifier onlyCandidate() {
        require(isCandidate(msg.sender), "CandidateRole: caller does not have the Candidate role");
        _;
    }

    function isCandidate(address account) public view returns (bool) {
        return _candidates.has(account);
    }

    function addCandidate(address account) public onlyAdmin {
        _addCandidate(account);
    }

    function removeCandidate(address account) public onlyAdmin {
        _removeCandidate(account);
    }

    function renonceCandidate() public {
        _removeCandidate(msg.sender);
    }

    function _addCandidate(address account) internal {
        _candidates.add(account);
        emit CandidateAdded(account);
    }

    function _removeCandidate(address account) internal {
        _candidates.remove(account);
        emit CandidateRemoved(account);
    }
}
