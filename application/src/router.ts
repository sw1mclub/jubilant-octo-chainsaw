import IUniswapV2Router02 from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { Trade } from '@uniswap/sdk';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import * as config from '../configs/secret-config.json';

async function executeTrade(web3: Web3, trade: Trade, gasPrice: number) {
    const routerAbi = IUniswapV2Router02.abi as unknown as AbiItem;
    const routerContract = new web3.eth.Contract(routerAbi, config.routerContractAddress);
    const myAddress = web3.eth.defaultAccount;
    if (!myAddress) {
        console.log("ERROR: couldn't find my wallet address.");
        return null;
    }
    const deadline = Date.now() + (1000 * 60 * 30);
    const result = await routerContract.methods.swapETHForExactTokens.call(
        trade.outputAmount.raw, trade.route.path.values, myAddress, deadline, { from: myAddress, value: trade.inputAmount, gasPrice: gasPrice });
    console.log("executing trade!");
    console.log(result);
}

export default { executeTrade };