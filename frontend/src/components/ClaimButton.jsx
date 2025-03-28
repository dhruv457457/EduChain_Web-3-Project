import React, { useState } from "react";
import { toast } from "react-toastify";
import { useWallet } from "../components/WalletContext"; // Import useWallet
import useContract from "../hooks/useContract";

const ClaimButton = ({ contractAddress = "0x6114B9FA1f90e6DDFea9fD8f8e7427F43B00F70A", contractABI }) => {
  const { walletData } = useWallet(); // Get wallet data from context
  const { getContract, fetchTransactions } = useContract(walletData?.provider); // Pass provider
  const [loading, setLoading] = useState(false);

  const claimFunds = async () => {
    if (!walletData?.provider) {
      toast.error("🦊 Please connect your wallet via Navbar!");
      return;
    }

    try {
      setLoading(true);
      const contract = await getContract(contractAddress, contractABI); // Pass address and ABI
      const tx = await contract.claimFunds();
      await tx.wait();
      toast.success("✅ Claimed successfully!");
      fetchTransactions();
    } catch (error) {
      console.error("Claim error:", error);
      toast.error(`❌ Claim failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={claimFunds}
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