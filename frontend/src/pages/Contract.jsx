import React, { useState } from "react";
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
  const { createContract, getContractDetails, approveMilestone, completeMilestone } = useContract();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateContract = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { receiver, title, description, coinType, duration, contractType, amount } = formData;
  
      // ✅ Validate fields
      if (Object.values(formData).some((field) => !field)) {
        throw new Error("All fields are required.");
      }
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a valid positive number.");
      }
  
      // 📝 Debug log
      console.log("📝 Submitting contract with:", formData);
  
      // ⚡ Correct order of parameters
      const id = await createContract(receiver, title, description, coinType, duration, contractType, amount);
  
      if (id) {
        setContractId(id);
        alert(`Contract created successfully! Contract ID: ${id}`);
      } else {
        throw new Error("Contract ID could not be retrieved.");
      }
    } catch (err) {
      console.error("Error creating contract:", err);
      setError(err.message || "Failed to create contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetContractDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const details = await getContractDetails(contractId);
      setContractDetails(details);
    } catch (err) {
      setError("Failed to fetch contract details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneAction = async (actionFn, successMessage) => {
    setLoading(true);
    setError("");
    try {
      await actionFn(contractId);
      alert(successMessage);
      handleGetContractDetails();
    } catch (err) {
      setError(`Failed to ${successMessage.toLowerCase()}. Please try again.`);
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
      className="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen text-white"
    >
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Smart Work Commitment Contracts</h1>
        {error && <div className="bg-red-500 text-white p-4 mb-6 rounded-md shadow-md">{error}</div>}
        <form
          className="bg-gray-800 p-6 rounded-2xl shadow-lg backdrop-blur-md bg-opacity-30"
          onSubmit={handleCreateContract}
        >
          <h2 className="text-2xl font-semibold mb-6">Create New Contract</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium capitalize mb-2">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                {key === "description" ? (
                  <textarea
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-3"
                    rows="3"
                    required
                  />
                ) : key === "coinType" || key === "contractType" ? (
                  <select
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-3"
                  >
                    {key === "coinType" ? (
                      <>
                        <option value="ETH">ETH</option>
                        <option value="BTC">BTC</option>
                      </>
                    ) : (
                      <>
                        <option value="Basic">Basic</option>
                        <option value="Advanced">Advanced</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type={key === "amount" || key === "duration" ? "number" : "text"}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-3"
                    required
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-300"
            disabled={loading}
          >
            {loading ? "Creating Contract..." : "Create Contract"}
          </button>
        </form>

        <div className="mt-16 bg-gray-800 p-6 rounded-2xl shadow-lg backdrop-blur-md bg-opacity-30">
          <h2 className="text-2xl font-semibold mb-6">View Contract Details</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Contract ID"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-3"
            />
            <button
              onClick={handleGetContractDetails}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300"
              disabled={loading}
            >
              {loading ? "Fetching Details..." : "Fetch Details"}
            </button>
          </div>
          {contractDetails && (
            <div className="bg-gray-900 p-6 rounded-lg mt-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Contract Details</h3>
              {Object.entries(contractDetails).map(([key, value]) => (
                <p key={key} className="text-gray-300">
                  <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {value}
                </p>
              ))}
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <button
                  onClick={() => handleMilestoneAction(approveMilestone, "Milestone approved successfully!")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                  disabled={loading}
                >
                  Approve Milestone
                </button>
                <button
                  onClick={() => handleMilestoneAction(completeMilestone, "Milestone completed successfully!")}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                  disabled={loading}
                >
                  Complete Milestone
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
