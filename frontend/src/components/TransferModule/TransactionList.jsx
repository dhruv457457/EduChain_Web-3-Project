import React, { useState } from "react";
import TransactionItem from "./TransactionItem";
import Loader from "../Global/Loader";
import "./customScrollbar.css";

const TransactionList = ({ transactions = [], userAddress, loading }) => {
  const [sortType, setSortType] = useState("newest");

  const sortedTransactions = [...transactions].sort((a, b) => {
    // Sorting logic is unchanged
    if (sortType === "newest") return Number(b.timestamp) - Number(a.timestamp);
    if (sortType === "oldest") return Number(a.timestamp) - Number(b.timestamp);
    if (sortType === "highest") return Number(b.amount) - Number(a.amount);
    if (sortType === "lowest") return Number(a.amount) - Number(b.amount);
    return 0;
  });

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Highest", value: "highest" },
    { label: "Lowest", value: "lowest" },
  ];

  return (
    <div
      className="bg-[#16192E] p-6 rounded-lg border border-gray-700/50 text-white h-full"
      data-driver="transaction-list"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold text-white">Transactions</h3>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortType(option.value)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${
                sortType === option.value
                  ? "bg-primary text-white"
                  : "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : sortedTransactions.length > 0 ? (
          <ul className="space-y-3">
            {sortedTransactions.map((tx, index) => (
              <TransactionItem key={index} tx={tx} userAddress={userAddress} />
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">No transactions recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;