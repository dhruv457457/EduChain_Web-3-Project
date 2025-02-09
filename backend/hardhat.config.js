require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // ✅ Load .env file

module.exports = {
  solidity: "0.8.20",
  networks: {
    educhain: {
      url: process.env.EDUCHAIN_RPC_URL, // ✅ Uses EduChain RPC URL from .env
      accounts: [process.env.PRIVATE_KEY] // ✅ Uses private key from .env
    }
  }
};
