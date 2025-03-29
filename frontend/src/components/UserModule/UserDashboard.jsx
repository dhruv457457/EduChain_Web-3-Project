import React, { useState, useEffect } from "react";
import UserBalance from "./UserBalance";
import RegisterName from "./RegisterName";
import UserTransactions from "./UserTransactions";
import UserContracts from "./UserContracts";
import { useWallet } from "../Global/WalletContext";
import useContract2 from "../../hooks/useContract2";
import useUsernameRegistry from "../../hooks/useUsernameRegistry";

const UserDashboard = () => {
  const { walletData } = useWallet();
  const { username, isRegistered } = useUsernameRegistry(walletData?.provider);
  const [registeredName, setRegisteredName] = useState(null);
  const swc = useContract2(walletData?.provider);

  useEffect(() => {
    console.log("UserDashboard walletData:", walletData); // Debug
    if (isRegistered && username) {
      setRegisteredName(username);
    }
  }, [isRegistered, username, walletData]);

  if (!walletData?.provider) {
    return <p className="text-red-400 text-center mt-10">Please connect your wallet.</p>;
  }

  return (
    <div className="bg-customSemiPurple min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center max-w-2xl pt-10">
        <h1 className="text-customPurple text-2xl md:text-4xl font-bold">
          Welcome, {registeredName || "User"}
        </h1>
        <p className="text-slate-400 font-medium text-lg md:text-xl mt-4">
          Manage your profile and view your activity across Cryptify
        </p>
        <p className="text-slate-400 font-medium text-lg md:text-xl mt-2">
          Reputation Score: {swc.reputation}
        </p>
      </div>

      <div className="mt-12 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        <UserBalance
          registeredName={registeredName}
          provider={walletData?.provider}
          reputation={swc.reputation}
        />
        <div className="flex flex-col gap-6">
          <RegisterName setGlobalRegisteredName={setRegisteredName} provider={walletData?.provider} />
          <UserTransactions provider={walletData?.provider} />
          <UserContracts provider={walletData?.provider} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;