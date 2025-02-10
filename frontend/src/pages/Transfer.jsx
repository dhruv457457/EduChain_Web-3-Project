import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FundTransferABI from "../contracts/FundTransfer.json";
import Navbar from "../components/Navbar";

const contractAddress = "0x8fB146232154f2456bCC9d0BD17353686b5F4864";

function Transfer() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserAddress();
    fetchTransactions();
  }, []);

  const fetchUserAddress = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setUserAddress(await signer.getAddress());
    }
  };

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, FundTransferABI.abi, signer);
  };

  const validateInputs = () => {
    if (!recipient || !ethers.isAddress(recipient)) {
      toast.error("⚠️ Invalid recipient address!");
      return false;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("⚠️ Enter a valid amount!");
      return false;
    }
    return true;
  };

  const sendFunds = async () => {
    if (!window.ethereum) return toast.error("🦊 Please install MetaMask!");

    if (!validateInputs()) return;

    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.sendFunds(recipient, message, {
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      toast.success(`✅ Transfer successful! TX: ${tx.hash}`);

      setRecipient("");
      setAmount("");
      setMessage("");
      fetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error("❌ Transaction failed!");
    } finally {
      setLoading(false);
    }
  };

  const claimFunds = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.claimFunds();
      await tx.wait();
      toast.success("✅ Claimed successfully!");
      fetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error("❌ Claim failed!");
    } finally {
      setLoading(false);
    }
  };

  const refund = async (receiver) => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.refund(receiver);
      await tx.wait();
      toast.success("✅ Refund issued successfully!");
      fetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error("❌ Refund failed!");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
        if (!window.ethereum) return alert("Please install MetaMask!");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, FundTransferABI.abi, provider);

        const txs = await contract.getAllTransactions(); // ✅ Use global function
        console.log("Fetched Transactions:", txs);

        if (txs.length === 0) console.log("No transactions found.");

        setTransactions(
            txs.map(tx => ({
                sender: tx.sender,
                receiver: tx.receiver,
                amount: ethers.formatEther(tx.amount),
                message: tx.message,
                timestamp: new Date(Number(tx.timestamp) * 1000).toLocaleString(),
                claimed: tx.claimed,
                refunded: tx.refunded,
            }))
        );
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
};



  return (
    <>
      <Navbar />
      <div className="p-6">
        <ToastContainer position="top-right" autoClose={5000} />
        <h2 className="text-2xl mb-4">Transfer Funds</h2>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Remark/Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={sendFunds}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Send Funds"}
        </button>

        <button
          onClick={claimFunds}
          className={`ml-2 px-4 py-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Claim Funds"}
        </button>

        <h3 className="text-xl mt-6">Recent Transactions</h3>
        {transactions.length > 0 ? (
          transactions.map((tx, index) => (
            <div key={index} className="border p-2 mt-2">
              <p>
                <strong>Sender:</strong> {tx.sender}
              </p>
              <p>
                <strong>Receiver:</strong> {tx.receiver}
              </p>
              <p>
                <strong>Amount:</strong> {tx.amount} ETH
              </p>
              <p>
                <strong>Message:</strong> {tx.message}
              </p>
              <p>
                <strong>Timestamp:</strong> {tx.timestamp}
              </p>
              {!tx.claimed &&
                tx.sender.toLowerCase() === userAddress.toLowerCase() && (
                  <button
                    onClick={() => refund(tx.receiver)}
                    className={`bg-red-500 px-3 py-1 rounded hover:bg-red-700 mt-2 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Refund"}
                  </button>
                )}
            </div>
          ))
        ) : (
          <p>No recent transactions</p>
        )}
      </div>
    </>
  );
}

export default Transfer;
