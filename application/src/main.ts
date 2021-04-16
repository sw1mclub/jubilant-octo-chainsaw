import * as config from '../configs/secret-config.json';
import * as strategyConfig from '../configs/strategy-config.json';
import Web3 from 'web3';
import TradeBuilder from './uniswap';
import * as ethers from 'ethers';
import Router from './router';
import Strategy from './strategy';
import BigNumberUtil from './bignumberutil';

const provider = config.ethNodeAddress;
const web3Provider = new Web3.providers.HttpProvider(provider);
const ethersProvider = new ethers.providers.JsonRpcProvider(config.ethNodeAddress);
const web3 = new Web3(web3Provider);
web3.eth.defaultAccount = config.walletAddress;

async function getBalances() {
  const ethBalance = await TradeBuilder.getMyEthBalance(web3);
  const usdcBalance = await TradeBuilder.getUSDCBalance(web3);
  return {
    eth: Number(ethBalance),
    usdc: usdcBalance
  };
}

const buyEth = async (usdcAmount: number) => {
  const roundedTokenAmount = BigNumberUtil.tokenAmountNumberToString(usdcAmount);
  const trade = await TradeBuilder.createUSDCToEthTrade(ethersProvider, roundedTokenAmount);
  await Router.executeTokenToEthTrade(web3, trade);
  return await getBalances();
};

const buyUSDC = async (ethAmount: number) => {
  const trade = await TradeBuilder.createEthToUSDCTrade(ethersProvider, ethAmount + "");
  await Router.executeEthToTokenTrade(web3, trade);
  return await getBalances();
};

async function main() {
  console.log("Starting");
  const initialEthBalance = await TradeBuilder.getMyEthBalance(web3);
  const initialUSDCBalance = await TradeBuilder.getUSDCBalance(web3);

  console.log("Initial balances:");
  console.log({ initialEthBalance, initialUSDCBalance });

  // Uncomment if you want to verify you can transact.

  // const canExecuteEthToUSDC = await buyUSDC(0.1);// verifyCanExecuteEthToUSDCTransaction
  // if (!canExecuteEthToUSDC) {
  //   console.log('Cannot execute eth to usdc trades. Terminating...');
  //   return;
  // };

  // const canExecuteUSDCToEth = await buyEth(200);// verifyCanExecuteUSDCToEthTransaction

  // if (!canExecuteUSDCToEth) {
  //   console.log('Cannot execute usdc to eth trades. Terminating...');
  //   return;
  // }

  Strategy.executeStrategy(ethersProvider, strategyConfig, buyEth, buyUSDC, getBalances);
}

main();
