import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    testnet: {
      url: 'https://testnet.evm.nodes.onflow.org',
      accounts: [`822a7f1bfe522c19ca0aa90a86fceda154acd5947123e84cff793f5ccfdf8e29`], // In practice, this should come from an environment variable and not be commited
      gas: 500000, // Example gas limit
    },
    mainnet: {
      url: 'https://mainnet.evm.nodes.onflow.org',
      accounts: [`822a7f1bfe522c19ca0aa90a86fceda154acd5947123e84cff793f5ccfdf8e29`], // In practice, this should come from an environment variable and not be commited
      gas: 500000,
    },
    mantle: {
      url: "https://rpc.mantle.xyz", //mainnet
      accounts: ["822a7f1bfe522c19ca0aa90a86fceda154acd5947123e84cff793f5ccfdf8e29"],
    },
    mantleSepolia: {
        url: "https://rpc.sepolia.mantle.xyz", // Sepolia Testnet
        accounts: ["822a7f1bfe522c19ca0aa90a86fceda154acd5947123e84cff793f5ccfdf8e29"],
    },
  },
  etherscan: {
    apiKey: {
      'testnet': 'empty'
    },
    customChains: [
      {
        network: "testnet",
        chainId: 545,
        urls: {
          apiURL: "https://evm-testnet.flowscan.io/api",
          browserURL: "https://evm-testnet.flowscan.io"
        }
      }
    ]
  }
};

export default config;
