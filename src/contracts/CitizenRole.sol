pragma solidity ^0.5.11;

import "./Roles.sol";
import "./AdminRole.sol";

contract CitizenRole is AdminRole {
    using Roles for Roles.Role;

    event CitizenAdded(address indexed account);
    event CitizenRemoved(address indexed account);

    Roles.Role private _citizens;

    modifier onlyCitizen() {
        require(isCitizen(msg.sender), "CitizenRole: caller does not have the Citizen role");
        _;
    }

    function isCitizen(address account) public view returns (bool) {
        return _citizens.has(account);
    }

    function addCitizen(address account) public onlyAdmin {
        _addCitizen(account);
    }

    function removeCitizen(address account) public onlyAdmin {
        _removeCitizen(account);
    }

    /*function renonceCitizen() public {
        _removeCitizen(msg.sender);
    } */

    function _addCitizen(address account) internal {
        _citizens.add(account);
        emit CitizenAdded(account);
    }

    function _removeCitizen(address account) internal {
        _citizens.remove(account);
        emit CitizenRemoved(account);
    }
}
