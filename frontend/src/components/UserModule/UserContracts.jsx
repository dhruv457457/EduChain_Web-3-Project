import React, { useEffect, useState } from "react";
import useContract2 from "../../hooks/useContract2";
import LoaderButton from "../Global/LoaderButton";

const UserContracts = ({ provider }) => {
  const { getUserContracts, signer } = useContract2(provider);
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContracts = async () => {
      // Check if all required dependencies are available
      if (!provider) {
        setError("Wallet provider not connected.");
        setLoading(false);
        return;
      }
      if (!signer) {
        setError("Signer not initialized.");
        setLoading(false);
        return;
      }
      if (!getUserContracts) {
        setError("Contract function not available.");
        setLoading(false);
        return;
      }

      try {
        const address = await signer.getAddress();
        setUserAddress(address);
        const userContracts = await getUserContracts();
        
        // Validate the response
        if (!userContracts || !Array.isArray(userContracts)) {
          throw new Error("Invalid contracts data received");
        }

        setContracts(userContracts);
        setError(null);
      } catch (err) {
        console.error("Error loading contracts:", err);
        setError(`Failed to load contracts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Only call loadContracts if we haven't already errored out
    if (!error) {
      loadContracts();
    }
  }, [provider, getUserContracts, signer, error]);

  return (
    <div className="border-t-4 border-customPurple rounded-md bg-customDark p-5 shadow-custom-purple text-white max-h-64 overflow-y-auto custom-scrollbar min-h-40">
      <h2 className="text-xl font-semibold mb-4">Your Contracts</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <LoaderButton loading={true} text="Loading Contracts" />
        </div>
      ) : error ? (
        <div className="text-red-400">
          <p>{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
            }}
            className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Retry
          </button>
        </div>
      ) : contracts.length === 0 ? (
        <p className="text-gray-400">No contracts found.</p>
      ) : (
        <ul className="space-y-4">
          {contracts.map((contract) => (
            <li
              key={contract.contractId}
              className="p-4 border border-gray-700 rounded-lg bg-gray-800"
            >
              <p><strong>Title:</strong> {contract.title}</p>
              <p>
                <strong>Role:</strong>{" "}
                {contract.creator.toLowerCase() === userAddress?.toLowerCase()
                  ? "Creator"
                  : "Receiver"}
              </p>
              <p><strong>Amount:</strong> {contract.amount} ETH</p>
              <p>
                <strong>Status:</strong>{" "}
                {["Pending", "Approved", "InProgress", "Completed", "Cancelled", "Disputed"][contract.status]}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserContracts;