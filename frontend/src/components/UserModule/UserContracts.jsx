import React, { useEffect, useState } from "react";
import useContract2 from "../../hooks/useContract2";

const UserContracts = ({ provider }) => {
  const { getUserContracts, isLoading } = useContract2(provider);
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const userContracts = await getUserContracts();
        setContracts(userContracts);
      } catch (err) {
        setError("Failed to load contracts.");
      }
    };
    loadContracts();
  }, [getUserContracts]);

  return (
    <div className="border-t-4 border-customPurple rounded-md bg-customDark p-5 shadow-custom-purple text-white max-h-64 overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-semibold mb-4">Your Contracts</h2>
      {isLoading ? (
        <p className="text-gray-400">Loading contracts...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : contracts.length === 0 ? (
        <p className="text-gray-400">No contracts found.</p>
      ) : (
        <ul className="space-y-4">
          {contracts.map((contract) => (
            <li key={contract.contractId} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
              <p><strong>Title:</strong> {contract.title}</p>
              <p><strong>Role:</strong> {contract.creator === contract.userAddress ? "Creator" : "Receiver"}</p>
              <p><strong>Amount:</strong> {contract.amount} ETH</p>
              <p><strong>Status:</strong> {["Pending", "Approved", "InProgress", "Completed", "Cancelled", "Disputed"][contract.status]}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserContracts;