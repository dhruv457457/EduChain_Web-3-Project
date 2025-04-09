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
      className="px-4 sm:px-10 lg:pl-36 pt-16 w-full flex justify-center"
      data-driver="transfer-form"
    >
      <div className="rounded-md px-6 sm:px-10 py-10 bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 shadow-custom-purple flex flex-col items-center gap-5 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">
          Transfer Funds
        </h2>

        {/* Toggle Section */}
        <div className="w-full mb-2">
          <div className="bg-customPurple/20 rounded-full p-1 flex justify-between items-center w-full relative">
            <button
              className={`w-1/2 py-2 z-10 font-semibold transition-colors duration-300 rounded-full ${
                isAddress ? "text-white" : "text-customPurple"
              }`}
              onClick={() => setIsAddress(true)}
            >
              Address
            </button>
            <button
              className={`w-1/2 py-2 z-10 font-semibold transition-colors duration-300 rounded-full ${
                !isAddress ? "text-white" : "text-customPurple"
              }`}
              onClick={() => setIsAddress(false)}
            >
              Username
            </button>

            {/* Animated Toggle Background */}
            <div
              className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-1/2 rounded-full bg-customPurple transition-all duration-300 ${
                isAddress ? "translate-x-0" : "translate-x-full"
              }`}
            ></div>
          </div>
        </div>

        <input
          type="text"
          placeholder={
            isAddress ? "Receiver Address (0x...)" : "Receiver UserName"
          }
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="border border-customPurple/30 p-2 rounded-md w-full bg-customInput text-cyan-50"
        />

        <input
          type="text"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-customPurple/30 p-2 rounded-md w-full bg-customInput text-cyan-50"
        />

        <input
          type="text"
          placeholder="Remark/Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-customPurple/30 p-2 rounded-md w-full bg-customInput text-cyan-50"
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
