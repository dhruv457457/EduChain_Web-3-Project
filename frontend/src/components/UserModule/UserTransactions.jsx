import React, { useEffect, useState } from "react";
import useContract from "../../hooks/useContract";
import LoaderButton from "../Global/Loader"; 

const UserTransactions = ({ provider }) => {
  const { userTransactions, fetchUserTransactions, userAddress } = useContract(provider);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        if (userAddress) {
          await fetchUserTransactions(userAddress);
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load transactions.");
        setLoading(false);
      }
    };
    loadTransactions();
  }, [userAddress, fetchUserTransactions]);


  return (
    <div className="rounded-md bg-customDark p-5 shadow-custom-purple text-white max-h-64 overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <LoaderButton loading={true} text="Loading Transactions" />
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : userTransactions.length === 0 ? (
        <p className="text-gray-400">No transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {userTransactions.map((tx, index) => (
            <li key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
              <p><strong>From:</strong> {tx.senderName}</p>
              <p><strong>To:</strong> {tx.receiverName}</p>
              <p><strong>Amount:</strong> {tx.amount} ETH</p>
              <p><strong>Message:</strong> {tx.message}</p>
              <p><strong>Timestamp:</strong> {new Date(tx.timestamp * 1000).toLocaleString()}</p>
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