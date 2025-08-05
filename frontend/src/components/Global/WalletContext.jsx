// lib/WalletContext.js
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import MetaMaskSDK from "@metamask/sdk";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState({ address: null, provider: null });

  const MMSDK = useRef(
    new MetaMaskSDK({
      dappMetadata: { name: "Cryptify" },
      logging: { developerMode: true },
    })
  ).current;

  useEffect(() => {
    const initialize = async () => {
      try {
        const provider = MMSDK.getProvider();
        if (!provider) {
          console.log("MetaMask provider not available");
          return;
        }

        const ethProvider = new ethers.BrowserProvider(provider);
        const accounts = await ethProvider.send("eth_accounts", []);

        if (accounts.length > 0) {
          setWalletData({ address: accounts[0], provider: ethProvider });
        }

        // Wallet events
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
        console.error("MetaMask initialization failed:", err);
      }
    };

    // Add a small delay to ensure MetaMask is ready
    setTimeout(initialize, 100);

    return () => {
      const provider = MMSDK.getProvider();
      if (provider?.removeListener) {
        provider.removeListener("accountsChanged", () => {});
        provider.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ walletData, setWalletData, MMSDK }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
