import React, { useState } from "react";
import { motion } from "framer-motion";
import useContract from "../hooks/useContract2"; // Your custom hook
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

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle contract creation
  const handleCreateContract = async (e) => {
    e.preventDefault();
    await createContract(
      formData.receiver,
      formData.title,
      formData.description,
      formData.coinType,
      formData.duration,
      formData.contractType,
      formData.amount
    );
    alert("Contract created successfully!");
  };

  // Fetch contract details
  const handleGetContractDetails = async () => {
    const details = await getContractDetails(contractId);
    setContractDetails(details);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Manage Your Smart Contracts</h1>

        {/* Form for creating a new contract */}
        <form className="bg-gray-100 p-6 rounded-md shadow-md" onSubmit={handleCreateContract}>
  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create New Contract</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block font-medium text-gray-700">Receiver Address</label>
      <input
        type="text"
        name="receiver"
        value={formData.receiver}
        onChange={handleChange}
        className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800"
        required
      />
    </div>
    <div>
      <label className="block font-medium text-gray-700">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800"
        required
      />
    </div>
    <div>
      <label className="block font-medium text-gray-700">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800"
        rows="3"
        required
      />
    </div>
    <div>
      <label className="block font-medium text-gray-700">Coin Type</label>
      <select
        name="coinType"
        value={formData.coinType}
        onChange={handleChange}
        className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800"
      >
        <option value="ETH">ETH</option>
        <option value="BTC">BTC</option>
      </select>
    </div>
    <div>
      <label className="block font-medium text-gray-700">Duration (days)</label>
      <input
        type="number"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800"
        required
      />
    </div>
    <div>
      <label className="block font-medium text-gray-700">Contract Type</label>
      <select
        name="contractType"
        value={formData.contractType}
        onChange={handleChange}
        className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800"
      >
        <option value="Basic">Basic</option>
        <option value="Advanced">Advanced</option>
      </select>
    </div>
    <div>
      <label className="block font-medium text-gray-700">Amount (ETH)</label>
      <input
        type="text"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-800"
        required
      />
    </div>
  </div>

  <button
    type="submit"
    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
  >
    Create Contract
  </button>
</form>


        {/* Section to fetch and display contract details */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">View Contract Details</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Contract ID"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="w-full border rounded-md p-2"
            />
            <button
              onClick={handleGetContractDetails}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Fetch Details
            </button>
          </div>

          {contractDetails && (
            <div className="bg-gray-100 p-4 rounded-md mt-4">
              <h3 className="text-xl font-bold">Contract Details</h3>
              <p><strong>Title:</strong> {contractDetails.title}</p>
              <p><strong>Description:</strong> {contractDetails.description}</p>
              <p><strong>Status:</strong> {contractDetails.status}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Contract;
