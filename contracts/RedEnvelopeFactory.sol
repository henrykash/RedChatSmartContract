// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "./RedEnvelope.sol";

interface IRedEnvelope {
    function totalTokens() external view returns (uint256);
}

contract RedEnvelopeFactory {
    address[] public deployedRedEnvelopes;
    IERC20 public token;

    event RedEnvelopeDeployed(address indexed envelopeAddress);

    constructor() {}

    function deployRedEnvelope(
        address _token,
        address[] memory _whitelist
    ) public returns (address) {
        RedEnvelope newEnvelope = new RedEnvelope(_token, _whitelist);
        address newEnvelopeAddress = address(newEnvelope);
        deployedRedEnvelopes.push(newEnvelopeAddress);

        emit RedEnvelopeDeployed(newEnvelopeAddress);
        return newEnvelopeAddress;
    }

    function getAllDeployedContracts() public view returns (address[] memory) {
        return deployedRedEnvelopes;
    }

    function checkBalanceOfDeployedContract(
        address _envelopeAddress
    ) public view returns (uint256) {
        IRedEnvelope envelope = IRedEnvelope(_envelopeAddress);
        return envelope.totalTokens();
    }
}
