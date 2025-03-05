import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useContract from "../hooks/useContract2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
};

const STATUS_LABELS = ["Pending", "Approved", "InProgress", "Completed", "Cancelled", "Disputed"];

const Contract = () => {
  const {
    createContract,
    getContractDetails,
    addMilestone,
    approveMilestone,
    completeMilestone,
    releaseMilestonePayment,
    approveContract,
    getMilestones,
  } = useContract();

  const [formData, setFormData] = useState({
    receiver: "",
    title: "",
    description: "",
    coinType: "ETH",
    duration: "",
    amount: "",
  });

  const [contractId, setContractId] = useState("");
  const [contractDetails, setContractDetails] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [milestoneData, setMilestoneData] = useState({
    title: "",
    amount: "",
    deadline: null,
    deliverables: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (!window.ethereum) {
          toast.error("Install MetaMask to continue.");
          return;
        }

        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        }
      } catch (error) {
        toast.error("Wallet connection error: " + error.message);
      }
    };
    checkWalletConnection();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleContractApproval = async () => {
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) throw new Error("Connect your wallet first");

      const isCreator = accounts[0].toLowerCase() === contractDetails.creator.toLowerCase();
      const isReceiver = accounts[0].toLowerCase() === contractDetails.receiver.toLowerCase();

      if (!isCreator && !isReceiver) {
        throw new Error("Only contract parties can approve");
      }

      await approveContract(contractId);
      toast.success("Contract approved!");
      await handleGetContractDetails();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { receiver, title, description, coinType, duration, amount } = formData;

      if (!receiver.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error("Invalid Ethereum address");
      }

      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a valid positive number");
      }

      const id = await createContract(receiver, title, description, coinType, duration, "Milestone", amount);
      setContractId(id);
      toast.success(`Contract created! ID: ${id}`);
    } catch (err) {
      toast.error(err.message || "Contract creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGetContractDetails = async () => {
    setLoading(true);
    try {
      const details = await getContractDetails(contractId);
      const milestones = await getMilestones(contractId);
      setContractDetails(details);
      setMilestones(milestones);
    } catch (err) {
      toast.error("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  // Update handleMilestoneAction
const handleMilestoneAction = async (actionFn, successMessage, milestoneId) => {
  setLoading(true);
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) throw new Error("Connect your wallet first");

    // Remove this check completely
    // if (actionFn === releaseMilestonePayment && contractDetails.status !== 1) {
    //   throw new Error("Approve the contract first");
    // }

    await actionFn(contractId, milestoneId);
    await handleGetContractDetails();
    toast.success(successMessage);
  } catch (err) {
    toast.error(err.message || "Action failed");
  } finally {
    setLoading(false);
  }
};
  const handleAddMilestone = async () => {
    setLoading(true);
    try {
      const { title, amount, deadline, deliverables } = milestoneData;
      if (!title || !amount || !deadline) {
        throw new Error("All fields are required");
      }

      const unixDeadline = Math.floor(deadline.getTime() / 1000);
      await addMilestone(contractId, title, amount, unixDeadline, deliverables);
      toast.success("Milestone added!");
      setMilestoneData({ title: "", amount: "", deadline: null, deliverables: "" });
      await handleGetContractDetails();
    } catch (err) {
      toast.error("Failed to add milestone");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (statusCode) => STATUS_LABELS[Number(statusCode)] || "Unknown";

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-customSemiPurple min-h-screen text-white"
    >
      <Navbar />
      <div className="container mx-auto px-4 py-10 pt-32">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Milestone-Based Contracts</h1>

        <form onSubmit={handleCreateContract} className="bg-customDark p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Create New Contract</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium mb-2 capitalize">{key}</label>
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
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md mt-4"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Contract"}
          </button>
        </form>

        <div className="bg-customDark p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Contract Details</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              placeholder="Enter Contract ID"
              className="flex-1 bg-gray-100 p-3 rounded-md text-gray-800"
            />
            <button
              onClick={handleGetContractDetails}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md"
              disabled={loading}
            >
              {loading ? "Loading..." : "Fetch Details"}
            </button>
          </div>

          {contractDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <p className={`font-medium ${
                    contractDetails.status == 1 ? "text-green-400" : "text-yellow-400"
                  }`}>
                    {getStatusLabel(contractDetails.status)}
                  </p>
                </div>
                {contractDetails.status == 0 && (
                  <button
                    onClick={handleContractApproval}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Approving..." : "Approve Contract"}
                  </button>
                )}
                <div>
                  <label className="text-sm text-gray-400">Amount</label>
                  <p className="font-medium">{contractDetails.amount} {contractDetails.coinType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Remaining Balance</label>
                  <p className="font-medium">{contractDetails.remainingBalance} {contractDetails.coinType}</p>
                </div>
              </div>

              {milestones.map((milestone, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-gray-400">{milestone.amount} {contractDetails.coinType}</p>
                      <p className="text-sm text-gray-400">Deadline: {formatDate(milestone.deadline)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-sm ${
                        milestone.isPaid ? "bg-green-600" : 
                        milestone.isApproved ? "bg-blue-600" : 
                        "bg-gray-600"
                      }`}>
                        {milestone.isPaid ? "Paid" : milestone.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleMilestoneAction(completeMilestone, "Milestone completed!", index)}
                      className={`text-sm px-3 py-1 rounded ${
                        milestone.isCompleted ||
                        currentAccount.toLowerCase() !== contractDetails.creator.toLowerCase()
                          ? "bg-gray-400 opacity-75 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                      }`}
                     
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleMilestoneAction(approveMilestone, "Milestone approved!", index)}
                      className={`text-sm px-3 py-1 rounded ${
                        milestone.isApproved ||
                        currentAccount.toLowerCase() !== contractDetails.receiver.toLowerCase()
                          ? "bg-gray-400 opacity-75 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      }`}
                    
                    >
                      Approve
                    </button>
        {/* Update the Release Payment button JSX */}
<button
  onClick={() => handleMilestoneAction(releaseMilestonePayment, "Payment released!", index)}
  className={`text-sm px-3 py-1 rounded 
      
       "bg-green-600 bg-green-700 cursor-pointer"
  }`}

>
  Release Payment
  {contractDetails.status < 1 && (
    <span className="text-xs block mt-1 text-red-300">Approve contract first</span>
  )}
</button>
                  </div>
                </div>
              ))}

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Add New Milestone</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={milestoneData.title}
                      onChange={(e) => setMilestoneData({ ...milestoneData, title: e.target.value })}
                      className="w-full bg-gray-100 p-2 rounded-md text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Amount</label>
                    <input
                      type="number"
                      value={milestoneData.amount}
                      onChange={(e) => setMilestoneData({ ...milestoneData, amount: e.target.value })}
                      className="w-full bg-gray-100 p-2 rounded-md text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Deadline</label>
                    <DatePicker
                      selected={milestoneData.deadline}
                      onChange={(date) => setMilestoneData({ ...milestoneData, deadline: date })}
                      showTimeSelect
                      dateFormat="Pp"
                      minDate={new Date()}
                      className="w-full bg-gray-100 p-2 rounded-md text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Deliverables</label>
                    <input
                      type="text"
                      value={milestoneData.deliverables}
                      onChange={(e) => setMilestoneData({ ...milestoneData, deliverables: e.target.value })}
                      className="w-full bg-gray-100 p-2 rounded-md text-gray-800"
                      required
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddMilestone}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
                  disabled={loading}
                >
                  Add Milestone
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Contract;