import { ethers } from "ethers";
import { HelpersWrapper } from "./helpers/helpers";

const main = async () => {
  const whitelist = [
    "0x81443057e6553D5CacEE656E3e8b71b52998db14",
    "0x86bc300654DE52620bB871E8B0922e52d4a06E43",
  ];
  const claimAddress = "0x81443057e6553D5CacEE656E3e8b71b52998db14";
  const deployedRedEnvelope = "0x6F297fEa8F7b37960Ffa18095E252A34bc6fa8FA";
  const owner = "0x05A7c5db4bEce0aBBFE9C576554cf4f08C671b5b";
  const tokenAount = ethers.utils.parseUnits("0.009");
  //  const initialize = await HelpersWrapper.initializeRedEnvelope(owner, deployedRedEnvelope, tokenAount)
  //  const deployENv = await HelpersWrapper.deployRedEnvelope(whitelist)

  const balance = await HelpersWrapper.checkEnvelopeContractBalance(
    deployedRedEnvelope,
  );
  console.log({ balance });
};

main();
