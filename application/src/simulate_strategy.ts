import * as config from '../configs/secret-config.json';
import Web3 from 'web3';
import TradeBuilder from './uniswap';
import * as ethers from 'ethers';

const provider = config.testNodeAddress;// testing for now. use `config.ethNodeAddress;` for production
const web3Provider = new Web3.providers.HttpProvider(provider);
const ethersProvider = new ethers.providers.JsonRpcProvider(config.ethNodeAddress);
const web3 = new Web3(web3Provider);
web3.eth.defaultAccount = config.walletAddress;

const TRADE_COOLDOWN_TIME = 1000*60*10;
const INTERVAL = 1000*60;
const VOLATILITY_THRESHOLD = 0.05;

async function sleep(ms:number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 

async function testStrategy() {
    const myAddress = web3.eth.defaultAccount;
    if (!myAddress) {
        console.log("ERROR: couldn't find my wallet address.");
        return null;
    }
    const myBalanceWei = await web3.eth.getBalance(myAddress);
    const myBalance = web3.utils.fromWei(myBalanceWei, 'ether')
    const prices = await TradeBuilder.getPrices(ethersProvider);
    let lastEthPrice = Number(prices.wethToUSDC);
    let ethBalance = Number(myBalance);
    let usdcBalance = 0;
    let lastTradeUnixTime = 0;

    console.log("Initial eth balance: " + ethBalance);
    while (true) {
        console.log("CURRENT STATE:");
        console.log({ethBalance, usdcBalance, lastTradeUnixTime});
        await sleep(INTERVAL);
        const now = Date.now();
        if (lastTradeUnixTime + TRADE_COOLDOWN_TIME > now) {
            continue;
        }

        const prices = await TradeBuilder.getPrices(ethersProvider);
        const currentEthPrice = Number(prices.wethToUSDC);
        const sellThreshold = lastEthPrice *  (1 + VOLATILITY_THRESHOLD);
        const buyThreshold = lastEthPrice *  (1 - VOLATILITY_THRESHOLD);
        if (ethBalance > 0.1 && currentEthPrice > sellThreshold) {
            ethBalance -= ethBalance;
            usdcBalance += ethBalance * currentEthPrice;
            lastTradeUnixTime = Date.now();
            continue;
        }

        if (usdcBalance > 500 && currentEthPrice < buyThreshold) {
            ethBalance += usdcBalance / currentEthPrice;
            usdcBalance -= usdcBalance;
            lastTradeUnixTime = Date.now();
            continue;
        }
    }
}

testStrategy();
