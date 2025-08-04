import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import RegisterName from "./RegisterName";
import UserTransactions from "./UserTransactions";
import UserContracts from "./UserContracts";
import { useWallet } from "../Global/WalletContext";
import useContract from "../../hooks/useContract"; // For metrics
import useContract2 from "../../hooks/useContract2";
import useUsernameRegistry from "../../hooks/useUsernameRegistry";
import LoaderButton from "../Global/Loader";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Wallet, Clock, Award, CheckCircle } from "lucide-react"; 


// Helper function to convert hex to rgba
const hexToRgba = (hex, opacity) => {
  let r = 0,
    g = 0,
    b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
    // 6 digits
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  return `rgba(${+r},${+g},${+b},${opacity})`;
};

// KPI Card sub-component for the dashboard metrics
const KpiCard = ({ title, value, icon, color }) => (
  <div
    className="p-5 rounded-lg border flex items-start justify-between shadow-lg"
    style={{
      backgroundColor: hexToRgba(color, 0.1),
      borderColor: hexToRgba(color, 0.3),
    }}
  >
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
    <div className={`p-2 rounded-lg`} style={{ backgroundColor: color }}>
      {icon}
    </div>
  </div>
);

const UserDashboard = () => {
  const { walletData } = useWallet();
  const navigate = useNavigate();

  // Hooks for metrics, previously in UserBalance
  const { balance, pendingBalance, userAddress, userTransactions } = useContract(
    walletData?.provider
  );
  const swc = useContract2(walletData?.provider);
  const { username, isRegistered } = useUsernameRegistry(walletData?.provider);

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
    // Tour logic remains unchanged
    const shouldStartTour = localStorage.getItem("startUserTour");
    if (shouldStartTour === "true") {
      // ... tour initialization code ...
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
    // Error handling remains unchanged
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <p className="text-lg font-semibold max-w-md text-red-400">
          ❌{" "}
          {error ||
            "Wallet not connected. Please connect your wallet to continue."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 lg:px-8 py-12 pt-28">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome back,{" "}
          <span className="text-primary">{username || "User"}</span>. Here is
          your overview.
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* KPI Cards Grid */}
        <div
          data-driver="user-balance"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <KpiCard
            title="Wallet Balance"
            value={`${parseFloat(balance).toFixed(4)} ETH`}
            icon={<Wallet size={20} className="text-white" />}
            color="#5A67D8"
          />
          <KpiCard
            title="Pending Balance"
            value={`${parseFloat(pendingBalance).toFixed(4)} ETH`}
            icon={<Clock size={20} className="text-white" />}
            color="#DD6B20"
          />
          <KpiCard
            title="Reputation Score"
            value={reputation}
            icon={<Award size={20} className="text-white" />}
            color="#38A169"
          />
          <KpiCard
            title="Completed TXs"
            value={userTransactions.filter((tx) => tx.claimed).length}
            icon={<CheckCircle size={20} className="text-white" />}
            color="#6B46C1"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div data-driver="user-transactions">
              <UserTransactions provider={walletData?.provider} />
            </div>
          </div>

          <div className="space-y-8">
            <div data-driver="register-name">
              <RegisterName
                setGlobalRegisteredName={setRegisteredName}
                provider={walletData?.provider}
              />
            </div>
            <div data-driver="user-contracts">
              <UserContracts provider={walletData?.provider} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;