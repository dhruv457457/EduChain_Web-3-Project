import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CryptifySWC from "../contracts/CryptifySWC.json";

const CONTRACT_ADDRESS = "0x484A5AA1d51021C4a5eB335F938F7D15eF229c4c";

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

        console.log("Contract initialized:", contractInstance);
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
      console.log("Executing transaction:", successMsg);
      const tx = await transactionFn();
      console.log("Transaction sent:", tx);
      const receipt = await tx.wait();
      console.log("Transaction successful:", successMsg, receipt);
      return receipt;
    } catch (error) {
      console.error("Transaction Error:", {
        error,
        message: error.message,
        reason: error.reason,
        stack: error.stack,
      });
      throw new Error(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if Contract Exists
  const contractExists = async (contractId) => {
    try {
      const details = await contract.getContractDetails(contractId);
      return details.creator !== ethers.ZeroAddress;
    } catch (error) {
      console.error("Contract Existence Check Error:", error);
      return false;
    }
  };

  // Create Contract
  const createContract = async (receiver, title, description, coinType, duration, contractType, amount) => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      // Validate inputs
      if (!receiver.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error("Invalid Ethereum address");
      }
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a valid positive number");
      }

      const amountInWei = ethers.parseEther(amount.toString());
      const contractTypeEnum = contractType === "Basic" ? 0 : 1;

      const tx = await contract.createContract(
        receiver,
        title,
        description,
        coinType,
        Number(duration),
        contractTypeEnum,
        { value: amountInWei }
      );

      const receipt = await tx.wait();
      const event = receipt.logs
        .map((log) => contract.interface.parseLog(log))
        .find((parsed) => parsed?.name === "ContractCreated");

      if (!event) throw new Error("Contract creation event not found");
      return event.args.contractId.toString();
    } catch (error) {
      console.error("Create Contract Error:", {
        error,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };
// Add this to useContract2.js
const approveContract = async (contractId) => {
  try {
    if (!contract) throw new Error("Contract not initialized");
    return handleTransaction(
      () => contract.approveContract(contractId),
      "Contract approved"
    );
  } catch (error) {
    console.error("Approve Contract Error:", error);
    throw error;
  }
};
  // Add Milestone
  const addMilestone = async (contractId, title, amount, deadline, deliverables) => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      // Validate inputs
      if (!title || !amount || !deadline || !deliverables) {
        throw new Error("All milestone fields are required");
      }

      const amountInWei = ethers.parseEther(amount.toString());
      return handleTransaction(
        () => contract.addMilestone(contractId, title, amountInWei, deadline, deliverables),
        "Milestone added"
      );
    } catch (error) {
      console.error("Add Milestone Error:", {
        error,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  // Approve Milestone
  const approveMilestone = async (contractId, milestoneId) => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      return handleTransaction(
        () => contract.approveMilestone(contractId, milestoneId),
        "Milestone approved"
      );
    } catch (error) {
      console.error("Approve Milestone Error:", {
        error,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  // Complete Milestone
  const completeMilestone = async (contractId, milestoneId) => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      return handleTransaction(
        () => contract.completeMilestone(contractId, milestoneId),
        "Milestone completed"
      );
    } catch (error) {
      console.error("Complete Milestone Error:", {
        error,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  // Release Payment
  // Update the releaseMilestonePayment function
const releaseMilestonePayment = async (contractId, milestoneId) => {
  try {
    if (!contract) throw new Error("Contract not initialized");
    
    // Add fresh contract details check
    const currentDetails = await getContractDetails(contractId);
    if (currentDetails.status < 1) {
      throw new Error("Contract must be approved first");
    }

    return handleTransaction(
      () => contract.releaseMilestonePayment(contractId, milestoneId),
      "Payment released"
    );
  } catch (error) {
    console.error("Release Payment Error:", error);
    throw error;
  }
};

  // Get Contract Details
  const getContractDetails = async (contractId) => {
    try {
      if (!(await contractExists(contractId))) throw new Error("Contract not found");

      const details = await contract.getContractDetails(contractId);
      return {
        creator: details[0],
        receiver: details[1],
        title: details[2],
        description: details[3],
        amount: ethers.formatEther(details[4]),
        coinType: details[5],
        duration: details[6],
        createdAt: details[7],
        remainingBalance: ethers.formatEther(details[8]),
        contractType: details[9],
        status: details[10],
        creatorApproved: details[11],
        receiverApproved: details[12],
      };
    } catch (error) {
      console.error("Get Contract Details Error:", {
        error,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  // Get Milestones
  const getMilestones = async (contractId) => {
    try {
      if (!(await contractExists(contractId))) throw new Error("Contract not found");

      const milestones = await contract.getMilestones(contractId);
      return milestones.map((m) => ({
        ...m,
        amount: ethers.formatEther(m.amount),
      }));
    } catch (error) {
      console.error("Get Milestones Error:", {
        error,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  return {
    contract,
    provider,
    signer,
    isLoading,
    createContract,
    addMilestone,
    approveMilestone,
    completeMilestone,approveContract,
    releaseMilestonePayment,
    getContractDetails,
    getMilestones,
  };
};

export default useContract2;