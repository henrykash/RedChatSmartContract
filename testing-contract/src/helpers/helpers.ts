import { Contract, Wallet, ethers, providers } from "ethers";
import {
  REDENVELOPE_ABI,
  REDENVELOPE_FACTORY_ABI,
} from "../constants/constants";
class Helpers {
  constructor() {}

  approveContract = (tokenAddress: string, signer: any, urlRpc: string) => {
    const provider = new providers.JsonRpcProvider(urlRpc);
    const account = new Wallet(signer, provider).connect(provider);

    return new Contract(
      tokenAddress,
      [
        "function approve(address _spender, uint256 _value) public returns (bool success)",
      ],
      account
    );
  };

  redEnvelopeFactoryContract = (
    factoryAddress: string,
    signer: any,
    rpcUrl: string
  ) => {
    const provider = new providers.JsonRpcProvider(rpcUrl);
    const account = new Wallet(signer, provider).connect(provider);

    return new Contract(factoryAddress, REDENVELOPE_FACTORY_ABI, account);
  };

  redEnvelopeContract = (
    redEnvelopeAddress: string,
    signer: any,
    rpcUrl: any
  ) => {
    const provider = new providers.JsonRpcProvider(rpcUrl);
    const account = new ethers.Wallet(signer, provider).connect(provider);

    return new Contract(redEnvelopeAddress, REDENVELOPE_ABI, account);
  };

  deployRedEnvelope = async (
    deploymentCreds: {
    factoryAddress: string;
    ownerAddress: string;
    whitelist: string[];
    tokenAmount: any;
    tokenAddress: string;
    signer: any;
    rpcUrl: string;
  }): Promise<{
    deployedEnvelopeAddress: string;
    initializeTxHash: string;
  }> => {
    try {
      const {
        factoryAddress,
        ownerAddress,
        whitelist,
        tokenAmount,
        tokenAddress,
        signer,
        rpcUrl,
      } = deploymentCreds;

      const redChatFactory = this.redEnvelopeFactoryContract(
        factoryAddress,
        signer,
        rpcUrl
      );

      //1. Factory Deploys the RedEnvelope
      const deployedEnvelope = await redChatFactory.deployRedEnvelope(
        tokenAddress,
        whitelist
      );

      // Wait for the transaction to be processed
      const receipt = await deployedEnvelope.wait();

      if (receipt && receipt.events) {
        // Filter the logs for the RedEnvelopeDeployed event
        const redEnvelopeDeployedEvent = receipt.events.filter(
          (x: { event: string }) => x.event === "RedEnvelopeDeployed"
        );

        if (redEnvelopeDeployedEvent.length > 0) {
          // Extracting the deployed address from the event's arguments
          const deployedEnvelopeAddress =
            redEnvelopeDeployedEvent[0].args.envelopeAddress;

          // 2. Call the initialize function from the Deployed RedEnvelope Contract
          const amount = ethers.utils.parseUnits(tokenAmount.toString());

          console.log("amount*********", amount)

          const initializeTxHash = await this.initializeRedEnvelope(
            ownerAddress,
            deployedEnvelopeAddress,
            amount,
            tokenAddress,
            signer,
            rpcUrl
          );

          

            // console.log("initializeTxHash", initializeTxHash)
          return { deployedEnvelopeAddress, initializeTxHash };
        } else {
          throw new Error("RedEnvelopeDeployed event not found");
        }
      } else {
        throw new Error("Transaction receipt not found");
      }
    } catch (error: any) {
      // error = this.parseError(error);
      // return error;
      throw error;
    }
  };

  initializeRedEnvelope = async (
    ownerAddress: string,
    redEnvelopeAddress: string,
    tokenAmount: any,
    tokenAddress: string,
    signer: any,
    rpcUrl: string
  ): Promise<string> => {
    try {
      // Initialize contract instance for the redEnvelope Contract
      const redEnvelope = this.redEnvelopeContract(
        redEnvelopeAddress,
        signer,
        rpcUrl
      );

      // Approve the RedEnvelope contract to spend tokens
      const approveTx = await this.approve(
        redEnvelopeAddress,
        tokenAddress,
        tokenAmount,
        signer,
        rpcUrl
      );

      // Check if approveTx  was successful
      if (approveTx.success == true) {

        const provider = new providers.JsonRpcProvider(rpcUrl);

        const nonce = await provider.getTransactionCount(
          ownerAddress,
          'latest'
        );

        console.log("Nonce", nonce)
  

        const initializeTx = await redEnvelope.initialize(
          ownerAddress,
          tokenAmount,
          {
             nonce: nonce + 1,
            gasLimit: 300000, // TODO  You might need to adjust gasLimit based on the operation's requirements OR allow ethers to calculate it automatically
          }
        );


        console.log("initializeTx****", initializeTx.hash)

        if (initializeTx && initializeTx.hash ) {
          return initializeTx.hash; // Return the transaction hash
        } else {
          throw new Error("Initialization transaction failed");
        }
      } else {
        throw new Error("Approval transaction failed");
      }
    } catch (error: any) {
      // error = this.parseError(error);
      // return error;

      throw error;
    }
  };

  userClaimEqualTokens = async (
    redEnvelopeAddress: string,
    claimerAddress: string,
    signer: any,
    urlRpc: string
  ) => {
    try {
      const provider = new providers.JsonRpcProvider(urlRpc);
      const account = new Wallet(signer, provider).connect(provider);

      const redEnvelope = new Contract(
        redEnvelopeAddress,
        REDENVELOPE_ABI,
        account
      );
       
      const _userAddress = claimerAddress
      const calimTx = await redEnvelope.claimEqualAmount(
        _userAddress,
      );

     return calimTx.hash

    } catch (error) {
      throw error;
      // error = this.parseError(error);
      // return error;
    }
  };

  userClaimRandomTokens = async (
    redEnvelopeAddress: string,
    claimerAddress: string,
    signer: any,
    urlRpc: string
  ) => {
    try {
      const provider = new providers.JsonRpcProvider(urlRpc);
      const account = new Wallet(signer, provider).connect(provider);

      const redEnvelope = new Contract(
        redEnvelopeAddress,
        REDENVELOPE_ABI,
        account
      );

      const calimTx = await redEnvelope.claimRandomToken(claimerAddress);
      if (calimTx ) {
        return calimTx.hash;
      }
    } catch (error) {
      console.error("User unalbe to claim Random Tokens", error)
      error = this.parseError(error);
      return error;
    }
  };

  getALLDeployedContracts = async (factoryAddress: string, rpcUrl: string) => {
    try {
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const redChatFactory = new Contract(
        factoryAddress,
        REDENVELOPE_FACTORY_ABI,
        provider
      );

      const deployedContracts = await redChatFactory.getAllDeployedContracts();

      if (deployedContracts) {
        return deployedContracts;
      }
    } catch (error) {
      error = this.parseError(error);
      return error;
    }
  };

  deployedRedEnvelopeContractBalance = async (
    deployedRedEnvelope: string,
    factoryAddress: string,
    rpcUrl: string
  ) => {
    try {
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const redChatFactory = new Contract(
        factoryAddress,
        REDENVELOPE_FACTORY_ABI,
        provider
      );

      const balance = await redChatFactory.checkBalanceOfDeployedContract(
        deployedRedEnvelope
      );

      if (balance) {
        return ethers.utils.formatUnits(balance);
      }
    } catch (error) {
      error = this.parseError(error);
      return error;
    }
  };

  getUserClaimedAmount = async (
    redEnvelopeAddress: string,
    claimAddress: string,
    rpcUrl: string
  ) => {
    try {
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const redEnvelope = new Contract(
        redEnvelopeAddress,
        REDENVELOPE_ABI,
        provider
      );

      const userDetails = await redEnvelope.getClaimedAmount(claimAddress);

      if (userDetails) {
        return ethers.utils.formatUnits(userDetails);
      }
    } catch (error) {
      error = this.parseError(error);
      return error;
    }
  };

  getAllUsersClaimDetails = async (redEnvelopeAddress: string, rpcUrl: string) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  
      const redEnvelope = new ethers.Contract(
        redEnvelopeAddress,
        REDENVELOPE_ABI,
        provider
      );
  
      // Fetching claimants and their claimed amounts
      const [claimants, amounts] = await redEnvelope.getClaimantsAndAmounts();
  
      // Pairing each claimant address with the corresponding amount claimed
      const allDetails = claimants.map((address: any, index: string | number) => ({
        address: address,
        amount: ethers.utils.formatUnits(amounts[index])
      }));
  
      return allDetails;
    } catch (error) {
      console.error("Error fetching claim details:", error);
      // Assuming parseError is a custom method to format error messages
      return this.parseError(error);
    }
  };
  

  approve = async (
    redEnvelopeAddress: string,
    tokenAddress: string,
    tokenAmount: any,
    signer: string,
    rpcUrl: string
  ) => {
    try {
      const contract = this.approveContract(tokenAddress, signer, rpcUrl);

      const transaction = await contract.approve(
        redEnvelopeAddress,
        tokenAmount
      );

        console.log("APPROVE", transaction.hash)
        return { success: true, data: `${transaction.hash}` };
    
    } catch (error) {
      return { success: false, data: `${error}` };
    }
  };

  /**
   *
   * @param error the error to be logged
   * @returns
   */
  parseError = (error: any) => {
    let msg = "";
    try {
      error = JSON.parse(JSON.stringify(error));
      msg =
        error?.error?.reason ||
        error?.reason ||
        JSON.parse(error)?.error?.error?.response?.error?.message ||
        error?.response ||
        error?.message ||
        error;
    } catch (_error: any) {
      msg = error;
    }

    return msg;
  };
}

export const HelpersWrapper = new Helpers();
