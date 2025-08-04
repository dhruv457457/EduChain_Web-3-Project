import React from "react";
import useContract from "../../hooks/useContract";
import useContract2 from "../../hooks/useContract2";
import LoaderButton from "../Global/LoaderButton"; // Updated import

const UserBalance = ({ registeredName, provider }) => {
  const { userAddress, balance, fetchBalance, pendingBalance, isLoading } =
    useContract(provider);
  const { reputation } = useContract2(provider);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <LoaderButton loading={true} text="Loading Balance" />
      </div>
    );

  return (
    <div className="bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30  rounded-md text-white p-5">
    <p className="text-md lg:text-xl font-semibold mt-3">Wallet Address:</p>
    <p className="text-sm lg:text-lg break-all text-gray-300">{userAddress || "Not connected"}</p>
  
  
    <p className="text-md lg:text-xl font-semibold mt-3">ETH Balance:</p>
    <p className="text-lg font-bold text-green-400">{balance} ETH</p>
  
    <p className="text-md lg:text-xl font-semibold mt-3">Pending Balance:</p>
    <p className="text-lg font-bold text-yellow-400">{pendingBalance} ETH</p>
  
    <p className="text-md lg:text-xl font-semibold mt-3">Reputation Score:</p>
    <p className="text-lg font-bold text-blue-400">{reputation}</p>
  
    <p className="text-md lg:text-xl font-semibold mt-3">Reputation Tier:</p>
    <p className="text-lg font-bold text-purple-400">
      {reputation >= 80 ? "Expert" : reputation >= 50 ? "Trusted" : "Beginner"}
    </p>
  
    {/* Motivational Message */}
    {balance >= 1 && (
      <p className="mt-3 italic text-sm text-green-300">💸 You’re doing great! Keep earning.</p>
    )}
    {reputation < 30 && (
      <p className="mt-3 italic text-sm text-yellow-300">🚀 Build your reputation by completing tasks.</p>
    )}
  
    <div className="mt-4">
      <LoaderButton
        onClick={() => fetchBalance(userAddress)}
        loading={isLoading}
        text="Refresh Balance"
        color="purple"
      />
    </div>
  </div>
  
  );
};

export default UserBalance;
