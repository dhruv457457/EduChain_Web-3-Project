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
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useNavigate, useLocation } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const shouldStartContractTour = localStorage.getItem("startContractTour");

    if (shouldStartContractTour === "true") {
      localStorage.removeItem("startContractTour"); // Prevent repeat tours

      // Make sure forms are visible before the tour starts
      setShowCreateForm(true);
      setShowFetchForm(true);
      setShowWorkPostForm(true);

      // Wait for components to render before starting the tour
      setTimeout(() => {
        console.log("🚀 Starting Driver.js tour...");

        const contractTour = new driver({
          showProgress: true,
          showButtons: true,
          allowClose: true,
          opacity: 0.1,
          stageBackground: "rgba(0, 0, 0, 0.6)",
          highlightedClass: "driver-highlight",
          scrollIntoViewOptions: { behavior: "smooth", block: "center" },
          steps: [
            {
              element: '[data-driver="contract-intro"]',
              popover: {
                title: "Welcome to Contracts! 📜",
                description:
                  "This is the main dashboard where you can manage your contracts and work posts.",
                position: "bottom",
              },
            },
            {
              element: '[data-driver="create-contract"]',
              popover: {
                title: "Create a Contract 🛠️",
                description:
                  "Use this form to create a new milestone-based contract. Fill in the details and submit.",
                position: "bottom",
              },
            },
            {
              element: '[data-driver="fetch-contract"]',
              popover: {
                title: "Fetch Existing Contracts 🔍",
                description:
                  "Retrieve and view details of an existing contract by entering its ID.",
                position: "bottom",
              },
            },
            {
              element: '[data-driver="work-post"]',
              popover: {
                title: "Post Work Requests 💼",
                description:
                  "Post work requirements to find collaborators for your project.",
                position: "bottom",
              },
            },
            {
              popover: {
                title: "Tour Complete 🎉",
                description:
                  "You’ve completed the tour! Feel free to explore the features on your own.",
                position: "center",
              },
            },
          ],
          onDestroyed: () => {
            console.log("✅ Contract tour completed.");
            // Hide forms after the tour ends
            setShowCreateForm(false);
            setShowFetchForm(false);
            setShowWorkPostForm(false);
          },
        });

        // Start the tour
        contractTour.drive();
      }, 1000); // Wait for 1 second to ensure components are rendered
    }
  }, [location.pathname]);

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
          data-driver="contract-intro"
          showCreateForm={showCreateForm}
          showFetchForm={showFetchForm}
          showWorkPostForm={showWorkPostForm}
          onToggleCreateForm={() => setShowCreateForm(!showCreateForm)}
          onToggleFetchForm={() => setShowFetchForm(!showFetchForm)}
          onToggleWorkPostForm={() => setShowWorkPostForm(!showWorkPostForm)}
        />

        {showCreateForm && (
          <CreateContractForm
            data-driver="create-contract"
            contractHooks={contractHooks}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {showFetchForm && (
          <FetchContractSection
            data-driver="fetch-contract"
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
            data-driver="work-post"
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
