import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UserBalance from "./UserBalance";
import RegisterName from "./RegisterName";
import UserTransactions from "./UserTransactions";
import UserContracts from "./UserContracts";
import { useWallet } from "../Global/WalletContext";
import useContract2 from "../../hooks/useContract2";
import useUsernameRegistry from "../../hooks/useUsernameRegistry";
import LoaderButton from "../Global/Loader";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const UserDashboard = () => {
  const { walletData } = useWallet();
  const navigate = useNavigate();

  const { username, isRegistered } = useUsernameRegistry(walletData?.provider);
  const swc = useContract2(walletData?.provider);

  const [registeredName, setRegisteredName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reputation = swc.reputation || "500";

  const isHookInitialized = useMemo(() => swc?.contract && swc?.signer, [swc]);

  useEffect(() => {
    if (!walletData?.provider) {
      setError("Wallet not connected.");
      setLoading(false);
      return;
    }

    if (isHookInitialized) {
      setLoading(false);
    }
  }, [walletData, isHookInitialized]);

  useEffect(() => {
    if (isRegistered && username) {
      setRegisteredName(username);
    }
  }, [isRegistered, username]);

  useEffect(() => {
    const shouldStartTour = localStorage.getItem("startUserTour");

    if (shouldStartTour === "true") {
      localStorage.removeItem("startUserTour");

      const profileTour = new driver({
        showProgress: true,
        showButtons: true,
        allowClose: true,
        opacity: 0.1,
        stageBackground: "rgba(0, 0, 0, 0.6)",
        highlightedClass: "driver-highlight",
        steps: [
          {
            element: '[data-driver="user-balance"]',
            popover: { title: "Your Balance 💰", description: "View your total balance and earnings here.", position: "bottom" },
          },
          {
            element: '[data-driver="register-name"]',
            popover: { title: "Register Your Name 🏷️", description: "Set up a unique username for transactions.", position: "bottom" },
          },
          {
            element: '[data-driver="user-transactions"]',
            popover: { title: "Transaction History 📜", description: "Check all your past transactions here.", position: "bottom" },
          },
          {
            element: '[data-driver="user-contracts"]',
            popover: { title: "Your Contracts 📄", description: "Manage your smart contracts easily.", position: "bottom" },
          },
        ],
        onDestroyed: () => {
          localStorage.setItem("startTransactionTour", "true");
          setTimeout(() => navigate("/transfer"), 100);
        },
      });

      setTimeout(() => profileTour.drive(), 400);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderButton loading={true} text="Initializing Dashboard" />
      </div>
    );
  }

  if (error || !walletData?.provider) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-400 text-lg font-medium">
          ❌ {error || "Wallet not connected. Please connect your wallet to continue."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-customDarkpurple min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center max-w-2xl pt-10">
        <h1 className="text-customPurple text-2xl md:text-4xl font-bold text-shadow-custom">
          Welcome, {registeredName || "User"}
        </h1>
      </div>

      <div className="mt-12 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div data-driver="user-balance" className="flex flex-col gap-6">
          <UserBalance
            registeredName={registeredName}
            provider={walletData?.provider}
            reputation={reputation}
          />
          <div data-driver="register-name">
            <RegisterName
              setGlobalRegisteredName={setRegisteredName}
              provider={walletData?.provider}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div data-driver="user-transactions">
            <UserTransactions provider={walletData?.provider} />
          </div>
          <div data-driver="user-contracts">
            <UserContracts provider={walletData?.provider} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;