import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserBalance from "./UserBalance";
import RegisterName from "./RegisterName";
import UserTransactions from "./UserTransactions";
import UserContracts from "./UserContracts";
import { useWallet } from "../Global/WalletContext";
import useContract2 from "../../hooks/useContract2";
import useUsernameRegistry from "../../hooks/useUsernameRegistry";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const UserDashboard = () => {
  const { walletData } = useWallet();
  const { username, isRegistered } = useUsernameRegistry(walletData?.provider);
  const [registeredName, setRegisteredName] = useState(null);
  const swc = useContract2(walletData?.provider);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("UserDashboard walletData:", walletData); // Debug
    if (isRegistered && username) {
      setRegisteredName(username);
    }
  }, [isRegistered, username, walletData]);

  if (!walletData?.provider) {
    return (
      <p className="text-red-400 text-center mt-10">
        Please connect your wallet.
      </p>
    );
  }

  useEffect(() => {
    const shouldStartTour = localStorage.getItem("startUserTour");
  
    if (shouldStartTour === "true") {
      localStorage.removeItem("startUserTour"); // ✅ Remove only after confirmation
  
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
            popover: {
              title: "Your Balance 💰",
              description: "View your total balance and earnings here.",
              position: "bottom",
            },
          },
          {
            element: '[data-driver="register-name"]',
            popover: {
              title: "Register Your Name 🏷️",
              description: "Set up a unique username for transactions.",
              position: "bottom",
            },
          },
          {
            element: '[data-driver="user-transactions"]',
            popover: {
              title: "Transaction History 📜",
              description: "Check all your past transactions here.",
              position: "bottom",
            },
          },
          {
            element: '[data-driver="user-contracts"]',
            popover: {
              title: "Your Contracts 📄",
              description: "Manage your smart contracts easily.",
              position: "bottom",
            },
          },
          {
            element: '[data-driver="transfer-button"]',
            popover: {
              title: "Transfer Funds 🔁",
              description: "Click here to transfer funds securely.",
              position: "bottom",
            },
          },
        ],
        onDestroyed: () => {
          console.log("Tour finished, navigating to transfer page...");
          localStorage.setItem("startTransactionTour", "true"); // ✅ Only set transaction tour flag
          setTimeout(() => navigate("/transfer"), 100);
        },
      });
  
      setTimeout(() => profileTour.drive(), 500); // ✅ Ensure the tour starts after rendering
    }
  }, [navigate]);
  
  
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
        <div data-driver="user-balance">
          <UserBalance
            registeredName={registeredName}
            provider={walletData?.provider}
            reputation={swc.reputation}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div data-driver="register-name">
            <RegisterName
              setGlobalRegisteredName={setRegisteredName}
              provider={walletData?.provider}
            />
          </div>
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
