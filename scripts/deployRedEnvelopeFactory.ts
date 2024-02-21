import { ethers } from "hardhat";

async function main() {

  const RedChatFactory = await ethers.getContractFactory("RedEnvelopeFactory");
  const redChatFactory = await RedChatFactory.deploy();

  await redChatFactory.deployed();

  console.log("RedChatFactory deployed to:", redChatFactory.address);
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
