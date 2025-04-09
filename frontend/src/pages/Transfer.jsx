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
import LoaderButton from "../components/Global/Loader"; // Updated import

const Transfer = () => {
  const { walletData } = useWallet();
  const {
    transactions,
    fetchTransactions,
    claimFunds,
    sendFunds,
    sendFundsToAddress,
  } = useContract(walletData?.provider);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAddress, setIsAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransactionsLoaded, setIsTransactionsLoaded] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      if (walletData?.address) {
        try {
          await fetchTransactions();
          setIsTransactionsLoaded(true);
        } catch (error) {
          console.error("Error loading transactions:", error);
          toast.error("Failed to load transactions!");
          setIsTransactionsLoaded(true); // Still set to true to prevent infinite loading
        }
      } else {
        setIsTransactionsLoaded(true); // If no wallet, mark as loaded
      }
    };
    loadTransactions();
  }, [walletData?.address, fetchTransactions]);

  const validateInputs = () => {
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
    if (!walletData?.provider) {
      toast.error("🦊 Please connect your wallet!");
      return;
    }
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const amountInWei = ethers.parseEther(amount);
      let tx;

      if (isAddress) {
        console.log(`💰 Sending ${amount} ETH to address ${recipient}...`);
        tx = await sendFundsToAddress(recipient, amount, message);
      } else {
        console.log(`💰 Sending ${amount} ETH to username ${recipient}...`);
        tx = await sendFunds(recipient, amount, message);
      }

      console.log("🔍 Transaction object:", tx);
      console.log("🔄 Transaction sent. Waiting for confirmation...");
      const receipt = await tx.wait();
      console.log("🔍 Transaction receipt:", receipt);
      const txHash = receipt.transactionHash || receipt.hash || tx.hash; // Fallbacks

      toast.success(`✅ Transfer successful! TX: ${txHash}`);
      setRecipient("");
      setAmount("");
      setMessage("");
      fetchTransactions();
    } catch (error) {
      console.error("❌ Transaction error:", error);
      toast.error(
        `❌ Transaction failed! ${
          error.reason || error.message || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const shouldStartTransactionTour = localStorage.getItem(
      "startTransactionTour"
    );
    if (shouldStartTransactionTour === "true") {
      localStorage.removeItem("startTransactionTour");

      const transactionTour = new driver({
        showProgress: true,
        showButtons: true,
        allowClose: true,
        opacity: 0.1,
        stageBackground: "rgba(0, 0, 0, 0.6)",
        highlightedClass: "driver-highlight",
        steps: [
          {
            element: '[data-driver="transfer-form"]',
            popover: {
              title: "Transfer Funds Form 📝",
              description:
                "Fill in the recipient, amount, and message to send funds.",
              position: "bottom",
            },
          },
          {
            element: '[data-driver="transaction-list"]',
            popover: {
              title: "Your Transactions 📂",
              description: "View all the transactions anyone have made.",
              position: "bottom",
            },
          },
        ],
        onDestroyed: () => {
          console.log(
            "Transaction tour finished, navigating to contract page..."
          );
          localStorage.setItem("startContractTour", "true");
          setTimeout(() => navigate("/contract"), 100);
        },
      });

      setTimeout(() => transactionTour.drive(), 1000);
    }
  }, [navigate, location.pathname]);

  // Show loader if transactions aren't loaded yet or during a transfer
  if (!isTransactionsLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-customDarkpurple">
        <div className="w-full max-w-md">
          <LoaderButton
            loading={true}
            text={loading ? "Processing Transfer..." : "Loading Transactions..."}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex flex-col bg-customDarkpurple justify-center items-center md:flex-row py-20 lg:max-h-screen">
        <TransferForm
          data-driver="transfer-form"
          recipient={recipient}
          setRecipient={setRecipient}
          amount={amount}
          setAmount={setAmount}
          message={message}
          setMessage={setMessage}
          sendFunds={handleSendFunds}
          claimFunds={claimFunds}
          loading={loading}
          isAddress={isAddress}
          setIsAddress={setIsAddress}
        />
        <TransactionList
          data-driver="transaction-list"
          transactions={transactions}
          userAddress={walletData?.address}
        />
      </div>
    </>
  );
};

export default Transfer;