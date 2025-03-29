import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import useContract2 from "../hooks/useContract2";
import ContractIntro from "../components/ContractModule/ContractIntro";
import CreateContractForm from "../components/ContractModule/CreateContractForm";
import FetchContractSection from "../components/ContractModule/FetchContractSection";
import WorkPostSection from "../components/ContractModule/WorkPostSection"; // New component
import { useWallet } from "../components/Global/WalletContext";

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
};

const Contract = () => {
  const { walletData } = useWallet();
  const contractHooks = useContract2(walletData?.provider);
  const [contractId, setContractId] = useState("");
  const [contractDetails, setContractDetails] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFetchForm, setShowFetchForm] = useState(false);
  const [showWorkPostForm, setShowWorkPostForm] = useState(false);

  const handleGetContractDetails = async () => {
    if (!walletData?.provider) {
      toast.error("🦊 Please connect your wallet!");
      return;
    }
    setLoading(true);
    try {
      const details = await contractHooks.getContractDetails(contractId);
      const milestones = await contractHooks.getMilestones(contractId);
      setContractDetails(details);
      setMilestones(milestones);
    } catch (err) {
      toast.error(`Failed to fetch details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-customSemiPurple min-h-screen text-white"
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="container mx-auto px-4 py-10 pt-32">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          Milestone-Based Contracts & Work Posts
        </h1>

        <ContractIntro
          showCreateForm={showCreateForm}
          showFetchForm={showFetchForm}
          showWorkPostForm={showWorkPostForm}
          onToggleCreateForm={() => setShowCreateForm(!showCreateForm)}
          onToggleFetchForm={() => setShowFetchForm(!showFetchForm)}
          onToggleWorkPostForm={() => setShowWorkPostForm(!showWorkPostForm)}
        />

        {showCreateForm && (
          <CreateContractForm
            contractHooks={contractHooks}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {showFetchForm && (
          <FetchContractSection
            contractId={contractId}
            setContractId={setContractId}
            contractDetails={contractDetails}
            milestones={milestones}
            currentAccount={walletData?.address}
            loading={loading}
            handleGetContractDetails={handleGetContractDetails}
            contractHooks={contractHooks}
          />
        )}

        {showWorkPostForm && (
          <WorkPostSection
            contractHooks={contractHooks}
            currentAccount={walletData?.address}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Contract;