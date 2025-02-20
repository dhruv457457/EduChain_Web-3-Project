import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useContract from "../hooks/useContract";

const UserTransactions = () => {
  const { userTransactions, fetchUserTransactions, userAddress } = useContract();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      if (userAddress) {
        try {
          await fetchUserTransactions(userAddress);
          setLoading(false);
        } catch (err) {
          setError("Failed to load transactions. Please try again.");
          setLoading(false);
        }
      }
    };
    loadTransactions();
  }, [userAddress, fetchUserTransactions]);

  return (
    <div className="border-t-4 border-customPurple rounded-md bg-customDark p-5 shadow-custom-purple text-white max-h-64 overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>
      {loading ? (
        <p className="text-gray-400">Loading transactions...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : userTransactions.length === 0 ? (
        <p className="text-gray-400">No transactions found.</p>
      ) : (
        <ul className="space-y-4 ">
          {userTransactions.map((tx, index) => (
            <li key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
              <p><strong>From:</strong> {tx.sender || "N/A"}</p>
              <p><strong>To:</strong> {tx.receiver || "N/A"}</p>
              <p><strong>Amount:</strong> {ethers.formatEther(tx.amount?.toString() || "0")} ETH</p>
              <p><strong>Message:</strong> {tx.message || "No message provided"}</p>
              <p><strong>Timestamp:</strong> {tx.timestamp ? new Date(Number(tx.timestamp) * 1000).toLocaleString() : "N/A"}</p>
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