import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";

const contractAddress = "0xD77d3395C47395723bEa144638c7D3c7718835b5";

const useContract = () => {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]); // New state for user-specific transactions

  useEffect(() => {
    const fetchAccount = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
          fetchBalance(address);
          fetchUserTransactions(address); // Fetch user's own transactions on login
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

  // Fetch all transactions (public)
  const fetchTransactions = async () => {
    try {
      const contract = await getContract();
      const txs = await contract.getAllTransactions();
      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch logged-in user's transactions
  const fetchUserTransactions = async (address) => {
    if (!address) {
      console.error("Invalid address provided for fetching transactions.");
      return;
    }
    
    try {
      const contract = await getContract();
      const userTxs = await contract.getUserTransactions(address);
      setUserTransactions(userTxs);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
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

  return { 
    getContract, 
    userAddress, 
    balance, 
    transactions, 
    fetchTransactions, 
    fetchBalance, 
    userTransactions, // Expose user transactions
    fetchUserTransactions 
  };
};

export default useContract;
