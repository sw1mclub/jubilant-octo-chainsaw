import { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } from '@uniswap/sdk';
import ethers from 'ethers';
import * as config from '../configs/secret-config.json';

async function queryUniswap(customHttpProvider: ethers.providers.JsonRpcProvider) {
    const chainID = config.chainID as ChainId;
    const weth = await Fetcher.fetchTokenData(chainID, WETH[chainID].address, customHttpProvider);
    const usdc = await Fetcher.fetchTokenData(chainID, config.usdcTokenAddress, customHttpProvider);
    const pair = await Fetcher.fetchPairData(usdc, weth, customHttpProvider);
    const route = new Route([pair], weth);
    // const trade = new Trade(route, new TokenAmount(weth, '1'), TradeType.EXACT_INPUT);
    console.log("WETH --> USDC:", route.midPrice.toSignificant(6));
    console.log("USDC --> WETH:", route.midPrice.invert().toSignificant(6));
    // console.log("Execution Price WETH --> USDC:", trade.executionPrice.toSignificant(6));
    // console.log("Mid Price after trade WETH --> USDC:", trade.nextMidPrice.toSignificant(6));
}

export default queryUniswap;