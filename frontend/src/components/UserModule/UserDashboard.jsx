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
import { Wallet, Clock, Award, CheckCircle, Activity, User, FileText } from "lucide-react";


// Helper function to convert hex to rgba
const hexToRgba = (hex, opacity) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
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

  const { balance, pendingBalance, userTransactions } = useContract(walletData?.provider);
  const swc = useContract2(walletData?.provider);
  const { username, isRegistered } = useUsernameRegistry(walletData?.provider);

  const [registeredName, setRegisteredName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reputation = swc.reputation || "500";
  const [activeTab, setActiveTab] = useState("Activity");

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
      // ... tour initialization code ...
    }
  }, [navigate]);

  const tabs = [
    { name: "Activity", icon: <Activity size={16} /> },
    { name: "Profile", icon: <User size={16} /> },
    { name: "Contracts", icon: <FileText size={16} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Activity":
        return <UserTransactions provider={walletData?.provider} />;
      case "Profile":
        return <RegisterName setGlobalRegisteredName={setRegisteredName} provider={walletData?.provider} />;
      case "Contracts":
        return <UserContracts provider={walletData?.provider} />;
      default:
        return null;
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderButton loading={true} text="Initializing Dashboard" />
      </div>
    );
  }

  if (error || !walletData?.provider) {
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
    <div className="min-h-screen text-white">

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

        {/* Tab Navigation */}
        <div className="bg-[#16192E] p-1.5 rounded-lg border border-gray-700/50 inline-flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
                activeTab === tab.name
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {renderContent()}
        </div>

      </main>
    </div>
  );
};

export default UserDashboard;