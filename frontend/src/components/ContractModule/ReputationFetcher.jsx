import React, { useState } from "react";
import { toast } from "react-toastify";
import { Search, Loader2, AlertCircle, CheckCircle, Star } from "lucide-react";
import { ethers } from "ethers";
import useUsernameRegistry from "../../hooks/useUsernameRegistry";

const ReputationFetcher = ({ contractHooks, walletProvider }) => {
  const [username, setUsername] = useState("");
  const [reputationScore, setReputationScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getAddressFromUsername, contract } = useUsernameRegistry(walletProvider);

  const fetchReputation = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    if (username.length < 3 || username.length > 32) {
      toast.error("Username must be between 3 and 32 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return;
    }
    if (!contractHooks || !walletProvider || !contract) {
      toast.error("Wallet or contract not connected");
      return;
    }

    setLoading(true);
    setError(null);
    setReputationScore(null);

    try {
      const address = await getAddressFromUsername(username);
      if (!address || address.toLowerCase() === ethers.ZeroAddress.toLowerCase()) {
        throw new Error("Username not found or not registered");
      }

      const score = await contractHooks.getReputationByAddress(address);
      if (score === undefined || score === null) {
        throw new Error("Reputation score not found for this username");
      }
      setReputationScore(ethers.formatUnits(score, 0));
      toast.success(`Reputation score fetched for ${username}`);
    } catch (err) {
      setError(err.message || "Failed to fetch reputation score");
      toast.error(err.message || "Failed to fetch reputation score");
      console.error("Reputation fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Determine reputation status and styling
  const getReputationStatus = (score) => {
    if (score === null || score === undefined) return null;
    const numericScore = parseInt(score, 10);
    if (numericScore < 500) {
      return {
        label: "Bad Reputation",
        description: "This user has a history of unreliable payments.",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        icon: <AlertCircle size={20} />,
      };
    } else if (numericScore === 500) {
      return {
        label: "Trustworthy",
        description: "You can trust this user for standard transactions.",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
        icon: <CheckCircle size={20} />,
      };
    } else {
      return {
        label: "Elite League",
        description: "This user is highly reliable and excels in performance.",
        color: "text-customNeonGreen",
        bgColor: "bg-customNeonGreen/10",
        icon: <Star size={20} />,
      };
    }
  };

  const reputationStatus = getReputationStatus(reputationScore); // Fixed typo here

  return (
    <div className="mt-6 p-6 bg-customDark/90 backdrop-blur-lg border border-customPurple/40 rounded-xl shadow-glass transition-all duration-300 hover:shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Star size={24} className="text-customNeonGreen" />
        Fetch Reputation Score
      </h3>

      {!contract && (
        <p className="text-yellow-400 flex items-center gap-2 mb-4">
          <Loader2 size={18} className="animate-spin" />
          Connecting to registry...
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full p-3 rounded-lg bg-customInput/80 text-white placeholder-gray-400 border border-customPurple/60 focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
          <button
            onClick={fetchReputation}
            className={`flex items-center gap-2 bg-customPurple hover:bg-customPurple/90 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              loading ? "animate-pulse" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Search size={18} />
                Fetch
              </>
            )}
          </button>
        </div>

        {reputationScore !== null && (
          <div
            className={`p-4 rounded-lg ${reputationStatus.bgColor} border ${reputationStatus.color.replace("text-", "border-")}/30 transition-all duration-300`}
          >
            <div className="flex items-center gap-2 justify-center">
              {reputationStatus.icon}
              <p className={`text-lg font-semibold ${reputationStatus.color}`}>
                Reputation Score for "{username}": {reputationScore}
              </p>
            </div>
            <p className={`text-center mt-2 ${reputationStatus.color}`}>
              <span className="font-bold">{reputationStatus.label}</span>: {reputationStatus.description}
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReputationFetcher;