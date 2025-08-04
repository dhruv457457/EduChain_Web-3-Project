import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import useContract from "../hooks/useContract";
import TransferForm from "../components/TransferModule/TransferForm";
import TransactionList from "../components/TransferModule/TransactionList";
import { useWallet } from "../components/Global/WalletContext";
import { useNavigate, useLocation } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Transfer = () => {
  const { walletData } = useWallet();
  const {
    transactions,
    fetchTransactions,
    claimFunds,
    sendFunds,
    sendFundsToAddress,
    isLoading, // Using the main loading state from the hook
  } = useContract(walletData?.provider);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAddress, setIsAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Local state for form submission

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (walletData?.address) {
      fetchTransactions();
    }
  }, [walletData?.address, fetchTransactions]);

  const validateInputs = () => {
    // Validation logic is unchanged
    if (!recipient || recipient.trim() === "") {
      toast.error("❌ Enter a valid recipient username or address!");
      return false;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("❌ Please enter a valid amount!");
      return false;
    }
    if (isAddress && !ethers.isAddress(recipient)) {
      toast.error("❌ Invalid Ethereum address!");
      return false;
    }
    return true;
  };

  const handleSendFunds = async () => {
    // Sending logic is unchanged
    if (!walletData?.provider) {
      toast.error("🦊 Please connect your wallet!");
      return;
    }
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      let tx;
      if (isAddress) {
        tx = await sendFundsToAddress(recipient, amount, message);
      } else {
        tx = await sendFunds(recipient, amount, message);
      }
      const waitingToastId = toast.info(
        "⏳ Waiting for transaction confirmation...",
        { autoClose: false }
      );
      await tx.wait();
      toast.dismiss(waitingToastId);
      setRecipient("");
      setAmount("");
      setMessage("");
      await fetchTransactions();
      toast.success("✅ Transfer successful!");
    } catch (error) {
      toast.dismiss();
      console.error("❌ Transaction error:", error);
      toast.error(
        `❌ Transaction failed! ${
          error.reason || error.message || "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Tour logic is unchanged
    const shouldStartTransactionTour = localStorage.getItem(
      "startTransactionTour"
    );
    if (shouldStartTransactionTour === "true") {
      // ... tour initialization ...
    }
  }, [navigate, location.pathname]);

  return (
    <div className="bg-[#0B0E1F] min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      
        {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]" />
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />

      <ToastContainer position="top-right" autoClose={5000} />
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
        <div className="lg:col-span-2">
          <TransferForm
            recipient={recipient}
            setRecipient={setRecipient}
            amount={amount}
            setAmount={setAmount}
            message={message}
            setMessage={setMessage}
            sendFunds={handleSendFunds}
            claimFunds={claimFunds}
            loading={isSubmitting} // Use local submitting state for the form button
            isAddress={isAddress}
            setIsAddress={setIsAddress}
          />
        </div>
        <div className="lg:col-span-3">
          <TransactionList
            transactions={transactions}
            userAddress={walletData?.address}
            loading={isLoading && transactions.length === 0} // Show loader only on initial fetch
          />
        </div>
      </main>
    </div>
  );
};

export default Transfer;