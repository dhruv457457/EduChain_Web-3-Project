import React, { useState } from "react";
import TransactionItem from "./TransactionItem";
import "./customScrollbar.css"; // Custom scrollbar styles

const TransactionList = ({
  transactions = [],
  userAddress,
  refund,
  loading,
}) => {
  const [sortType, setSortType] = useState("newest"); // Default: Sort by newest

  // Sorting logic
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortType === "newest") {
      return Number(b.timestamp) - Number(a.timestamp); // Newest first
    } else if (sortType === "oldest") {
      return Number(a.timestamp) - Number(b.timestamp); // Oldest first
    } else if (sortType === "highest") {
      return Number(b.amount) - Number(a.amount); // Highest amount first
    } else if (sortType === "lowest") {
      return Number(a.amount) - Number(b.amount); // Lowest amount first
    }
    return 0;
  });

  return (
    <div className="px-4 sm:px-10 lg:pr-40" data-driver="transaction-list">
      <div className="flex flex-col rounded-md bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 shadow-custom-purple py-5 px-6 sm:px-5 mt-10 sm:mt-14 md:min-h-[450px] md:min-w-[470px]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl text-white font-bold">Recent Transactions</h3>
          <select
            className="p-2 bg-customPurple text-white rounded-md outline-none cursor-pointer"
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="newest">🕒 Newest First</option>
            <option value="oldest">⏳ Oldest First</option>
            <option value="highest">💰 Highest Amount</option>
            <option value="lowest">💵 Lowest Amount</option>
          </select>
        </div>

        {/* Scrollable Transaction List */}
        <div className="mt-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar w-full">
          {sortedTransactions.length > 0 ? (
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
            <p className="text-white">Please Connect the Wallet to Show Recent Transactions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
