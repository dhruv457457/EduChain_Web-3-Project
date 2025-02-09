const hre = require("hardhat");

async function main() {
  const Investment = await hre.ethers.getContractFactory("Investment");
  const investment = await Investment.deploy(); // ✅ Deploy the contract

  await investment.waitForDeployment(); // ✅ Wait for contract to be deployed

  console.log(`Investment contract deployed to: ${await investment.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
