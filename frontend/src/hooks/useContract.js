import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";

const FUND_TRANSFER_ADDRESS = "0x31bCF4cC0c6c7F13Ab92260FAdc8BCeFFBfEef5c";

const useContract = (provider) => {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [pendingBalance, setPendingBalance] = useState("0");
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
        fetchPendingBalance(address);
      } catch (error) {
        console.error("Error fetching user account:", error);
      }
    };
    fetchAccount();

    // Setup event listeners
    const contract = getContract();
    if (contract) {
      contract.then((c) => {
        c.on("FundsSent", () => {
          fetchTransactions();
          fetchUserTransactions(userAddress);
          fetchPendingBalance(userAddress);
        });
        c.on("FundsClaimed", () => fetchPendingBalance(userAddress));
      });
      return () => {
        contract.then((c) => {
          c.removeAllListeners("FundsSent");
          c.removeAllListeners("FundsClaimed");
        });
      };
    }
  }, [provider]);

  const getContract = async (
    contractAddress = FUND_TRANSFER_ADDRESS,
    contractABI = FundTransferWithRegistryABI.abi
  ) => {
    if (!provider) throw new Error("Wallet not connected. Please connect via Navbar.");
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
      const formattedTxs = txs.map((tx) => ({
        sender: tx.sender,
        receiver: tx.receiver,
        senderName: tx.senderName,
        receiverName: tx.receiverName,
        amount: ethers.formatEther(tx.amount),
        message: tx.message,
        timestamp: Number(tx.timestamp),
        claimed: tx.claimed,
        refunded: tx.refunded,
      }));
      setTransactions(formattedTxs);
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
      const formattedUserTxs = userTxs.map((tx) => ({
        sender: tx.sender,
        receiver: tx.receiver,
        senderName: tx.senderName,
        receiverName: tx.receiverName,
        amount: ethers.formatEther(tx.amount),
        message: tx.message,
        timestamp: Number(tx.timestamp),
        claimed: tx.claimed,
        refunded: tx.refunded,
      }));
      setUserTransactions(formattedUserTxs);
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

  const fetchPendingBalance = async (address) => {
    if (!provider || !address) return;
    try {
      const contract = await getContract();
      const pendingWei = await contract.pendingBalances(address);
      setPendingBalance(ethers.formatEther(pendingWei));
    } catch (error) {
      console.error("Error fetching pending balance:", error);
    }
  };

  const depositFunds = async (amount) => {
    if (!provider) throw new Error("Wallet not connected.");
    setIsLoading(true);
    try {
      const contract = await getContract();
      const amountInWei = ethers.parseEther(amount.toString());
      const tx = await contract.depositFunds({ value: amountInWei });
      await tx.wait();
      fetchPendingBalance(userAddress);
      return tx.hash;
    } catch (error) {
      console.error("Error depositing funds:", error);
      throw error.message || "Failed to deposit funds";
    } finally {
      setIsLoading(false);
    }
  };

  const sendFunds = async (receiverUsername, amount, message) => {
    if (!provider) throw new Error("Wallet not connected.");
    setIsLoading(true);
    try {
      const contract = await getContract();
      const amountInWei = ethers.parseEther(amount.toString());
      const tx = await contract.sendFunds(receiverUsername, message, { value: amountInWei });
      await tx.wait();
      fetchUserTransactions(userAddress);
      fetchPendingBalance(userAddress);
      return tx.hash;
    } catch (error) {
      console.error("Error sending funds:", error);
      throw error.message || "Failed to send funds";
    } finally {
      setIsLoading(false);
    }
  };

  const sendFundsToAddress = async (receiverAddress, amount, message) => {
    if (!provider) throw new Error("Wallet not connected.");
    setIsLoading(true);
    try {
      const contract = await getContract();
      const amountInWei = ethers.parseEther(amount.toString());
      const tx = await contract.sendFundsToAddress(receiverAddress, message, { value: amountInWei });
      await tx.wait();
      fetchUserTransactions(userAddress);
      fetchPendingBalance(userAddress);
      return tx.hash;
    } catch (error) {
      console.error("Error sending funds to address:", error);
      throw error.message || "Failed to send funds to address";
    } finally {
      setIsLoading(false);
    }
  };

  const claimFunds = async () => {
    if (!provider) throw new Error("Wallet not connected.");
    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.claimFunds();
      await tx.wait();
      fetchUserTransactions(userAddress);
      fetchPendingBalance(userAddress);
      return tx.hash;
    } catch (error) {
      console.error("Error claiming funds:", error);
      // Extract the revert reason from the error object
      const revertReason =
        error.reason || // ethers.js v6
        error.data?.message || // Some providers
        error.message || // Generic fallback
        "Failed to claim funds";
      throw new Error(revertReason); // Throw the specific reason
    } finally {
      setIsLoading(false);
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
    pendingBalance,
    fetchPendingBalance,
    depositFunds,
    sendFunds,
    sendFundsToAddress,
    claimFunds,
    isLoading,
  };
};

export default useContract;