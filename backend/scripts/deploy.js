const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying contracts...");

  // Get the deployer's address
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deploying from:", deployer.address);

  // Deploy UsernameRegistry contract (fully qualified name)
  const UsernameRegistry = await hre.ethers.getContractFactory("contracts/UsernameRegistry.sol:UsernameRegistry");
  const usernameRegistry = await UsernameRegistry.deploy();
  await usernameRegistry.waitForDeployment();
  console.log(`✅ UsernameRegistry deployed at: ${usernameRegistry.target}`);

  // Deploy FundTransferWithRegistry contract with UsernameRegistry address
  const FundTransferWithRegistry = await hre.ethers.getContractFactory("FundTransferWithRegistry");
  const fundTransferWithRegistry = await FundTransferWithRegistry.deploy(usernameRegistry.target);
  await fundTransferWithRegistry.waitForDeployment();
  console.log(`✅ FundTransferWithRegistry deployed at: ${fundTransferWithRegistry.target}`);

  // Deploy CryptifySWC contract with UsernameRegistry address
  const CryptifySWC = await hre.ethers.getContractFactory("CryptifySWC");
  const cryptifySWC = await CryptifySWC.deploy(usernameRegistry.target);
  await cryptifySWC.waitForDeployment();
  console.log(`✅ CryptifySWC deployed at: ${cryptifySWC.target}`);

  // Verify the registry address used by each contract
  console.log("🔗 UsernameRegistry address used by FundTransferWithRegistry:", await fundTransferWithRegistry.registry());
  console.log("🔗 UsernameRegistry address used by CryptifySWC:", await cryptifySWC.registry());
}

main()
  .then(() => {
    console.log("🎉 All contracts deployed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });