const path = require("path");

const HDWalletProvider = require("@truffle/hdwallet-provider");

const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!y
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  complilers: {
    solc: {
      version: "pragma",
    },
  },
  networks: {
    development: {
      host: "127.0.0.1", // Localhost where Ganache is running
      port: 7545,
      network_id: "*",
    },

    ropsten: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `wss://ropsten.infura.io/ws/v3/5ca0f3d23cbf48998e2543ac1436344f`
        ),
      network_id: 3, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 2000,
      details: {
        yul: true,
        yulDetails: {
          stackAllocation: true,
          optimizerSteps: "dhfoDgvulfnTUtnIf",
        },
      },
    },
  },
  plugins: ["truffle-plugin-verify"],
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "ETH",
      gasPrice: 20, // Adjust gas price
      onlyCalledMethods: true, // Show only functions that were called
      excludeContracts: ["Migrations"], // Ignore Migrations contract
    },
  },
};
