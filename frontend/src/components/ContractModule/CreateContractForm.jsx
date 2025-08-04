import React, { useState } from "react";
import { toast } from "react-toastify";
import ContractCreatedModal from "./ContractCreatedModal";
import LoaderButton from "../Global/LoaderButton";

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

  const inputClass = (hasError) =>
    `w-full p-3 rounded-md bg-gray-900/50 text-white border ${
      hasError ? "border-red-500" : "border-gray-700"
    } focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none`;


  return (
    <>
      <div className="bg-[#16192E] p-8 rounded-lg border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Create New Contract
        </h2>
        <form
          onSubmit={handleCreateContract}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Receiver Username
            </label>
            <input
              type="text"
              name="receiverUsername"
              value={formData.receiverUsername}
              onChange={handleChange}
              placeholder="Enter receiver's username"
              className={inputClass(errors.receiverUsername)}
              required
            />
            {errors.receiverUsername && (
              <p className="text-red-500 text-xs mt-1">{errors.receiverUsername}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Website Development"
              className={inputClass(errors.title)}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the terms of the contract"
              className={inputClass(errors.description)}
              rows="4"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter total amount"
              step="0.01"
              min="0"
              className={inputClass(errors.amount)}
              required
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Deadline</label>
            <input
              type="text"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
              className={inputClass(errors.deadline)}
              required
            />
            {errors.deadline && (
              <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
            )}
          </div>
          <div className="md:col-span-2 mt-4">
            <LoaderButton
              onClick={handleCreateContract}
              loading={loading}
              text="Create Contract"
              color="purple"
            />
          </div>
        </form>
      </div>

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