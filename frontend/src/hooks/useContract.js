import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";

const FUND_TRANSFER_ADDRESS = "0x20a4BEe5E72Cd0842bba1407230C7B2bFCaa0fe3";

const useContract = (provider) => {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!provider) return;
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
        fetchBalance(address);
        fetchUserTransactions(address);
      } catch (error) {
        console.error("Error fetching user account:", error);
      }
    };
    fetchAccount();
  }, [provider]);

  const getContract = async (contractAddress = FUND_TRANSFER_ADDRESS, contractABI = FundTransferWithRegistryABI.abi) => {
    if (!provider) throw new Error("Wallet not connected. Please connect via Navbar."); // Line 33
    try {
      const signer = await provider.getSigner();
      return new ethers.Contract(contractAddress, contractABI, signer);
    } catch (error) {
      console.error("Error getting contract:", error);
      throw error;
    }
  };

  const fetchTransactions = async () => {
    if (!provider) return;
    setIsLoading(true);
    try {
      const contract = await getContract();
      const txs = await contract.getAllTransactions();
      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTransactions = async (address) => {
    if (!provider || !address) return;
    try {
      const contract = await getContract();
      const userTxs = await contract.getUserTransactions(address);
      setUserTransactions(userTxs);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
    }
  };

  const fetchBalance = async (address) => {
    if (!provider || !address) return;
    try {
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
    userTransactions,
    fetchUserTransactions,
    isLoading,
  };
};

export default useContract;