import { Contract, Wallet, ethers, providers, utils } from "ethers";
import { Config } from "../config/config";
import {
  REDENVELOPE_ABI,
  REDENVELOPE_FACTORY_ABI,
} from "../constants/constants";
class Helpers {
  private _provider: providers.JsonRpcProvider;
  private _signer: Wallet;
  private _claimWalletSIgner: Wallet;
  constructor() {
    this._provider = new providers.JsonRpcProvider(Config.JSON_RPC_URL_OPBNB);
    this._signer = new Wallet(Config.PRIVATE_KEY, this._provider).connect(
      this._provider
    );

    this._claimWalletSIgner = new Wallet(
      Config.TEST_SIGNER,
      this._provider
    ).connect(this._provider);
  }

  approveContract = async (privateKey: any, tokenAddress: string) => {
    const account = new Wallet(privateKey, this._provider).connect(
      this._provider
    );

    return new Contract(
      tokenAddress,
      [
        "function approve(address _spender, uint256 _value) public returns (bool success)",
      ],
      account
    );
  };

  deployRedEnvelope = async (whitelist: string[]): Promise<void> => {
    try {
      const redChatFactory = new Contract(
        Config.RED_ENVELOPE_FACTORY_ADDRESS,
        REDENVELOPE_FACTORY_ABI,
        this._signer
      );

      const deployedEnvelopeTx = await redChatFactory.deployRedEnvelope(
        Config.TEST_ERC20_TOKEN,
        whitelist
      );

      // Wait for the transaction to be mined
      const receipt = await deployedEnvelopeTx.wait();

      if (receipt) {

        // Filter the logs for the RedEnvelopeDeployed event
        const redEnvelopeDeployedEvent = receipt.events?.filter(
          (x: { event: string }) => x.event === "RedEnvelopeDeployed"
        );
        console.log("redEnvelopeDeployedEvent", redEnvelopeDeployedEvent);

        if (redEnvelopeDeployedEvent && redEnvelopeDeployedEvent.length > 0) {
          // Extracting the deployed address from the event's arguments
          const deployedEnvelopeAddress =
            redEnvelopeDeployedEvent[0].args.envelopeAddress;
          console.log("RedEnvelope deployed at:", deployedEnvelopeAddress);

          return deployedEnvelopeAddress
        } else {
          console.log("RedEnvelopeDeployed event not found");
        }
      }
    } catch (error) {
      console.error("Unable to deploy new RedEnvelope", error);
      throw error;
    }
  };


  getALLDeployedContracts = async () => {
    try {
      const redChatFactory = new Contract(
        Config.RED_ENVELOPE_FACTORY_ADDRESS,
        REDENVELOPE_FACTORY_ABI,
        this._provider
      );

      const deployedContracts = await redChatFactory.getAllDeployedContracts();

      if(deployedContracts) {
        return deployedContracts;
      }
    } catch (error) {
      throw error;
    }
  };

  initializeRedEnvelope = async (
    owner: string,
    redEnvelopeAddress: string,
    tokenAmount: any
  ) => {
    try {
      const redEnvelope = new Contract(
        redEnvelopeAddress,
        REDENVELOPE_ABI,
        this._signer
      );

      // Approve the RedEnvelope contract to spend tokens
      const approveTx = await this.approve(
        redEnvelopeAddress,
        Config.TEST_ERC20_TOKEN
      );
      

      if (approveTx) {
        // Initialize the RedEnvelope
        const nonce = await this._provider.getTransactionCount(owner)

        console.log("nonce", nonce)
        const initializeTx = await redEnvelope.initialize(owner, tokenAmount, {
            nonce: nonce,
            gasLimit: 300000
        });

        if (initializeTx) {
          console.log("RedEnvelope initialized with tokens", initializeTx.hash);
          return initializeTx;
        }
      }
    } catch (error) {
      console.log("unable to initializeRedEnvelope", error);
      throw error;
    }
  };

  userClaimTokens = async (
    redEnvelopeAddress: string,
    claimerWallet: string
  ) => {
    try {
      const redEnvelope = new Contract(
        redEnvelopeAddress,
        REDENVELOPE_ABI,
        this._claimWalletSIgner
      );
      const calimTx = await redEnvelope.claimTokens(claimerWallet);

      if (calimTx) {
        console.log("successful user claim tokens", calimTx);

        return calimTx
      }
    } catch (error) {
      console.log("User unable to claim tokens", error);
      throw error;
    }
  };

  checkEnvelopeContractBalance = async(deployedRedEnvelope: string)=> {
    try {
        const redChatFactory = new Contract(
            Config.RED_ENVELOPE_FACTORY_ADDRESS,
            REDENVELOPE_FACTORY_ABI,
            this._provider
          );

          const envBalance = await redChatFactory.checkBalanceOfDeployedContract(deployedRedEnvelope)

          if(envBalance) {

            console.log("successful balance: ", envBalance)
            return ethers.utils.formatUnits(envBalance)
          }
        
    } catch (error) {
        throw error;
    }
  }

  approve = async (redEnvelopeAddress: string, tokenAddress: string) => {
    try {
      const MAX_INT =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";

      const contract = await this.approveContract(this._signer, tokenAddress);
      const transaction = await contract.approve(redEnvelopeAddress, MAX_INT);


      const receipt = await transaction.wait()

      if(receipt) {
        console.log("******APPROVE TRANSACTION********", transaction.hash);
        return { success: true, data: `${transaction.hash}` };
      }

    } catch (error) {
      console.log("Approve Transaction Failed", error);
      return { success: false, data: `${error}` };
    }
  };
}

export const HelpersWrapper = new Helpers();
