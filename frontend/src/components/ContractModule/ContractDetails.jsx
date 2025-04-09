import React from "react";

const ContractDetails = ({ contractDetails, statusLabels }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-customInput p-4 rounded-lg shadow-md">
      <div>
        <label className="text-sm text-gray-400">Status</label>
        <p className="font-semibold text-purple-300">
          {statusLabels[Number(contractDetails.status)] || "Unknown"}
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
  );
};

export default ContractDetails;