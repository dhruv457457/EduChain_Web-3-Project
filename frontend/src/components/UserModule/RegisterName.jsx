import React, { useState } from "react";
import { toast } from "react-toastify";
import useUsernameRegistry from "../../hooks/useUsernameRegistry";
import LoaderButton from "../Global/LoaderButton";
import { CheckCircle } from "lucide-react";

const RegisterName = ({ setGlobalRegisteredName, provider }) => {
  const { username, isRegistered, registerUsername, isLoading, userAddress } =
    useUsernameRegistry(provider);
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

  return (
    <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 text-white">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm font-medium">Wallet Address</p>
          <p className="text-gray-200 text-sm break-all">
            {userAddress || "..."}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium">Username</p>
          {isRegistered ? (
            <p className="mt-1 text-green-400 text-lg font-semibold flex items-center gap-2">
              <CheckCircle size={18} />
              {username}
            </p>
          ) : (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Choose a username"
                className="border border-gray-600 p-3 mt-2 rounded-md w-full bg-gray-900/50 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <div className="mt-4">
                <LoaderButton
                  onClick={handleRegisterName}
                  loading={isLoading}
                  text="Register Username"
                  color="blue"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterName;