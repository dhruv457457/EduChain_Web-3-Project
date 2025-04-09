import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CryptifySWCABI from "../contracts/CryptifySWC.json";

const CONTRACT_ADDRESS = "0x3766EFeDCd3445A07d3a1107c956808d3A1B0103";

const useContract2 = (provider) => {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reputation, setReputation] = useState("500"); // Default base score

  useEffect(() => {
    const initContract = async () => {
      if (!provider) return;
      try {
        const web3Signer = await provider.getSigner();
        setSigner(web3Signer);

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CryptifySWCABI.abi,
          web3Signer
        );
        setContract(contractInstance);

        const address = await web3Signer.getAddress();
        const rep = await contractInstance.getReputation(address);
        setReputation(ethers.formatUnits(rep, 0));

        // Event listeners
        contractInstance.on("ContractCreated", () => fetchReputation());
        contractInstance.on("MilestoneCompleted", () => fetchReputation());
        contractInstance.on("ContractCompleted", () => fetchReputation());

        console.log("Contract initialized:", contractInstance);
      } catch (error) {
        console.error("Contract Initialization Error:", error);
      }
    };
    initContract();

    return () => {
      if (contract) {
        contract.removeAllListeners("ContractCreated");
        contract.removeAllListeners("MilestoneCompleted");
        contract.removeAllListeners("ContractCompleted");
      }
    };
  }, [provider]);

  const handleTransaction = async (transactionFn, successMsg) => {
    if (!contract) throw new Error("Contract not initialized.");
    setIsLoading(true);
    try {
      console.log("Executing transaction:", successMsg);
      const tx = await transactionFn();
      const receipt = await tx.wait();
      console.log("Transaction successful:", successMsg, receipt);

      // Update reputation after transaction
      const address = await signer.getAddress();
      const rep = await contract.getReputation(address);
      setReputation(ethers.formatUnits(rep, 0));

      return receipt;
    } catch (error) {
      console.error("Transaction Error:", error);
      throw error.message || "Transaction failed";
    } finally {
      setIsLoading(false);
    }
  };

  const contractExists = async (contractId) => {
    if (!contract) return false;
    try {
      const details = await contract.getContractDetails(contractId);
      return details.creator !== ethers.ZeroAddress;
    } catch (error) {
      console.error("Contract Existence Check Error:", error);
      return false;
    }
  };

  const createContract = async (receiverUsername, title, description, coinType, duration, contractType, amount) => {
    if (!contract) throw new Error("Contract not initialized");
    try {
      if (!receiverUsername || receiverUsername.trim() === "") throw new Error("Receiver username is required");
      if (isNaN(amount) || amount <= 0) throw new Error("Amount must be a valid positive number");
      if (isNaN(duration) || duration <= 0 || duration > 365 * 24 * 60 * 60) throw new Error("Invalid duration");

      const amountInWei = ethers.parseEther(amount.toString());
      const contractTypeEnum = contractType === "Basic" ? 0 : 1;

      const tx = await contract.createContract(
        receiverUsername,
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
      console.error("Create Contract Error:", error);
      throw error;
    }
  };

  const approveContract = async (contractId) => {
    return handleTransaction(
      () => contract.approveContract(contractId),
      "Contract approved"
    );
  };

  const addMilestone = async (contractId, title, amount, deadline, deliverables) => {
    if (!title || !amount || !deadline || !deliverables) throw new Error("All milestone fields are required");
    const amountInWei = ethers.parseEther(amount.toString());
    return handleTransaction(
      () => contract.addMilestone(contractId, title, amountInWei, deadline, deliverables),
      "Milestone added"
    );
  };

  const approveMilestone = async (contractId, milestoneId) => {
    return handleTransaction(
      () => contract.approveMilestone(contractId, milestoneId),
      "Milestone approved"
    );
  };

  const completeMilestone = async (contractId, milestoneId) => {
    return handleTransaction(
      () => contract.completeMilestone(contractId, milestoneId),
      "Milestone completed"
    );
  };

  const releaseMilestonePayment = async (contractId, milestoneId) => {
    const currentDetails = await getContractDetails(contractId);
    if (currentDetails.status < 1) throw new Error("Contract must be approved first");
    return handleTransaction(
      () => contract.releaseMilestonePayment(contractId, milestoneId),
      "Payment released"
    );
  };

  const createWorkPost = async (title, description, budget, duration) => {
    return handleTransaction(
      () => contract.createWorkPost(title, description, ethers.parseEther(budget.toString()), Number(duration)),
      "Work post created"
    );
  };

  const submitProposal = async (postId, message) => {
    return handleTransaction(
      () => contract.submitProposal(postId, message),
      "Proposal submitted"
    );
  };

  const acceptProposal = async (postId, proposalId, budget) => {
    return handleTransaction(
      () => contract.acceptProposal(postId, proposalId, { value: ethers.parseEther(budget.toString()) }),
      "Proposal accepted"
    );
  };

  const getUserContracts = async () => {
    if (!contract || !signer) throw new Error("Contract or signer not initialized");
    const address = await signer.getAddress();
    const contractCount = await contract.contractCounter();
    const userContracts = [];
    for (let i = 1; i <= Number(contractCount); i++) {
      const details = await getContractDetails(i);
      if (details.creator === address || details.receiver === address) {
        userContracts.push({ contractId: i, ...details });
      }
    }
    return userContracts;
  };

  const fetchReputation = async () => {
    if (!contract || !signer) throw new Error("Contract or signer not initialized");
    const address = await signer.getAddress();
    const rep = await contract.getReputation(address);
    setReputation(ethers.formatUnits(rep, 0));
    return rep.toString();
  };

  const getReputationByAddress = async (address) => {
    if (!contract) throw new Error("Contract not initialized");
    if (!ethers.isAddress(address)) throw new Error("Invalid address");
    try {
      const rep = await contract.getReputation(address);
      return rep;
    } catch (error) {
      console.error("Get Reputation By Address Error:", error);
      throw error;
    }
  };

  const getContractDetails = async (contractId) => {
    if (!contract) throw new Error("Contract not initialized");
    try {
      if (!(await contractExists(contractId))) throw new Error("Contract not found");

      const details = await contract.getContractDetails(contractId);
      return {
        creator: details[0],
        receiver: details[1],
        creatorUsername: details[2],
        receiverUsername: details[3],
        title: details[4],
        description: details[5],
        amount: ethers.formatEther(details[6]),
        coinType: details[7],
        duration: Number(details[8]),
        createdAt: Number(details[9]),
        remainingBalance: ethers.formatEther(details[10]),
        contractType: Number(details[11]),
        status: Number(details[12]),
        creatorApproved: details[13],
        receiverApproved: details[14],
      };
    } catch (error) {
      console.error("Get Contract Details Error:", error);
      throw error;
    }
  };

  const getMilestones = async (contractId) => {
    if (!contract) throw new Error("Contract not initialized");
    try {
      if (!(await contractExists(contractId))) throw new Error("Contract not found");

      const milestones = await contract.getMilestones(contractId);
      return milestones.map((m) => ({
        title: m.title,
        amount: ethers.formatEther(m.amount),
        deadline: Number(m.deadline),
        isCompleted: m.isCompleted,
        isApproved: m.isApproved,
        isPaid: m.isPaid,
        deliverables: m.deliverables,
        completedTimestamp: Number(m.completedTimestamp),
        approvedTimestamp: Number(m.approvedTimestamp),
        approvalCooldown: Number(m.approvalCooldown),
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
    reputation,
    createContract,
    addMilestone,
    approveMilestone,
    completeMilestone,
    approveContract,
    releaseMilestonePayment,
    createWorkPost,
    submitProposal,
    acceptProposal,
    getUserContracts,
    fetchReputation,
    getReputationByAddress,
    getContractDetails,
    getMilestones,
  };
};

export default useContract2;