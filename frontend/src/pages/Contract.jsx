import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useContract from "../hooks/useContract2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
};

const Contract = () => {
  const {
    createContract,
    getContractDetails,
    addMilestone,
    approveMilestone,
    completeMilestone,
    releaseMilestonePayment,
    getMilestones,
  } = useContract();

  const [formData, setFormData] = useState({
    receiver: "",
    title: "",
    description: "",
    coinType: "ETH",
    duration: "",
    contractType: "Basic",
    amount: "",
  });

  const [contractId, setContractId] = useState("");
  const [contractDetails, setContractDetails] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [milestoneData, setMilestoneData] = useState({
    title: "",
    amount: "",
    deadline: "",
    deliverables: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");

  // Get current account
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        }
      }
    };
    checkWalletConnection();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Create Contract
  const handleCreateContract = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { receiver, title, description, coinType, duration, contractType, amount } = formData;

      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a valid positive number");
      }

      const id = await createContract(receiver, title, description, coinType, duration, contractType, amount);
      setContractId(id);
      alert(`Contract created! ID: ${id}`);
    } catch (err) {
      setError(err.message || "Contract creation failed");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Contract Details
  const handleGetContractDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const details = await getContractDetails(contractId);
      const milestones = await getMilestones(contractId);
      setContractDetails(details);
      setMilestones(milestones);
    } catch (err) {
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  // Handle Milestone Actions
  const handleMilestoneAction = async (actionFn, successMessage, milestoneId) => {
    setLoading(true);
    setError("");
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) throw new Error("Connect your wallet first");

      if (actionFn === approveMilestone) {
        if (accounts[0].toLowerCase() !== contractDetails?.receiver?.toLowerCase()) {
          throw new Error("Only the receiver can approve milestones");
        }
      }

      await actionFn(contractId, milestoneId);
      
      // Refresh data
      const updatedDetails = await getContractDetails(contractId);
      const updatedMilestones = await getMilestones(contractId);
      setContractDetails(updatedDetails);
      setMilestones(updatedMilestones);

      alert(successMessage);
    } catch (err) {
      console.error("Action failed:", err);
      setError(err.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  // Add Milestone
  const handleAddMilestone = async () => {
    setLoading(true);
    setError("");
    try {
      const { title, amount, deadline, deliverables } = milestoneData;
      await addMilestone(contractId, title, amount, deadline, deliverables);
      alert("Milestone added!");
      setMilestoneData({ title: "", amount: "", deadline: "", deliverables: "" });
      handleGetContractDetails();
    } catch (err) {
      setError("Failed to add milestone");
    } finally {
      setLoading(false);
    }
  };

  // Helper to display contract status
  const getStatusLabel = (statusCode) => {
    const statuses = ["Pending", "Approved", "InProgress", "Completed", "Cancelled", "Disputed"];
    return statuses[statusCode] || "Unknown";
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-customSemiPurple min-h-screen text-white"
    >
      <Navbar />
      <div className="container mx-auto px-4 py-10 pt-32">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Smart Work Contracts</h1>
        {error && <div className="bg-red-500 text-white p-4 mb-6 rounded-md">{error}</div>}

        {/* Contract Creation Form */}
        <form onSubmit={handleCreateContract} className="bg-customDark p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Create New Contract</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium mb-2 capitalize">{key}</label>
                {key === "description" ? (
                  <textarea
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
                    rows="3"
                  />
                ) : key === "contractType" || key === "coinType" ? (
                  <select
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
                  >
                    {key === "contractType" ? (
                      <>
                        <option value="Basic">Basic</option>
                        <option value="Milestone">Milestone</option>
                      </>
                    ) : (
                      <>
                        <option value="ETH">ETH</option>
                        <option value="BTC">BTC</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type={["amount", "duration"].includes(key) ? "number" : "text"}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md mt-4"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Contract"}
          </button>
        </form>

        {/* Contract Details Section */}
        <div className="bg-customDark p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Contract Details</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              placeholder="Enter Contract ID"
              className="flex-1 bg-gray-100 p-3 rounded-md text-gray-800"
            />
            <button
              onClick={handleGetContractDetails}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md"
              disabled={loading}
            >
              {loading ? "Loading..." : "Fetch Details"}
            </button>
          </div>

          {contractDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <p className="font-medium">{getStatusLabel(contractDetails.status)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Amount</label>
                  <p className="font-medium">{contractDetails.amount} {contractDetails.coinType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Remaining Balance</label>
                  <p className="font-medium">{contractDetails.remainingBalance} {contractDetails.coinType}</p>
                </div>
              </div>

              {/* Milestones Section */}
              {milestones.map((milestone, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-gray-400">{milestone.amount} {contractDetails.coinType}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-sm ${
                        milestone.isPaid ? "bg-green-600" : 
                        milestone.isApproved ? "bg-blue-600" : 
                        "bg-gray-600"
                      }`}>
                        {milestone.isPaid ? "Paid" : milestone.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                  {/* Complete Button */}
<button
  onClick={() => handleMilestoneAction(completeMilestone, "Milestone completed!", index)}
  className={`text-sm px-3 py-1 rounded ${
    milestone.isCompleted || 
    currentAccount.toLowerCase() !== contractDetails.creator.toLowerCase()
      ? "bg-gray-400 opacity-75 cursor-not-allowed"
      : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
  }`}
  disabled={
    milestone.isCompleted || 
    currentAccount.toLowerCase() !== contractDetails.creator.toLowerCase()
  }
>
  Complete
</button>

{/* Approve Button */}
<button
  onClick={() => handleMilestoneAction(approveMilestone, "Milestone approved!", index)}
  className={`text-sm px-3 py-1 rounded ${
    !milestone.isCompleted || 
    milestone.isApproved || 
    currentAccount.toLowerCase() !== contractDetails.receiver.toLowerCase()
      ? "bg-gray-400 opacity-75 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
  }`}
  disabled={
    !milestone.isCompleted || 
    milestone.isApproved || 
    currentAccount.toLowerCase() !== contractDetails.receiver.toLowerCase()
  }
>
  Approve
</button>

{/* Release Payment Button */}
<button
  onClick={() => handleMilestoneAction(releaseMilestonePayment, "Payment released!", index)}
  className={`text-sm px-3 py-1 rounded ${
    !milestone.isApproved || 
    milestone.isPaid || 
    !(
      currentAccount.toLowerCase() === contractDetails.creator.toLowerCase() ||
      currentAccount.toLowerCase() === contractDetails.receiver.toLowerCase()
    )
      ? "bg-gray-400 opacity-75 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700 cursor-pointer"
  }`}
  disabled={
    !milestone.isApproved || 
    milestone.isPaid || 
    !(
      currentAccount.toLowerCase() === contractDetails.creator.toLowerCase() ||
      currentAccount.toLowerCase() === contractDetails.receiver.toLowerCase()
    )
  }
>
  Release Payment
</button>
                  </div>
                </div>
              ))}

              {/* Add Milestone Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Add New Milestone</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(milestoneData).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm text-gray-400 mb-1 capitalize">{key}</label>
                      <input
                        type={["amount", "deadline"].includes(key) ? "number" : "text"}
                        value={value}
                        onChange={(e) => setMilestoneData(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full bg-gray-100 p-2 rounded-md text-gray-800"
                        placeholder={`Enter ${key}`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddMilestone}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
                  disabled={loading}
                >
                  Add Milestone
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Contract;