var Election = artifacts.require("./Election.sol");
var Proposals = artifacts.require("./Proposals.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
  deployer.deploy(Proposals);
};
