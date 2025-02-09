const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying FundTransfer contract...");

  const FundTransfer = await hre.ethers.getContractFactory("FundTransfer"); // ✅ Change contract name
  const fundTransfer = await FundTransfer.deploy(); // ✅ Deploy FundTransfer contract

  await fundTransfer.waitForDeployment(); // ✅ Ensure deployment is completed

  console.log(`✅ FundTransfer contract deployed to: ${await fundTransfer.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
