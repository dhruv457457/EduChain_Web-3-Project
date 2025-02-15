import React from "react";
import useContract from "../hooks/useContract";

const UserBalance = ({ registeredName }) => {
  const { userAddress, balance, fetchBalance } = useContract();

  return (
    <div className="bg-gray-900 text-white p-5 rounded-lg shadow-lg border border-customPurple">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      {registeredName && (
        <>
          <p className="text-md font-semibold">Registered Name:</p>
          <p className="text-lg text-green-400">{registeredName}</p>
        </>
      )}
      <p className="text-md font-semibold mt-3">Wallet Address:</p>
      <p className="text-sm break-all text-gray-300">{userAddress || "Not connected"}</p>
      <p className="text-md font-semibold mt-3">ETH Balance:</p>
      <p className="text-lg font-bold text-green-400">{balance} ETH</p>
      <button
        onClick={() => fetchBalance(userAddress)}
        className="mt-4 px-4 py-2 bg-customPurple hover:bg-purple-600 transition text-white rounded-lg w-full"
      >
        Refresh Balance
      </button>
    </div>
  );
};

export default UserBalance;
