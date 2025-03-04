import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CryptifySWC from "../contracts/CryptifySWC.json";

const CONTRACT_ADDRESS = "0x2Dba04d7A7134Ab647652006A080a626ce978E7a";

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
      console.error("Transaction Error:", error);
      throw new Error(error.reason || error.message); 
    } finally {
      setIsLoading(false);
    }
  };

  // Contract Existence Checker
  const contractExists = async (contractId) => {
    try {
      const details = await contract.getContractDetails(contractId);
      return details.creator !== ethers.ZeroAddress;
    } catch {
      return false;
    }
  };

  // Create Contract
  const createContract = async (receiver, title, description, coinType, duration, contractType, amount) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
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
        .map(log => contract.interface.parseLog(log))
        .find(parsed => parsed?.name === "ContractCreated");

      if (!event) throw new Error("Contract creation event not found");
      return event.args.contractId.toString();
    } catch (error) {
      console.error("Create Contract Error:", error);
      throw error;
    }
  };

  // Add Milestone
  const addMilestone = async (contractId, title, amount, deadline, deliverables) => {
    const amountInWei = ethers.parseEther(amount.toString());
    return handleTransaction(
      () => contract.addMilestone(contractId, title, amountInWei, deadline, deliverables),
      "Milestone added"
    );
  };

  // Approve Milestone
  const approveMilestone = async (contractId, milestoneId) => {
    return handleTransaction(
      async () => {
        console.log("Approving milestone:", milestoneId);
        return contract.approveMilestone(contractId, milestoneId);
      },
      "Milestone approved"
    );
  };

  // Complete Milestone
  const completeMilestone = async (contractId, milestoneId) => {
    return handleTransaction(
      () => contract.completeMilestone(contractId, milestoneId),
      "Milestone completed"
    );
  };

  // Release Payment
  const releaseMilestonePayment = async (contractId, milestoneId) => {
    return handleTransaction(
      () => contract.releaseMilestonePayment(contractId, milestoneId),
      "Payment released"
    );
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
        receiverApproved: details[12]
      };
    } catch (error) {
      console.error("Get Contract Error:", error);
      throw error;
    }
  };

  // Get Milestones
  const getMilestones = async (contractId) => {
    try {
      if (!(await contractExists(contractId))) throw new Error("Contract not found");
      const milestones = await contract.getMilestones(contractId);
      return milestones.map(m => ({
        ...m,
        amount: ethers.formatEther(m.amount)
      }));
    } catch (error) {
      console.error("Get Milestones Error:", error);
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
    completeMilestone,
    releaseMilestonePayment,
    getContractDetails,
    getMilestones
  };
};

export default useContract2;