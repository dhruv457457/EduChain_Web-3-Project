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
  setIsAddress, // Add toggle props
}) => {
  return (
    <div
      className="px-4 sm:px-10 lg:pl-36 py-20 w-full flex justify-center"
      data-driver="transfer-form"
    >
      <div className="border-b-4 border-customPurple rounded-md px-6 sm:px-10 py-8 bg-customDark flex flex-col items-center gap-5 shadow-custom-purple w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">
          Transfer Funds
        </h2>

        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            placeholder={
              isAddress ? "Receiver Address (0x...)" : "Receiver UserName"
            }
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border border-customPurple p-2 rounded-md w-full bg-customInput text-cyan-50"
          />
          <button
            onClick={() => setIsAddress(!isAddress)}
            className="bg-customPurple text-white px-2 py-1 rounded-md hover:bg-customLightPurple transition-all"
          >
            {isAddress ? "Use Username" : "Use Address"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-customPurple p-2 rounded-md w-full bg-customInput text-cyan-50"
        />

        <input
          type="text"
          placeholder="Remark/Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-customPurple p-2 rounded-md w-full bg-customInput text-cyan-50"
        />

        <LoaderButton
          onClick={sendFunds}
          loading={loading}
          text="Send Funds"
          color="customPurple"
        />

        <ClaimButton claimFunds={claimFunds} />
      </div>
    </div>
  );
};

export default TransferForm;
