import React from "react";
import useContract from "../../hooks/useContract";
import useContract2 from "../../hooks/useContract2";
import LoaderButton from "../Global/LoaderButton"; // Updated import

const UserBalance = ({ registeredName, provider }) => {
  const { userAddress, balance, fetchBalance, pendingBalance, isLoading } = useContract(provider);
  const { reputation } = useContract2(provider);

  if (isLoading) return (
    <div className="flex justify-center items-center h-32">
      <LoaderButton loading={true} text="Loading Balance" />
    </div>
  );

  return (
    <div className="bg-customDark rounded-md text-white p-5 shadow-custom-purple">
      <p className="text-md lg:text-xl font-semibold mt-3">Wallet Address:</p>
      <p className="text-sm lg:text-lg break-all text-gray-300">{userAddress || "Not connected"}</p>
      <p className="text-md lg:text-xl font-semibold mt-3">ETH Balance:</p>
      <p className="text-lg font-bold text-green-400">{balance} ETH</p>
      <p className="text-md lg:text-xl font-semibold mt-3">Pending Balance:</p>
      <p className="text-lg font-bold text-yellow-400">{pendingBalance} ETH</p>
      <p className="text-md lg:text-xl font-semibold mt-3">Reputation Score:</p>
      <p className="text-lg font-bold text-blue-400">{reputation}</p>
      <LoaderButton
        onClick={() => fetchBalance(userAddress)}
        loading={isLoading}
        text="Refresh Balance"
        color="purple"
      />
    </div>
  );
};

export default UserBalance;