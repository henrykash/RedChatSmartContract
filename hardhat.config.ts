import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import { load } from "ts-dotenv";

// const env = load({
//   SEPOLIA_RPC: String,
//   ETHERSCAN_API_KEY: String,
//   MUMBAI_RPC_URL: String,
//   PRIVATE_KEY: String,
//   POLYGONSCAN_API_KEY: String,
//   REPORT_GAS: Boolean,
//   FORKING_BLOCK_NUMBER: String,
//   MAINNET: String,
//   MAINNET_RPC: String
// })

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
  // networks: {
  //   hardhat: {
  //         hardfork: "merge",
  //         // If you want to do some forking set `enabled` to true
  //         forking: {
  //             url: env.SEPOLIA_RPC,
  //             blockNumber: Number(env.FORKING_BLOCK_NUMBER),
  //             enabled: false,
  //         },
  //         chainId: 31337,
  //     },
  //     localhost: {
  //       url: "http://127.0.0.1:8545",
  //       chainId: 1337,
  //       //accounts: [
  //       //  '0xd679301478ca92136a2df59c7f6c141ece62b1e933908fe7b6ce9d5e9b060126',
  //       //  '0x96927e77297377903a55809d1c06d2b6e55dd7e3e9097a30dba5a4d746626368',
  //       //  '0xcf05757e858b70cd709667ecde607a47acee1950144c8835e9567968c64a0e6a'
  //       //]
  //     },
  //     mainnet: {
  //       url: env.MAINNET_RPC !== undefined ? env.MAINNET_RPC : "",
  //       accounts: env.MAINNET !== undefined ? [env.MAINNET] : [],
  //       //saveDeployments: true,
  //       chainId: 1,
  //     },
  //     sepolia: {
  //         url: env.SEPOLIA_RPC !== undefined ? env.SEPOLIA_RPC : "",
  //         accounts: env.PRIVATE_KEY !== undefined ? [env.PRIVATE_KEY] : [],
  //         //saveDeployments: true,
  //         chainId: 11155111,
  //     },
  //     mumbai: {
  //       url: env.MUMBAI_RPC_URL,
  //       accounts: env.PRIVATE_KEY !== undefined ? [env.PRIVATE_KEY] : [],
  //       //saveDeployments: true,
  //       chainId: 80001,
  //   },
  // },
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
  // },
    
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
