import React from "react";
import { toast } from "react-toastify";
import { Check, ShieldCheck, DollarSign } from 'lucide-react';

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


   const getStatusBadge = (milestone) => {
    if (milestone.isPaid) return <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">Paid</span>;
    if (milestone.isApproved) return <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">Approved</span>;
    if (milestone.isCompleted) return <span className="px-2 py-1 text-xs font-medium text-white bg-purple-500 rounded-full">Completed</span>;
    return <span className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-600 rounded-full">Pending</span>;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Milestones</h3>
      {milestones.length > 0 ? milestones.map((milestone, index) => (
        <div key={index} className="bg-black/20 p-5 rounded-lg border border-gray-700/30 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-200">{milestone.title}</h4>
              <p className="text-sm text-gray-400">{milestone.deliverables}</p>
            </div>
            {getStatusBadge(milestone)}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
            <span><strong>Amount:</strong> {milestone.amount} {contractDetails.coinType}</span>
            <span><strong>Deadline:</strong> {new Date(milestone.deadline * 1000).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {/* Action Buttons with new styling */}
          </div>
        </div>
      )) : <p className="text-gray-400">No milestones added yet.</p>}
    </div>
  );
};

export default MilestoneList;