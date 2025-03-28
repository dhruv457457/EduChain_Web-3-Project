import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import useContract from "../hooks/useContract";
import TransferForm from "../components/TransferForm";
import TransactionList from "../components/TransactionList";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";
import { useWallet } from "../components/WalletContext";

const fundTransferAddress = "0x31bCF4cC0c6c7F13Ab92260FAdc8BCeFFBfEef5c";

const Transfer = () => {
  const { walletData } = useWallet();
  const { transactions, fetchTransactions, getContract, userAddress } = useContract(walletData?.provider);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    return true;
  };

  const sendFunds = async () => {
    if (!walletData?.provider) {
      toast.error("🦊 Please connect your wallet!");
      return;
    }
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const contract = await getContract(fundTransferAddress, FundTransferWithRegistryABI.abi);
      if (!contract) {
        toast.error("❌ Contract instance not found!");
        return;
      }

      const amountInWei = ethers.parseEther(amount);
      console.log(`💰 Sending ${amount} ETH to ${recipient}...`);
      const tx = await contract.sendFunds(recipient, message, { value: amountInWei });
      console.log("🔄 Transaction sent. Waiting for confirmation...");
      await tx.wait();

      toast.success(`✅ Transfer successful! TX: ${tx.hash}`);
      setRecipient("");
      setAmount("");
      setMessage("");
      fetchTransactions();
    } catch (error) {
      console.error("❌ Transaction error:", error);
      toast.error(`❌ Transaction failed! ${error.reason || error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex flex-col bg-customSemiPurple justify-between md:flex-row py-20">
        <TransferForm
          recipient={recipient}
          setRecipient={setRecipient}
          amount={amount}
          setAmount={setAmount}
          message={message}
          setMessage={setMessage}
          sendFunds={sendFunds}
          loading={loading}
        />
        <TransactionList transactions={transactions} userAddress={walletData?.address} />
      </div>
    </>
  );
};

export default Transfer;