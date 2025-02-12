// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserRegistry {  
    mapping(string => address) private usernameToAddress;
    mapping(address => string) private addressToUsername;

    event UserRegistered(address indexed user, string username);

    function registerUsername(string calldata _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(usernameToAddress[_username] == address(0), "Username already taken");
        require(bytes(addressToUsername[msg.sender]).length == 0, "You already have a username");

        usernameToAddress[_username] = msg.sender;
        addressToUsername[msg.sender] = _username;

        emit UserRegistered(msg.sender, _username);
    }

    function getAddressByUsername(string calldata _username) external view returns (address) {
        return usernameToAddress[_username];
    }

    function getUsernameByAddress(address _user) external view returns (string memory) {
        return addressToUsername[_user];
    }
}
