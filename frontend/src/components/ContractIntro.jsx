import React from "react";

const ContractIntro = ({
  showCreateForm,
  showFetchForm,
  showWorkPostForm,
  onToggleCreateForm,
  onToggleFetchForm,
  onToggleWorkPostForm,
}) => {
  return (
    <div className="bg-customDark p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">Welcome to SWC System</h2>
      <p className="mb-4">
        Manage milestone-based contracts and work posts securely on the blockchain. Create contracts, fetch details, manage milestones, post work opportunities, and handle proposals.
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Create contracts with milestones.</li>
        <li>Fetch and manage existing contracts.</li>
        <li>Post work opportunities and accept proposals.</li>
      </ul>
      <div className="flex justify-center gap-4">
        <button
          onClick={onToggleCreateForm}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md"
        >
          {showCreateForm ? "Hide Create Contract" : "Create Contract"}
        </button>
        <button
          onClick={onToggleFetchForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
        >
          {showFetchForm ? "Hide Fetch Contract" : "Fetch Contract"}
        </button>
        <button
          onClick={onToggleWorkPostForm}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md"
        >
          {showWorkPostForm ? "Hide Work Post" : "Create Work Post"}
        </button>
      </div>
    </div>
  );
};

export default ContractIntro;