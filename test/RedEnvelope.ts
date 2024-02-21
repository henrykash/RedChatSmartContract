import { expect } from "chai";
import { ethers } from "hardhat";
// import { ethers } from "ethers";

describe("RedChatFactory and RedEnvelope", function () {
  let redChatFactory: any;
  let redEnvelopeAddress: any;
  let owner: any;
  let  addr1: any;
  let addr2: any;
  let token: any; // This will be a mock token for testing

  beforeEach(async function () {
    // Deploy a mock ERC20 token first
    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy("MockToken", "MTK", ethers.utils.parseEther("1000"));
    await token.deployed();

    // Get signers
    // [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy RedChatFactory
    const RedChatFactory: any  = await ethers.getContractFactory("RedChatFactory");
    redChatFactory = await RedChatFactory.deploy();
    await redChatFactory.deployed();
  });


  it("Should deploy a RedEnvelope through the factory and return its address", async function () {
    // Directly call the deployRedEnvelope function and capture the return value
    const redEnvelopeAddress = await redChatFactory.deployRedEnvelope(token.address, [addr1.address]);

    // expect(redEnvelopeAddress).to.be.properAddress;
    expect(await redChatFactory.getAllDeployedContracts()).to.include(redEnvelopeAddress);
});


  it("Should allow whitelisted address to claim tokens", async function () {
    // Assuming the previous test has already run, and redEnvelopeAddress is set
    const RedEnvelope = await ethers.getContractAt("RedEnvelope", redEnvelopeAddress);

    // Approve and initialize the RedEnvelope with tokens
    await token.approve(redEnvelopeAddress, ethers.utils.parseEther("100"));
    await RedEnvelope.initialize(ethers.utils.parseEther("100"));

    // Claim tokens
    await RedEnvelope.connect(addr1).claimTokens(addr1.address); // Assuming claimTokens is correctly implemented

    // Check balances
    expect(await token.balanceOf(addr1.address)).to.be.above(0);
  });

});
