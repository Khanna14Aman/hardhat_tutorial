/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
const ALCHEMEY_API_KEY = process.env.alchemyKey; // api key which is given by Alchemy when you create app;
const ACCOUNT_PRIVATE_KEY = process.env.privateKey; // you test net accounts private from which ethers will get deducted and you contract gets deployed on testnet.
module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMEY_API_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`], // here we need to write accounts instead of account otherwise it will give error like -: sendTransaction is found null
    },
  },
};
// npx hardhat run scripts/deploy.js --network sepolia => run this code in root directory of your project to deploy your contract on testnet
// after deploy get this token from deploy.js
// Token address: 0xf18E9b95cb3f77111442E9C7e43ff074b791f915
