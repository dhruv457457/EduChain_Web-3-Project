import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CryptifySWC from "../contracts/CryptifySWC.json"; // Import the JSON file

const CONTRACT_ADDRESS = "0xc55681C4ECB904aa797B204C2690CEEDc668f2aa";

const useContract2 = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof ethers === 'undefined') {
        console.error("Ethers library is not available.");
        alert("Ethers library is not available.");
        return;
      }

      if (!window.ethereum) {
        console.error("Ethereum provider not found. Please install MetaMask.");
        alert("Ethereum provider not found. Please install MetaMask.");
        return;
      }

      try {
        // Use the existing wallet connection
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        // Get the connected wallet signer
        const web3Signer = await web3Provider.getSigner();
        setSigner(web3Signer);

        // Create the contract instance
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CryptifySWC.abi, // Use the `abi` property from the JSON file
          web3Signer
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Error initializing contract:", error.message || error);
        alert("Failed to initialize contract. Ensure MetaMask is connected.");
      }
    };

    initializeContract();
  }, []);

  // Function to create a new contract
  const createContract = async (receiver, title, description, coinType, duration, contractType, amount) => {
    if (!contract) return alert("Contract is not initialized.");

    try {
      if (!amount || isNaN(amount)) {
        throw new Error("Invalid amount provided.");
      }

      setIsLoading(true); // Start loading
      const tx = await contract.createContract(
        receiver,
        title,
        description,
        coinType,
        duration,
        contractType,
        {
          value: ethers.parseEther(amount.toString()), // Use `parseEther` directly from ethers
          gasLimit: 300000, // Optional: Set gas limit to prevent out-of-gas errors
        }
      );

      await tx.wait();
      console.log("Contract created successfully!");
      alert("Contract created successfully!");
    } catch (error) {
      console.error("Error creating contract:", error.message || error);
      alert("Error creating contract: " + (error.message || error));
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Function to approve a milestone
  const approveMilestone = async (contractId, milestoneId) => {
    if (!contract) return alert("Contract is not initialized.");
    setIsLoading(true);
    try {
      const tx = await contract.approveMilestone(contractId, milestoneId);
      await tx.wait();
      console.log("Milestone approved successfully");
      alert("Milestone approved successfully!");
    } catch (error) {
      console.error("Error approving milestone:", error.message || error);
      alert("Error approving milestone: " + (error.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to complete a milestone
  const completeMilestone = async (contractId, milestoneId) => {
    if (!contract) return alert("Contract is not initialized.");
    setIsLoading(true);
    try {
      const tx = await contract.completeMilestone(contractId, milestoneId);
      await tx.wait();
      console.log("Milestone completed successfully");
      alert("Milestone completed successfully!");
    } catch (error) {
      console.error("Error completing milestone:", error.message || error);
      alert("Error completing milestone: " + (error.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get contract details
  const getContractDetails = async (contractId) => {
    if (!contract) return alert("Contract is not initialized.");
    try {
      const details = await contract.getContractDetails(contractId);
      return details;
    } catch (error) {
      console.error("Error fetching contract details:", error.message || error);
      alert("Error fetching contract details: " + (error.message || error));
    }
  };

  // Function to get milestone details
  const getMilestoneDetails = async (contractId, milestoneId) => {
    if (!contract) return alert("Contract is not initialized.");
    try {
      const details = await contract.getMilestoneDetails(contractId, milestoneId);
      return details;
    } catch (error) {
      console.error("Error fetching milestone details:", error.message || error);
      alert("Error fetching milestone details: " + (error.message || error));
    }
  };

  return {
    contract,
    provider,
    signer,
    isLoading,
    createContract,
    approveMilestone,
    completeMilestone,
    getContractDetails,
    getMilestoneDetails,
  };
};

export default useContract2;