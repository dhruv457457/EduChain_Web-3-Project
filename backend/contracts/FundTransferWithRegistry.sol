// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FundTransferWithRegistry is Ownable {
    struct User {
        string username;
        bool registered;
    }

    struct Transaction {
        address sender;
        address receiver;
        string senderName;
        string receiverName;
        uint256 amount;
        string message;
        uint256 timestamp;
        bool claimed;
        bool refunded;
    }

    mapping(address => User) public users;
    mapping(string => address) public usernameToAddress;
    Transaction[] public allTransactions;
    mapping(address => uint256) public pendingBalances;

    event UserRegistered(address indexed user, string username);
    event FundsSent(address indexed sender, address indexed receiver, uint256 amount, string message);
    event FundsClaimed(address indexed receiver, uint256 amount);
    event RefundIssued(address indexed sender, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function registerUsername(string calldata _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(usernameToAddress[_username] == address(0), "Username already taken");
        require(!users[msg.sender].registered, "You already have a username");

        users[msg.sender] = User(_username, true);
        usernameToAddress[_username] = msg.sender;

        emit UserRegistered(msg.sender, _username);
    }

    function sendFunds(string memory _receiverUsername, string memory _message) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(users[msg.sender].registered, "Sender must be registered");

        address receiver = usernameToAddress[_receiverUsername];
        require(receiver != address(0), "Receiver username not found");

        Transaction memory newTx = Transaction({
            sender: msg.sender,
            receiver: receiver,
            senderName: users[msg.sender].username,
            receiverName: users[receiver].username,
            amount: msg.value,
            message: _message,
            timestamp: block.timestamp,
            claimed: false,
            refunded: false
        });

        allTransactions.push(newTx);
        pendingBalances[receiver] += msg.value;

        emit FundsSent(msg.sender, receiver, msg.value, _message);
    }

    function sendFundsToAddress(address _receiver, string memory _message) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(users[msg.sender].registered, "Sender must be registered");
        require(users[_receiver].registered, "Receiver must be registered");

        Transaction memory newTx = Transaction({
            sender: msg.sender,
            receiver: _receiver,
            senderName: users[msg.sender].username,
            receiverName: users[_receiver].username,
            amount: msg.value,
            message: _message,
            timestamp: block.timestamp,
            claimed: false,
            refunded: false
        });

        allTransactions.push(newTx);
        pendingBalances[_receiver] += msg.value;

        emit FundsSent(msg.sender, _receiver, msg.value, _message);
    }

    function claimFunds() external {
        uint256 amount = pendingBalances[msg.sender];
        require(amount > 0, "No funds to claim");

        pendingBalances[msg.sender] = 0;

        for (uint256 i = 0; i < allTransactions.length; i++) {
            if (allTransactions[i].receiver == msg.sender && !allTransactions[i].claimed && !allTransactions[i].refunded) {
                allTransactions[i].claimed = true;
                break;
            }
        }

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Claim failed");

        emit FundsClaimed(msg.sender, amount);
    }

    function refund(address _receiver) external {
        uint256 amount = pendingBalances[_receiver];
        require(amount > 0, "No funds to refund");

        bool isSender = false;
        for (uint256 i = 0; i < allTransactions.length; i++) {
            if (
                allTransactions[i].receiver == _receiver &&
                allTransactions[i].sender == msg.sender &&
                !allTransactions[i].claimed &&
                !allTransactions[i].refunded &&
                block.timestamp >= allTransactions[i].timestamp + 5 minutes
            ) {
                isSender = true;
                allTransactions[i].refunded = true;
                break;
            }
        }
        require(isSender, "Only sender can refund after 5 minutes");

        pendingBalances[_receiver] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Refund failed");

        emit RefundIssued(msg.sender, amount);
    }

    function getAllTransactions() external view returns (Transaction[] memory) {
        return allTransactions;
    }
}
