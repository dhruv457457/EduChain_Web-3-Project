import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useContract2 from "../../hooks/useContract2";
import Loader from "../Global/Loader";

const UserContracts = ({ provider }) => {
  const { getUserContracts, signer } = useContract2(provider);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const loadContracts = async () => {
      if (!signer) return;
      try {
        const userContracts = await getUserContracts();
        setContracts(Array.isArray(userContracts) ? userContracts : []);
      } catch (err) {
        console.warn("⚠️ Error loading contracts:", err.message);
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };
    loadContracts();
  }, [getUserContracts, signer]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 0:
        return { label: "Pending", color: "bg-yellow-500" };
      case 1:
        return { label: "Approved", color: "bg-blue-500" };
      case 2:
        return { label: "In Progress", color: "bg-indigo-500" };
      case 3:
        return { label: "Completed", color: "bg-green-500" };
      case 4:
        return { label: "Cancelled", color: "bg-red-500" };
      default:
        return { label: "Unknown", color: "bg-gray-500" };
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    if (filter === "all") return true;
    if (filter === "pending") return contract.status === 0;
    if (filter === "done") return contract.status === 3;
    return true;
  });

  return (
    <div className="bg-[#16192E] p-6 rounded-lg border border-gray-700/50 text-white h-full">
      <h2 className="text-xl font-bold mb-4">My Contracts</h2>

      <div className="flex gap-2 mb-4">
        {["all", "pending", "done"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${
              filter === type
                ? "bg-primary text-white"
                : "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="h-32 flex justify-center items-center">
            <Loader />
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <p>No contracts found.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredContracts.map((contract) => {
              const statusInfo = getStatusInfo(contract.status);
              return (
                <li
                  key={contract.contractId}
                  onClick={() => navigate(`/contract?id=${contract.contractId}`)}
                  className="flex items-center justify-between p-3 rounded-md bg-black/20 cursor-pointer hover:bg-black/40 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm">{contract.title}</p>
                    <p className="text-xs text-gray-400">
                      ID: #{contract.contractId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{contract.amount} ETH</p>
                    <span
                      className={`text-xs px-2 py-0.5 mt-1 inline-block rounded-full text-white ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserContracts;