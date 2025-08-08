import React from "react";
import { ArrowUpRight, ArrowDownLeft, Check, Clock } from "lucide-react";

const TransactionItem = ({ tx, userAddress }) => {
  const shortenAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "N/A";

  const isSender = tx.sender.toLowerCase() === userAddress?.toLowerCase();

  const getStatus = () => {
    if (tx.claimed) {
      return {
        text: "Completed",
        icon: <Check size={14} className="text-green-400" />,
        color: "text-green-400",
      };
    }
    if (isSender) {
      return {
        text: "Pending",
        icon: <Clock size={14} className="text-yellow-400" />,
        color: "text-yellow-400",
      };
    }
    return {
      text: "Received",
      icon: <Check size={14} className="text-gray-400" />,
      color: "text-gray-400",
    };
  };

  const status = getStatus();

  return (
    <li className="flex items-center justify-between p-3 rounded-md bg-black/15 hover:bg-black/20 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-full ${
            isSender ? "bg-red-500/20" : "bg-green-500/20"
          }`}
        >
          {isSender ? (
            <ArrowUpRight size={16} className="text-red-400" />
          ) : (
            <ArrowDownLeft size={16} className="text-green-400" />
          )}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-200">
            {isSender
              ? `To: ${tx.receiverName || shortenAddress(tx.receiver)}`
              : `From: ${tx.senderName || shortenAddress(tx.sender)}`}
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
            {status.icon}
            {status.text}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-bold text-sm ${
            isSender ? "text-red-400" : "text-green-400"
          }`}
        >
          {isSender ? "-" : "+"}
          {tx.amount} ETH
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(Number(tx.timestamp) * 1000).toLocaleDateString()}
        </p>
      </div>
    </li>
  );
};

export default TransactionItem;