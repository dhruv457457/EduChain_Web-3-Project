import React, { createContext, useContext, useState } from "react";

// Create the context
const WalletContext = createContext();

// Provider component to wrap the app
export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState({ address: null, provider: null });
  return (
    <WalletContext.Provider value={{ walletData, setWalletData }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook to use the context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};