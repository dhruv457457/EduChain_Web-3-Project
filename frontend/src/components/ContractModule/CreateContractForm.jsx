import React, { useState } from "react";
import { toast } from "react-toastify";
import ContractCreatedModal from "./ContractCreatedModal";
import { motion } from "framer-motion";

const CreateContractForm = ({ contractHooks, loading, setLoading }) => {
  const [formData, setFormData] = useState({
    receiverUsername: "",
    title: "",
    description: "",
    coinType: "EDU",
    amount: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({});
  const [createdContractId, setCreatedContractId] = useState(null);

  const coinTypes = ["EDU", "ETH", "USDT"];

  // Handle text/number input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate and parse DD/MM/YYYY format
  const parseDeadline = (deadlineStr) => {
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = deadlineStr.match(regex);
    if (!match) return null;

    const [_, day, month, year] = match;
    const paddedDay = day.padStart(2, "0");
    const paddedMonth = month.padStart(2, "0");
    const date = new Date(`${year}-${paddedMonth}-${paddedDay}`);

    if (
      isNaN(date.getTime()) ||
      date.getDate() !== parseInt(paddedDay) ||
      date.getMonth() + 1 !== parseInt(paddedMonth) ||
      date.getFullYear() !== parseInt(year)
    ) {
      return null;
    }
    return date;
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.receiverUsername.trim()) {
      newErrors.receiverUsername = "Receiver username is required";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required (DD/MM/YYYY)";
    } else {
      const parsedDate = parseDeadline(formData.deadline);
      if (!parsedDate) {
        newErrors.deadline = "Invalid date format. Use DD/MM/YYYY (e.g., 9/12/2025)";
      } else if (parsedDate < new Date()) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    try {
      const { receiverUsername, title, description, coinType, amount, deadline } = formData;

      // Parse deadline string to Date object
      const parsedDeadline = parseDeadline(deadline);
      const now = new Date();
      const durationInDays = Math.ceil((parsedDeadline - now) / (1000 * 60 * 60 * 24));

      const id = await contractHooks.createContract(
        receiverUsername,
        title,
        description,
        coinType,
        durationInDays,
        "Milestone",
        amount
      );

      setCreatedContractId(id);
      toast.success(`Contract created successfully! ID: ${id}`);
    } catch (err) {
      // Improved error handling
      let errorMessage = "Failed to create contract";
      if (err.revert?.args?.[0] === "Cannot create contract with yourself" || err.message.includes("Cannot create contract with yourself")) {
        errorMessage = "Cannot create contract with yourself";
      } else if (err.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds to create the contract";
      } else if (err.message.includes("user rejected transaction")) {
        errorMessage = "Transaction rejected by user";
      } else if (err.message.includes("network")) {
        errorMessage = "Network error, please try again later";
      } else if (err.message.includes("invalid")) {
        errorMessage = "Invalid input data";
      }
      toast.error(errorMessage);
      console.error("Contract creation error:", err); // Log detailed error to console
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        data-driver="create-contract"
        className="bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 p-8 rounded-xl shadow-lg mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-white text-center">Create New Contract</h2>
        <form
          onSubmit={handleCreateContract}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Receiver Username */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-300">
              Receiver Username
            </label>
            <input
              type="text"
              name="receiverUsername"
              value={formData.receiverUsername}
              onChange={handleChange}
              placeholder="Enter receiver username"
              className={`p-3 rounded-md bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                errors.receiverUsername ? "border-red-500 border" : ""
              }`}
              required
            />
            {errors.receiverUsername && (
              <p className="text-red-500 text-xs mt-1">{errors.receiverUsername}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter contract title"
              className={`p-3 rounded-md bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                errors.title ? "border-red-500 border" : ""
              }`}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 text-sm font-semibold text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the contract details"
              className={`p-3 rounded-md bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                errors.description ? "border-red-500 border" : ""
              }`}
              rows="4"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Coin Type */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-300">Coin Type</label>
            <select
              name="coinType"
              value={formData.coinType}
              onChange={handleChange}
              className="p-3 rounded-md bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              required
            >
              {coinTypes.map((coin) => (
                <option key={coin} value={coin}>
                  {coin}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-300">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              min="0"
              className={`p-3 rounded-md bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                errors.amount ? "border-red-500 border" : ""
              }`}
              required
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Deadline (Text Input) */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-300">Deadline</label>
            <input
              type="text"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              placeholder="DD/MM/YYYY (e.g., 9/12/2025)"
              className={`p-3 rounded-md bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                errors.deadline ? "border-red-500 border" : ""
              }`}
              required
            />
            {errors.deadline && (
              <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Contract"}
            </button>
          </div>
        </form>
      </motion.div>

      {createdContractId && (
        <ContractCreatedModal
          contractId={createdContractId}
          onClose={() => setCreatedContractId(null)}
        />
      )}
    </>
  );
};

export default CreateContractForm;