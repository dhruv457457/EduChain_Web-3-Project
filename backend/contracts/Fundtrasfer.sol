// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FundTransfer is Ownable {
    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        bool claimed;
        bool refunded;
    }

    Transaction[] public allTransactions; // Store all transactions globally
    mapping(address => Transaction[]) private transactions; // Per-user transactions
    mapping(address => uint256) public pendingBalances;

    event FundsSent(address indexed sender, address indexed receiver, uint256 amount, string message);
    event FundsClaimed(address indexed receiver, uint256 amount);
    event RefundIssued(address indexed sender, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function sendFunds(address _receiver, string memory _message) external payable {
        require(msg.value > 0, "Amount must be greater than 0");

        Transaction memory newTx = Transaction({
            sender: msg.sender,
            receiver: _receiver,
            amount: msg.value,
            message: _message,
            timestamp: block.timestamp,
            claimed: false,
            refunded: false
        });

        transactions[_receiver].push(newTx);
        allTransactions.push(newTx); // Store globally
        pendingBalances[_receiver] += msg.value;

        emit FundsSent(msg.sender, _receiver, msg.value, _message);
    }

    function claimFunds() external {
        uint256 amount = pendingBalances[msg.sender];
        require(amount > 0, "No funds to claim");

        pendingBalances[msg.sender] = 0;
        for (uint i = 0; i < transactions[msg.sender].length; i++) {
            if (!transactions[msg.sender][i].claimed && !transactions[msg.sender][i].refunded) {
                transactions[msg.sender][i].claimed = true;
            }
        }

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Claim failed");

        emit FundsClaimed(msg.sender, amount);
    }

    function refund(address _receiver) external {
        uint256 amount = pendingBalances[_receiver];
        require(amount > 0, "No funds to refund");
        
        uint256 lastTransactionTime = transactions[_receiver][transactions[_receiver].length - 1].timestamp;
        require(block.timestamp >= lastTransactionTime + 10 hours, "Cannot refund yet");
        require(transactions[_receiver][transactions[_receiver].length - 1].sender == msg.sender, "Only sender can refund");
        
        pendingBalances[_receiver] = 0;
        transactions[_receiver][transactions[_receiver].length - 1].refunded = true;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Refund failed");

        emit RefundIssued(msg.sender, amount);
    }

    // ✅ Get transactions for any user (for sender or receiver)
    function getTransactionsFor(address user) external view returns (Transaction[] memory) {
        return transactions[user];
    }

    // ✅ Get all transactions globally
    function getAllTransactions() external view returns (Transaction[] memory) {
        return allTransactions;
    }
}
