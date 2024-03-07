import { ethers } from "ethers";
import { HelpersWrapper } from "./helpers/helpers";
import { Config } from "./config/config";

const main = async () => {
  const whitelist = [
    "0x81443057e6553D5CacEE656E3e8b71b52998db14",
    "0x86bc300654DE52620bB871E8B0922e52d4a06E43",
    "0x68601FCb114F5480D20c0338a63411aaDfe7c9ce"
  ];
  //0x28be9ec4785f74d0fc893965aB20bEc135940330
  const redEnvelopeAddress = "0x5294312132c662947E0c46DB820c76E6acfa2135";
  const ownerAddress = "0x05A7c5db4bEce0aBBFE9C576554cf4f08C671b5b";
  const tokenAmount = 1000;
  const quantity = 2;
  const testSigner1 = Config.TEST_SIGNER
  const testSigner2 = Config.TEST_SIGNER_2
  const testSigner3 = Config.TEST_SIGNER_3
  const claimAddress1 = "0x81443057e6553D5CacEE656E3e8b71b52998db14";
  const claimAddress2 = "0x86bc300654DE52620bB871E8B0922e52d4a06E43";
  const claimAddress3 = "0x68601FCb114F5480D20c0338a63411aaDfe7c9ce"
  const factoryAddress = Config.RED_ENVELOPE_FACTORY_ADDRESS
  const rpcUrl = Config.JSON_RPC_URL_OPBNB
  const tokenAddress = Config.TEST_ERC20_TOKEN
  const signer = Config.PRIVATE_KEY

  const deployCreds = {
    factoryAddress,
    ownerAddress,
    whitelist,
    tokenAmount, 
    tokenAddress,
    signer,
    rpcUrl
   }
  
  // const claim = await HelpersWrapper.userClaimRandomTokens(
  //   redEnvelopeAddress,
  //   claimAddress3,
  //   testSigner3,
  //   rpcUrl 
  // )


  const getClaimAmount = await HelpersWrapper.getUserClaimedAmount(
  redEnvelopeAddress, 
  claimAddress1 ,
  rpcUrl
  )

  // const getAllUserDetails = await HelpersWrapper.getAllUsersClaimDetails(
  //   redEnvelopeAddress,
  //   rpcUrl
  // )

    // const deployRedEnvelope = await HelpersWrapper.deployRedEnvelope(deployCreds)

  console.log({getClaimAmount});
};

main();
