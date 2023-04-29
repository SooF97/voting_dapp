const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Contract deployer address : ", deployer.address);
  //Get the Voting smart contract object and deploy it
  const Voting = await ethers.getContractFactory("Voting");
  console.log("Deploying...");
  const voting = await Voting.deploy();
  console.log("Contract deployed!");
  await voting.deployed();
  console.log("Contract deployed successfully!");

  //Pull the address and ABI out while you deploy, since that will be key in interacting with the smart contract later
  const data = {
    address: voting.address,
    abi: JSON.parse(voting.interface.format("json")),
  };

  //This writes the ABI and address to the sfnMarket.json
  //This data is then used by frontend files to connect with the smart contract
  fs.writeFileSync("./contracts/voting.json", JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
