import React, { useState } from "react";
import { motion } from "framer-motion";
import ContractDetails from "./ContractDetails";
import MilestoneList from "./MilestoneList";
import AddMilestoneForm from "./AddMilestoneForm";

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
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  const isCreator = currentAccount?.toLowerCase() === contractDetails?.creator?.toLowerCase();
  const canAddMilestone =
    isCreator &&
    contractDetails?.status !== 3 && // Not Completed
    Number(contractDetails?.remainingBalance) > 0;

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
          className="flex-1 bg-customInput/80 text-white placeholder-gray-400 border border-customPurple/60 p-3 rounded-md"
        />
        <button
          onClick={handleGetContractDetails}
          className="bg-customPurple hover:bg-customPurple/90 text-white px-6 py-3 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Details"}
        </button>
      </div>

      {contractDetails && (
        <div className="space-y-6">
          <ContractDetails contractDetails={contractDetails} statusLabels={STATUS_LABELS} />
          
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
            <div className="mt-6">
              <button
                onClick={() => setShowMilestoneForm(!showMilestoneForm)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md shadow"
              >
                {showMilestoneForm ? "Hide Form" : "Add New Milestone"}
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
    </motion.div>
  );
};

export default FetchContractSection;