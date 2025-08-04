import React from "react";
import { FilePlus, Search, Star, Compass } from "lucide-react";

const ContractIntro = ({ onToggleView, activeView, onStartTour }) => {
  const getButtonClass = (viewName) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold shadow-md transition-all duration-300 ${
      activeView === viewName
        ? "bg-purple-600 text-white"
        : "bg-gray-700/80 text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <div
      data-driver="contract-intro"
      className="bg-[#16192E] p-8 rounded-lg border border-gray-700/50"
    >
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white mb-3">
          Smart Work Commitment (SWC)
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Manage secure, milestone-based contracts on the blockchain. Create
          new agreements, track existing ones, and verify user reputation.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-6">
        <button
          onClick={() => onToggleView(activeView === "create" ? null : "create")}
          className={getButtonClass("create")}
          data-driver="create-contract"
        >
          <FilePlus size={18} />
          Create Contract
        </button>

        <button
          onClick={() => onToggleView(activeView === "fetch" ? null : "fetch")}
          className={getButtonClass("fetch")}
          data-driver="fetch-contract"
        >
          <Search size={18} />
          Fetch Contract
        </button>

        <button
          onClick={() => onToggleView(activeView === "reputation" ? null : "reputation")}
          className={getButtonClass("reputation")}
        >
          <Star size={18} />
          Check Reputation
        </button>
      </div>
    </div>
  );
};

export default ContractIntro;