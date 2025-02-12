// RegisterName.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useContract from "../hooks/useContract";
import UserRegistryABI from "../contracts/FundTransferWithRegistry.json";

const userRegistryAddress = "0x9c2ed62ab722d8eEb6eDeab06f9464EdfCaf46Dd";

const RegisterName = () => {
  const { userAddress, getContract } = useContract();
  const [name, setName] = useState("");
  const [registeredName, setRegisteredName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userAddress) fetchRegisteredName();
  }, [userAddress]);

  // Fetch registered username
  const fetchRegisteredName = async () => {
    try {
      const contract = await getContract();
      const userData = await contract.users(userAddress);
      setRegisteredName(userData.username);
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
    <div className="bg-customDark p-4 rounded-md w-full max-w-md text-white flex flex-col gap-3 shadow-custom-purple border border-customPurple">
      <h2 className="text-lg font-semibold">Register Name</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="border border-customPurple p-2 rounded-md w-full bg-customInput text-cyan-50 "
      />
      <button
        onClick={registerName}
        className="mt-2 px-4 py-2 bg-customPurple text-white rounded-lg w-full"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      {registeredName && <p className="mt-2">✅ Registered Name: {registeredName}</p>}
    </div>
  );
};

export default RegisterName;
