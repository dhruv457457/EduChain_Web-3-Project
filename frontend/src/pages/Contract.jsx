import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import useContract2 from "../hooks/useContract2";
import ContractIntro from "../components/ContractModule/ContractIntro";
import CreateContractForm from "../components/ContractModule/CreateContractForm";
import FetchContractSection from "../components/ContractModule/FetchContractSection";
// import WorkPostSection from "../components/ContractModule/WorkPostSection";
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
   // const [showWorkPostForm, setShowWorkPostForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tourStarted = useRef(false);

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

  const startTour = () => {
    console.log("🚀 Attempting to start Driver.js tour...");
    const elements = {
      intro: document.querySelector('[data-driver="contract-intro"]'),
      create: document.querySelector('[data-driver="create-contract"]'),
      fetch: document.querySelector('[data-driver="fetch-contract"]'),
      // workPost: document.querySelector('[data-driver="work-post"]'),
    };
    console.log("Elements:", elements);

    if (!elements.intro || !elements.create || !elements.fetch /* || !elements.workPost */) {
      console.error("❌ One or more elements not found:", elements);
      toast.error("Tour failed: Components not fully loaded.");
      return;
    }

    const contractTour = driver({
      showProgress: true,
      allowClose: true,
      steps: [
        {
          element: '[data-driver="contract-intro"]',
          popover: {
            title: "Welcome to Contracts! 📜",
            description: "This is your main dashboard.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-driver="create-contract"]',
          popover: {
            title: "Create a Contract 🛠️",
            description: "Create a new contract here.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-driver="fetch-contract"]',
          popover: {
            title: "Fetch Contracts 🔍",
            description: "View existing contracts.",
            side: "bottom",
            align: "center",
          },
        },
        // {
        //   element: '[data-driver="work-post"]',
        //   popover: {
        //     title: "Work Posts 💼",
        //     description: "Post work opportunities.",
        //     side: "bottom",
        //     align: "center",
        //   },
        // },
        {
          popover: {
            title: "Tour Complete 🎉",
            description: "You’re ready to explore!",
          },
        },
      ],
      onDestroyed: () => {
        console.log("✅ Tour completed.");
        setShowCreateForm(false);
        setShowFetchForm(false);
        // setShowWorkPostForm(false);
      },
    });

    contractTour.drive();
  };

  useEffect(() => {
    const shouldStartContractTour = localStorage.getItem("startContractTour");

    if (shouldStartContractTour === "true" && !tourStarted.current) {
      localStorage.removeItem("startContractTour");
      tourStarted.current = true;

      console.log("🔧 Setting up tour...");
      setShowCreateForm(true);
      setShowFetchForm(true);
      // setShowWorkPostForm(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (showCreateForm && showFetchForm /* && showWorkPostForm */ && tourStarted.current) {
      console.log("⏳ All forms visible, starting tour...");
      setTimeout(() => startTour(), 500); // Small delay to ensure DOM updates
    }
  }, [showCreateForm, showFetchForm/* , showWorkPostForm */]);

  const handleManualTour = () => {
    setShowCreateForm(true);
    setShowFetchForm(true);
    // setShowWorkPostForm(true);
    setTimeout(() => startTour(), 500);
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

        <button
          onClick={handleManualTour}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md mb-4"
        >
          Start Tour Manually
        </button>

        <ContractIntro
          data-driver="contract-intro"
          showCreateForm={showCreateForm}
          showFetchForm={showFetchForm}
          // showWorkPostForm={showWorkPostForm}
          onToggleCreateForm={() => setShowCreateForm(!showCreateForm)}
          onToggleFetchForm={() => setShowFetchForm(!showFetchForm)}
          // onToggleWorkPostForm={() => setShowWorkPostForm(!showWorkPostForm)}
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

        {/* {showWorkPostForm && (
          <WorkPostSection
            data-driver="work-post"
            contractHooks={contractHooks}
            currentAccount={walletData?.address}
            loading={loading}
            setLoading={setLoading}
          />
        )} */}
      </div>
    </motion.div>
  );
};

export default Contract;