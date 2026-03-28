import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useWallet } from "../Global/WalletContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received"); // "received" or "sent"
  const { walletData } = useWallet();
  const navigate = useNavigate();

  const fetchProposals = async () => {
    if (!walletData?.address) return;

    setLoading(true);
    try {
      let q;
      if (activeTab === "received") {
        // Proposals received for jobs posted by the current user
        q = query(
          collection(db, "proposals"),
          where("postedBy", "==", walletData.address),
          orderBy("createdAt", "desc")
        );
      } else {
        // Proposals sent by the current user
        q = query(
          collection(db, "proposals"),
          where("freelancer", "==", walletData.address),
          orderBy("createdAt", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      const proposalsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProposals(proposalsList);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [walletData?.address, activeTab]);

  const handleStatusUpdate = async (proposalId, newStatus, proposal) => {
    try {
      await updateDoc(doc(db, "proposals", proposalId), {
        status: newStatus,
      });
      toast.success(`Proposal ${newStatus} successfully!`);
      
      // If proposal is accepted, navigate to contract creation with pre-filled data
      if (newStatus === "accepted") {
        const contractData = {
          title: proposal.jobTitle,
          description: proposal.message,
          amount: proposal.budget,
          freelancer: proposal.freelancer,
          jobId: proposal.jobId,
        };
        
        // Navigate to contract page with pre-filled data
        navigate("/contract?create=true", { 
          state: { 
            prefillData: contractData,
            fromProposal: true 
          } 
        });
      }
      
      fetchProposals(); // Refresh the list
    } catch (error) {
      console.error("Error updating proposal:", error);
      toast.error("Failed to update proposal");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "accepted":
        return "bg-green-500";
      case "declined":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!walletData?.address) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Please connect your wallet to view proposals</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading proposals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Proposals</h1>
          <p className="text-gray-400">
            {activeTab === "received" 
              ? "Manage proposals for your posted jobs" 
              : "Track your submitted proposals"
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "received"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Proposals Received
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "sent"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            My Proposals
          </button>
        </div>

        {/* Proposals List */}
        {proposals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">
              {activeTab === "received" 
                ? "No proposals received yet" 
                : "No proposals submitted yet"
              }
            </div>
            <p className="text-gray-500">
              {activeTab === "received" 
                ? "Proposals for your jobs will appear here" 
                : "Your submitted proposals will appear here"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {proposal.jobTitle}
                    </h3>
                    <p className="text-gray-400">
                      Budget: {proposal.budget} ETH
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                      proposal.status
                    )}`}
                  >
                    {proposal.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">
                      {activeTab === "received" ? "Freelancer:" : "Submitted:"}
                    </span>
                    <p className="text-white font-mono text-sm">
                      {activeTab === "received" 
                        ? proposal.freelancer 
                        : formatDate(proposal.createdAt)
                      }
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-400 text-sm">Message:</span>
                    <p className="text-gray-300 mt-1">{proposal.message}</p>
                  </div>
                </div>

                {/* Action Buttons for Received Proposals */}
                {activeTab === "received" && proposal.status === "pending" && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleStatusUpdate(proposal.id, "accepted", proposal)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(proposal.id, "declined", proposal)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {/* Status Info for Sent Proposals */}
                {activeTab === "sent" && (
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      Status: <span className="text-white">{proposal.status}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposals; 