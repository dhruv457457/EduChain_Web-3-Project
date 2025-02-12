import React from "react";
import LoaderButton from "./LoaderButton";

const TransactionItem = ({ tx, userAddress, refund, loading }) => {
  return (
    <div className="p-2 mt-3 text-white bg-customInput border-2 border-customPurple rounded-md w-auto flex flex-col items-start">
      <p><strong>Sender:</strong> {tx.sender}</p>
      <p><strong>Receiver:</strong> {tx.receiver}</p>
      <p><strong>Amount:</strong> {BigInt(tx.amount).toString()} ETH</p> {/* ✅ Fixed variable name */}
      <p><strong>Message:</strong> {tx.message}</p>
      <p><strong>Timestamp:</strong> {new Date(Number(tx.timestamp) * 1000).toLocaleString()}</p> {/* ✅ Safe conversion */}

      {!tx.claimed && tx.sender.toLowerCase() === userAddress.toLowerCase() && (
        <LoaderButton onClick={() => refund(tx)} loading={loading} text="Refund" color="red" />
      )}
    </div>
  );
};

export default TransactionItem;
