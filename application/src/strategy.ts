import Web3 from 'web3';
import TradeBuilder from './uniswap';
import * as ethers from 'ethers';

const TRADE_COOLDOWN_TIME = 1000 * 60 * 2;
const INTERVAL = 1000 * 10;
const VOLATILITY_THRESHOLD = 0.0005;

const ETH_TO_SPEND = 2;

type BuyFunc = (amount: number) => Promise<{ eth: number, usdc: number }>;

async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function executeStrategy(web3: Web3, ethersProvider: ethers.providers.JsonRpcProvider, buyEth: BuyFunc, buyUSDC: BuyFunc) {
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
        console.log({ ethBalance, usdcBalance, lastTradeUnixTime });
        await sleep(INTERVAL);
        const now = Date.now();
        if (lastTradeUnixTime + TRADE_COOLDOWN_TIME > now) {
            continue;
        }

        const prices = await TradeBuilder.getPrices(ethersProvider);
        const currentEthPrice = Number(prices.wethToUSDC);
        const sellThreshold = lastEthPrice * (1 + VOLATILITY_THRESHOLD);
        const buyThreshold = lastEthPrice * (1 - VOLATILITY_THRESHOLD);
        if (ethBalance > ETH_TO_SPEND + 0.1 && currentEthPrice > sellThreshold) {
            const result = await buyUSDC(ETH_TO_SPEND);
            ethBalance = result.eth;
            usdcBalance = result.usdc;
            lastTradeUnixTime = Date.now();
            lastEthPrice = Number(prices.wethToUSDC);
            continue;
        }

        if (usdcBalance > 500 && currentEthPrice < buyThreshold) {
            const result = await buyEth(usdcBalance);
            ethBalance = result.eth;
            usdcBalance = result.usdc;
            lastTradeUnixTime = Date.now();
            lastEthPrice = Number(prices.wethToUSDC);
            continue;
        }
    }
}

export default { executeStrategy };