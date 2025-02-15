import React from "react";
import TransactionItem from "./TransactionItem";
import "./customScrollbar.css"; // Import custom CSS for scrollbar

const TransactionList = ({ transactions, userAddress, refund, loading }) => {
  return (
    <div className="px-4 sm:px-10 lg:pr-40">
      <div className="flex flex-col border-b-4 border-customPurple rounded-md bg-customDark py-5 px-6 sm:px-10 mt-10 sm:mt-14 shadow-custom-purple md:min-h-[450px] md:min-w-[470px]">
        <h3 className="text-xl text-white font-bold">Recent Transactions</h3>

        {/* Scrollable container with custom scrollbar */}
        <div className="mt-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar w-full">
          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <TransactionItem
                key={index}
                tx={tx}
                userAddress={userAddress}
                refund={refund || (() => {})} // ✅ Ensure refund has a default function
                loading={loading}
              />
            ))
          ) : (
            <p className="text-white">No recent transactions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
