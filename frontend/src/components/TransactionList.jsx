import React from "react";
import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, userAddress, refund, loading }) => {
  return (
    <div>
      <h3 className="text-xl mt-6">Recent Transactions</h3>
      {transactions.length > 0 ? (
        transactions.map((tx, index) => (
          <TransactionItem key={index} tx={tx} userAddress={userAddress} refund={refund} loading={loading} />
        ))
      ) : (
        <p>No recent transactions</p>
      )}
    </div>
  );
};

export default TransactionList;
