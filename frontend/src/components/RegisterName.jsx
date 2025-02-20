import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useContract from "../hooks/useContract";

const RegisterName = ({ setGlobalRegisteredName }) => {
  const { userAddress, getContract } = useContract();
  const [name, setName] = useState("");
  const [registeredName, setRegisteredName] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userAddress) fetchRegisteredName();
  }, [userAddress]);

  const fetchRegisteredName = async () => {
    try {
      const contract = await getContract();
      const userData = await contract.users(userAddress);
      if (userData.username) {
        setRegisteredName(userData.username);
        setGlobalRegisteredName(userData.username);
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      toast.error("❌ Could not fetch username!");
    }
  };

  const registerName = async () => {
    if (!name) return toast.error("❌ Please enter a name!");
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.registerUsername(name);
      await tx.wait();
      toast.success("✅ Name registered successfully!");
      setRegisteredName(name);
      setGlobalRegisteredName(name);
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(`❌ Registration failed: ${error.reason || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t-4 border-customPurple rounded-md px-6 sm:px-10 py-8 bg-customDark shadow-custom-purple text-white lg:min-h-20">
      <h2 className="text-xl font-semibold">User Name</h2>

      {registeredName ? (
        <p className="mt-3 text-green-400">✅ Registered Name: {registeredName}</p>
      ) : (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="border border-gray-600 p-2 rounded-md w-full bg-gray-800 text-white mt-2"
          />
          <button
            onClick={registerName}
            className="mt-4 px-4 py-2 bg-customPurple hover:bg-purple-600 transition text-white rounded-lg w-full"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </>
      )}
    </div>
  );
};

export default RegisterName;