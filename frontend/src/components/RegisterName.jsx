import React, { useState } from "react";
import { toast } from "react-toastify";
import useUsernameRegistry from "../hooks/useUsernameRegistry";

const RegisterName = ({ setGlobalRegisteredName, provider }) => {
  const { username, isRegistered, registerUsername, isLoading } = useUsernameRegistry(provider);
  const [name, setName] = useState("");

  const handleRegisterName = async () => {
    if (!name) return toast.error("❌ Please enter a name!");
    try {
      const txHash = await registerUsername(name);
      toast.success(`✅ Name registered successfully! Tx: ${txHash.slice(0, 6)}...`);
      setGlobalRegisteredName(name);
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(`❌ Registration failed: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="border-t-4 border-customPurple rounded-md px-6 sm:px-10 py-8 bg-customDark shadow-custom-purple text-white lg:min-h-20">
      <h2 className="text-xl font-semibold">User Name</h2>

      {isRegistered ? (
        <p className="mt-3 text-green-400">✅ Registered Name: {username}</p>
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
            onClick={handleRegisterName}
            className="mt-4 px-4 py-2 bg-customPurple hover:bg-purple-600 transition text-white rounded-lg w-full"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </>
      )}
    </div>
  );
};

export default RegisterName;