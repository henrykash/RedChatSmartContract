// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "./RedEnvelope.sol";

interface IRedEnvelope {
    function totalTokens() external view returns (uint256);
}

contract RedChatFactory {
    address[] public deployedRedEnvelopes;
    address public owner;
    IERC20 public token;

    event RedEnvelopeDeployed(address indexed envelopeAddress);

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }
 
   modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function deployRedEnvelope(address[] memory _whitelist) public {
        require(msg.sender == owner, "Only owner can deploy");
        RedEnvelope newEnvelope = new RedEnvelope(address(token), _whitelist);
        deployedRedEnvelopes.push(address(newEnvelope));
        emit RedEnvelopeDeployed(address(newEnvelope));
    }

    function getAllDeployedContracts() public view returns (address[] memory) {
        return deployedRedEnvelopes;
    }

    function checkBalanceOfDeployedContract(address _envelopeAddress) public view returns (uint256) {
        IRedEnvelope envelope = IRedEnvelope(_envelopeAddress);
        return envelope.totalTokens();
    }

  
}


