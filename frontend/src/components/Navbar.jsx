import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { FaBars, FaTimes, FaWallet, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa"; // Added alert icon

function Navbar() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const alertTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
      checkChainId(); // Check chain when component mounts if wallet is connected
    }
    
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const showCustomAlert = () => {
    setShowAlert(true);
    
    // Auto hide after 5 seconds
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    
    alertTimeoutRef.current = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const checkChainId = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const chainId = network.chainId;
        
        // EDU Chain ID is 656476 (0xa045c in hex)
        if (chainId.toString() !== "656476") {
          showCustomAlert();
          return false;
        }
        return true;
      } catch (error) {
        console.error("Failed to check chain ID", error);
        return false;
      }
    }
    return false;
  };

  const goToDocs = () => {
    navigate("/docs");
    setShowAlert(false);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);

        // Store wallet address in localStorage
        localStorage.setItem("walletAddress", accounts[0]);
        
        // Check if connected to the correct chain
        const isCorrectChain = await checkChainId();
        if (!isCorrectChain) {
          console.log("Not connected to EDU Chain");
        }
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

  // Listen for chain changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        // Chain ID comes in hex format from this event
        if (chainId !== '0xa045c') { // 0xa045c is the hex representation of 656476
          showCustomAlert();
        }
      });
    }
    
    return () => {
      // Clean up event listener
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [navigate]);

  return (
    <>
      {/* Custom Alert */}
      {showAlert && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-11/12 md:w-auto">
          <div className="bg-customDarkpurple border-2 border-customPurple rounded-lg shadow-lg px-6 py-4 flex flex-col md:flex-row items-center gap-4 backdrop-blur-sm bg-opacity-95 animate-fadeIn">
            <FaExclamationTriangle className="text-yellow-300 text-3xl flex-shrink-0" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-white font-bold text-lg mb-1">Wrong Network Detected</h3>
              <p className="text-gray-300 text-sm mb-3">
                Please connect to the OpenCampus Codex Sepolia (EDU Chain) to use this application.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button 
                  onClick={goToDocs} 
                  className="bg-gradient-to-r from-customPurple to-customBlue py-2 px-4 rounded-md text-white font-medium hover:opacity-90 transition-all"
                >
                  Add EDU Chain
                </button>
                <button 
                  onClick={() => setShowAlert(false)} 
                  className="text-gray-300 py-2 px-4 rounded-md border border-gray-600 hover:bg-gray-800 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            isOpen ? "max-h-72" : "max-h-0"
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
              onClick={() => setIsOpen(false)}
            >
              Contract
            </Link>
            <Link
              to="/docs"
              className="hover:text-customBlue2 transition duration-300"
              onClick={() => setIsOpen(false)}
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
    </>
  );
}

export default Navbar;