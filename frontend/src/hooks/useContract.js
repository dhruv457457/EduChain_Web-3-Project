import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";

const contractAddress = "0x9c2ed62ab722d8eEb6eDeab06f9464EdfCaf46Dd";

const useContract = () => {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAccount = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
          fetchBalance(address);
        } catch (error) {
          console.error("Error fetching user account:", error);
        }
      }
    };
    fetchAccount();
  }, []);

  // Get contract instance
  const getContract = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed!");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, FundTransferWithRegistryABI.abi, signer);
  };

  // Fetch transactions from the blockchain
  const fetchTransactions = async () => {
    try {
      const contract = await getContract();
      const txs = await contract.getAllTransactions();
      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch user's ETH balance
  const fetchBalance = async (address) => {
    if (!window.ethereum) {
      console.error("MetaMask is not installed!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      setBalance(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return { getContract, userAddress, balance, transactions, fetchTransactions, fetchBalance };
};

export default useContract;
