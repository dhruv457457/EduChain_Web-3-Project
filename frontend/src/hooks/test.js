import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";
import CRYPTIFY_FREELANCEABI from "../contracts/CryptifyFreelance.json";

const FUND_TRANSFER_ADDRESS = "0x20a4BEe5E72Cd0842bba1407230C7B2bFCaa0fe3";
const CRYPTIFY_FREELANCE_ADDRESS = "0x970fb171599BFEDf7A1943E49ECDa5a1Ab692c0e";

const useContract = () => {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);

  useEffect(() => {
    const fetchAccount = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
          fetchBalance(address);
          fetchUserTransactions(address);
        } catch (error) {
          console.error("Error fetching user account:", error);
        }
      }
    };
    fetchAccount();
  }, []);

  // 🔹 Get FundTransfer Contract
  const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask is not installed!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(FUND_TRANSFER_ADDRESS, FundTransferWithRegistryABI.abi, signer);
  };
  const fetchFreelancers = async () => {
    try {
      const contract = await getCryptifyContract();
      const freelancerList = await contract.getAllFreelancers();
      console.log("Fetched freelancers:", freelancerList);
      return freelancerList;
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      return [];
    }
  };
  
  // 🔹 Get CryptifyFreelance Contract
  const getCryptifyContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask is not installed!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CRYPTIFY_FREELANCE_ADDRESS, CRYPTIFY_FREELANCEABI.abi, signer);
  };

  // 🔹 Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const contract = await getContract();
      const txs = await contract.getAllTransactions();
      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // 🔹 Fetch User Transactions
  const fetchUserTransactions = async (address) => {
    if (!address) return;
    try {
      const contract = await getContract();
      const userTxs = await contract.getUserTransactions(address);
      setUserTransactions(userTxs);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
    }
  };

  // 🔹 Fetch Balance
  const fetchBalance = async (address) => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      setBalance(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // 🔹 Freelancer Registration
  const registerFreelancer = async (name, skills, profileLink, hourlyRate) => {
    try {
      const contract = await getCryptifyContract();
      const tx = await contract.registerFreelancer(name, skills, profileLink, hourlyRate);
      await tx.wait();
      console.log("Freelancer registered!");
    } catch (error) {
      console.error("Error registering freelancer:", error);
    }
  };

  // 🔹 Fetch Freelancer Details
  const getFreelancer = async (address) => {
    try {
      const contract = await getCryptifyContract();
      return await contract.getFreelancer(address);
    } catch (error) {
      console.error("Error fetching freelancer:", error);
    }
  };

  // 🔹 Fetch All Freelancers
  const getAllFreelancers = async () => {
    try {
      const contract = await getCryptifyContract();
      return await contract.getAllFreelancers();
    } catch (error) {
      console.error("Error fetching freelancers:", error);
    }
  };

  // 🔹 Update Freelancer Profile
  const updateFreelancerProfile = async (name, skills, profileLink, hourlyRate) => {
    try {
      const contract = await getCryptifyContract();
      const tx = await contract.updateFreelancerProfile(name, skills, profileLink, hourlyRate);
      await tx.wait();
      console.log("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // 🔹 Delete Freelancer Profile
  const deleteFreelancer = async () => {
    try {
      const contract = await getCryptifyContract();
      const tx = await contract.deleteFreelancer();
      await tx.wait();
      console.log("Freelancer profile deleted!");
    } catch (error) {
      console.error("Error deleting freelancer:", error);
    }
  };

  // 🔹 Create Work Contract
  const createContract = async (freelancer, amount, duration) => {
    try {
      const contract = await getCryptifyContract();
      const tx = await contract.createContract(freelancer, amount, duration, { value: ethers.parseEther(amount) });
      await tx.wait();
      console.log("Contract created!");
    } catch (error) {
      console.error("Error creating contract:", error);
    }
  };

  // 🔹 Approve Contract (Freelancer)
  const approveContract = async (contractId) => {
    try {
      const contract = await getCryptifyContract();
      const tx = await contract.approveContract(contractId);
      await tx.wait();
      console.log("Contract approved!");
    } catch (error) {
      console.error("Error approving contract:", error);
    }
  };

  // 🔹 Start Work (Client)
  const startWork = async (contractId) => {
    try {
      const contract = await getCryptifyContract();
      const tx = await contract.startWork(contractId);
      await tx.wait();
      console.log("Work started!");
    } catch (error) {
      console.error("Error starting work:", error);
    }
  };

  // 🔹 Complete Work (Freelancer)
  const completeWork = async (contractId) => {
    try {
      const contract = await getCryptifyContract();
      const tx = await contract.completeWork(contractId);
      await tx.wait();
      console.log("Work completed!");
    } catch (error) {
      console.error("Error completing work:", error);
    }
  };

  // 🔹 Release Funds for Contract (Client)
  const releaseFundsForContract = async (contractId) => {
    try {
      const contract = await getCryptifyContract();
      const tx = await contract.releaseFunds(contractId);
      await tx.wait();
      console.log("Funds released!");
    } catch (error) {
      console.error("Error releasing funds:", error);
    }
  };

  return { 
    getContract, 
    getCryptifyContract, 
    userAddress, 
    balance, 
    transactions, 
    fetchTransactions, 
    fetchBalance, 
    userTransactions,
    fetchUserTransactions,
    registerFreelancer,
    getFreelancer,
    getAllFreelancers,
    updateFreelancerProfile,
    deleteFreelancer,
    createContract,
    approveContract,
    startWork,
    completeWork,
    releaseFundsForContract,
    fetchFreelancers
  };
};

export default useContract;
