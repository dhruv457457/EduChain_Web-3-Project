import React from "react";
import LoaderButton from "../Global/LoaderButton";

const TransactionItem = ({ tx, userAddress, pending, loading }) => {
  return (
    <div className="p-2 mt-3 text-white border border-gray-700 bg-gray-800 rounded-md w-auto flex flex-col items-start">
      <p><strong>Sender:</strong> {tx.sender}</p>
      <p><strong>Receiver:</strong> {tx.receiver}</p>
      <p><strong>Amount:</strong> {tx.amount} ETH</p> {/* Remove Number(tx.amount) / 10 ** 18 */}
      <p><strong>Message:</strong> {tx.message}</p>
      <p><strong>Timestamp:</strong> {new Date(Number(tx.timestamp) * 1000).toLocaleString()}</p>
      {!tx.claimed && tx.sender.toLowerCase() === userAddress.toLowerCase() && (
        <LoaderButton onClick={() => pending(tx)} loading={loading} text="Pending" color="red" />
      )}
    </div>
  );
};

export default TransactionItem;