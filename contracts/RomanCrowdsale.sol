pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/token/MintableToken.sol";

contract RomanToken is MintableToken {
    string public name = "RomanStormToken";
    string public symbol = "RST";
    uint256 public decimals = 18;
    uint256 public INITIAL_SUPPLY = 10000;
}

contract RomanCrowdsale is Crowdsale {
    function RomanCrowdsale(uint256 _startBlock, uint256 _endBlock, uint256 _rate, address _wallet) Crowdsale(_startBlock, _endBlock, _rate, _wallet) {
    }

    function createTokenContract() internal returns (MintableToken) {
        return new RomanToken();
    }

}

