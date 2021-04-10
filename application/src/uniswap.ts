import { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } from '@uniswap/sdk';
import ethers from 'ethers';
import * as config from '../configs/secret-config.json';

async function queryUniswap(customHttpProvider: ethers.providers.JsonRpcProvider): Promise<Trade> {
    const chainID = ChainId.MAINNET;
    const weth = await Fetcher.fetchTokenData(chainID, WETH[chainID].address, customHttpProvider);
    const usdc = await Fetcher.fetchTokenData(chainID, config.usdcTokenAddress, customHttpProvider);
    const pair = await Fetcher.fetchPairData(weth, usdc, customHttpProvider);
    const route = new Route([pair], weth, usdc);
    
    console.log("WETH --> USDC:", route.midPrice.toSignificant(6));
    console.log("USDC --> WETH:", route.midPrice.invert().toSignificant(6));
    const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
    console.log("Execution Price WETH --> USDC:", trade.executionPrice.toSignificant(6));
    console.log("Mid Price after trade WETH --> USDC:", trade.nextMidPrice.toSignificant(6));
    return trade;
}

export default queryUniswap;