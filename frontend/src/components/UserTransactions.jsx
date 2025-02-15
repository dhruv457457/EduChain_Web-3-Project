import React, { useEffect } from "react";
import { ethers } from "ethers";
import useContract from "../hooks/useContract";

const UserTransactions = () => {
  const { userTransactions, fetchUserTransactions, userAddress } = useContract();

  useEffect(() => {
    if (userAddress) {
      fetchUserTransactions(userAddress); // Pass address explicitly
    }
  }, [userAddress]);

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Transactions</h2>
      {userTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {userTransactions.map((tx, index) => (
            <li key={index} className="p-4 border border-gray-700 rounded-lg">
              <p><strong>From:</strong> {tx.sender}</p>
              <p><strong>To:</strong> {tx.receiver}</p>
              <p><strong>Amount:</strong> {ethers.formatEther(tx.amount.toString())} ETH</p>
              <p><strong>Message:</strong> {tx.message}</p>
              <p><strong>Timestamp:</strong> {new Date(Number(tx.timestamp) * 1000).toLocaleString()}</p>
              <p className={tx.claimed ? "text-green-400" : "text-yellow-400"}>
                {tx.claimed ? "Claimed" : "Pending"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserTransactions;
