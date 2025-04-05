import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useWallet } from "../components/Global/WalletContext";
import UserDashboard from "../components/UserModule/UserDashboard";
import LoaderButton from "../components/Global/Loader";
import { useNavigate } from "react-router-dom";

const User = () => {
  const { walletData } = useWallet();
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    if (!walletData?.provider) {
      toast.error(
        "⚠️ Please connect your wallet to access the user dashboard."
      );

      // ⏳ Wait for 2 seconds before redirecting
      setTimeout(() => {
        navigate("/");
      }, 2000);

      return;
    }

    timeout = setTimeout(() => {
      setIsReady(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, [walletData, navigate]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      {!isReady ? (
        <div className="flex justify-center items-center h-screen">
          <LoaderButton />
        </div>
      ) : (
        <UserDashboard />
      )}
    </>
  );
};

export default User;
