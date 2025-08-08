import React from "react";
import LoaderButton from "../Global/LoaderButton";
import ClaimButton from "./ClaimButton";

const TransferForm = ({
  recipient,
  setRecipient,
  amount,
  setAmount,
  message,
  setMessage,
  sendFunds,
  loading,
  claimFunds,
  isAddress,
  setIsAddress,
}) => {
  return (
    <div
      className="bg-black/20 p-6 rounded-lg border border-gray-700/50 text-white h-full"
      data-driver="transfer-form"
    >
      <h2 className="text-xl font-bold mb-6">Send Funds</h2>

      <div className="space-y-5">
        {/* Toggle Section */}
        <div className="bg-gray-900/60 rounded-md p-1 flex">
          <button
            onClick={() => setIsAddress(false)}
            className={`w-1/2 py-2 text-sm font-semibold rounded transition-all duration-300 ${
              !isAddress ? "bg-primary text-white" : "text-gray-400"
            }`}
          >
            Username
          </button>
          <button
            onClick={() => setIsAddress(true)}
            className={`w-1/2 py-2 text-sm font-semibold rounded transition-all duration-300 ${
              isAddress ? "bg-primary text-white" : "text-gray-400"
            }`}
          >
            Address
          </button>
        </div>

        <input
          type="text"
          placeholder={isAddress ? "Receiver Address (0x...)" : "Receiver Username"}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-900/50 text-white border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />

        <input
          type="text" // Keep as text to allow for easier validation of numeric/non-numeric input
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-900/50 text-white border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />

        <input
          type="text"
          placeholder="Message / Memo (Optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-900/50 text-white border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />

        <LoaderButton
          onClick={sendFunds}
          loading={loading}
          text="Send"
          color="blue"
        />

        <ClaimButton claimFunds={claimFunds} />
      </div>
    </div>
  );
};

export default TransferForm;