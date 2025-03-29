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
      toast.error(`❌ Claim failed: ${error.message || "Unknown error"}`);
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