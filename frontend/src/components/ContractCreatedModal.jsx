import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const ContractCreatedModal = ({ contractId, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4 bg-green-100 rounded-full p-4 inline-block">
            <Check className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Contract Created Successfully
          </h2>
          <p className="text-gray-600 mb-6">
            Your contract has been created. Please save your Contract ID.
          </p>
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 mb-6">
            <span className="text-lg text-gray-800 font-medium mr-4 truncate max-w-[200px]">
              {contractId}
            </span>
            <button
              onClick={handleCopy}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Copy Contract ID"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
          </div>
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractCreatedModal;