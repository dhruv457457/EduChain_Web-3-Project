import React, { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import useContract2 from "../hooks/useContract2";
import ContractIntro from "../components/ContractModule/ContractIntro";
import CreateContractForm from "../components/ContractModule/CreateContractForm";
import FetchContractSection from "../components/ContractModule/FetchContractSection";
import ReputationFetcher from "../components/ContractModule/ReputationFetcher";
import { useWallet } from "../components/Global/WalletContext";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Contract = () => {
  const { walletData } = useWallet();
  const contractHooks = useContract2(walletData?.provider);
  const [contractId, setContractId] = useState("");
  const [contractDetails, setContractDetails] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState(null); // 'create', 'fetch', 'reputation'
  const location = useLocation();
  const tourStarted = useRef(false);

  // Logic for fetching contract details remains unchanged
  const handleGetContractDetails = async () => {
    if (!walletData?.provider) {
      toast.error("🦊 Please connect your wallet!");
      return;
    }
    setLoading(true);
    try {
      const details = await contractHooks.getContractDetails(contractId);
      const milestonesData = await contractHooks.getMilestones(contractId);
      setContractDetails(details);
      setMilestones(milestonesData);
    } catch (err) {
      let errorMessage = "Failed to fetch contract details.";
      if (err.message.includes("invalid contract ID")) {
        errorMessage = "Invalid contract ID.";
      } else if (err.message.includes("not found")) {
        errorMessage = "Contract not found.";
      }
      toast.error(errorMessage);
      console.error("Fetch contract details error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tour logic remains unchanged
  const startTour = () => {
    // ... tour logic ...
  };

  useEffect(() => {
    // ... tour useEffects ...
  }, [location.pathname, activeView]);

  const handleManualTour = () => {
    setActiveView("create"); // Show one view for the tour
    setTimeout(() => startTour(), 500);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-[#0B0E1F] min-h-screen text-white pt-28 pb-12">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <ContractIntro
          onToggleView={setActiveView}
          activeView={activeView}
          onStartTour={handleManualTour}
        />

        <AnimatePresence mode="wait">
          {activeView === "create" && (
            <motion.div
              key="create"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CreateContractForm
                contractHooks={contractHooks}
                loading={loading}
                setLoading={setLoading}
              />
            </motion.div>
          )}

          {activeView === "fetch" && (
            <motion.div
              key="fetch"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
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
            </motion.div>
          )}

          {activeView === "reputation" && (
            <motion.div
              key="reputation"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ReputationFetcher
                contractHooks={contractHooks}
                walletProvider={walletData?.provider}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Contract;