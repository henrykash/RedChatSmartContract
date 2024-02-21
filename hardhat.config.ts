import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()

const {
    JSON_RPC_URL_OPBNB,
    PRIVATE_KEY,
  } = process.env
  

const COMPILER_SETTINGS = {
  optimizer: {
      enabled: true,
      runs: 1000000,
  },
  metadata: {
      bytecodeHash: "none",
  },
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {} ,

    testnet: {
        url: JSON_RPC_URL_OPBNB,
        accounts: [`0x${PRIVATE_KEY}`],
      },

  } ,
    
  // etherscan: {
  //     // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
  //     apiKey: {
  //         // npx hardhat verify --list-networks
  //         mainnet: env.ETHERSCAN_API_KEY,
  //         polygonMumbai: env.POLYGONSCAN_API_KEY,
  //     },
  // },
  // gasReporter: {
  //     enabled: true,//env.REPORT_GAS !== undefined,
  //     outputFile: "gas-report.txt",
  //     noColors: false,
  //     // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  
    
  solidity: {
      compilers: [
          {
              version: "0.8.20",
              settings: COMPILER_SETTINGS
          },
      ],
  },
  mocha: {
      timeout: 200000, // 200 seconds max for running tests
  },
  typechain: {
      outDir: "typechain",
      target: "ethers-v5",
  },
}

export default config;
