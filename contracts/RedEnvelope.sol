// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract RedEnvelope {
    IERC20 public token;
    uint256 public totalTokens;
    mapping(address => bool) public whitelisted;
    mapping(address => bool) public hasClaimed;
    mapping(address => uint256) public claimedAmounts; // Track amounts claimed by users
    address[] public claimants; // List of users who have claimed tokens
    uint256 public totalWhitelistedUsers;
    uint256 public usersClaimed = 0; // Track the number of users who have claimed their tokens

    constructor(address _token, address[] memory _whitelist) {
        token = IERC20(_token);
        totalWhitelistedUsers = _whitelist.length; // Set the total number of whitelisted users
        for(uint i = 0; i < _whitelist.length; i++) {
            whitelisted[_whitelist[i]] = true;
        }
    }

    function initialize(address _owner, uint256 _tokenAmount) public {
        require(token.transferFrom(_owner, address(this), _tokenAmount), "Token transfer failed");
        totalTokens = _tokenAmount;
    }

    // Updated function to claim an equal amount of tokens
    function claimEqualAmount(address _userAddress) public {
        require(whitelisted[_userAddress], "User is not whitelisted");
        require(!hasClaimed[_userAddress], "User has already claimed tokens");

        uint256 eligibleUsers = totalWhitelistedUsers - usersClaimed;
        require(eligibleUsers > 0, "No eligible users remaining");
        
        uint256 amountPerUser = totalTokens / eligibleUsers;
        require(amountPerUser > 0, "Insufficient tokens for distribution");

        _makeClaim(_userAddress, amountPerUser);
        usersClaimed++; // Increment the count of users who have claimed
    }

    // Function to claim a random amount of tokens
    function claimRandomToken(address _userAddress) public {
        require(whitelisted[_userAddress], "User is not whitelisted");
        require(!hasClaimed[_userAddress], "User has already claimed tokens");

        uint256 randomPercentage = _randomPercentage();
        uint256 amount = totalTokens * randomPercentage / 100;
        require(amount > 0, "Insufficient tokens for distribution");

        _makeClaim(_userAddress, amount);
    }

    // Internal function to handle token transfer and state update
    function _makeClaim(address _userAddress, uint256 amount) internal {
        require(totalTokens >= amount, "Not enough tokens left");
        totalTokens -= amount;
        hasClaimed[_userAddress] = true;
        claimedAmounts[_userAddress] = amount;
        claimants.push(_userAddress);

        require(token.transfer(_userAddress, amount), "Token transfer failed");
    }

    // Internal function to generate a pseudo-random percentage between 20 and 80
    function _randomPercentage() private view returns (uint256) {
        return (uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 61) + 20;
    }

    // Function to get the list of users who claimed and their amounts
    function getClaimantsAndAmounts() public view returns (address[] memory, uint256[] memory) {
        uint256[] memory amounts = new uint256[](claimants.length);
        for(uint i = 0; i < claimants.length; i++) {
            amounts[i] = claimedAmounts[claimants[i]];
        }
        return (claimants, amounts);
    }

    // Function to get claimed amount for a specific user
    function getClaimedAmount(address user) public view returns (uint256) {
        require(whitelisted[user], "User is not whitelisted");
        return claimedAmounts[user];
    }
}
