import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import MetaMaskSDK from "@metamask/sdk";
import chainConfig from "../chainConfig";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState({ address: null, provider: null });
  const [currentChain, setCurrentChain] = useState("eduChain"); // Default to EduChain

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
          const network = await ethProvider.getNetwork();
          const chainId = network.chainId.toString();
          setCurrentChain(
            chainId === chainConfig.linea.chainId ? "linea" : "eduChain"
          );
        }

        // Listen for chain changes
        sdkProvider.on("chainChanged", (chainId) => {
          const newChainId = parseInt(chainId, 16).toString();
          const newChain =
            newChainId === chainConfig.linea.chainId ? "linea" : "eduChain";
          setCurrentChain(newChain);
        });
      } catch (err) {
        console.error("WalletProvider initialization failed:", err);
      }
    };
    initializeProvider();

    return () => {
      const sdkProvider = MMSDK.getProvider();
      if (sdkProvider && typeof sdkProvider.removeListener === "function") {
        sdkProvider.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ walletData, setWalletData, currentChain, setCurrentChain }}>
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