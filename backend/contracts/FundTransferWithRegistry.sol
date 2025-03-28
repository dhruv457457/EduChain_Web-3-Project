// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface UsernameRegistry {
    function getAddressFromUsername(string memory _username) external view returns (address);
    function getUsernameFromAddress(address _user) external view returns (string memory);
    function isRegistered(address _user) external view returns (bool);
}

contract FundTransferWithRegistry is Ownable {
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

    UsernameRegistry public registry; // Reference to shared username registry
    Transaction[] public allTransactions;
    mapping(address => uint256) public pendingBalances;

    event FundsSent(address indexed sender, address indexed receiver, uint256 amount, string message);
    event FundsClaimed(address indexed receiver, uint256 amount);
    event RefundIssued(address indexed sender, uint256 amount);
    event FundsDeposited(address indexed user, uint256 amount);
    event EscrowReleased(address indexed recipient, uint256 amount);

    constructor(address _registryAddress) Ownable(msg.sender) {
        registry = UsernameRegistry(_registryAddress);
    }

    function depositFunds() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        pendingBalances[msg.sender] += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    function sendFunds(string memory _receiverUsername, string memory _message) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(registry.isRegistered(msg.sender), "Sender must be registered");

        address receiver = registry.getAddressFromUsername(_receiverUsername);
        require(receiver != address(0), "Receiver username not found");

        _processTransaction(msg.sender, receiver, msg.value, _message);
    }

    function sendFundsToAddress(address _receiver, string memory _message) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(registry.isRegistered(msg.sender), "Sender must be registered");
        require(registry.isRegistered(_receiver), "Receiver must be registered");

        _processTransaction(msg.sender, _receiver, msg.value, _message);
    }

    function _processTransaction(address _sender, address _receiver, uint256 _amount, string memory _message) internal {
        allTransactions.push(Transaction({
            sender: _sender,
            receiver: _receiver,
            senderName: registry.getUsernameFromAddress(_sender),
            receiverName: registry.getUsernameFromAddress(_receiver),
            amount: _amount,
            message: _message,
            timestamp: block.timestamp,
            claimed: false,
            refunded: false
        }));

        pendingBalances[_receiver] += _amount;
        emit FundsSent(_sender, _receiver, _amount, _message);
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

    function releaseEscrow(address _recipient, uint256 _amount) external onlyOwner {
        require(pendingBalances[_recipient] >= _amount, "Insufficient escrow funds");

        pendingBalances[_recipient] -= _amount;
        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "Escrow release failed");

        emit EscrowReleased(_recipient, _amount);
    }

    function getAllTransactions() external view returns (Transaction[] memory) {
        return allTransactions;
    }

    function getUserTransactions(address user) external view returns (Transaction[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allTransactions.length; i++) {
            if (allTransactions[i].sender == user || allTransactions[i].receiver == user) {
                count++;
            }
        }

        Transaction[] memory userTransactions = new Transaction[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allTransactions.length; i++) {
            if (allTransactions[i].sender == user || allTransactions[i].receiver == user) {
                userTransactions[index] = allTransactions[i];
                index++;
            }
        }
        return userTransactions;
    }
}