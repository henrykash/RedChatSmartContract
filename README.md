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
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address[]", name: "_whitelist", type: "address[]" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address", name: "_userAddress", type: "address" },
    ],
    name: "claimEqualAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_userAddress", type: "address" },
    ],
    name: "claimRandomToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "claimants",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "claimedAmounts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getClaimantsAndAmounts",
    outputs: [
      { internalType: "address[]", name: "", type: "address[]" },
      { internalType: "uint256[]", name: "", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getClaimedAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "hasClaimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_owner", type: "address" },
      { internalType: "uint256", name: "_tokenAmount", type: "uint256" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokens",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalWhitelistedUsers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "usersClaimed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "whitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

```

# Helpers Folder 
- Create a helpers folder where you can define all the functions needed to interact with the contracts.  
Here is an example of how I created mine. Feel free to re-use the Logic or modify it to fit your useCase.

```shell
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

   if(claimTx){
     return calimTx.hash
   }
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


```

# How to make the contract calls to the functions above
- We are almost done, now we want to interact with our functions.
- Lets's see how we can use the HelpersWrapper above  to  `deployRedEnvelope`

```shell
const main = async()=>{
   const whitelist = [
    "0x81443057e6553D5CacEE656E3e8b71b52998db14",
    "0x86bc300654DE52620bB871E8B0922e52d4a06E43",
    "0x68601FCb114F5480D20c0338a63411aaDfe7c9ce"
  ];

  const factoryAddress = Config.RED_ENVELOPE_FACTORY_ADDRESS
  const rpcUrl = Config.JSON_RPC_URL_OPBNB
  const tokenAddress = Config.TEST_ERC20_TOKEN
  const signer = Config.PRIVATE_KEY
  const ownerAddress = "0x05A7c5db4bEce0aBBFE9C576554cf4f08C671b5b";
  const tokenAmount = 1000;

   const deployCreds = {
    factoryAddress,
    ownerAddress,
    whitelist,
    tokenAmount, 
    tokenAddress,
    signer,
    rpcUrl
  }
  
  const deployRedEnvelope = await HelpersWrapper.deployRedEnvelope(deployCreds)
  console.log(deployRedEnvelope );
}
main()
```

- Response 

```shell
 deployRedEnvelope: {
    deployedEnvelopeAddress: '0x0681F9cDeA1c44D943df308B71D2Fed1d210AfAc',
    initializeTxHash: '0x2a9a1b54ec94147eeb5843a95e67023f5acc21ed11230cf0dbfb8e501b0be33e'
  }
```

- NOTE : Inside the deployRedEnvelope function above internally we call the `initializeRedEnvelope` and  `approve` function which makes the 
(deployedEnvelopeAddress) RedEnvelope Contract deployed the spender.
 It allows RedEnvelope contract (deployedEnvelopeAddress) to spend on behalf of the owner ,some Test ERC20 tokens for users to claim . After succesful `approve` transaction 
 the  `initialiaze` RedEnvelope Conrtact function is called  which `transfersFrom` from the owner wallet to the RedEnvelope contract the `approved token amounts`.

# userClaimEqualTokens
```shell
const main = async()=>{
 const redEnvelopeAddress = "0xCa3F296B3AC1372EE3C82BB8E61a44b8fa17414F";
 const claimAddress1 = "0x81443057e6553D5CacEE656E3e8b71b52998db14";
 const testSigner1 = Config.TEST_SIGNER 
 const rpcUrl = Config.JSON_RPC_URL_OPBNB
  const claim = await HelpersWrapper.userClaimEqualTokens(
    redEnvelopeAddress,
    claimAddress1,
    testSigner1,
    rpcUrl
  )
 console.log({claim});
}

main()
```

- Response 
```shell

{
  claim: '0xbaaa5f155d452ce37862e9d2d66fc419eb30b4235f3ca02dfac1286f32c40327'
}
```


# userClaimRandomTokens
```shell
const main = async()=>{
 const redEnvelopeAddress = "0xCa3F296B3AC1372EE3C82BB8E61a44b8fa17414F";
 const claimAddress1 = "0x81443057e6553D5CacEE656E3e8b71b52998db14";
 const testSigner1 = Config.TEST_SIGNER 
 const rpcUrl = Config.JSON_RPC_URL_OPBNB
  const claim = await HelpersWrapper.userClaimRandomTokens(
    redEnvelopeAddress,
    claimAddress1,
    testSigner1,
    rpcUrl
  )
 console.log({claim});
}

main()
```

- Response 
```shell

{
  claim: '0xbaaa5f155d452ce37862e9d2d66fc419eb30b4235f3ca02dfac1286f32c40327'
}
```
# getAllUserDetails
```shell
const main = async()=>{
 const redEnvelopeAddress = "0xCa3F296B3AC1372EE3C82BB8E61a44b8fa17414F";
const rpcUrl = Config.JSON_RPC_URL_OPBNB
const getAllUserDetails = await HelpersWrapper.getAllUsersClaimDetails(
    redEnvelopeAddress,
    rpcUrl
  )
 
 console.log({getAllUserDetails});
}

main()
```

- Response 
```shell

{
  getAllUSerDetails: [
    {
      address: '0x81443057e6553D5CacEE656E3e8b71b52998db14',
      amount: '590.0'
    },
    {
      address: '0x86bc300654DE52620bB871E8B0922e52d4a06E43',
      amount: '102.5'
    },
    {
      address: '0x68601FCb114F5480D20c0338a63411aaDfe7c9ce',
      amount: '101.475'
    }
  ]
}
```

# getUserClaimedAmount
```shell
const main = async()=>{
 const redEnvelopeAddress = "0xCa3F296B3AC1372EE3C82BB8E61a44b8fa17414F";
 claimAddress1 = "0x81443057e6553D5CacEE656E3e8b71b52998db14"
 const rpcUrl = Config.JSON_RPC_URL_OPBNB

  const getClaimAmount = await HelpersWrapper.getUserClaimedAmount(
  redEnvelopeAddress, 
  claimAddress1 ,
  rpcUrl
  )
 console.log({getClaimAmount});
}

main()
```

- Response 
```shell
{ getClaimAmount: '590.0' }

```

# Finit0!!!
- Hope these examples will make it easier for intergrations. Happy Coding  🚀🚀🚀
