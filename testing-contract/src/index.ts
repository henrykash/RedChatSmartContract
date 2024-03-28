import { ethers } from "ethers";
import { HelpersWrapper } from "./helpers/helpers";
import { Config } from "./config/config";

const main = async () => {
  const whitelist = [
    "0x81443057e6553D5CacEE656E3e8b71b52998db14",
    "0x86bc300654DE52620bB871E8B0922e52d4a06E43",
    "0x68601FCb114F5480D20c0338a63411aaDfe7c9ce"
  ];
  
  const redEnvelopeAddress = "0x1a9E6FBBb68FC8D063Dd1d0F16cCE510Ff1945e9";
  const ownerAddress = "0x05A7c5db4bEce0aBBFE9C576554cf4f08C671b5b";
  const amount = 0.00003;
  const quantity = 3;
  const testSigner1 = Config.TEST_SIGNER
  const testSigner2 = Config.TEST_SIGNER_2 //wallet which ends with 43
  const testSigner3 = Config.TEST_SIGNER_3
  const claimAddress1 = "0x81443057e6553D5CacEE656E3e8b71b52998db14";
  const claimAddress2 = "0x86bc300654DE52620bB871E8B0922e52d4a06E43";
  const claimAddress3 = "0x68601FCb114F5480D20c0338a63411aaDfe7c9ce"
  const factoryAddress = "0x9E9BdC4444362d72d97f17699CB0f8c49AD46eE2"
  const rpcUrl = "https://opbnb-mainnet.nodereal.io/v1/996086557f6f47ff991341e707aa6dc2";

  const tokenAddress = "0xa41B3067eC694DBec668c389550bA8fc589e5797" 
 //uic token mainnet 0xb55d3128919d4576aaa3d390638490a053cdea13
  //opb tokeen op.ai 0xa41B3067eC694DBec668c389550bA8fc589e5797
  const signer = Config.PRIVATE_KEY
  const isRandom = false;

    
   

  const deployCreds = {
    isRandom,
    factoryAddress,
    ownerAddress,
    whitelist,
    quantity,
    amount, 
    tokenAddress,
    signer,
    rpcUrl
   }
  
  // const claim = await HelpersWrapper.userClaimEqualERC20Tokens(
  //   redEnvelopeAddress,
  //   claimAddress3,
  //   testSigner3,
  //   rpcUrl 
  // )

  //   const claim = await HelpersWrapper.userClaimRandomERC20Tokens(
  //   redEnvelopeAddress,
  //   claimAddress2,
  //   testSigner2,
  //   rpcUrl 
  // )

  // const claim = await HelpersWrapper.userClaimRandomNativeTokens(
  //   redEnvelopeAddress,
  //   claimAddress3,
  //   testSigner3,
  //   rpcUrl 
  // )

  //  const claim = await HelpersWrapper.userClaimEqualNativeTokens(
  //     redEnvelopeAddress,
  //     claimAddress3,
  //     testSigner3,
  //     rpcUrl 
  //   )

  // const native = await HelpersWrapper.getUsersClaimedNativeTokensList(
  // redEnvelopeAddress, 
  // rpcUrl
  // )

  
  // const native = await HelpersWrapper.getUserClaimedNativeToken(
  //   redEnvelopeAddress, 
  //   claimAddress3,
  //   rpcUrl
  // )

  // const getAllUserDetails = await HelpersWrapper.getUserClaimedERC20Token(
  //   redEnvelopeAddress,
  //   claimAddress3,
  //   rpcUrl
  // )

  // const contractBal = await HelpersWrapper.deployedRedEnvelopeContractBalance(
  //   redEnvelopeAddress,
  //   factoryAddress,
  //   rpcUrl
  // )

   const deployRedEnvelope = await HelpersWrapper.deployRedEnvelopeERC20(deployCreds)
  //  const deployRedEnvelope = await HelpersWrapper.deployRedEnvelopeNative(deployCreds)

  console.log({deployRedEnvelope});
};

main();
