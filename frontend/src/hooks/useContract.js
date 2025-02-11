import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundTransferABI from "../contracts/FundTransfer.json";

const contractAddress = "0x8fB146232154f2456bCC9d0BD17353686b5F4864";

const useContract = () => {
  const [transactions, setTransactions] = useState([]);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    fetchUserAddress();
    fetchTransactions();
  }, []);

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, FundTransferABI.abi, signer);
  };

  const fetchUserAddress = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setUserAddress(await signer.getAddress());
    }
  };

  const fetchTransactions = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask!");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, FundTransferABI.abi, provider);
      const txs = await contract.getAllTransactions();

      setTransactions(
        txs.map(tx => ({
          sender: tx.sender,
          receiver: tx.receiver,
          amount: ethers.formatEther(tx.amount),
          message: tx.message,
          timestamp: new Date(Number(tx.timestamp) * 1000).toLocaleString(),
          claimed: tx.claimed,
          refunded: tx.refunded,
        }))
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return { transactions, fetchTransactions, getContract, userAddress };
};

export default useContract;
