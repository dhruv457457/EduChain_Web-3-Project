const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying contracts...");

  // ✅ Deploy FundTransferWithRegistry
  const FundTransferWithRegistry = await hre.ethers.getContractFactory("FundTransferWithRegistry");
  const fundTransferWithRegistry = await FundTransferWithRegistry.deploy();
  await fundTransferWithRegistry.waitForDeployment();
  const fundTransferWithRegistryAddress = await fundTransferWithRegistry.getAddress();
  console.log(`✅ FundTransferWithRegistry deployed at: ${fundTransferWithRegistryAddress}`);

  // ✅ Deploy CryptifyFreelance and link with FundTransferWithRegistry
  const CryptifyFreelance = await hre.ethers.getContractFactory("CryptifyFreelance");
  const cryptifyFreelance = await CryptifyFreelance.deploy(fundTransferWithRegistryAddress);
  await cryptifyFreelance.waitForDeployment();
  const cryptifyFreelanceAddress = await cryptifyFreelance.getAddress();
  console.log(`✅ CryptifyFreelance deployed at: ${cryptifyFreelanceAddress}`);
}

// ✅ Handle errors properly
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
