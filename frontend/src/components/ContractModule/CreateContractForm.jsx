import React, { useState } from "react";
import { toast } from "react-toastify";
import ContractCreatedModal from "./ContractCreatedModal";

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
      <div data-driver="create-contract" className="bg-customDark p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-6">Create New Contract</h2>
        <form onSubmit={handleCreateContract} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-2 capitalize">
                {key === "receiverUsername" ? "Receiver Username" : key}
              </label>
              {key === "description" ? (
                <textarea
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
                  rows="3"
                  required
                />
              ) : (
                <input
                  type={["amount", "duration"].includes(key) ? "number" : "text"}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
                  required
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md mt-4"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Contract"}
          </button>
        </form>
      </div>

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