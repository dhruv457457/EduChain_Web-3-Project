import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

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
      if (!title || !amount || !deadline || !deliverables) {
        throw new Error("All fields are required");
      }
      const unixDeadline = Math.floor(deadline.getTime() / 1000);
      await contractHooks.addMilestone(contractId, title, amount, unixDeadline, deliverables);
      toast.success("Milestone added!");
      setMilestoneData({ title: "", amount: "", deadline: null, deliverables: "" });
      await handleGetContractDetails();
    } catch (err) {
      toast.error(err.message || "Failed to add milestone");
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
            className="w-full bg-white p-3 rounded-md text-gray-800 shadow-sm"
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
            className="w-full bg-white p-3 rounded-md text-gray-800 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Deadline</label>
          <DatePicker
            selected={milestoneData.deadline}
            onChange={(date) => setMilestoneData({ ...milestoneData, deadline: date })}
            showTimeSelect
            dateFormat="Pp"
            minDate={new Date()}
            className="w-full bg-white p-3 rounded-md text-gray-800 shadow-sm"
            required
            placeholderText="Select deadline"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Deliverables</label>
          <input
            type="text"
            placeholder="Enter deliverables"
            value={milestoneData.deliverables}
            onChange={(e) => setMilestoneData({ ...milestoneData, deliverables: e.target.value })}
            className="w-full bg-white p-3 rounded-md text-gray-800 shadow-sm"
            required
          />
        </div>
      </div>
      <button
        onClick={handleAddMilestone}
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md shadow"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Milestone"}
      </button>
    </div>
  );
};

export default AddMilestoneForm;