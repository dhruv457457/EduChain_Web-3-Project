import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import MetaMaskSDK from "@metamask/sdk";
import {
  FaBars,
  FaTimes,
  FaWallet,
  FaSignOutAlt,
  FaCopy,
  FaUserCircle,
  FaTachometerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useWallet } from "./WalletContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { walletData, setWalletData } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const MMSDK = useRef(
    new MetaMaskSDK({
      dappMetadata: { name: "Dkarma" },
      logging: { developerMode: true },
    })
  ).current;

  // Effect to handle clicking outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  useEffect(() => {
    const init = async () => {
      try {
        const provider = MMSDK.getProvider();
        if (!provider) throw new Error("MetaMask SDK not ready");
        const ethProvider = new ethers.BrowserProvider(provider);
        const accounts = await ethProvider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setWalletData({ address: accounts[0], provider: ethProvider });
        } else {
          setWalletData({ address: null, provider: null });
        }

        provider.on("accountsChanged", (accounts) => {
          if (accounts.length === 0) {
            setWalletData({ address: null, provider: null });
          } else {
            const updatedProvider = new ethers.BrowserProvider(provider);
            setWalletData({ address: accounts[0], provider: updatedProvider });
          }
        });

        provider.on("chainChanged", () => window.location.reload());
      } catch (err) {
        setError("MetaMask initialization failed");
      }
    };
    init();

    return () => {
      const provider = MMSDK.getProvider();
      if (provider?.removeListener) {
        provider.removeListener("accountsChanged", () => {});
        provider.removeListener("chainChanged", () => {});
      }
    };
  }, [setWalletData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

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
      toast.success("Wallet Connected!");
    } catch (err) {
      toast.error("Wallet connection failed");
    }
  };

  const disconnectWallet = () => {
    setWalletData({ address: null, provider: null });
    MMSDK.terminate();
    setShowProfileDropdown(false);
    navigate("/");
    toast.info("Wallet Disconnected");
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
    { path: "/docs", label: "Docs" },
    { path: "/user#transfer", label: "Transfer" },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  return (
    <nav className="fixed top-0 w-full h-16 z-50 backdrop-blur-md px-4 py-3 flex justify-between items-center">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-primary_hover font-poppins"
      >
        Dkarma
      </motion.h1>

      <div className="hidden md:flex items-center gap-6 text-white font-poppins font-medium">
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

        {walletData.address ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="transition-transform duration-300 hover:scale-110"
            >
              <FaUserCircle className="w-8 h-8 text-white hover:text-customPurple" />
            </button>
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-56 bg-[#16192E] border border-gray-700/50 rounded-xl shadow-lg z-50 text-sm overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-700/50">
                    <p className="text-xs text-gray-400">Connected as</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-white">
                        {walletData.address.slice(0, 6)}...
                        {walletData.address.slice(-4)}
                      </span>
                      <button onClick={copyAddress} title="Copy Address">
                        {copied ? (
                          <FaCheckCircle className="text-green-400" />
                        ) : (
                          <FaCopy className="text-gray-400 hover:text-white transition" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Link
                    to="/user"
                    className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-purple-600/20 text-gray-200 transition-colors duration-200"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <FaTachometerAlt className="text-customPurple" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={disconnectWallet}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-400 transition-colors duration-200"
                  >
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            onClick={connectWallet}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-customPurple hover:bg-customBlue text-white px-3 py-1.5 rounded-full shadow-md-purple transition text-sm"
          >
            <FaWallet /> Connect
          </motion.button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-customSemiPurple backdrop-blur-md shadow-glass md:hidden"
          >
            <div className="flex flex-col items-center gap-4 text-white font-poppins font-medium px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`${getLinkClass(
                    link.path
                  )} w-full text-center py-2 hover:bg-customDark/50 rounded-md transition`}
                >
                  {link.label}
                </Link>
              ))}

              {walletData.address && (
                 <Link
                    to="/user"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2 hover:bg-customDark/50 rounded-md transition"
                >
                    Profile
                </Link>
              )}

              {walletData.address ? (
                <div className="flex flex-col items-center gap-3 px-4 py-3 text-sm bg-black/20 rounded-xl shadow-soft w-full border border-gray-700/50 mt-2">
                  <div className="flex items-center gap-2">
                    <FaWallet className="text-customPurple" />
                    <span className="font-mono">
                      {walletData.address.slice(0, 6)}...
                      {walletData.address.slice(-4)}
                    </span>
                  </div>
                  <div className="w-full flex justify-center gap-6 mt-2">
                    <button
                      onClick={copyAddress}
                      className="flex items-center gap-1.5 text-gray-300 hover:text-white transition"
                    >
                      <FaCopy /> Copy
                    </button>
                    <button
                      onClick={disconnectWallet}
                      className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition"
                    >
                      <FaSignOutAlt /> Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="flex items-center justify-center gap-2 bg-customPurple hover:bg-customBlue text-white px-4 py-2 rounded-md shadow-soft w-full text-sm transition mt-2"
                >
                  <FaWallet /> Connect Wallet
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;