import * as config from '../configs/secret-config.json';
import Web3 from 'web3';
import TradeBuilder from './uniswap';
import * as ethers from 'ethers';
import Router from './router';

const VERIFICATION_INTERVAL = 1000*60*10;

const provider = config.testNodeAddress;// testing for now. use `config.ethNodeAddress;` for production
const web3Provider = new Web3.providers.HttpProvider(provider);
const ethersProvider = new ethers.providers.JsonRpcProvider(config.ethNodeAddress);
const web3 = new Web3(web3Provider);
web3.eth.defaultAccount = config.walletAddress;

async function sleep(ms:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

async function verifyCanExecuteEthToUSDCTransaction(): Promise<boolean> {
  try{
    const trade = await TradeBuilder.createUSDCToEthTrade(ethersProvider, 10);
    await Router.executeTokenToEthTrade(web3, trade);
    await sleep(VERIFICATION_INTERVAL);
    return true;
  } catch(error) {
    return false;
  };
}

async function verifyCanExecuteUSDCToEthTransaction(): Promise<boolean> {
  try{
    const trade = await TradeBuilder.createEthToUSDCTrade(ethersProvider, '0.01');
    await Router.executeEthToTokenTrade(web3, trade);
    await sleep(VERIFICATION_INTERVAL);
    return true;
  } catch(error) {
    return false;
  };
}

async function main() {
  const canExecuteEthToUSDC = await verifyCanExecuteEthToUSDCTransaction();
  if (!canExecuteEthToUSDC) {
    console.log('Cannot execute eth to usdc trades. Terminating...');
    return;
  };

  const canExecuteUSDCToEth = await verifyCanExecuteUSDCToEthTransaction();

  if (!canExecuteUSDCToEth) {
    console.log('Cannot execute usdc to eth trades. Terminating...');
    return;
  }
}

main();
