require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // ✅ Load .env file

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {}, // ✅ Local Hardhat network
    educhain: {
      url: process.env.EDUCHAIN_RPC_URL, // ✅ Use EduChain RPC from .env
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [] // ✅ Load private key securely
    }
  }
};
