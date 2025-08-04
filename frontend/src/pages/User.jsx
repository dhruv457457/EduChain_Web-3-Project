import  { useEffect, useState } from "react";
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
    }, 0);

    return () => clearTimeout(timeout);
  }, [walletData, navigate]);

  return (
   <div className="bg-[#0B0E1F] min-h-screen relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]" />
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />

      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="relative z-10">
        {!isReady ? (
          <div className="flex justify-center items-center h-screen bg-[#0B0E1F]">
            <LoaderButton />
          </div>
        ) : (
          <UserDashboard />
        )}
      </div>
    </div>
  );
};


export default User;