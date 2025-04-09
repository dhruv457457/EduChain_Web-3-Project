import React, { useState } from "react";
import { toast } from "react-toastify";

const ClaimButton = ({ claimFunds }) => {
  const [loading, setLoading] = useState(false);

  const handleClaimFunds = async () => {
    if (!claimFunds) {
      toast.error("❌ Claim functionality not available!");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting to claim funds..."); // Debug
      const txHash = await claimFunds();
      console.log("Claim transaction hash:", txHash); // Debug
      toast.success(`✅ Funds claimed successfully! TX: ${txHash}`);
    } catch (error) {
      console.error("Claim error:", error);
      // Extract the revert reason from the error object
      const errorMessage =
        error.reason || // For ethers.js v6
        error.data?.message || // For some providers
        error.message || // Fallback to generic message
        "Unknown error";
      toast.error(`❌ Claim failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClaimFunds}
      className={`w-full px-4 py-2 rounded text-white transition-all ${
        loading
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-customPurple hover:bg-customLightPurple"
      }`}
      disabled={loading}
    >
      {loading ? "Processing..." : "Claim Funds"}
    </button>
  );
};

export default ClaimButton;