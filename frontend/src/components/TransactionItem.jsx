import React from "react";
import LoaderButton from "./LoaderButton";

const TransactionItem = ({ tx, userAddress, refund, loading }) => {
  return (
    <div className=" p-2 mt-3 text-white bg-customInput border-2 border-customPurple rounded-md w-auto flex flex-col items-start">
      <p><strong>Sender:</strong> {tx.sender}</p>
      <p><strong>Receiver:</strong> {tx.receiver}</p>
      <p><strong>Amount:</strong> {tx.amount} ETH</p>
      <p><strong>Message:</strong> {tx.message}</p>
      <p><strong>Timestamp:</strong> {tx.timestamp}</p>

      {!tx.claimed && tx.sender.toLowerCase() === userAddress.toLowerCase() && (
        <LoaderButton onClick={() => refund(tx.receiver)} loading={loading} text="Refund" color="red" />
      )}
    </div>
  );
};

export default TransactionItem;
