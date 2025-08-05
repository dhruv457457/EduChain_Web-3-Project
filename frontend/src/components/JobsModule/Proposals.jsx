import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useWallet } from "../Global/WalletContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../Global/Loader";
import { Check, X, Inbox, Send, AlertCircle, FileText, User, Tag, MessageSquare } from "lucide-react";

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
        q = query(
          collection(db, "proposals"),
          where("postedBy", "==", walletData.address),
          orderBy("createdAt", "desc")
        );
      } else {
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

      if (newStatus === "accepted") {
        const contractData = {
          title: proposal.jobTitle,
          description: proposal.message,
          amount: proposal.budget,
          freelancer: proposal.freelancer,
          jobId: proposal.jobId,
        };

        navigate("/contract?create=true", {
          state: {
            prefillData: contractData,
            fromProposal: true
          }
        });
      }

      fetchProposals();
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

  const getStatusPill = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold text-yellow-300 bg-yellow-500/20 rounded-full">
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full">
            Accepted
          </span>
        );
      case "declined":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold text-red-300 bg-red-500/20 rounded-full">
            Declined
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold text-gray-300 bg-gray-500/20 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="mt-40">
        <Loader text="Loading Proposals..." />
      </div>
    );
  }

  if (!walletData?.address) {
    return (
      <div className="min-h-screen bg-[#0B0E1F] flex items-center justify-center text-center p-4">
        <div>
          <AlertCircle className="mx-auto text-red-500 w-12 h-12 mb-4" />
          <h2 className="text-xl font-semibold text-white">Wallet Not Connected</h2>
          <p className="text-gray-400 mt-2">
            Please connect your wallet to view your proposals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {/* Header and Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <p className="text-gray-400 mt-1">
              Manage and track your job proposals.
            </p>
          </div>
          <div className="flex space-x-1 bg-[#16192E] p-1 rounded-lg border border-gray-700/50">
            <button
              onClick={() => setActiveTab("received")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeTab === "received"
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              <Inbox size={16} />
              Received
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeTab === "sent"
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              <Send size={16} />
              Sent
            </button>
          </div>
        </div>

        {/* Proposals List */}
        {proposals.length === 0 ? (
          <div className="text-center py-20 bg-[#16192E] rounded-lg border border-gray-700/50">
            <AlertCircle className="mx-auto text-gray-500 w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300">
              {activeTab === "received" ? "No Proposals Received" : "No Proposals Sent"}
            </h2>
            <p className="text-gray-500 mt-2">
              {activeTab === "received" ? "Proposals for your jobs will appear here." : "Your submitted proposals will be listed here."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-[#16192E] rounded-lg p-6 border border-gray-700/50"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <FileText size={20} className="text-primary" />
                      <h3 className="text-xl font-semibold text-white">
                        {proposal.jobTitle}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Tag size={16} />
                      <span>Budget: <span className="font-semibold text-white">{proposal.budget} ETH</span></span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    {getStatusPill(proposal.status)}
                  </div>
                </div>

                <div className="border-t border-gray-700/50 my-4"></div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">
                        {activeTab === "received" ? "Freelancer Address" : "Submitted On"}
                      </p>
                      <p className="font-mono text-sm text-white">
                        {activeTab === "received" ? proposal.freelancer : formatDate(proposal.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare size={16} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Message</p>
                      <p className="text-gray-300 mt-1">
                        {proposal.message}
                      </p>
                    </div>
                  </div>
                </div>

                {activeTab === "received" && proposal.status === "pending" && (
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-gray-700/50">
                    <button
                      onClick={() => handleStatusUpdate(proposal.id, "accepted", proposal)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition-colors"
                    >
                      <Check size={16} /> Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(proposal.id, "declined", proposal)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold transition-colors"
                    >
                      <X size={16} /> Decline
                    </button>
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