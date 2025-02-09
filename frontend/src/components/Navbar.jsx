import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

function Navbar() {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert("Please install MetaMask to use this feature!");
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="hover:text-blue-300">Home</Link>
        <Link to="/transfer" className="hover:text-green-300">Transfer</Link>
      </div>
      <button 
        onClick={connectWallet} 
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
      >
        {walletAddress ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4) : "Connect Wallet"}
      </button>
    </nav>
  );
}

export default Navbar;
