import Web3 from 'web3';
import TradeBuilder from './uniswap';
import * as ethers from 'ethers';

const TRADE_COOLDOWN_TIME = 1000 * 60 * 10;
const INTERVAL = 1000 * 60;
const BUY_ETH_PRICE = 2100;
const SELL_ETH_PRICE = 2200;

const ETH_TO_SPEND = 0.3;
const TOKEN_LOWER_BOUND = 400;

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
    let ethBalance = Number(myBalance);
    let usdcBalance = await TradeBuilder.getUSDCBalance(web3);
    let lastTradeUnixTime = 0;

    while (true) {
        await sleep(INTERVAL);
        console.log("CURRENT STATE:");
        console.log({ ethBalance, usdcBalance, lastTradeUnixTime });

        const now = Date.now();
        if (lastTradeUnixTime + TRADE_COOLDOWN_TIME > now) {
            continue;
        }

        const prices = await TradeBuilder.getPrices(ethersProvider);
        const currentEthPrice = Number(prices.wethToUSDC);
        const sellThreshold = SELL_ETH_PRICE;
        const buyThreshold = BUY_ETH_PRICE;
        if (ethBalance > ETH_TO_SPEND + 0.1 && currentEthPrice > sellThreshold) {
            const result = await buyUSDC(ETH_TO_SPEND);
            ethBalance = result.eth;
            usdcBalance = result.usdc;
            lastTradeUnixTime = Date.now();
            continue;
        } else if (ethBalance > ETH_TO_SPEND) {
            console.log("Eth Price needs to go up by " + (sellThreshold - currentEthPrice));
        }

        if (usdcBalance > TOKEN_LOWER_BOUND && currentEthPrice < buyThreshold) {
            const result = await buyEth(usdcBalance);
            ethBalance = result.eth;
            usdcBalance = result.usdc;
            lastTradeUnixTime = Date.now();
            continue;
        } else if (usdcBalance > TOKEN_LOWER_BOUND) {
            console.log("Eth Price needs to go down by " + (currentEthPrice - buyThreshold));
        }
    }
}

export default { executeStrategy };
