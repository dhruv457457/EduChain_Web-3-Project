import React from 'react';

const ContractIntro = ({ 
  showCreateForm, 
  showFetchForm, 
  onToggleCreateForm, 
  onToggleFetchForm 
}) => {
  return (
    <div className="bg-customDark p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">
        Welcome to SWC Contract System
      </h2>
      <p className="mb-4">
        This platform allows you to create and manage milestone-based
        contracts securely on the blockchain. You can create new contracts,
        fetch existing contract details, and manage milestones with ease.
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Create new contracts with specific details and milestones.</li>
        <li>Fetch and view details of existing contracts.</li>
        <li>
          Manage milestones by adding, approving, and completing them.
        </li>
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
      </div>
    </div>
  );
};

export default ContractIntro;