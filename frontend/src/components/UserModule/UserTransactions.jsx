import React, { useEffect, useState } from "react";
import useContract from "../../hooks/useContract";
import LoaderButton from "../Global/Loader";

const UserTransactions = ({ provider }) => {
  const { userTransactions, fetchUserTransactions, userAddress } =
    useContract(provider);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

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

  const filteredTransactions = userTransactions.filter((tx) => {
    if (filter === "All") return true;
    if (filter === "Claimed") return tx.claimed;
    if (filter === "Pending") return !tx.claimed;
    return true;
  });

  return (
    <div className="rounded-md bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 shadow-custom-purple p-5 text-white">
      <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["All", "Claimed", "Pending"].map((btn) => (
          <button
            key={btn}
            onClick={() => setFilter(btn)}
            className={`px-4 py-1 rounded-full text-sm border transition ${
              filter === btn
                ? "bg-purple-600 border-purple-400 text-white"
                : "bg-transparent border-purple-300 text-purple-200 hover:bg-purple-500/20"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="max-h-44 lg:min-h-44 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <LoaderButton loading={true} text="Loading Transactions" />
          </div>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-400">No transactions found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredTransactions.map((tx, index) => (
              <li
                key={index}
                className="p-4 rounded-lg bg-customPurple/10 backdrop-blur-md border border-customPurple/20"
              >
                <p>
                  <strong>From:</strong> {tx.senderName}
                </p>
                <p>
                  <strong>To:</strong> {tx.receiverName}
                </p>
                <p>
                  <strong>Amount:</strong> {tx.amount} ETH
                </p>
                <p>
                  <strong>Message:</strong> {tx.message}
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(tx.timestamp * 1000).toLocaleString()}
                </p>
                <p
                  className={tx.claimed ? "text-green-400" : "text-yellow-400"}
                >
                  {tx.claimed ? "✅ Claimed" : "⏳ Pending"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserTransactions;
