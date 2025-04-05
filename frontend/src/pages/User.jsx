import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useWallet } from "../components/Global/WalletContext";
import UserDashboard from "../components/UserModule/UserDashboard";
import LoaderButton from "../components/Global/LoaderButton"; // Updated import

const User = () => {
  const { walletData } = useWallet();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timeout;
    if (walletData?.provider) {
      timeout = setTimeout(() => {
        setIsReady(true);
      }, 200);
    }

    return () => clearTimeout(timeout);
  }, [walletData]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      {!isReady ? (
        <div className="flex justify-center items-center h-screen">
      
        </div>
      ) : !walletData?.provider ? (
        <p className="text-red-400 text-center mt-20 text-lg">
          ❌ Please connect your wallet to access your profile.
        </p>
      ) : (
        <UserDashboard />
      )}
    </>
  );
};

export default User;