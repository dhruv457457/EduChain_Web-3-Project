import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for mobile menu

function Navbar() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="fixed top-0 left-0 w-full bg-customDarkpurple bg-opacity-90 backdrop-blur-md shadow-lg transition-all duration-300 px-8 sm:px-10 py-4 text-white flex justify-between items-center z-50">
      {/* Logo */}
      <h1 className="font-bold text-xl">Web 3 Pay</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-10 items-center text-base">
        <Link to="/" className="hover:text-blue-300 transition duration-300">Home</Link>
        <Link to="/transfer" className="hover:text-green-300 transition duration-300">Transfer</Link>
        <Link to="/group-payments" className="hover:text-green-300 transition duration-300">Group Payments</Link>
        <button 
          onClick={connectWallet} 
          className="bg-white px-4 py-2 rounded text-customLightPurple font-semibold border-b-4 border-customLightPurple transition duration-300 hover:bg-opacity-90"
        >
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`absolute top-full left-0 w-full bg-customDarkpurple bg-opacity-95 backdrop-blur-md transition-all duration-500 overflow-hidden ${isOpen ? "max-h-60" : "max-h-0"}`}>
        <div className="flex flex-col items-center py-4 space-y-4">
          <Link to="/" className="hover:text-blue-300 transition duration-300" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/transfer" className="hover:text-green-300 transition duration-300" onClick={() => setIsOpen(false)}>Transfer</Link>
          <Link to="/group-payments" className="hover:text-green-300 transition duration-300" onClick={() => setIsOpen(false)}>Group Payments</Link>
          <button 
            onClick={connectWallet} 
            className="bg-white px-4 py-2 rounded text-customLightPurple font-semibold border-b-4 border-customLightPurple transition duration-300 hover:bg-opacity-90"
          >
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
