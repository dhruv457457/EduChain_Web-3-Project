import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

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
      ? new Date(timestamp * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
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
      setMilestoneData({
        title: "",
        amount: "",
        deadline: null,
        deliverables: "",
      });
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
      if (!isCreator && !isReceiver) {
        throw new Error("Only contract parties can approve");
      }
      await contractHooks.approveContract(contractId);
      toast.success("Contract approved!");
      await handleGetContractDetails();
    } catch (err) {
      toast.error(err.message || "Failed to approve contract");
    }
  };

  return (
    <div data-driver="fetch-contract" className="bg-customDark p-6 rounded-lg mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <p
                className={`font-medium ${
                  contractDetails.status === 1 ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {STATUS_LABELS[Number(contractDetails.status)] || "Unknown"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Amount</label>
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
              className="bg-customBlue hover:bg-customBlue2 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Approving..." : "Approve Contract"}
            </button>
          )}

          {milestones.map((milestone, index) => (
            <div key={index} className="bg-customInput p-4 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Milestone: {milestone.title}</h4>
                  <p className="text-sm text-gray-400">
                    Amount: {milestone.amount} {contractDetails.coinType}
                  </p>
                  <p className="text-sm text-gray-400">
                    Deadline: {formatDate(milestone.deadline)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Deliverables: {milestone.deliverables}
                  </p>
                  <p className="text-sm text-gray-400">
                    Completed: {formatDate(milestone.completedTimestamp)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Approved: {formatDate(milestone.approvedTimestamp)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Approval Cooldown: {milestone.approvalCooldown} seconds
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      milestone.isPaid
                        ? "bg-green-600"
                        : milestone.isApproved
                        ? "bg-customBlue2"
                        : "bg-customDark"
                    }`}
                  >
                    {milestone.isPaid ? "Paid" : milestone.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    handleMilestoneAction(
                      contractHooks.completeMilestone,
                      "Milestone completed!",
                      index
                    )
                  }
                  className={`text-sm px-3 py-1 rounded ${
                    milestone.isCompleted ||
                    currentAccount?.toLowerCase() !== contractDetails.creator.toLowerCase()
                      ? "bg-gray-400 opacity-75 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                  }`}
                  disabled={milestone.isCompleted || currentAccount?.toLowerCase() !== contractDetails.creator.toLowerCase()}
                >
                  Complete
                </button>
                <button
                  onClick={() =>
                    handleMilestoneAction(
                      contractHooks.approveMilestone,
                      "Milestone approved!",
                      index
                    )
                  }
                  className={`text-sm px-3 py-1 rounded ${
                    milestone.isApproved ||
                    currentAccount?.toLowerCase() !== contractDetails.receiver.toLowerCase()
                      ? "bg-gray-400 opacity-75 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                  disabled={milestone.isApproved || currentAccount?.toLowerCase() !== contractDetails.receiver.toLowerCase()}
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleMilestoneAction(
                      contractHooks.releaseMilestonePayment,
                      "Payment released!",
                      index
                    )
                  }
                  className={`text-sm px-3 py-1 rounded ${
                    milestone.isPaid
                      ? "bg-gray-400 opacity-75 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 cursor-pointer"
                  }`}
                  disabled={milestone.isPaid}
                >
                  Release Payment
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Add New Milestone</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Enter milestone title"
                  value={milestoneData.title}
                  onChange={(e) => setMilestoneData({ ...milestoneData, title: e.target.value })}
                  className="w-full bg-gray-100 p-2 rounded-md text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount</label>
                <input
                  type="number"
                  placeholder="Enter milestone amount"
                  value={milestoneData.amount}
                  onChange={(e) => setMilestoneData({ ...milestoneData, amount: e.target.value })}
                  className="w-full bg-gray-100 p-2 rounded-md text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Deadline</label>
                <DatePicker
                  selected={milestoneData.deadline}
                  onChange={(date) => setMilestoneData({ ...milestoneData, deadline: date })}
                  showTimeSelect
                  dateFormat="Pp"
                  minDate={new Date()}
                  className="w-full bg-gray-100 p-2 rounded-md text-gray-800"
                  required
                  placeholderText="Select deadline"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Deliverables</label>
                <input
                  type="text"
                  placeholder="Enter milestone deliverables"
                  value={milestoneData.deliverables}
                  onChange={(e) =>
                    setMilestoneData({ ...milestoneData, deliverables: e.target.value })
                  }
                  className="w-full bg-gray-100 p-2 rounded-md text-gray-800"
                  required
                />
              </div>
            </div>
            <button
              onClick={handleAddMilestone}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Milestone"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchContractSection;