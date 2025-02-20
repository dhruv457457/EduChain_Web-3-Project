import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { FaBars, FaTimes, FaWallet, FaSignOutAlt } from "react-icons/fa"; // Icons

function Navbar() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);

        // Store wallet address in localStorage
        localStorage.setItem("walletAddress", accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert("Please install MetaMask to use this feature!");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-customDarkpurple bg-opacity-90 backdrop-blur-sm shadow-lg transition-all duration-300 px-8 sm:px-10 py-4 text-white flex justify-between items-center z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-customPurple via-customBlue to-customBlue2 text-transparent bg-clip-text">
        Cryptify
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-10 items-center text-base">
        <Link to="/" className="hover:text-customBlue2 transition duration-300">
          Home
        </Link>
        <Link
          to="/contract"
          className="hover:text-customBlue2 transition duration-300"
        >
          Contract
        </Link>
        <Link
          to="/docs"
          className="hover:text-customBlue2 transition duration-300"
        >
          Docs
        </Link>
        <Link
          to="/transfer"
          className="hover:text-customBlue transition duration-300"
        >
          Transfer
        </Link>
        <Link
          to="/user"
          className="hover:text-customBlue transition duration-300"
        >
          Profile
        </Link>

        {/* Wallet Connection */}
        <div className="relative">
          {walletAddress ? (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded text-customLightPurple font-semibold border-b-4 border-customLightPurple transition duration-300 hover:bg-opacity-90">
              <FaWallet className="text-customLightPurple" />
              <span>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                onClick={disconnectWallet}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-4 py-2 rounded font-semibold  
    bg-white text-customLightPurple border-b-4 border-customLightPurple  
    transition-all duration-300 ease-in-out shadow-md 
    hover:bg-customLightPurple hover:text-white hover:border-white hover:shadow-lg active:scale-95"
            >
              <FaWallet />
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-customDarkpurple bg-opacity-95 backdrop-blur-md transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center py-4 space-y-4">
          <Link
            to="/"
            className="hover:text-blue-300 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/contract"
            className="hover:text-customBlue2 transition duration-300"
          >
            Contract
          </Link>
          <Link
            to="/docs"
            className="hover:text-customBlue2 transition duration-300"
          >
            Docs
          </Link>
          <Link
            to="/transfer"
            className="hover:text-green-300 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Transfer
          </Link>
          <Link
            to="/user"
            className="hover:text-green-300 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>

          {/* Wallet Connection for Mobile */}
          {walletAddress ? (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded text-customLightPurple font-semibold border-b-4 border-customLightPurple transition duration-300 hover:bg-opacity-90">
              <FaWallet className="text-customLightPurple" />
              <span>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                onClick={disconnectWallet}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-white px-4 py-2 rounded text-customLightPurple font-semibold border-b-4 border-customLightPurple transition duration-300 hover:bg-opacity-90 flex items-center gap-2"
            >
              <FaWallet />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
