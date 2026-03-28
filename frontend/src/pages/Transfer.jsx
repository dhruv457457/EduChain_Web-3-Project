import{ useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import useContract from "../hooks/useContract";
import TransferForm from "../components/TransferModule/TransferForm";
import TransactionList from "../components/TransferModule/TransactionList";
import { useWallet } from "../components/Global/WalletContext";
import { useNavigate, useLocation } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { List } from "lucide-react";

const Transfer = () => {
  const { walletData } = useWallet();
  const {
    transactions,
    fetchTransactions,
    claimFunds,
    sendFunds,
    sendFundsToAddress,
    isLoading,
  } = useContract(walletData?.provider);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAddress, setIsAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("Transactions");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (walletData?.address) {
      fetchTransactions();
    }
  }, [walletData?.address, fetchTransactions]);

  const validateInputs = () => {
    if (!recipient || recipient.trim() === "") {
      toast.error("❌ Enter a valid recipient username or address!");
      return false;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("❌ Please enter a valid amount!");
      return false;
    }
    if (isAddress && !ethers.isAddress(recipient)) {
      toast.error("❌ Invalid Ethereum address!");
      return false;
    }
    return true;
  };

  const handleSendFunds = async () => {
    if (!walletData?.provider) {
      toast.error("🦊 Please connect your wallet!");
      return;
    }
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      const tx = isAddress
        ? await sendFundsToAddress(recipient, amount, message)
        : await sendFunds(recipient, amount, message);
        
      const waitingToastId = toast.info("⏳ Waiting for transaction confirmation...", { autoClose: false });
      await tx.wait();
      toast.dismiss(waitingToastId);
      setRecipient("");
      setAmount("");
      setMessage("");
      await fetchTransactions();
      toast.success("✅ Transfer successful!");
    } catch (error) {
      toast.dismiss();
      toast.error(`❌ Transaction failed! ${error.reason || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const tabs = [{ name: "Transactions", icon: <List size={16} /> }];

  const renderContent = () => {
    switch (activeTab) {
      case "Transactions":
        return (
          <TransactionList
            transactions={transactions}
            userAddress={walletData?.address}
            loading={isLoading && transactions.length === 0}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white pb-12 ">
      <ToastContainer position="top-right" autoClose={5000} />
      <main className="max-w-7xl mx-auto space-y-8">

        {/* Transfer Form */}
        <TransferForm
          recipient={recipient}
          setRecipient={setRecipient}
          amount={amount}
          setAmount={setAmount}
          message={message}
          setMessage={setMessage}
          sendFunds={handleSendFunds}
          claimFunds={claimFunds}
          loading={isSubmitting}
          isAddress={isAddress}
          setIsAddress={setIsAddress}
        />
        
        {/* Tab Navigation */}
        <div className="bg-[#16192E] p-1.5 rounded-lg border border-gray-700/50 inline-flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
                activeTab === tab.name
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Transfer;