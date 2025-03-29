import React from "react";
import useContract from "../../hooks/useContract";
import useContract2 from "../../hooks/useContract2"; // Import SWC hook for reputation

const UserBalance = ({ registeredName, provider }) => {
  const { userAddress, balance, fetchBalance, pendingBalance } = useContract(provider);
  const { reputation } = useContract2(provider); // Get reputation from SWC

  return (
    <div className="bg-customDark border-y-4 border-customPurple rounded-md text-white p-5 shadow-custom-purple flex flex-col justify-between">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      {registeredName && (
        <>
          <p className="text-md lg:text-xl font-semibold">Registered Name:</p>
          <p className="text-lg font-bold text-green-400">{registeredName}</p>
        </>
      )}
      <p className="text-md lg:text-xl font-semibold mt-3">Wallet Address:</p>
      <p className="text-sm lg:text-lg break-all text-gray-300">{userAddress || "Not connected"}</p>
      <p className="text-md lg:text-xl font-semibold mt-3">ETH Balance:</p>
      <p className="text-lg font-bold text-green-400">{balance} ETH</p>
      <p className="text-md lg:text-xl font-semibold mt-3">Pending Balance:</p>
      <p className="text-lg font-bold text-yellow-400">{pendingBalance} ETH</p>
      <p className="text-md lg:text-xl font-semibold mt-3">Reputation Score:</p>
      <p className="text-lg font-bold text-blue-400">{reputation}</p>
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