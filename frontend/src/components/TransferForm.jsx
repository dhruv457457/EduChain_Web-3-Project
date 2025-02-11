import React from "react";
import LoaderButton from "./LoaderButton";

const TransferForm = ({ recipient, setRecipient, amount, setAmount, message, setMessage, sendFunds, loading }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Transfer Funds</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Remark/Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <LoaderButton onClick={sendFunds} loading={loading} text="Send Funds" color="green" />
    </div>
  );
};

export default TransferForm;
