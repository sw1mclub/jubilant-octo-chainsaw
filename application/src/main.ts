import * as config from '../configs/secret-config.json';
import Web3 from 'web3';
import TradeBuilder from './uniswap';
import * as ethers from 'ethers';
import Router from './router';

const provider = config.testNodeAddress;// testing for now. use `config.ethNodeAddress;` for production
const web3Provider = new Web3.providers.HttpProvider(provider);
const ethersProvider = new ethers.providers.JsonRpcProvider(config.ethNodeAddress);
const web3 = new Web3(web3Provider);
web3.eth.defaultAccount = config.walletAddress;

TradeBuilder.createUSDCToEthTrade(ethersProvider, 1000).then(async (trade) => {
  await Router.executeTokenToEthTrade(web3, trade);
});

// TradeBuilder.createEthToUSDCTrade(ethersProvider, '10000000000000000').then(async (trade) => {
//   await Router.executeEthToTokenTrade(web3, trade);
// });
