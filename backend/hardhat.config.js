require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // ✅ Load .env file

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // ✅ Optimization runs
      },
      viaIR: true, // ✅ Enable IR-based compilation to fix "Stack too deep" errors
    },
  },
  networks: {
    hardhat: {}, // ✅ Local Hardhat network
    educhain: {
      url: process.env.EDUCHAIN_RPC_URL, // ✅ Use EduChain RPC from .env
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // ✅ Load private key securely
    },
  },
};