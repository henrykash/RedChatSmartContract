// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;


interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract RedEnvelope {
    address public owner;
    IERC20 public token;
    uint256 public totalTokens;
    mapping(address => bool) public whitelisted;
    mapping(address => bool) public hasClaimed;

    constructor(address _token, address[] memory _whitelist) {
        owner = msg.sender;
        token = IERC20(_token);
        for(uint i = 0; i < _whitelist.length; i++) {
            whitelisted[_whitelist[i]] = true;
        }
    }

     modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Owner calls this function after deploying the contract and approving it to pull the tokens
    function initialize(uint256 _tokenAmount) public onlyOwner {
        require(token.transferFrom(msg.sender, address(this), _tokenAmount), "Token transfer failed");
        totalTokens = _tokenAmount;
    }

    function claimTokens(address _userAddress) public {

        require(whitelisted[_userAddress], "You are not whitelisted");
        require(!hasClaimed[_userAddress], "You have already claimed your tokens");
        require(totalTokens > 0, "Gift tokens depleted");

        uint256 percentage = randomPercentage();
        uint256 amountToClaim = (totalTokens * percentage) / 100;

        if (amountToClaim > totalTokens) {
            amountToClaim = totalTokens;
        }

        totalTokens -= amountToClaim;
        hasClaimed[_userAddress] = true;
        require(token.transfer(_userAddress, amountToClaim), "Token transfer failed");
    }

    function randomPercentage() private view returns (uint256) {
        return (uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 61) + 20;
    }

   

}
