var RomanCrowdsale = artifacts.require("./RomanCrowdsale.sol");
module.exports = function(deployer, network, accounts) {
  deployer.deploy(RomanCrowdsale, web3.eth.blockNumber+5, web3.eth.blockNumber+1000000000000000, 1, accounts[1]);
};
