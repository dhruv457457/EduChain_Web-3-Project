import React, { useState } from "react";
import { toast } from "react-toastify";
import useUsernameRegistry from "../../hooks/useUsernameRegistry";
import LoaderButton from "../Global/LoaderButton"; // Updated import

const RegisterName = ({ setGlobalRegisteredName, provider }) => {
  const { username, isRegistered, registerUsername, isLoading } = useUsernameRegistry(provider);
  const [name, setName] = useState("");

  const handleRegisterName = async () => {
    if (!name) return toast.error("❌ Please enter a name!");
    try {
      const txHash = await registerUsername(name);
      toast.success(`✅ Name registered! Tx: ${txHash.slice(0, 6)}...`);
      setGlobalRegisteredName(name);
    } catch (error) {
      toast.error(`❌ Failed: ${error.message}`);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-32">
      <LoaderButton loading={true} text="Loading" />
    </div>
  );

  return (
    <div className="rounded-md px-6 py-8 bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 shadow-custom-purple text-white">
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
            className="border border-gray-600 p-2 rounded-md w-full bg-gray-800 text-white mt-2 mb-5"
          />
          <LoaderButton
            onClick={handleRegisterName}
            loading={isLoading}
            text="Register"
            color="purple"
          />
        </>
      )}
    </div>
  );
};

export default RegisterName;