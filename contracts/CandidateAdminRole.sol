pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";

contract CandidateAdminRole {
    using Roles for Roles.Role;

    event CandidateAdminAdded(address indexed account);
    event CandidateAdminRemoved(address indexed account);

    Roles.Role private _candidateAdmins;

    constructor () internal {
        _addCandidateAdmin(msg.sender);
    }

    modifier onlyCandidateAdmin() {
        require(isCandidateAdmin(msg.sender), "CandidateAdminRole: caller does not have the CandidateAdmin role");
        _;
    }

    function isCandidateAdmin(address account) public view returns (bool) {
        return _candidateAdmins.has(account);
    }

    function addCandidateAdmin(address account) public onlyCandidateAdmin {
        _addCandidateAdmin(account);
    }

    function renonceCandidateAdmin() public {
        _removeCandidateAdmin(msg.sender);
    }

    function _addCandidateAdmin(address account) internal {
        _candidateAdmins.add(account);
        emit CandidateAdminAdded(account);
    }

    function _removeCandidateAdmin(address account) internal {
        _candidateAdmins.remove(account);
        emit CandidateAdminRemoved(account);
    }
}
