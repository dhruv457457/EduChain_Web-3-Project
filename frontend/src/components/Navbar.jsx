import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import MetaMaskSDK from '@metamask/sdk';
import { FaBars, FaTimes, FaWallet, FaSignOutAlt, FaExclamationTriangle, FaCopy } from "react-icons/fa";
import { useWallet } from "./WalletContext";

function Navbar() {
  const { walletData, setWalletData } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const alertTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const MMSDK = useRef(new MetaMaskSDK({
    dappMetadata: { name: "Cryptify" },
    logging: { developerMode: true },
  })).current;

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        const sdkProvider = MMSDK.getProvider();
        if (sdkProvider) {
          const ethProvider = new ethers.BrowserProvider(sdkProvider);
          const accounts = await ethProvider.send("eth_accounts", []);
          if (accounts.length > 0) {
            setWalletData({ address: accounts[0], provider: ethProvider });
          }
        }
      } catch (err) {
        setError("Failed to initialize provider: " + err.message);
      }
    };
    initializeProvider();
  }, [setWalletData]);

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress && walletData.provider) {
      setWalletData(prev => ({ ...prev, address: storedAddress }));
      checkConnectedAccounts();
      checkChainId();
    }
  }, [walletData.provider, setWalletData]);

  const checkConnectedAccounts = async () => {
    if (!walletData.provider) return;
    try {
      const accounts = await walletData.provider.send("eth_accounts", []);
      if (accounts.length === 0 || accounts[0] !== walletData.address) {
        disconnectWallet();
      }
    } catch (error) {
      console.error("Error checking connected accounts:", error);
    }
  };

  const showCustomAlert = () => {
    setShowAlert(true);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    alertTimeoutRef.current = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const checkChainId = async () => {
    if (!walletData.provider) return false;
    try {
      const network = await walletData.provider.getNetwork();
      const chainId = network.chainId.toString();
      if (chainId !== "656476") {
        showCustomAlert();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to check chain ID:", error);
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await MMSDK.connect();
      if (accounts && accounts.length > 0) {
        const sdkProvider = MMSDK.getProvider();
        if (!sdkProvider) throw new Error("Provider not available after connection");
        const ethProvider = new ethers.BrowserProvider(sdkProvider);
        setWalletData({ address: accounts[0], provider: ethProvider });
        localStorage.setItem("walletAddress", accounts[0]);
        const isCorrectChain = await checkChainId();
        if (!isCorrectChain) {
          console.log("Not connected to EDU Chain");
        }
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setError("Failed to connect wallet. Please ensure MetaMask is installed.");
    }
  };

  const disconnectWallet = () => {
    setWalletData({ address: null, provider: null });
    localStorage.removeItem("walletAddress");
    MMSDK.terminate();
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goToDocs = () => {
    navigate("/docs");
    setShowAlert(false);
  };

  useEffect(() => {
    if (!walletData.provider) return;
    const sdkProvider = MMSDK.getProvider();
    if (sdkProvider && typeof sdkProvider.on === "function") { // Guard against undefined
      const handleChainChanged = (chainId) => {
        if (chainId !== "0xa045c") {
          showCustomAlert();
        } else {
          setShowAlert(false);
        }
      };
      sdkProvider.on("chainChanged", handleChainChanged);
      return () => {
        if (sdkProvider && typeof sdkProvider.removeListener === "function") {
          sdkProvider.removeListener("chainChanged", handleChainChanged);
        }
      };
    } else {
      console.warn("MetaMask SDK provider not ready or invalid");
    }
  }, [walletData.provider]);

  if (error) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-customDarkpurple bg-opacity-90 backdrop-blur-sm shadow-navbar px-8 sm:px-10 py-4 text-white flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-customPurple via-customBlue to-customBlue2 text-transparent bg-clip-text">
          Cryptify
        </h1>
        <div className="text-red-500">{error}</div>
      </nav>
    );
  }

  return (
    <>
      {showAlert && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-11/12 md:w-auto">
          <div className="bg-customDarkpurple border-2 border-customPurple rounded-lg shadow-lg px-6 py-4 flex flex-col md:flex-row items-center gap-4 backdrop-blur-sm bg-opacity-95 animate-fadeIn">
            <FaExclamationTriangle className="text-yellow-300 text-3xl flex-shrink-0" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-white font-bold text-lg mb-1">Wrong Network Detected</h3>
              <p className="text-customGray text-sm mb-3">
                Please connect to OpenCampus Codex Sepolia (EDU Chain).
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
                  className="text-customGray py-2 px-4 rounded-md border border-gray-600 hover:bg-customSemiPurple transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full bg-customDarkpurple bg-opacity-90 backdrop-blur-sm shadow-navbar px-8 sm:px-10 py-4 text-white flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-customPurple via-customBlue to-customBlue2 text-transparent bg-clip-text">
          Cryptify
        </h1>

        <div className="hidden md:flex gap-10 items-center text-base">
          <Link to="/" className="hover:text-customBlue2 transition duration-300">
            Home
          </Link>
          <Link to="/contract" className="hover:text-customBlue2 transition duration-300">
            Contract
          </Link>
          <Link to="/docs" className="hover:text-customBlue2 transition duration-300">
            Docs
          </Link>
          <Link to="/transfer" className="hover:text-customBlue2 transition duration-300">
            Transfer
          </Link>
          <Link to="/user" className="hover:text-customBlue2 transition duration-300">
            Profile
          </Link>

          {walletData.address ? (
            <div className="flex items-center gap-2 bg-gradient-to-r from-customPurple to-customBlue px-4 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition-all">
              <FaWallet className="text-white" />
              <span>{walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}</span>
              <button onClick={copyAddress} className="text-white hover:text-customGray">
                <FaCopy title={copied ? "Copied!" : "Copy Address"} />
              </button>
              <button onClick={disconnectWallet} className="text-red-300 hover:text-red-500">
                <FaSignOutAlt title="Disconnect" />
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-customPurple to-customBlue px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2 shadow-md hover:opacity-90 transition-all active:scale-95"
            >
              <FaWallet />
              Connect Wallet
            </button>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div
          className={`absolute top-full left-0 w-full bg-customSemiPurple bg-opacity-95 backdrop-blur-md transition-all duration-500 overflow-hidden ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center py-4 space-y-4">
            <Link to="/" className="hover:text-customBlue2 transition duration-300" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/contract" className="hover:text-customBlue2 transition duration-300" onClick={() => setIsOpen(false)}>
              Contract
            </Link>
            <Link to="/docs" className="hover:text-customBlue2 transition duration-300" onClick={() => setIsOpen(false)}>
              Docs
            </Link>
            <Link to="/transfer" className="hover:text-customBlue2 transition duration-300" onClick={() => setIsOpen(false)}>
              Transfer
            </Link>
            <Link to="/user" className="hover:text-customBlue2 transition duration-300" onClick={() => setIsOpen(false)}>
              Profile
            </Link>

            {walletData.address ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-customPurple to-customBlue px-4 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition-all">
                <FaWallet className="text-white" />
                <span>{walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}</span>
                <button onClick={copyAddress} className="text-white hover:text-customGray">
                  <FaCopy title={copied ? "Copied!" : "Copy Address"} />
                </button>
                <button onClick={disconnectWallet} className="text-red-300 hover:text-red-500">
                  <FaSignOutAlt title="Disconnect" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-customPurple to-customBlue px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2 shadow-md hover:opacity-90 transition-all active:scale-95"
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