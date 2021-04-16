import * as config from '../configs/secret-config.json';
import * as strategyConfig from '../configs/test-strategy-config.json';
import TradeBuilder from './uniswap';
import * as ethers from 'ethers';
import Strategy from './strategy';

const ethersProvider = new ethers.providers.JsonRpcProvider(config.ethNodeAddress);

async function simulate() {
    let ethBalance = 5;
    let usdcBalance = 0;
    let txnCount = 0;

    const buyEth = async (usdcAmount: number) => {
        txnCount++;
        const prices = await TradeBuilder.getPrices(ethersProvider);
        const currentEthPrice = Number(prices.wethToUSDC);
        ethBalance += usdcAmount / currentEthPrice;
        usdcBalance -= usdcAmount;
        return {
            eth: ethBalance,
            usdc: usdcBalance
        };
    }

    const buyUSDC = async (ethAmount: number) => {
        txnCount++;
        const prices = await TradeBuilder.getPrices(ethersProvider);
        const currentEthPrice = Number(prices.wethToUSDC);
        ethBalance -= ethAmount;
        usdcBalance += ethAmount * currentEthPrice;
        return {
            eth: ethBalance,
            usdc: usdcBalance
        };
    }

    try {
        await Strategy.executeStrategy(
            ethersProvider,
            strategyConfig,
            buyEth,
            buyUSDC,
            async () => {
                return {
                    eth: ethBalance,
                    usdc: usdcBalance
                };
            });
    } catch (error) {

    }
    return {
        eth: ethBalance,
        usdc: usdcBalance,
        txnCount: txnCount,
    };
}

export default { simulate };
