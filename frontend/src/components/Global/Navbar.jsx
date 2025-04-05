import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import MetaMaskSDK from "@metamask/sdk";
import { FaBars, FaTimes, FaWallet, FaSignOutAlt, FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWallet } from "./WalletContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { walletData, setWalletData } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const MMSDK = useRef(
    new MetaMaskSDK({
      dappMetadata: { name: "Cryptify" },
      logging: { developerMode: true },
    })
  ).current;

  useEffect(() => {
    const init = async () => {
      try {
        const provider = MMSDK.getProvider();
        if (!provider) throw new Error("MetaMask SDK not ready");
        const ethProvider = new ethers.BrowserProvider(provider);
        const accounts = await ethProvider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setWalletData({ address: accounts[0], provider: ethProvider });
        }
      } catch (err) {
        setError("MetaMask initialization failed");
      }
    };
    init();
  }, [setWalletData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-customPurple relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-customPurple"
      : "relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-customPurple after:transition-all after:duration-300 hover:text-customPurple";

  const connectWallet = async () => {
    try {
      const accounts = await MMSDK.connect();
      const provider = MMSDK.getProvider();
      if (!provider || !accounts?.length) throw new Error("Connection failed");
      const ethProvider = new ethers.BrowserProvider(provider);
      setWalletData({ address: accounts[0], provider: ethProvider });
    } catch (err) {
      toast.error("🦊 Wallet connection failed");
    }
  };

  const disconnectWallet = () => {
    setWalletData({ address: null, provider: null });
    MMSDK.terminate();
    navigate("/");
  };

  const copyAddress = () => {
    if (walletData.address) {
      navigator.clipboard.writeText(walletData.address);
      setCopied(true);
      toast.success("Address copied!");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/contract", label: "Contract" },
    { path: "/docs", label: "Docs" },
    { path: "/transfer", label: "Transfer" },
    { path: "/user", label: "Profile" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-customDarkpurple/80 border-b border-customPurple shadow-custom-purple px-6 py-3 flex justify-between items-center">
      {/* Brand */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-customPurple to-customBlue font-poppins"
      >
        Cryptify
      </motion.h1>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8 text-white font-medium">
        {navLinks.map((link, i) => (
          <motion.div
            key={link.path}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link to={link.path} className={getLinkClass(link.path)}>
              {link.label}
            </Link>
          </motion.div>
        ))}

        {/* Wallet Buttons */}
        {walletData.address ? (
          <div className="flex items-center gap-2 px-4 py-1 rounded-full text-sm shadow-md border border-customPurple bg-gradient-to-r from-customPurple to-customBlue">
            <FaWallet />
            <span className="font-mono">{walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}</span>
            <button onClick={copyAddress} title="Copy Address">
              <FaCopy className="hover:text-customGray transition" />
            </button>
            <button onClick={disconnectWallet} title="Disconnect">
              <FaSignOutAlt className="text-red-300 hover:text-red-500 transition" />
            </button>
          </div>
        ) : (
          <motion.button
            onClick={connectWallet}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-customPurple hover:bg-customBlue text-white px-5 py-2 rounded-full shadow-md transition"
          >
            <FaWallet /> Connect Wallet
          </motion.button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className={`absolute top-full left-0 w-full bg-customSemiPurple backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="flex flex-col gap-4 text-white font-medium px-6 py-4">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={getLinkClass(link.path)}>
              {link.label}
            </Link>
          ))}

          {walletData.address ? (
            <div className="flex flex-col items-start gap-2 px-4 py-2 text-sm bg-gradient-to-r from-customPurple to-customBlue rounded-xl shadow-md">
              <div className="flex items-center gap-2">
                <FaWallet />
                <span className="font-mono">{walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}</span>
              </div>
              <button onClick={copyAddress}><FaCopy /> Copy</button>
              <button onClick={disconnectWallet} className="text-red-400"><FaSignOutAlt /> Disconnect</button>
            </div>
          ) : (
            <button onClick={connectWallet} className="flex items-center gap-2 bg-customPurple hover:bg-customBlue text-white px-4 py-2 rounded-md">
              <FaWallet /> Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
