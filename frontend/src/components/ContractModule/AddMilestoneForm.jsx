import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css"; // Import default styles

const AddMilestoneForm = ({ contractId, contractHooks, handleGetContractDetails, loading }) => {
  const [milestoneData, setMilestoneData] = useState({
    title: "",
    amount: "",
    deadline: null,
    deliverables: "",
  });

  const handleAddMilestone = async () => {
    try {
      const { title, amount, deadline, deliverables } = milestoneData;

      // Validation
      if (!title || !amount || !deadline || !deliverables) {
        throw new Error("All fields are required");
      }
      if (isNaN(amount) || Number(amount) <= 0) {
        throw new Error("Amount must be a positive number");
      }
      const now = new Date();
      if (deadline <= now) {
        throw new Error("Deadline must be in the future");
      }

      const unixDeadline = Math.floor(deadline.getTime() / 1000);
      await contractHooks.addMilestone(contractId, title, amount, unixDeadline, deliverables);
      toast.success("Milestone added!");
      setMilestoneData({ title: "", amount: "", deadline: null, deliverables: "" });
      await handleGetContractDetails();
    } catch (err) {
      // Improved error handling
      let errorMessage = "Failed to add milestone";
      if (err.message.includes("All fields are required")) {
        errorMessage = "Please fill in all fields";
      } else if (err.message.includes("Amount must be a positive number")) {
        errorMessage = "Amount must be a positive number";
      } else if (err.message.includes("Deadline must be in the future")) {
        errorMessage = "Deadline must be in the future";
      } else if (err.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds to add milestone";
      } else if (err.message.includes("user rejected transaction")) {
        errorMessage = "Transaction rejected by user";
      }
      toast.error(errorMessage);
      console.error("Add milestone error:", err); // Log detailed error
    }
  };

  return (
    <div className="mt-6 p-4 bg-customInput rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-white">Add New Milestone</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter milestone title"
            value={milestoneData.title}
            onChange={(e) => setMilestoneData({ ...milestoneData, title: e.target.value })}
            className="w-full p-3 rounded-md bg-customInput/80 text-white placeholder-gray-400 border border-customPurple/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            placeholder="Enter milestone amount"
            value={milestoneData.amount}
            onChange={(e) => setMilestoneData({ ...milestoneData, amount: e.target.value })}
            className="w-full bg-customInput/80 text-white placeholder-gray-400 border border-customPurple/60 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Deadline</label>
          <DatePicker
            selected={milestoneData.deadline}
            onChange={(date) => setMilestoneData({ ...milestoneData, deadline: date })}
            showTimeSelect
            dateFormat="Pp" // e.g., "10/15/2025 2:30 PM"
            minDate={new Date()} // Prevents past dates
            className="w-full bg-customInput/80 text-white placeholder-gray-400 border border-customPurple/60 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholderText="Select deadline"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Deliverables</label>
          <input
            type="text"
            placeholder="Enter deliverables"
            value={milestoneData.deliverables}
            onChange={(e) => setMilestoneData({ ...milestoneData, deliverables: e.target.value })}
            className="w-full bg-customInput/80 text-white placeholder-gray-400 border border-customPurple/60 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
      </div>
      <button
        onClick={handleAddMilestone}
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md shadow disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Milestone"}
      </button>
    </div>
  );
};

export default AddMilestoneForm;