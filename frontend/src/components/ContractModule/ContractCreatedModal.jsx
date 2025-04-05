import React, { useState } from "react";
import { Copy, Check, X } from "lucide-react";

const ContractCreatedModal = ({ contractId, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="mb-4 bg-green-100 rounded-full p-4 inline-block shadow">
            <Check className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Contract Created!
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Your contract has been created successfully. Please copy and save your Contract ID.
          </p>

          <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3 mb-6">
            <span className="text-base text-gray-800 font-mono truncate max-w-[200px]">
              {contractId}
            </span>
            <button
              onClick={handleCopy}
              className="text-gray-600 hover:text-gray-900 transition"
              aria-label="Copy Contract ID"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractCreatedModal;
