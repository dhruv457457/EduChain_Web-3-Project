import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import useContract from "../hooks/useContract";
import UserRegistryABI from "../contracts/FundTransferWithRegistry.json"; // Ensure this is the correct ABI

const userRegistryAddress = "0x9c2ed62ab722d8eEb6eDeab06f9464EdfCaf46Dd";

const User = () => {
  const { userAddress, getContract, balance, fetchBalance } = useContract(); // Use balance & fetchBalance from hook
  const [name, setName] = useState("");
  const [registeredName, setRegisteredName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userAddress) {
      fetchBalance(userAddress); // Use the fetchBalance from useContract.js
      fetchRegisteredName();
    }
  }, [userAddress]);

  // Fetch registered username
 // Fetch registered username
 const fetchRegisteredName = async () => {
  try {
    const contract = await getContract();
    const userData = await contract.users(userAddress); // ✅ Use correct function
    const username = userData.username; // ✅ Extract username
    setRegisteredName(username);
  } catch (error) {
    console.error("Error fetching username:", error);
    toast.error("❌ Could not fetch username!");
  }
};



  // Register username
  const registerName = async () => {
    if (!name) return toast.error("❌ Please enter a name!");

    try {
      setLoading(true);
      const contract = await getContract(userRegistryAddress, UserRegistryABI.abi);
      const tx = await contract.registerUsername(name);
      await tx.wait();
      toast.success("✅ Name registered successfully!");
      setRegisteredName(name);
      setName("");
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(`❌ Registration failed: ${error.reason || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex flex-col items-center bg-customSemiPurple py-20 px-4">
        <h1 className="text-2xl font-bold text-white mb-4">User Dashboard</h1>

        {/* Wallet & Balance Section */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
          <p className="text-lg font-semibold">Wallet Address:</p>
          <p className="text-sm break-all">{userAddress || "Not connected"}</p>

          <p className="text-lg font-semibold mt-4">ETH Balance:</p>
          <p className="text-sm">{balance} ETH</p>
          <button
            onClick={() => fetchBalance(userAddress)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Refresh Balance
          </button>
        </div>

        {/* Register Name Section */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mt-6">
          <h2 className="text-lg font-semibold">Register Name</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 mt-2 border rounded-lg"
          />
          <button
            onClick={registerName}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {registeredName && <p className="mt-2">✅ Registered Name: {registeredName}</p>}
        </div>
      </div>
    </>
  );
};

export default User;
