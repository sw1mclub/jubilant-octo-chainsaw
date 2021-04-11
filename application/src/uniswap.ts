import { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } from '@uniswap/sdk';
import ethers from 'ethers';
import Web3 from 'web3';
import * as config from '../configs/secret-config.json';

async function getPrices(customHttpProvider: ethers.providers.JsonRpcProvider) {
    const chainID = ChainId.MAINNET;
    const weth = await Fetcher.fetchTokenData(chainID, WETH[chainID].address, customHttpProvider);
    const usdc = await Fetcher.fetchTokenData(chainID, config.usdcTokenAddress, customHttpProvider);
    const pair = await Fetcher.fetchPairData(weth, usdc, customHttpProvider);
    const route = new Route([pair], weth, usdc);
    
    console.log("WETH --> USDC:", route.midPrice.toSignificant(6));
    console.log("USDC --> WETH:", route.midPrice.invert().toSignificant(6));
    const wethToUSDC = route.midPrice.toSignificant(6);
    const usdcToWEth = route.midPrice.invert().toSignificant(6);
    return {wethToUSDC, usdcToWEth};
}

async function createEthToUSDCTrade(customHttpProvider: ethers.providers.JsonRpcProvider, ethToSpend: string): Promise<Trade> {
    const weiToSpend = Web3.utils.toWei(ethToSpend, 'ether');
    const chainID = ChainId.MAINNET;
    const weth = await Fetcher.fetchTokenData(chainID, WETH[chainID].address, customHttpProvider);
    const usdc = await Fetcher.fetchTokenData(chainID, config.usdcTokenAddress, customHttpProvider);
    const pair = await Fetcher.fetchPairData(weth, usdc, customHttpProvider);
    const route = new Route([pair], weth, usdc);
    
    console.log("WETH --> USDC:", route.midPrice.toSignificant(6));
    console.log("USDC --> WETH:", route.midPrice.invert().toSignificant(6));
    const trade = new Trade(route, new TokenAmount(weth, weiToSpend), TradeType.EXACT_INPUT);
    console.log("Execution Price WETH --> USDC:", trade.executionPrice.toSignificant(6));
    console.log("Mid Price after trade WETH --> USDC:", trade.nextMidPrice.toSignificant(6));
    return trade;
}

async function createUSDCToEthTrade(customHttpProvider: ethers.providers.JsonRpcProvider, usdcToSpend: number): Promise<Trade> {
    const usdcToSpendString = usdcToSpend * 1000000 + "";
    const chainID = ChainId.MAINNET;
    const weth = await Fetcher.fetchTokenData(chainID, WETH[chainID].address, customHttpProvider);
    const usdc = await Fetcher.fetchTokenData(chainID, config.usdcTokenAddress, customHttpProvider);
    const pair = await Fetcher.fetchPairData(usdc, weth, customHttpProvider);
    const route = new Route([pair], usdc, weth);
    
    console.log("USDC --> WETH:", route.midPrice.toSignificant(6));
    console.log("WETH --> USDC:", route.midPrice.invert().toSignificant(6));
    const trade = new Trade(route, new TokenAmount(usdc, usdcToSpendString), TradeType.EXACT_INPUT);
    console.log("Execution Price USDC --> WETH:", trade.executionPrice.toSignificant(6));
    console.log("Mid Price after trade USDC --> WETH:", trade.nextMidPrice.toSignificant(6));
    return trade;
}

export default {createEthToUSDCTrade, createUSDCToEthTrade, getPrices};
