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
    <nav className="bg-customDarkpurple px-10 py-4 text-white flex justify-between items-center">
      <div className="">
        {" "}
        <h1 className="font-bold text-xl">Web 3 Pay</h1>
      </div>
      <div className="flex gap-10 items-center text-base">
        <Link to="/" className="hover:text-blue-300">
          Home
        </Link>
        <Link to="/transfer" className="hover:text-green-300">
          Transfer
        </Link>
        <Link to="/transfer" className="hover:text-green-300">
        Group Payments
        </Link>
        <button
          onClick={connectWallet}
          className="bg-white px-4 py-2 rounded text-customLightPurple font-semibold border-b-4 border-customLightPurple"
        >
          {walletAddress
            ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
            : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
