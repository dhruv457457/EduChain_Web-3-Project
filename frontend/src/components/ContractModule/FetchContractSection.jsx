import React, { useState } from "react";
import ContractDetails from "./ContractDetails";
import MilestoneList from "./MilestoneList";
import AddMilestoneForm from "./AddMilestoneForm";

const STATUS_LABELS = [
  "Pending", "Approved", "In Progress", "Completed", "Cancelled", "Disputed",
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
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  const canAddMilestone =
    contractDetails?.creator?.toLowerCase() === currentAccount?.toLowerCase() &&
    contractDetails?.status !== 3; // Not Completed

  return (
    <div className="bg-[#16192E] p-8 rounded-lg border border-gray-700/50 space-y-6">
      <h2 className="text-2xl font-bold text-white">Fetch Contract Details</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Enter Contract ID"
          className="flex-1 p-3 rounded-md bg-gray-900/50 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
        />
        <button
          onClick={handleGetContractDetails}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Details"}
        </button>
      </div>

      {contractDetails && (
        <div className="space-y-6 pt-4 border-t border-gray-700">
          <ContractDetails
            contractDetails={contractDetails}
            statusLabels={STATUS_LABELS}
          />
          <MilestoneList
            milestones={milestones}
            contractDetails={contractDetails}
            currentAccount={currentAccount}
            contractHooks={contractHooks}
            contractId={contractId}
            handleGetContractDetails={handleGetContractDetails}
            loading={loading}
          />

          {canAddMilestone && (
            <div>
              <button
                onClick={() => setShowMilestoneForm((prev) => !prev)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold transition"
              >
                {showMilestoneForm ? "Cancel" : "+ Add Milestone"}
              </button>
              {showMilestoneForm && (
                <AddMilestoneForm
                  contractId={contractId}
                  contractHooks={contractHooks}
                  handleGetContractDetails={handleGetContractDetails}
                  loading={loading}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FetchContractSection;