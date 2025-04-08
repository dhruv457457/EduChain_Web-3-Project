import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const STATUS_LABELS = [
  "Pending",
  "Approved",
  "InProgress",
  "Completed",
  "Cancelled",
  "Disputed",
];

const FetchContractSection = ({
  contractId,
  setContractId,
  contractDetails,
  milestones,
  currentAccount,
  loading,
  handleGetContractDetails,
  contractHooks,
}) => {
  const [milestoneData, setMilestoneData] = useState({
    title: "",
    amount: "",
    deadline: null,
    deliverables: "",
  });

  const formatDate = (timestamp) => {
    return timestamp > 0
      ? new Date(timestamp * 1000).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";
  };

  const handleMilestoneAction = async (actionFn, successMessage, milestoneId) => {
    try {
      if (!currentAccount) throw new Error("Connect your wallet first");
      await actionFn(contractId, milestoneId);
      await handleGetContractDetails();
      toast.success(successMessage);
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

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

  const handleContractApproval = async () => {
    try {
      if (!currentAccount) throw new Error("Connect your wallet first");
      const isCreator = currentAccount.toLowerCase() === contractDetails.creator.toLowerCase();
      const isReceiver = currentAccount.toLowerCase() === contractDetails.receiver.toLowerCase();
      if (!isCreator && !isReceiver) throw new Error("Only contract parties can approve");

      await contractHooks.approveContract(contractId);
      toast.success("Contract approved!");
      await handleGetContractDetails();
    } catch (err) {
      toast.error(err.message || "Failed to approve contract");
    }
  };

  return (
    <motion.div
      data-driver="fetch-contract"
      className="bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 p-6 rounded-lg mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Contract Details</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Enter Contract ID"
          className="flex-1 bg-gray-100 p-3 rounded-md text-gray-800"
        />
        <button
          onClick={handleGetContractDetails}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Details"}
        </button>
      </div>

      {contractDetails && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-customInput p-4 rounded-lg shadow-md">
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <p className="font-semibold text-purple-300">
                {STATUS_LABELS[Number(contractDetails.status)] || "Unknown"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Total Amount</label>
              <p className="font-medium">
                {contractDetails.amount} {contractDetails.coinType}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Remaining Balance</label>
              <p className="font-medium">
                {contractDetails.remainingBalance} {contractDetails.coinType}
              </p>
            </div>
          </div>

          {contractDetails.status === 0 && (
            <button
              onClick={handleContractApproval}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-md shadow transition"
              disabled={loading}
            >
              {loading ? "Approving..." : "Approve Contract"}
            </button>
          )}

          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-customInput to-customDark p-5 rounded-xl shadow-md space-y-2"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1 text-sm text-gray-300">
                  <p><strong className="text-white">Title:</strong> {milestone.title}</p>
                  <p>Amount: {milestone.amount} {contractDetails.coinType}</p>
                  <p>Deadline: {formatDate(milestone.deadline)}</p>
                  <p>Deliverables: {milestone.deliverables}</p>
                  <p>Completed: {formatDate(milestone.completedTimestamp)}</p>
                  <p>Approved: {formatDate(milestone.approvedTimestamp)}</p>
                  <p>Cooldown: {milestone.approvalCooldown}s</p>
                </div>
                <div className="flex-shrink-0 self-start">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${milestone.isPaid ? "bg-green-500" :
                      milestone.isApproved ? "bg-blue-500" :
                      "bg-yellow-500"} text-white`}>
                    {milestone.isPaid ? "Paid" :
                     milestone.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() =>
                    handleMilestoneAction(contractHooks.completeMilestone, "Milestone completed!", index)
                  }
                  disabled={milestone.isCompleted || currentAccount?.toLowerCase() !== contractDetails.creator.toLowerCase()}
                  className={`text-sm px-4 py-2 rounded transition font-medium 
                    ${milestone.isCompleted || currentAccount?.toLowerCase() !== contractDetails.creator.toLowerCase()
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"}`}
                >
                  Complete
                </button>

                <button
                  onClick={() =>
                    handleMilestoneAction(contractHooks.approveMilestone, "Milestone approved!", index)
                  }
                  disabled={milestone.isApproved || currentAccount?.toLowerCase() !== contractDetails.receiver.toLowerCase()}
                  className={`text-sm px-4 py-2 rounded transition font-medium 
                    ${milestone.isApproved || currentAccount?.toLowerCase() !== contractDetails.receiver.toLowerCase()
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleMilestoneAction(contractHooks.releaseMilestonePayment, "Payment released!", index)
                  }
                  disabled={milestone.isPaid}
                  className={`text-sm px-4 py-2 rounded transition font-medium 
                    ${milestone.isPaid
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"}`}
                >
                  Release Payment
                </button>
              </div>
            </div>
          ))}

          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">Add New Milestone</h3>
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
                  onChange={(e) =>
                    setMilestoneData({ ...milestoneData, deliverables: e.target.value })
                  }
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
        </div>
      )}
    </motion.div>
  );
};

export default FetchContractSection;
