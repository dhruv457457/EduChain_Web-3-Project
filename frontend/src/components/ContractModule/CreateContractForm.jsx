import React, { useState } from "react";
import { toast } from "react-toastify";
import ContractCreatedModal from "./ContractCreatedModal";
import { motion } from "framer-motion";

const CreateContractForm = ({ contractHooks, loading, setLoading }) => {
  const [formData, setFormData] = useState({
    receiverUsername: "",
    title: "",
    description: "",
    coinType: "ETH",
    duration: "",
    amount: "",
  });
  const [createdContractId, setCreatedContractId] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateContract = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { receiverUsername, title, description, coinType, duration, amount } = formData;

      if (!receiverUsername.trim()) throw new Error("Receiver username is required");
      if (isNaN(amount) || amount <= 0) throw new Error("Amount must be a valid positive number");
      if (isNaN(duration) || duration <= 0) throw new Error("Duration must be a valid positive number");

      const id = await contractHooks.createContract(
        receiverUsername,
        title,
        description,
        coinType,
        duration,
        "Milestone",
        amount
      );

      setCreatedContractId(id);
      toast.success(`Contract created successfully! ID: ${id}`);
    } catch (err) {
      toast.error(err.message || "Contract creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        data-driver="create-contract"
        className="bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 p-6 rounded-lg mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Create New Contract</h2>
        <form
          onSubmit={handleCreateContract}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl "
        >
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-300 capitalize">
                {key === "receiverUsername" ? "Receiver Username" : key}
              </label>
              {key === "description" ? (
                <textarea
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="bg-white text-gray-800 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  rows="3"
                  required
                />
              ) : (
                <input
                  type={["amount", "duration"].includes(key) ? "number" : "text"}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="bg-white text-gray-800 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full col-span-1 md:col-span-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Contract"}
          </button>
        </form>
      </motion.div>

      {createdContractId && (
        <ContractCreatedModal
          contractId={createdContractId}
          onClose={() => setCreatedContractId(null)}
        />
      )}
    </>
  );
};

export default CreateContractForm;
