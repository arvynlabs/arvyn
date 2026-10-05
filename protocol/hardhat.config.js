import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
    },
  },
  networks: {
    robinhoodTestnet: {
      type: "http",
      chainType: "l1",
      chainId: 46630,
      url: "https://rpc.testnet.chain.robinhood.com",
    },
  },
  test: {
    mocha: {
      timeout: 40_000,
    },
  },
});
