// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UsernameRegistry {
    struct User {
        string username;
        bool registered;
    }

    mapping(address => User) public users;
    mapping(string => address) public usernameToAddress;

    event UserRegistered(address indexed user, string username);

    function registerUsername(string calldata _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(usernameToAddress[_username] == address(0), "Username already taken");
        require(!users[msg.sender].registered, "User already registered");

        users[msg.sender] = User(_username, true);
        usernameToAddress[_username] = msg.sender;

        emit UserRegistered(msg.sender, _username);
    }

    function getAddressFromUsername(string memory _username) external view returns (address) {
        return usernameToAddress[_username];
    }

    function getUsernameFromAddress(address _user) external view returns (string memory) {
        return users[_user].username;
    }

    function isRegistered(address _user) external view returns (bool) {
        return users[_user].registered;
    }
}