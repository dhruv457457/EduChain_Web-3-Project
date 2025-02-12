// UserBalance.js
import React from "react";
import useContract from "../hooks/useContract";

const UserBalance = () => {
  const { userAddress, balance, fetchBalance } = useContract();

  return (
    <div className="bg-customDark text-white p-4 rounded-lg shadow-custom-purple w-full max-w-md  border border-customPurple">
      <h1 className="text-2xl font-bold text-white mb-4">User Dashboard</h1>
      <p className="text-lg font-semibold">Wallet Address:</p>
      <p className="text-sm break-all">{userAddress || "Not connected"}</p>

      <p className="text-lg font-semibold mt-4">ETH Balance:</p>
      <p className="text-sm">{balance} ETH</p>

      <button
        onClick={() => fetchBalance(userAddress)}
        className="mt-2 px-4 py-2 bg-customPurple text-white rounded-md w-full"
      >
        Refresh Balance
      </button>
    </div>
  );
};

export default UserBalance;
