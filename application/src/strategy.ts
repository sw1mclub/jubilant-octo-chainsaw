import TradeBuilder from './uniswap';
import * as ethers from 'ethers';

type StrategyConfig = {
    tradeCooldownTimeSec: number,
    intervalSec: number,
    buyEthPrice: number,
    sellEthPrice: number,
    ethToSpend: number,
    tokenLowerBound: number
}

type BuyFunc = (amount: number) => Promise<{ eth: number, usdc: number }>;

type BalanceGetter = () => Promise<{
    eth: number;
    usdc: number;
}>;

async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function executeStrategy(
    ethersProvider: ethers.providers.JsonRpcProvider,
    strategyConfig: StrategyConfig,
    buyEth: BuyFunc,
    buyUSDC: BuyFunc,
    getBalance: BalanceGetter) {
    const balances = await getBalance();
    let ethBalance = balances.eth;
    let usdcBalance = balances.usdc;
    let lastTradeUnixTime = 0;

    while (true) {
        await sleep(strategyConfig.intervalSec * 1000);
        console.log("CURRENT STATE:");
        console.log({ ethBalance, usdcBalance, lastTradeUnixTime });

        const now = Date.now();
        if (lastTradeUnixTime + (strategyConfig.tradeCooldownTimeSec * 1000) > now) {
            continue;
        }

        const prices = await TradeBuilder.getPrices(ethersProvider);
        const currentEthPrice = Number(prices.wethToUSDC);
        const sellThreshold = strategyConfig.sellEthPrice;
        const buyThreshold = strategyConfig.buyEthPrice;
        if (ethBalance > strategyConfig.ethToSpend + 0.1 && currentEthPrice > sellThreshold) {
            const result = await buyUSDC(strategyConfig.ethToSpend);
            ethBalance = result.eth;
            usdcBalance = result.usdc;
            lastTradeUnixTime = Date.now();
            continue;
        } else if (ethBalance > strategyConfig.ethToSpend) {
            console.log("Eth Price needs to go up by " + (sellThreshold - currentEthPrice));
        }

        if (usdcBalance > strategyConfig.tokenLowerBound && currentEthPrice < buyThreshold) {
            const result = await buyEth(usdcBalance);
            ethBalance = result.eth;
            usdcBalance = result.usdc;
            lastTradeUnixTime = Date.now();
            continue;
        } else if (usdcBalance > strategyConfig.tokenLowerBound) {
            console.log("Eth Price needs to go down by " + (currentEthPrice - buyThreshold));
        }
    }
}

export default { executeStrategy };
