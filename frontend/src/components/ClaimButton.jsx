import React, { useState } from "react";
import { toast } from "react-toastify";
import useContract from "../hooks/useContract";

const ClaimButton = () => {
  const { getContract, fetchTransactions } = useContract();
  const [loading, setLoading] = useState(false);

  const claimFunds = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.claimFunds();
      await tx.wait();
      toast.success("✅ Claimed successfully!");
      fetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error("❌ Claim failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={claimFunds}
      className={`ml-2 px-4 py-2 rounded text-white ${
        loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
      }`}
      disabled={loading}
    >
      {loading ? "Processing..." : "Claim Funds"}
    </button>
  );
};

export default ClaimButton;
