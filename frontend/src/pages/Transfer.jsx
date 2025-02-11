import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import useContract from "../hooks/useContract";
import TransferForm from "../components/TransferForm";
import TransactionList from "../components/TransactionList";
import ClaimButton from "../components/ClaimButton";
import { ethers } from "ethers";

const Transfer = () => {
  const { transactions, fetchTransactions, getContract, userAddress } = useContract();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendFunds = async () => {
    if (!window.ethereum) return toast.error("🦊 Please install MetaMask!");

    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.sendFunds(recipient, message, {
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      toast.success(`✅ Transfer successful! TX: ${tx.hash}`);
      setRecipient(""); setAmount(""); setMessage("");
      fetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error("❌ Transaction failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} />
      <TransferForm {...{ recipient, setRecipient, amount, setAmount, message, setMessage, sendFunds, loading }} />
      <ClaimButton />
      <TransactionList {...{ transactions, userAddress }} />
    </>
  );
};

export default Transfer;
