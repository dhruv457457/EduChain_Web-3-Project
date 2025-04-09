// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title UsernameRegistry interface for mapping usernames to addresses
interface UsernameRegistry {
    function getAddressFromUsername(string memory _username) external view returns (address);
    function getUsernameFromAddress(address _user) external view returns (string memory);
    function isRegistered(address _user) external view returns (bool);
}

/// @title FundTransferWithRegistry
/// @notice A contract for sending, claiming, and managing escrowed funds using a username registry
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

    UsernameRegistry public registry;
    Transaction[] public allTransactions;

    mapping(address => uint256) public pendingBalances;
    mapping(address => uint256[]) private receivedTransactionIndexes;

    event FundsSent(address indexed sender, address indexed receiver, uint256 amount, string message);
    event FundsClaimed(address indexed receiver, uint256 amount);
    event RefundIssued(address indexed sender, uint256 amount);
    event FundsDeposited(address indexed user, uint256 amount);
    event EscrowReleased(address indexed recipient, uint256 amount);

    /// @notice Initializes the contract with a username registry
    constructor(address _registryAddress) Ownable(msg.sender) {
        registry = UsernameRegistry(_registryAddress);
    }

    /// @notice Allows users to deposit funds into their pending balance
    function depositFunds() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        pendingBalances[msg.sender] += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    /// @notice Send funds to a registered user via username
    function sendFunds(string memory _receiverUsername, string memory _message) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(registry.isRegistered(msg.sender), "Sender must be registered");

        address receiver = registry.getAddressFromUsername(_receiverUsername);
        require(receiver != address(0), "Receiver username not found");

        _processTransaction(msg.sender, receiver, msg.value, _message);
    }

    /// @notice Send funds to a registered user directly by address
    function sendFundsToAddress(address _receiver, string memory _message) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(registry.isRegistered(msg.sender), "Sender must be registered");
        require(registry.isRegistered(_receiver), "Receiver must be registered");

        _processTransaction(msg.sender, _receiver, msg.value, _message);
    }

    /// @dev Internal function to log and store a transaction
    function _processTransaction(address _sender, address _receiver, uint256 _amount, string memory _message) internal {
        Transaction memory txn = Transaction({
            sender: _sender,
            receiver: _receiver,
            senderName: registry.getUsernameFromAddress(_sender),
            receiverName: registry.getUsernameFromAddress(_receiver),
            amount: _amount,
            message: _message,
            timestamp: block.timestamp,
            claimed: false,
            refunded: false
        });

        allTransactions.push(txn);
        receivedTransactionIndexes[_receiver].push(allTransactions.length - 1);

        pendingBalances[_receiver] += _amount;
        emit FundsSent(_sender, _receiver, _amount, _message);
    }

    /// @notice Claim all unclaimed funds received by the caller
    function claimFunds() external {
        uint256 amount = pendingBalances[msg.sender];
        require(amount > 0, "No funds to claim");

        pendingBalances[msg.sender] = 0;

        uint256[] storage indexes = receivedTransactionIndexes[msg.sender];
        for (uint256 i = 0; i < indexes.length; i++) {
            uint256 txnIndex = indexes[i];
            if (!allTransactions[txnIndex].claimed && !allTransactions[txnIndex].refunded) {
                allTransactions[txnIndex].claimed = true;
            }
        }

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Claim failed");

        emit FundsClaimed(msg.sender, amount);
    }

    /// @notice Release escrow funds manually as the contract owner
    function releaseEscrow(address _recipient, uint256 _amount) external onlyOwner {
        require(pendingBalances[_recipient] >= _amount, "Insufficient escrow funds");

        pendingBalances[_recipient] -= _amount;
        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "Escrow release failed");

        emit EscrowReleased(_recipient, _amount);
    }

    /// @notice Returns all transactions stored on the contract
    function getAllTransactions() external view returns (Transaction[] memory) {
        return allTransactions;
    }

    /// @notice Returns all transactions related to a specific user
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
