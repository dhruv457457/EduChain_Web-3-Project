import { useState, useEffect } from "react";
import { ethers } from "ethers";
import UsernameRegistryABI from "../contracts/UsernameRegistry.json";

const REGISTRY_ADDRESS = "0x55C5C1991714595969c66F0b55DFF740f3031Cb4";

const useUsernameRegistry = (provider) => {
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize contract and check registration status
  useEffect(() => {
    const init = async () => {
      if (!provider) return;
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

        const contractInstance = new ethers.Contract(
          REGISTRY_ADDRESS,
          UsernameRegistryABI.abi,
          signer
        );
        setContract(contractInstance);

        // Check registration status
        const registered = await contractInstance.isRegistered(address);
        setIsRegistered(registered);
        if (registered) {
          const name = await contractInstance.getUsernameFromAddress(address);
          setUsername(name);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    init();
  }, [provider]);

  const registerUsername = async (usernameInput) => {
    if (!contract) throw new Error("Contract not initialized");
    if (!usernameInput.trim()) throw new Error("Username cannot be empty");
    
    setIsLoading(true);
    try {
      const tx = await contract.registerUsername(usernameInput);
      await tx.wait();
      setUsername(usernameInput);
      setIsRegistered(true);
      return tx.hash;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAddressFromUsername = async (usernameInput) => {
    if (!contract) throw new Error("Contract not initialized");
    try {
      const address = await contract.getAddressFromUsername(usernameInput);
      return address === ethers.ZeroAddress ? null : address;
    } catch (error) {
      console.error("Address lookup error:", error);
      throw error;
    }
  };

  return {
    contract,
    userAddress,
    username,
    isRegistered,
    isLoading,
    registerUsername,
    getAddressFromUsername,
    checkRegistration: async (address) => {
      if (!contract) return false;
      return await contract.isRegistered(address || userAddress);
    }
  };
};

export default useUsernameRegistry;