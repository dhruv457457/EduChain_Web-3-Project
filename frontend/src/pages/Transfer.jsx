import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import useContract from "../hooks/useContract";
import TransferForm from "../components/TransferModule/TransferForm";
import TransactionList from "../components/TransferModule/TransactionList";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";
import { useWallet } from "../components/Global/WalletContext";
import { useNavigate, useLocation } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const fundTransferAddress = "0x31bCF4cC0c6c7F13Ab92260FAdc8BCeFFBfEef5c";

const Transfer = () => {
  const { walletData } = useWallet();
  const {
    transactions,
    fetchTransactions,
    getContract,
    userAddress,
    claimFunds,
    sendFunds,
    sendFundsToAddress,
  } = useContract(walletData?.provider); // Add sendFundsToAddress
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAddress, setIsAddress] = useState(false); // Toggle for address vs username
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current pathname

  useEffect(() => {
    if (walletData?.address) {
      fetchTransactions();
    }
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
        tx = await sendFundsToAddress(recipient, amount, message); // Use sendFundsToAddress
      } else {
        console.log(`💰 Sending ${amount} ETH to username ${recipient}...`);
        tx = await sendFunds(recipient, amount, message); // Use sendFunds
      }

      console.log("🔄 Transaction sent. Waiting for confirmation...");
      await tx.wait();

      toast.success(`✅ Transfer successful! TX: ${tx.hash}`);
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
          localStorage.setItem("startContractTour", "true"); // Set flag for Contract tour
          setTimeout(() => navigate("/contract"), 100);
        },
      });

      // 🔹 Increase delay to 1000ms to ensure components are rendered
      setTimeout(() => transactionTour.drive(), 1000);
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex flex-col bg-customSemiPurple justify-between md:flex-row py-20">
        <TransferForm
          data-driver="transfer-form"
          recipient={recipient}
          setRecipient={setRecipient}
          amount={amount}
          setAmount={setAmount}
          message={message}
          setMessage={setMessage}
          sendFunds={handleSendFunds} // Renamed to avoid confusion
          claimFunds={claimFunds}
          loading={loading}
          isAddress={isAddress}
          setIsAddress={setIsAddress} // Pass toggle state
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
