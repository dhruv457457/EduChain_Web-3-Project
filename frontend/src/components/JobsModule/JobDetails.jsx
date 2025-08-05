import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useWallet } from "../Global/WalletContext";
import { toast } from "react-toastify";

const JobDetails = ({ job, onClose, onProposalSubmitted }) => {
  const [proposal, setProposal] = useState({
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { walletData } = useWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!walletData?.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!proposal.message.trim()) {
      toast.error("Please enter a proposal message");
      return;
    }

    setIsSubmitting(true);
    try {
      const proposalData = {
        jobId: job.id,
        jobTitle: job.title,
        freelancer: walletData.address,
        message: proposal.message,
        status: "pending",
        createdAt: serverTimestamp(),
        budget: job.budget,
        postedBy: job.postedBy,
      };

      await addDoc(collection(db, "proposals"), proposalData);
      toast.success("Proposal submitted successfully!");
      onClose();
      if (onProposalSubmitted) {
        onProposalSubmitted();
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Job Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Job Information */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">{job.title}</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Description</h4>
              <p className="text-gray-400">{job.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-gray-300 font-medium mb-2">Budget</h4>
                <p className="text-white font-semibold">{job.budget} ETH</p>
              </div>

              <div>
                <h4 className="text-gray-300 font-medium mb-2">Deadline</h4>
                <p className="text-white">{formatDate(job.deadline)}</p>
              </div>
            </div>

            {job.skills && (
              <div>
                <h4 className="text-gray-300 font-medium mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/20 text-primary_hover text-sm rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-gray-300 font-medium mb-2">Posted</h4>
                <p className="text-white">{formatDate(job.createdAt)}</p>
              </div>

              <div>
                <h4 className="text-gray-300 font-medium mb-2">Status</h4>
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                  {job.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Proposal Form */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Submit Proposal</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Message *
              </label>
              <textarea
                name="message"
                value={proposal.message}
                onChange={(e) => setProposal({ ...proposal, message: e.target.value })}
                required
                rows="6"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-primary"
                placeholder="Explain why you're a great fit for this job, your relevant experience, and how you plan to approach this project..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Wallet Address
              </label>
              <input
                type="text"
                value={walletData?.address || "Not connected"}
                disabled
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !walletData?.address}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary_hover1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Proposal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 