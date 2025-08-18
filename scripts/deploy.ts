import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy PropertyNFT
  const propertyNFT = await ethers.deployContract("PropertyNFT", [deployer.address]);
  await propertyNFT.waitForDeployment();
  console.log("PropertyNFT deployed to:", await propertyNFT.getAddress());

  // Deploy Fractionalizer
  const fractionalizer = await ethers.deployContract("Fractionalizer", [await propertyNFT.getAddress()]);
  await fractionalizer.waitForDeployment();
  console.log("Fractionalizer deployed to:", await fractionalizer.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
