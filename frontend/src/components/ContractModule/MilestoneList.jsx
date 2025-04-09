import React from "react";
import { toast } from "react-toastify";

const MilestoneList = ({
  milestones,
  contractDetails,
  currentAccount,
  contractHooks,
  contractId,
  handleGetContractDetails,
  loading,
}) => {
  const formatDate = (timestamp) =>
    timestamp > 0
      ? new Date(timestamp * 1000).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

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
    <div>
      {contractDetails.status === 0 && (
        <button
          onClick={handleContractApproval}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-md shadow transition mb-6"
          disabled={loading}
        >
          {loading ? "Approving..." : "Approve Contract"}
        </button>
      )}

      {milestones.map((milestone, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-customInput to-customDark p-5 rounded-xl shadow-md space-y-2 mb-4"
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
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                  ${milestone.isPaid ? "bg-green-500" : milestone.isApproved ? "bg-blue-500" : "bg-yellow-500"} text-white`}
              >
                {milestone.isPaid ? "Paid" : milestone.isApproved ? "Approved" : "Pending"}
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
                ${milestone.isPaid ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
            >
              Release Payment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MilestoneList;