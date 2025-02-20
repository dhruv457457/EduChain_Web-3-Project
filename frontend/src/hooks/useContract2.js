import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CryptifySWC from "../contracts/CryptifySWC.json";

const CONTRACT_ADDRESS = "0x5a23750a77aDFC40C16bb03454762e94f12Afa3F";

const useContract2 = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Contract
  useEffect(() => {
    const initContract = async () => {
      try {
        if (!window.ethereum) throw new Error("Install MetaMask to continue.");

        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        const web3Signer = await web3Provider.getSigner();
        setSigner(web3Signer);

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CryptifySWC.abi,
          web3Signer
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Contract Initialization Error:", error);
        throw new Error(`Failed to initialize contract: ${error.message}`);
      }
    };
    initContract();
  }, []);

  // Transaction Handler
  const handleTransaction = async (transactionFn, successMsg) => {
    if (!contract) throw new Error("Contract not initialized.");
    setIsLoading(true);
    try {
      const tx = await transactionFn();
      const receipt = await tx.wait();
      console.log(`Transaction successful: ${successMsg}`, receipt);
      return receipt;
    } catch (error) {
      console.error("Transaction Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create Contract
  const createContract = async (receiver, title, description, coinType, duration, contractType, amount) => {
    try {
      console.log("Creating contract with params:", {
        receiver,
        title,
        description,
        coinType,
        duration,
        contractType,
        amount
      });

      if (!contract) throw new Error("Contract not initialized");
      if (isNaN(amount) || amount <= 0) throw new Error("Amount must be a valid positive number");
      if (isNaN(duration) || duration <= 0) throw new Error("Duration must be a valid positive number");

      // Convert contractType string to enum (Basic: 0, Milestone: 1)
      const contractTypeEnum = contractType === "Basic" ? 0 : 1;

      const tx = await contract.createContract(
        receiver,
        title,
        description,
        coinType,
        Number(duration),
        contractTypeEnum,
        { value: ethers.parseEther(amount.toString()) }
      );

      const receipt = await tx.wait();
      
      const event = receipt.logs
        .map(log => {
          try {
            return contract.interface.parseLog(log);
          } catch (error) {
            console.error("Error parsing log:", error);
            return null;
          }
        })
        .find(parsed => parsed && parsed.name === "ContractCreated");

      if (!event) throw new Error("ContractCreated event not found in transaction logs");

      const contractId = event.args.contractId.toString();
      return contractId;
    } catch (error) {
      console.error("Create Contract Error:", error);
      throw error;
    }
  };

  // Add Milestone
  const addMilestone = async (contractId, title, amount, deadline, deliverables) => {
    return handleTransaction(
      () => contract.addMilestone(contractId, title, amount, deadline, deliverables),
      "Milestone added successfully"
    );
  };

  // Approve Milestone
  const approveMilestone = async (contractId, milestoneId) => {
    return handleTransaction(
      () => contract.approveMilestone(contractId, milestoneId),
      "Milestone approved successfully"
    );
  };

  // Complete Milestone
  const completeMilestone = async (contractId, milestoneId) => {
    return handleTransaction(
      () => contract.completeMilestone(contractId, milestoneId),
      "Milestone completed successfully"
    );
  };

  // Get Contract Details
  const getContractDetails = async (contractId) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      if (!contractId) throw new Error("Contract ID is required");

      const details = await contract.getContractDetails(contractId);
      
      // Format the returned data into a more usable structure
      return {
        creator: details[0],
        receiver: details[1],
        title: details[2],
        description: details[3],
        amount: details[4],
        coinType: details[5],
        duration: details[6],
        createdAt: details[7],
        remainingBalance: details[8],
        contractType: details[9], // 0 for Basic, 1 for Milestone
        status: details[10], // Maps to ContractStatus enum
        creatorApproved: details[11],
        receiverApproved: details[12]
      };
    } catch (error) {
      console.error("Get Contract Details Error:", error);
      throw error;
    }
  };

  // Create Work Post
  const createWorkPost = async (title, description, budget, duration) => {
    return handleTransaction(
      () => contract.createWorkPost(title, description, budget, duration),
      "Work post created successfully"
    );
  };

  // Submit Proposal
  const submitProposal = async (postId, message) => {
    return handleTransaction(
      () => contract.submitProposal(postId, message),
      "Proposal submitted successfully"
    );
  };

  // Accept Proposal
  const acceptProposal = async (postId, proposalId, budget) => {
    return handleTransaction(
      () => contract.acceptProposal(postId, proposalId, { value: ethers.parseEther(budget.toString()) }),
      "Proposal accepted successfully"
    );
  };

  return {
    contract,
    provider,
    signer,
    isLoading,
    createContract,
    addMilestone,
    approveMilestone,
    completeMilestone,
    getContractDetails,
    createWorkPost,
    submitProposal,
    acceptProposal
  };
};

export default useContract2;