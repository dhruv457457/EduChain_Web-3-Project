import React from "react";
import LoaderButton from "../Global/LoaderButton";

const TransactionItem = ({ tx, userAddress, pending, loading }) => {
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}*****${address.slice(-4)}`;
  };

  return (
    <div className="p-4 mt-4 rounded-xl w-auto bg-customPurple/10 backdrop-blur-md border border-customPurple/20 shadow-lg text-white">
      <p>
        <strong>Sender:</strong> {shortenAddress(tx.sender)}
      </p>
      <p>
        <strong>Receiver:</strong>
        {shortenAddress(tx.receiver)}
      </p>
      <p>
        <strong>Amount:</strong> {tx.amount} ETH
      </p>{" "}
      {/* Remove Number(tx.amount) / 10 ** 18 */}
      <p>
        <strong>Message:</strong> {tx.message}
      </p>
      <p>
        <strong>Timestamp:</strong>{" "}
        {new Date(Number(tx.timestamp) * 1000).toLocaleString()}
      </p>
      {!tx.claimed && tx.sender.toLowerCase() === userAddress.toLowerCase() && (
        <LoaderButton
          onClick={() => pending(tx)}
          loading={loading}
          text="Pending"
          color="red"
        />
      )}
    </div>
  );
};

export default TransactionItem;
