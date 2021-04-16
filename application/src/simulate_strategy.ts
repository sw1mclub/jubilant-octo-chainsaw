import * as config from '../configs/secret-config.json';
import Web3 from 'web3';
import TradeBuilder from './uniswap';
import * as ethers from 'ethers';
import Strategy from './strategy';

const provider = config.testNodeAddress;// testing for now. use `config.ethNodeAddress;` for production
const web3Provider = new Web3.providers.HttpProvider(provider);
const ethersProvider = new ethers.providers.JsonRpcProvider(config.ethNodeAddress);
const web3 = new Web3(web3Provider);
web3.eth.defaultAccount = config.walletAddress;

async function startTest() {
    const myAddress = web3.eth.defaultAccount;
    if (!myAddress) {
        console.log("ERROR: couldn't find my wallet address.");
        return null;
    }
    const myBalanceWei = await web3.eth.getBalance(myAddress);
    const myBalance = web3.utils.fromWei(myBalanceWei, 'ether')
    let ethBalance = Number(myBalance);
    let usdcBalance = 0;

    const buyEth = async (usdcAmount: number) => {
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
        const prices = await TradeBuilder.getPrices(ethersProvider);
        const currentEthPrice = Number(prices.wethToUSDC);
        ethBalance -= ethAmount;
        usdcBalance += ethAmount * currentEthPrice;
        return {
            eth: ethBalance,
            usdc: usdcBalance
        };
    }

    Strategy.executeStrategy(web3, ethersProvider, buyEth, buyUSDC);
}

startTest();
