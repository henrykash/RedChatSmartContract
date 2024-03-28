import { BigNumber, Contract, Wallet, ethers, providers } from "ethers";
import {
  PANCAKESWAP_PAIR_ABI,
  REDENVELOPE_ABI,
  REDENVELOPE_FACTORY_ABI,
} from "../constants/constants";
import axios from "axios";
import {
  CoinData,
  GasPriceResponse,
  TransactionCostSimulationResponse,
} from "../interfaces/interfaces";
import { Config } from "../config/config";
import { url } from "inspector";
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

  deployRedEnvelopeERC20 = async (deploymentCreds: {
    isRandom: boolean;
    factoryAddress: string;
    ownerAddress: string;
    whitelist: string[];
    quantity: any;
    amount: any;
    tokenAddress: string;
    signer: any;
    rpcUrl: string;
  }): Promise<{
    deployedEnvelopeAddress: string;
    initializeTxHash: string;
  }> => {
    try {
      const {
        isRandom,
        factoryAddress,
        ownerAddress,
        whitelist,
        quantity,
        amount,
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
        ownerAddress
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


            console.log("deployedEnvelopeAddress", deployedEnvelopeAddress)

          // 2. Call the initialize function from the Deployed RedEnvelope Contract
          const tokenAmount = ethers.utils.parseUnits(amount.toString());

          const initializeTxHash = await this.initializeRedEnvelopeERC20(
            isRandom,
            ownerAddress,
            deployedEnvelopeAddress,
            tokenAmount,
            tokenAddress,
            whitelist,
            quantity,
            signer,
            rpcUrl
          );

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

  deployRedEnvelopeNative = async (deploymentCreds: {
    isRandom: boolean;
    factoryAddress: string;
    ownerAddress: string;
    whitelist: string[];
    quantity: any;
    amount: any;
    signer: any;
    rpcUrl: string;
  }): Promise<{
    deployedEnvelopeAddress: string;
    initializeTxHash: string;
  }> => {
    try {
      const {
        isRandom,
        factoryAddress,
        ownerAddress,
        whitelist,
        quantity,
        amount,
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
        ownerAddress
      );

      console.log("deployedEnvelope", deployedEnvelope);

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

          const initializeTxHash = await this.initializeRedEnvelopeNativeToken(
            isRandom,
            deployedEnvelopeAddress,
            amount,
            whitelist,
            quantity,
            signer,
            rpcUrl
          );

          return { deployedEnvelopeAddress, initializeTxHash };
        } else {
          throw new Error("RedEnvelopeDeployed event not found");
        }
      } else {
        throw new Error("Transaction receipt not found");
      }
    } catch (error: any) {
      error = this.parseError(error);
      return error;
    }
  };

  initializeRedEnvelopeERC20 = async (
    isRandom: boolean,
    ownerAddress: string,
    redEnvelopeAddress: string,
    tokenAmount: any,
    tokenAddress: string,
    whiteList: string[],
    quantity: any,
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

      let initializeTx;

      if (isRandom) {

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
            "latest"
          );

          console.log("approveTx", approveTx)

          const _token = tokenAddress;
          const _tokenAmount = tokenAmount;
          const _whitelist = whiteList;
          const _quantity = quantity;

          initializeTx = await redEnvelope.initializeRandomERC20(
            _token,
            _tokenAmount,
            _whitelist,
            _quantity,
            {
              nonce: nonce + 1,
              gasLimit: 200000
            }
          );

          // console.log("initializeTx", initializeTx)

          if (initializeTx && initializeTx.hash) {
            initializeTx.hash;
          }
        }
      } else {
        const approveTx = await this.approve(
          redEnvelopeAddress,
          tokenAddress,
          tokenAmount,
          signer,
          rpcUrl
        );

        console.log("approveTx", approveTx)

        if (approveTx.success == true) {
          const provider = new providers.JsonRpcProvider(rpcUrl);

          const nonce = await provider.getTransactionCount(
            ownerAddress,
            "latest"
          );

          const _token = tokenAddress;
          const _tokenAmount = tokenAmount;
          const _whitelist = whiteList;
          const _quantity = quantity;

          initializeTx = await redEnvelope.initializeEqualERC20(
            _token,
            _tokenAmount,
            _whitelist,
            _quantity,
            {
              nonce: nonce + 1,
              // gasLimit: 5000000
            }
          );

          if (initializeTx && initializeTx.hash) {
            initializeTx.hash;
          }
        }
      }
      return initializeTx.hash;
    } catch (error: any) {
      // error = this.parseError(error);
      // return error;

      throw error;
    }
  };

  initializeRedEnvelopeNativeToken = async (
    isRandom: boolean,
    redEnvelopeAddress: string,
    tokenAmount: any,
    whiteList: string[],
    quanity: any,
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

      let initializeTx;

      if (isRandom) {
        const amount = ethers.utils.parseEther(tokenAmount.toString());
        const _whitelist = whiteList;
        const _quantity = quanity;

        initializeTx = await redEnvelope.initializeEtherRandomNativeTokens(
          _whitelist,
          _quantity,

          {
            value: amount,
          }
        );

        if (initializeTx && initializeTx.hash) {
          initializeTx.hash;
        }
      } else {
        const amount = ethers.utils.parseEther(tokenAmount.toString());
        const _whitelist = whiteList;
        const _quantity = quanity;
        initializeTx = await redEnvelope.initializeEtherEqualNativeTokens(
          _whitelist,
          _quantity,

          {
            value: amount,
          }
        );

        if (initializeTx && initializeTx.hash) {
          initializeTx.hash;
        }
      }

      return initializeTx.hash;
    } catch (error: any) {
      error = this.parseError(error);
      return error;
    }
  };

  userClaimEqualERC20Tokens = async (
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

      const _userAddress = claimerAddress;
      const claimTx = await redEnvelope.claimEqualAmountERC20(_userAddress);

      if (claimTx) {
        return claimTx.hash;
      }
    } catch (error) {
      // error = this.parseError(error);
      // return error;
      throw error;
    }
  };

  userClaimEqualNativeTokens = async (
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

      const claimTx = await redEnvelope.claimEqualAmountEther(claimerAddress);

      if (claimTx) {
        return claimTx.hash;
      }
    } catch (error) {
      error = this.parseError(error);
      return error;
    }
  };

  userClaimRandomERC20Tokens = async (
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

      const _userAddress = claimerAddress;

      const claimTx = await redEnvelope.claimRandomAmountERC20(_userAddress);
      if (claimTx) {
        return claimTx.hash;
      }
    } catch (error) {
      // error = this.parseError(error);
      // return error;
      throw error;
    }
  };

  userClaimRandomNativeTokens = async (
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
      const _userAddress = claimerAddress;
      const calimTx = await redEnvelope.claimRandomEther(_userAddress);
      if (calimTx) {
        return calimTx.hash;
      }
    } catch (error) {
      error = this.parseError(error);
      return error;
    }
  };

  getUserClaimedERC20Token = async (
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

      const { tokenAmount, timestamp } =
        await redEnvelope.getERC20ClaimedAmount(claimAddress);
      const timestampBigNumber = ethers.BigNumber.from(timestamp); // This is just an example

      // Convert BigNumber to a number. Note: timestamps in Ethereum are in seconds.
      const timestampNumber = timestampBigNumber.toNumber();

      // Convert the timestamp to milliseconds (JavaScript Date requires milliseconds)
      const dateInMilliseconds = timestampNumber * 1000;

      // Create a new Date object
      const dateObject = new Date(dateInMilliseconds);

      // Format the date as a string for readability
      // You can adjust the formatting as needed
      const dateString = dateObject.toLocaleString();
      const formattedAmount = ethers.utils.formatUnits(tokenAmount);

      return { formattedAmount, dateString };
    } catch (error) {
      error = this.parseError(error);
      return error;
    }
  };

  getUserClaimedNativeToken = async (
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

      const { etherAmount, timestamp } =
        await redEnvelope.getEtherClaimedAmount(claimAddress);

      const timestampBigNumber = ethers.BigNumber.from(timestamp); // This is just an example

      // Convert BigNumber to a number. Note: timestamps in Ethereum are in seconds.
      const timestampNumber = timestampBigNumber.toNumber();

      // Convert the timestamp to milliseconds (JavaScript Date requires milliseconds)
      const dateInMilliseconds = timestampNumber * 1000;

      // Create a new Date object
      const dateObject = new Date(dateInMilliseconds);

      // Format the date as a string for readability
      // You can adjust the formatting as needed
      const dateString = dateObject.toLocaleString();
      const formattedAmount = ethers.utils.formatEther(etherAmount);

      return { formattedAmount, dateString };
    } catch (error) {
      return this.parseError(error);
    }
  };

  getUsersClaimedERC20TokenList = async (
    redEnvelopeAddress: string,
    rpcUrl: string
  ) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      const redEnvelope = new ethers.Contract(
        redEnvelopeAddress,
        REDENVELOPE_ABI,
        provider
      );

      // Fetching claimants, their claimed amounts, and timestamps
      const [claimants, tokenAmounts, timestamps] =
        await redEnvelope.getERC20ClaimantsAndAmounts();

      // Process and pair each claimant address with the corresponding amount claimed and timestamp
      const allDetails = claimants.map(
        (address: any, index: string | number) => {
          // Convert BigNumber timestamp to a number (timestamps in Ethereum are in seconds)
          const timestampNumber = timestamps[index].toNumber();

          // Convert the timestamp to milliseconds (JavaScript Date requires milliseconds)
          const dateInMilliseconds = timestampNumber * 1000;

          // Create a new Date object
          const dateObject = new Date(dateInMilliseconds);

          // Format the date as a string for readability
          // You can adjust the formatting as needed
          const dateString = dateObject.toLocaleString();

          return {
            address: address,
            amount: ethers.utils.formatUnits(tokenAmounts[index], 18),
            timestamp: dateString,
          };
        }
      );

      return allDetails;
    } catch (error) {
      error = this.parseError(error);
      return error;
    }
  };

  getUsersClaimedNativeTokensList = async (
    redEnvelopeAddress: string,
    rpcUrl: string
  ) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      const redEnvelope = new ethers.Contract(
        redEnvelopeAddress,
        REDENVELOPE_ABI,
        provider
      );

      // Fetching claimants, their claimed amounts, and timestamps
      const [claimants, etherAmounts, timestamps] =
        await redEnvelope.getEtherClaimantsAndAmounts();

      // Process and pair each claimant address with the corresponding amount claimed and timestamp
      const allDetails = claimants.map(
        (address: any, index: string | number) => {
          // Convert BigNumber timestamp to a number (timestamps in Ethereum are in seconds)
          const timestampNumber = timestamps[index].toNumber();

          // Convert the timestamp to milliseconds (JavaScript Date requires milliseconds)
          const dateInMilliseconds = timestampNumber * 1000;

          // Create a new Date object
          const dateObject = new Date(dateInMilliseconds);

          // Format the date as a string for readability
          // You can adjust the formatting as needed
          const dateString = dateObject.toLocaleString();

          return {
            address: address,
            amount: ethers.utils.formatEther(etherAmounts[index]),
            timestamp: dateString, // Including formatted date string
          };
        }
      );

      return allDetails;
    } catch (error) {
      error = this.parseError(error);
      return error;
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

      return { success: true, data: `${transaction.hash}` };
    } catch (error) {
      return { success: false, data: `${error}` };
    }
  };

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

  getTokenReserves = async (
    tokenA: string,
    wbnbAddress: string,
    factoryAddress: string,
    rpcUrl: string
  ): Promise<{ wbnbReserve: BigNumber; tokenA: BigNumber }> => {
    try {
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const factoryABI = [
        "function getPair(address tokenA, address tokenB) external view returns (address pair)",
      ];

      const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
      const pairAddress = await factory.getPair(wbnbAddress, tokenA);

      console.log("pairAddress", pairAddress);

      const pairContract = new Contract(
        pairAddress,
        PANCAKESWAP_PAIR_ABI,
        provider
      );

      const [reserve0, reserve1] = await pairContract.getReserves();
      const token0Address = await pairContract.token0();

      const isWbnbToken0 =
        token0Address.toLowerCase() === wbnbAddress.toLowerCase();

      if (isWbnbToken0) {
        return { wbnbReserve: reserve0, tokenA: reserve1 };
      } else {
        return { wbnbReserve: reserve1, tokenA: reserve0 };
      }
    } catch (error) {
      throw error;
    }
  };

  getWBNBPriceInUSD = async (wbnb: string) => {
    try {
      const _url = `https://api.coingecko.com/api/v3/simple/price?ids=${wbnb}&vs_currencies=usd`;
      const response = await axios.get(_url);
      if (response) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  calculatePriceOfTokenAInUSD = async (
    tokenA: string,
    wbnbAddress: string,
    factoryAddress: string,
    wbnbSymbol: string,
    rpcUrl: string
  ) => {
    try {
      // Fetch the price of WBNB in USD
      const wbnbUSD = await this.getWBNBPriceInUSD(wbnbSymbol);

      // Fetch the pool reserves
      const poolReserves = await this.getTokenReserves(
        tokenA,
        wbnbAddress,
        factoryAddress,
        rpcUrl
      );

      console.log("poolReserves", poolReserves);

      if (poolReserves) {
        // Calculate the price of tokenA in terms of WBNB
        const priceOfTokenAInWBNB =
          Number(poolReserves.wbnbReserve) / Number(poolReserves.tokenA);

        console.log("priceOfTokenAInWBNB", priceOfTokenAInWBNB);

        // Calculate the price of tokenA in USD
        const tokenPriceUSD = priceOfTokenAInWBNB * wbnbUSD.wbnb.usd;

        if (tokenPriceUSD) {
          return tokenPriceUSD;
        }
      }
    } catch (error) {
      throw error;
    }
  };

  calculatePriceOfUICToken = async (
    uicToken: string,
    usdcAddress: string,
    factoryAddress: string,
    rpcUrl: string
  ) => {
    try {

      // Fetch the pool reserves
      const poolReserves = await this.getTokenReserves(
        uicToken,
        usdcAddress,
        factoryAddress,
        rpcUrl
      );

      if (poolReserves) {

       // Calculate the price of  UIC token in terms of USDT
        const pricePerToken =
          Number(poolReserves.wbnbReserve) / Number(poolReserves.tokenA);

        if (pricePerToken) {
          return pricePerToken;
        }
      }
    } catch (error) {
      throw error;
    }
  };

  public async getGasPrice(rpcUrl: string): Promise<GasPriceResponse> {
    try {
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const feeData = await provider.getFeeData();

      let response: GasPriceResponse;

      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        // EIP-1559 network, return maxFeePerGas and maxPriorityFeePerGas
        response = {
          maxFeePerGas: ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei"),
          maxPriorityFeePerGas: ethers.utils.formatUnits(
            feeData.maxPriorityFeePerGas,
            "gwei"
          ),
        };
      } else if (feeData.gasPrice) {
        // Legacy network, return gasPrice
        response = {
          gasPrice: ethers.utils.formatUnits(feeData.gasPrice, "gwei"),
        };
      } else {
        // If neither is available, throw an error
        throw new Error("Unable to retrieve gas price data.");
      }

      return response;
    } catch (error) {
      throw new Error(
        `Failed to get gas price: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async simulateTransactionCost(
    fromAddress: string,
    toAddress: string,
    amount: string,
    data: string,
    rpcUrl: string,
    lowFeePercentage: number = 90,
    highFeePercentage: number = 120
  ): Promise<TransactionCostSimulationResponse> {
    // Check for valid fromAddress and toAddress
    if (!ethers.utils.isAddress(fromAddress)) {
      throw new Error("Invalid fromAddress provided.");
    }
    if (!ethers.utils.isAddress(toAddress)) {
      throw new Error("Invalid toAddress provided.");
    }

    // Check for valid amount
    if (!amount) {
      throw new Error("Amount must be provided.");
    }

    // Check for non-null data, assuming data is optional but must be a string if provided
    if (data != null && typeof data !== "string") {
      throw new Error("Data must be a string.");
    }

    try {
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const feeData = await provider.getFeeData();

      // Convert amount to BigNumber for calculation
      const amountInWei = ethers.utils.parseEther(amount);

      // Estimate gas limit for the transaction
      const gasLimit: BigNumber = await provider.estimateGas({
        from: fromAddress,
        to: toAddress,
        value: amountInWei,
        data,
      });

      let totalCost: BigNumber;

      // Use BigNumber for gasPrice and maxFeePerGas calculations
      const gasPrice: BigNumber | null = feeData.gasPrice || null;
      const maxFeePerGas: BigNumber | null = feeData.maxFeePerGas || null;

      if (maxFeePerGas) {
        // Calculate total cost for EIP-1559 transactions
        totalCost = maxFeePerGas.mul(gasLimit);
      } else if (gasPrice) {
        // Calculate total cost for legacy transactions
        totalCost = gasPrice.mul(gasLimit);
      } else {
        throw new Error("Unable to retrieve gas price data.");
      }

      // Convert total cost to a string in Ether for readability
      const totalCostInEther = ethers.utils.formatEther(totalCost);

      // Calculate fee estimates for different speeds
      const lowFeeFactor = ethers.utils.parseEther(`${lowFeePercentage / 100}`);
      const highFeeFactor = ethers.utils.parseEther(
        `${highFeePercentage / 100}`
      );

      const lowFee = gasPrice?.mul(gasLimit).mul(lowFeeFactor);
      const averageFee = gasPrice?.mul(gasLimit);
      const highFee = gasPrice?.mul(gasLimit).mul(highFeeFactor);

      // Format fees with a fixed number of decimal places
      const formattedLowFee = ethers.utils.formatEther(
        lowFee || BigNumber.from(0)
      );
      const formattedAverageFee = ethers.utils.formatEther(
        averageFee || BigNumber.from(0)
      );
      const formattedHighFee = ethers.utils.formatEther(
        highFee || BigNumber.from(0)
      );

      // Format gasPrice in GWei
      const formattedGasPrice = gasPrice
        ? ethers.utils.formatUnits(gasPrice, "gwei")
        : "EIP-1559 transaction";

      return {
        gasLimit: gasLimit.toString(),
        gasPrice: formattedGasPrice,
        totalCost: totalCostInEther,
        lowFee: formattedLowFee,
        averageFee: formattedAverageFee,
        highFee: formattedHighFee,
      };
    } catch (error) {
      throw new Error(
        `Failed to simulate transaction cost: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  getUICTokenBalance = async (walletAddress: string, rpcUrl: string) => {
    try {
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const contract = new Contract(
        Config.OPBNB_UICTOKEN_ADDRESS_MAINNET,
        ["function balanceOf(address account) public view returns(uint256)"],
        provider
      );
      const balance = await contract.balanceOf(walletAddress);
      const formatedBalance = ethers.utils.formatUnits(balance);
      console.log("Token Balance", formatedBalance);
  
      // Check if the balance is zero
      if (balance.isZero()) {
        console.log("Wallet has 0 tokens.");
        return "0.00";
      }
  
      const priceperToken = await this.calculatePriceOfUICToken(
        Config.OPBNB_UICTOKEN_ADDRESS_MAINNET,
        Config.OPBBNB_USDT_ADDRESS_MAINNET,
        Config.OPBNB_UNISWAPV2_FACTORY_ADDRESS_MAINNET,
        rpcUrl
      );
  
      if (priceperToken) {
        console.log("priceperToken", priceperToken);
        const tokenBalanceInUSDT = Number(formatedBalance) * Number(priceperToken);
        console.log("tokenBalanceInUSDT", tokenBalanceInUSDT);
        return tokenBalanceInUSDT.toFixed(2);
      }
    } catch (error) {
      throw error;
    }
  };

  fetchCoinDataForSpecificCoins = async (
    coinIds: string[]
  ): Promise<CoinData[]> => {
    try {
      const response = await axios.get<CoinData[]>(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
            sparkline: false,
            locale: "en",
            ids: coinIds.join(","),
          },
        }
      );

      return response.data.map((coin) => ({
        id: coin.id,
        current_price: coin.current_price,
        price_change_percentage_24h: parseFloat(
          coin.price_change_percentage_24h
        ).toFixed(2),
      }));
    } catch (error) {
      console.error("Error fetching coin data:", error);
      return [];
    }
  };
}

export const HelpersWrapper = new Helpers();

///gas feee logic

// const Web3 = require('web3');
// const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');

// // Fetch current gas price
// const gasPrice = await web3.eth.getGasPrice();

// // Estimate gas usage for a hypothetical transaction
// const gasEstimate = await web3.eth.estimateGas({
//   to: '0x...', // Recipient address
//   value: web3.utils.toWei('1', 'ether'), // Amount to send
// });

// // Calculate fee estimates for different speeds
// const lowFee = gasPrice * gasEstimate * 0.9; // 90% of base gas price
// const averageFee = gasPrice * gasEstimate;
// const highFee = gasPrice * gasEstimate * 1.2; // 120% of base gas price

// console.log('Low Fee:', web3.utils.fromWei(lowFee, 'ether'), 'ETH');
// console.log('Average Fee:', web3.utils.fromWei(averageFee, 'ether'), 'ETH');
// console.log('High Fee:', web3.utils.fromWei(highFee, 'ether'), 'ETH');

// public async simulateTransactionCost(
//   fromAddress: string,
//   toAddress: string,
//   amount: string,
//   data: string,
//   rpcUrl: string
// ): Promise<TransactionCostSimulationResponse> {
//   // Check for valid fromAddress and toAddress
//   if (!ethers.utils.isAddress(fromAddress)) {
//     throw new Error("Invalid fromAddress provided.");
//   }
//   if (!ethers.utils.isAddress(toAddress)) {
//     throw new Error("Invalid toAddress provided.");
//   }

//   // Check for valid amount
//   if (!amount) {
//     throw new Error("Amount must be provided.");
//   }

//   // Check for non-null data, assuming data is optional but must be a string if provided
//   if (data != null && typeof data !== "string") {
//     throw new Error("Data must be a string.");
//   }

//   try {
//     const provider = new providers.JsonRpcProvider(rpcUrl);
//     const feeData = await provider.getFeeData();

//     // Convert amount to BigNumber for calculation
//     const amountInWei = ethers.utils.parseUnits(amount, "ether");

//     // Estimate gas limit for the transaction
//     const gasLimit: BigNumber = await provider.estimateGas({
//       from: fromAddress,
//       to: toAddress,
//       value: amountInWei,
//       data,
//     });

//     let totalCost: BigNumber;

//     // Use BigNumber for gasPrice and maxFeePerGas calculations
//     const gasPrice: BigNumber | null = feeData.gasPrice || null;
//     const maxFeePerGas: BigNumber | null = feeData.maxFeePerGas || null;

//     if (maxFeePerGas) {
//       // Calculate total cost for EIP-1559 transactions
//       totalCost = maxFeePerGas.mul(gasLimit);
//     } else if (gasPrice) {
//       // Calculate total cost for legacy transactions
//       totalCost = gasPrice.mul(gasLimit);
//     } else {
//       throw new Error("Unable to retrieve gas price data.");
//     }

//     // Convert total cost to a string in Ether for readability
//     const totalCostInEther = ethers.utils.formatUnits(totalCost, "ether");

//     // Calculate fee estimates for different speeds
//     const lowFee = gasPrice?.mul(gasLimit).mul("900000000000000000").div(10e18); // 90% of base gas price
//     const averageFee = gasPrice?.mul(gasLimit);
//     const highFee = gasPrice?.mul(gasLimit).mul("1200000000000000000").div(10e18); // 120% of base gas price

//     return {
//       gasLimit: gasLimit.toString(),
//       gasPrice: gasPrice ? gasPrice.toString() : "EIP-1559 transaction",
//       totalCost: totalCostInEther,
//       lowFee: lowFee ? ethers.utils.formatUnits(lowFee, "ether") : "0",
//       averageFee: averageFee ? ethers.utils.formatUnits(averageFee, "ether") : "0",
//       highFee: highFee ? ethers.utils.formatUnits(highFee, "ether") : "0",
//     };
//   } catch (error) {
//     throw new Error(
//       `Failed to simulate transaction cost: ${
//         error instanceof Error ? error.message : String(error)
//       }`
//     );
//   }
// }
