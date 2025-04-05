import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useContract2 from "../../hooks/useContract2";
import Loader from "../Global/Loader";
import { FaCopy } from "react-icons/fa";

const UserContracts = ({ provider }) => {
  const { getUserContracts, signer } = useContract2(provider);
  const [contracts, setContracts] = useState([]);
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadContracts = async () => {
      if (!provider || !signer || !getUserContracts) {
        setTimeout(() => {
          if (mounted) setReady(true);
        }, 500);
        return;
      }

      try {
        const address = await signer.getAddress();
        const userContracts = await getUserContracts();

        if (mounted) {
          setUserAddress(address);
          setContracts(Array.isArray(userContracts) ? userContracts : []);
        }
      } catch (err) {
        console.warn("⚠️ Non-blocking load error:", err.message);
        if (mounted) setContracts([]);
      } finally {
        if (mounted) {
          setReady(true);
          setLoading(false);
        }
      }
    };

    loadContracts();
    return () => (mounted = false);
  }, [provider, getUserContracts, signer]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 0:
        return "bg-yellow-600";
      case 1:
        return "bg-blue-600";
      case 2:
        return "bg-indigo-600";
      case 3:
        return "bg-green-600";
      case 4:
        return "bg-red-500";
      case 5:
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const statusLabels = [
    "Pending",
    "Approved",
    "InProgress",
    "Completed",
    "Cancelled",
    "Disputed",
  ];

  return (
<div className="rounded-md bg-customDark p-5 shadow-custom-purple text-white min-h-48 max-h-60 overflow-y-auto custom-scrollbar transition-all">
<h2 className="text-xl font-semibold mb-4">Your Contracts</h2>

      {!ready || loading ? (
        <div className="h-32 flex justify-center items-center">
          <Loader />
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>No contracts found yet.</p>
          <p className="text-xs mt-1 opacity-50">Contracts you create or receive will show here.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {contracts.map((contract) => (
            <li
              key={contract.contractId}
              onClick={() => navigate(`/contract?id=${contract.contractId}`)}
              className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition cursor-pointer relative"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-mono text-sm text-purple-400">
                  ID: #{contract.contractId}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(contract.contractId);
                  }}
                  title="Copy Contract ID"
                  className="text-purple-300 hover:text-white transition text-sm flex items-center gap-1"
                >
                  <FaCopy className="w-3 h-3" />
                  {copiedId === contract.contractId ? "Copied!" : "Copy"}
                </button>
              </div>

              <p><strong>Title:</strong> {contract.title}</p>
              <p>
                <strong>Role:</strong>{" "}
                {contract.creator.toLowerCase() === userAddress?.toLowerCase()
                  ? "Creator"
                  : "Receiver"}
              </p>
              <p><strong>Amount:</strong> {contract.amount} ETH</p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <span
                  className={`text-white text-xs px-2 py-1 rounded-full ${getStatusStyle(contract.status)}`}
                >
                  {statusLabels[contract.status]}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserContracts;
