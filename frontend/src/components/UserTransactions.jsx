// UserTransactions.js
import React, { useEffect } from "react";
import { ethers } from "ethers";
import useContract from "../hooks/useContract";

const UserTransactions = () => {
  const { userTransactions, fetchUserTransactions, userAddress } = useContract();

  useEffect(() => {
    if (userAddress) {
      fetchUserTransactions(userAddress);
    }
  }, [userAddress]);

  return (
    <div className="bg-gray-900 p-5 rounded-lg shadow-lg border border-customPurple text-white">
      <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>
      {userTransactions.length === 0 ? (
        <p className="text-gray-400">No transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {userTransactions.map((tx, index) => (
            <li key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
              <p><strong>From:</strong> {tx.sender}</p>
              <p><strong>To:</strong> {tx.receiver}</p>
              <p><strong>Amount:</strong> {ethers.formatEther(tx.amount.toString())} ETH</p>
              <p><strong>Message:</strong> {tx.message}</p>
              <p><strong>Timestamp:</strong> {new Date(Number(tx.timestamp) * 1000).toLocaleString()}</p>
              <p className={tx.claimed ? "text-green-400" : "text-yellow-400"}>
                {tx.claimed ? "✅ Claimed" : "⏳ Pending"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserTransactions;