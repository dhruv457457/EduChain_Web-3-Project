import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import MetaMaskSDK from "@metamask/sdk";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState({ address: null, provider: null });

  const MMSDK = new MetaMaskSDK({
    dappMetadata: { name: "Cryptify" },
    logging: { developerMode: true },
  });

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        const sdkProvider = MMSDK.getProvider();
        if (!sdkProvider) throw new Error("MetaMask SDK provider not initialized");
        const ethProvider = new ethers.BrowserProvider(sdkProvider);
        const accounts = await ethProvider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setWalletData({ address: accounts[0], provider: ethProvider });
          console.log("✅ Wallet initialized with address:", accounts[0]);
        } else {
          console.log("❌ No connected accounts found.");
        }
      } catch (err) {
        console.error("WalletProvider initialization failed:", err);
      }
    };
    initializeProvider();
  }, []);
  

  return (
    <WalletContext.Provider value={{ walletData, setWalletData }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};