require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
//const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
//const PRIVATE_KEY = process.env.PRIVATE_KEY;
//console.log(PRIVATE_KEY);
//console.log(GOERLI_RPC_URL);
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    /*goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    }, */
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
  },
  solidity: "0.8.17",
};
