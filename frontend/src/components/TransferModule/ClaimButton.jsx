import React, { useState } from "react";
import { toast } from "react-toastify";
import { Download } from "lucide-react";

const ClaimButton = ({ claimFunds }) => {
  const [loading, setLoading] = useState(false);

  const handleClaimFunds = async () => {
    // Claiming logic is unchanged
    if (!claimFunds) {
      toast.error("❌ Claim functionality not available!");
      return;
    }

    setLoading(true);
    try {
      const tx = await claimFunds();
      await tx.wait();
      toast.success("✅ Funds claimed successfully!");
    } catch (error) {
      console.error("Claim error:", error);
      const errorMessage =
        error.reason || error.data?.message || error.message || "Unknown error";
      toast.error(`❌ Claim failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClaimFunds}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-white transition-all ${
        loading
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-gray-700/80 hover:bg-gray-700"
      }`}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Claiming...</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>Claim Pending Funds</span>
        </>
      )}
    </button>
  );
};

export default ClaimButton;