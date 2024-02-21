# RedEnvelope Contracts

- RedEnvelope Contracts and RedEnvelopeFactory Contracts provide a decentralized solution for creating and managing digital red envelopes on EVM chains. Through the contracts,  a user can send a gift inform of a redpacket i.e RedEnvelope to a list of users adddresses, who later claim those assets. This documentation covers how to interact with the RedEnvelopeFactory and RedEnvelope contracts using the ethers.js library.

# Features 
- RedEnvelope and RedEnvelopeFactory smart contracts
- Ability to whitelist users addresses when deploying the RedEnvelope contracts using the RedEnvelopeFactory contract
- Ability  for users to claim tokens
- Ability  to randomize the amounts of tokens users can claim.
- Ability to get all deployed RedEnvelope contracts deployed by the RedEnvelopeFactory contract
- Ability to get balances of assets (erc20 tokens) on the RedEnvelope contracts deployed by RedEnvelopeFactory contract

# Installations
- `npm install --force` 
- `cd testing-contract ` & `npm install`

# Smart Contracts  
- To compile the smart contracts cd to RedChartContract folder : `cd RedChartContract`
- Before compiling the contracts make sure you have the following in your .env file
  
 ```shell
JSON_RPC_URL_OPBNB=""
PRIVATE_KEY= ""
 ```

- Now , Run the command:  `npx hardhat compile` to compile the contracts
- To deploy the the RedEnvelopeFactory contract to tesnet, run the command:
```shell
 npx hardhat run --network tesnet scripts/deployRedEnvelopeFactory.ts
```
# Usage 
- Here are some examples on how you can make calls to the contract using ethersjs in Typescript. 
Note: the same logic will apply while using ethersjs for react-native applications with tsx

# Config Folder 

- Create a Config folder where you will have all your configurations i.e

```shell
export const Config = {

    PRIVATE_KEY: process.env.PRIVATE_KEY!,
    JSON_RPC_URL_OPBNB: process.env.JSON_RPC_URL_OPBNB!, // the rpc url of your desired testnet , make sure is the same as the deployed RedEnvelopeFactory contract
    RED_ENVELOPE_FACTORY_ADDRESS: "0x8d0f767c42832DB73BBCa59494326b7fdAB1f749", // the one you deployed above i.e RedEnvelopeFactory contract 
    TEST_ERC20_TOKEN: "0x7bbfa59108b2bad29dE4f357E3C9816D533Ac183", // create a test token here: https://wizard.openzeppelin.com/
    TEST_SIGNER: process.env.TEST_SIGNER! //the privateKey of the user who claims the tokens
   
}
  
```

# Constants Folder
- This is where you can setup your ABI files , used when interacting with the RedEnvelopeFactory and  RedEnvelope smart contract functions. 
However feel free to use mine it would still work.

```shell
export const REDENVELOPE_FACTORY_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "envelopeAddress",
        type: "address",
      },
    ],
    name: "RedEnvelopeDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_envelopeAddress",
        type: "address",
      },
    ],
    name: "checkBalanceOfDeployedContract",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_whitelist",
        type: "address[]",
      },
    ],
    name: "deployRedEnvelope",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "deployedRedEnvelopes",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllDeployedContracts",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const REDENVELOPE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_whitelist",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userAddress",
        type: "address",
      },
    ],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasClaimed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenAmount",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "whitelisted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

```

# Helpers Folder 
- Create a helpers folder where you can define all the functions needed to interact with the contracts.  
Here is an example of how I created mine. Feel free to re-use the Logic or modify it to fit your useCase.

```shell
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
        Config.TEST_ERC20_TOKEN,
        tokenAmount
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

  approve = async (redEnvelopeAddress: string, tokenAddress: string, amount: any) => {
    try {
      const MAX_INT = amount ;

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

```

# How to make the contract calls to the functions above
- We are almost done, now we want to interact with our functions.
- Lets's see how we can use the HelpersWrapper abocve  to  `deployRedEnvelope`

```shell
const main = async()=>{
    const whitelist = [
    "0x81443057e6553D5CacEE656E3e8b71b52998db14",
    "0x86bc300654DE52620bB871E8B0922e52d4a06E43",
  ];
  const deployRedEnv = await HelpersWrapper.deployRedEnvelope(whitelist)
  console.log({ deployRedEnv });
}
main()
```

- Response 

```shell
 { deployENv: '0xA4BdCA56ebac0A78C554F651a5D026b4736D93c9' }
```

- Now lets call the `initializeRedEnvelope` in our HelpersWrapper above . This function internally calls `approve` function which makes the RedEnvelope Contract deployed 
 above the spender. It allows RedEnvelope contract to spend on behalf of the owner ,some Test ERC20 tokens for users to claim . After succesful `approve` transaction ,
 the  `initialiaze` RedEnvelope Conrtact function is called  which `transfersFrom` from the owner wallet to the RedEnvelope contract the `approved token amounts`.

```shell
const main = async()=>{
  const deployedRedEnvelope = "0xA4BdCA56ebac0A78C554F651a5D026b4736D93c9";
  const owner = "0x05A7c5db4bEce0aBBFE9C576554cf4f08C671b5b";
  const tokenAount = ethers.utils.parseUnits("0.009"); // of the test erc20 tokens owner minted for the test
  const initialize = await HelpersWrapper.initializeRedEnvelope(owner, deployedRedEnvelope, tokenAount
  console.log({initialize})
}
main()
```

- Response 
```shell
{
  initialize: {
    type: 2,
    chainId: 97,
    nonce: 20,
    maxPriorityFeePerGas: BigNumber { _hex: '0x59682f00', _isBigNumber: true },
    maxFeePerGas: BigNumber { _hex: '0x59682f00', _isBigNumber: true },
    gasPrice: null,
    gasLimit: BigNumber { _hex: '0x0493e0', _isBigNumber: true },
    to: '0x6F297fEa8F7b37960Ffa18095E252A34bc6fa8FA',
    value: BigNumber { _hex: '0x00', _isBigNumber: true },
    data: '0xcd6dc68700000000000000000000000005a7c5db4bece0abbfe9c576554cf4f08c671b5b000000000000000000000000000000000000000000000000001ff973cafa8000',
    accessList: [],
    hash: '0xc956ade4f6c9f4431fa43b7875048aa826987126655ff856250a93dcdf875670',
    v: 0,
    r: '0x635043a62406e61f19dde11a19ba1f3cdde63c54d8c2964e45b4b2c21036e5c9',
    s: '0x0215bceaed3c646e569ce7867aac7d98ff18a961b85d5eb9b6ae339d0dc0bc26',
    from: '0x05A7c5db4bEce0aBBFE9C576554cf4f08C671b5b',
    confirmations: 0,
    wait: [Function (anonymous)]
  }
}

here is the transactionHash : https://testnet.bscscan.com/tx/0xc956ade4f6c9f4431fa43b7875048aa826987126655ff856250a93dcdf875670
```

# Finit0!!!
- Hope these examples will make it easier for intergrations. Happy Coding  🚀🚀🚀
