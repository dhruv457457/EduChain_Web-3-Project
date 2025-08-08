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
        }
      } catch (err) {
        setError("Failed to load transactions.");
      } finally {
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

  const shortenAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "N/A";

  return (
    <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 text-white h-full">
      <h2 className="text-xl font-bold mb-4">Activity Feed</h2>

      <div className="flex gap-2 mb-4">
        {["All", "Claimed", "Pending"].map((btn) => (
          <button
            key={btn}
            onClick={() => setFilter(btn)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              filter === btn
                ? "bg-primary text-white"
                : "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <LoaderButton loading={true} text="Loading Transactions" />
          </div>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            No transactions found.
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredTransactions.map((tx, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-black/15 hover:bg-black/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      tx.claimed ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <div>
                    <p className="font-semibold text-sm text-gray-200">
                      {tx.sender.toLowerCase() === userAddress.toLowerCase()
                        ? `Sent to ${
                            tx.receiverName || shortenAddress(tx.receiver)
                          }`
                        : `Received from ${
                            tx.senderName || shortenAddress(tx.sender)
                          }`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.timestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-sm ${
                      tx.sender.toLowerCase() === userAddress.toLowerCase()
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {tx.sender.toLowerCase() === userAddress.toLowerCase()
                      ? "-"
                      : "+"}
                    {tx.amount} ETH
                  </p>
                  <p
                    className={`text-xs font-semibold ${
                      tx.claimed ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {tx.claimed ? "Completed" : "Pending"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserTransactions;