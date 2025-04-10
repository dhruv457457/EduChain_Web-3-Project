import React from "react";

const TransactionItem = ({ tx, userAddress }) => {
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}*****${address.slice(-4)}`;
  };

  const isSender = tx.sender.toLowerCase() === userAddress.toLowerCase();

  return (
    <div className="p-5 mt-4 rounded-xl w-full bg-customPurple/10 backdrop-blur-md border border-customPurple/20 shadow-lg text-white">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-customPurple">
          {tx.claimed ? (
            <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium">
              ✅ Claimed
            </span>
          ) : isSender ? (
            <span className="px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-xs font-medium animate-pulse">
              ⏳ Pending
            </span>
          ) : (
            <span className="px-3 py-1 bg-gray-600/20 text-gray-300 rounded-full text-xs font-medium">
              📦 Received
            </span>
          )}
        </p>
        <p className="text-xs opacity-70">
          {new Date(Number(tx.timestamp) * 1000).toLocaleString()}
        </p>
      </div>

      <p>
        <strong>Sender:</strong> {shortenAddress(tx.sender)}
      </p>
      <p>
        <strong>Receiver:</strong> {shortenAddress(tx.receiver)}
      </p>
      <p>
        <strong>Amount:</strong> {tx.amount} ETH
      </p>
      <p>
        <strong>Message:</strong> {tx.message || "—"}
      </p>
    </div>
  );
};

export default TransactionItem;
