import React, { useState } from "react";
import TransactionItem from "./TransactionItem";
import LoaderButton from "../Global/Loader"; // ✅ Make sure this path is correct
import "./customScrollbar.css";

const TransactionList = ({
  transactions = [],
  userAddress,
  refund,
  loading,
}) => {
  const [sortType, setSortType] = useState("newest");

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortType === "newest") return Number(b.timestamp) - Number(a.timestamp);
    if (sortType === "oldest") return Number(a.timestamp) - Number(b.timestamp);
    if (sortType === "highest") return Number(b.amount) - Number(a.amount);
    if (sortType === "lowest") return Number(a.amount) - Number(b.amount);
    return 0;
  });

  const sortOptions = [
    { label: "🕒 Newest", value: "newest" },
    { label: "⏳ Oldest", value: "oldest" },
    { label: "💰 Highest", value: "highest" },
    { label: "💵 Lowest", value: "lowest" },
  ];

  return (
    <div className="px-4 sm:px-10 lg:pr-40" data-driver="transaction-list">
      <div className="flex flex-col rounded-md bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 shadow-custom-purple py-5 px-6 sm:px-5 mt-10 sm:mt-14 md:min-h-[450px] md:min-w-[470px]">
        <div className="flex flex-col sm:items-center sm:justify-between gap-3">
          <h3 className="text-xl text-white font-bold">Recent Transactions</h3>

          {/* Sort Buttons */}
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortType(option.value)}
                className={`px-3 py-1 rounded-full text-sm border transition-all ${
                  sortType === option.value
                    ? "bg-purple-600 border-purple-400 text-white"
                    : "bg-transparent border-purple-300 text-purple-200 hover:bg-purple-500/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="mt-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar w-full">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoaderButton loading={true} text="Loading transactions..." />
            </div>
          ) : sortedTransactions.length > 0 ? (
            sortedTransactions.map((tx, index) => (
              <TransactionItem
                key={index}
                tx={tx}
                userAddress={userAddress}
                refund={refund || (() => {})}
                loading={loading}
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-40">
            <LoaderButton loading={true} text="Loading transactions..." />
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
