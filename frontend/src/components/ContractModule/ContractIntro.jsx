import React from "react";
import { FilePlus, Search, Compass, Star } from "lucide-react";

const ContractIntro = ({
  showCreateForm,
  showFetchForm,
  showReputationFetcher, // New prop
  showWorkPostForm,
  onToggleCreateForm,
  onToggleFetchForm,
  onToggleReputationFetcher, // New callback
  onToggleWorkPostForm,
  onStartTour,
  contractHooks,
  walletProvider,
}) => {
  return (
    <div
      data-driver="contract-intro"
      className="bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 p-8 rounded-xl space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white mb-2">
          🚀 Welcome to the SWC System
        </h2>
        <p className="text-gray-300 max-w-3xl text-xl mx-auto">
          Manage milestone-based contracts and work posts securely on the
          blockchain. You can create new contracts, manage existing ones, handle
          proposals, and check anyone's reputation score using their username.
        </p>
      </div>

      <ul className="list-disc list-inside text-gray-400 text-xl px-4">
        <li>Create contracts with milestones</li>
        <li>Fetch and manage existing contracts</li>
        <li>Check user reliability with their Reputation Score.</li>
      </ul>

      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <button
          onClick={onToggleCreateForm}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-semibold shadow transition"
        >
          <FilePlus size={18} />
          {showCreateForm ? "Hide Create Form" : "Create Contract"}
        </button>

        <button
          onClick={onToggleFetchForm}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow transition"
        >
          <Search size={18} />
          {showFetchForm ? "Hide Fetch Form" : "Fetch Contract"}
        </button>

        <button
          onClick={onToggleReputationFetcher}
          className="flex items-center gap-2 bg-customNeonGreen hover:bg-customNeonGreen/80 text-black px-5 py-2 rounded-full font-semibold shadow transition"
        >
          <Star size={18} />
          {showReputationFetcher ? "Hide Reputation" : "See Reputation Score"}
        </button>
      </div>

      {/* Start Tour Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onStartTour}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-full shadow transition"
        >
          <Compass size={18} /> Start Tour Manually
        </button>
      </div>
    </div>
  );
};

export default ContractIntro;
