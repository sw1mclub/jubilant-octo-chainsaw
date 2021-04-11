import IUniswapV2Router02 from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { Trade } from '@uniswap/sdk';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import * as config from '../configs/secret-config.json';
import TransactionHelper from './transaction'

async function executeTrade(web3: Web3, trade: Trade) {
    const routerAbi = IUniswapV2Router02.abi as unknown as AbiItem;
    const routerContract = new web3.eth.Contract(routerAbi, config.routerContractAddress);
    const myAddress = web3.eth.defaultAccount;
    if (!myAddress) {
        console.log("ERROR: couldn't find my wallet address.");
        return null;
    }
    const deadline = Date.now() + (1000 * 60 * 30);
    const outputAmout = web3.utils.toBN(Math.floor(Number(trade.outputAmount.toExact())));
    const inputAmount = trade.inputAmount.toExact();
    const path = trade.route.path.map((token) => { return token.address });
    const args = { outputAmout, path, myAddress, deadline, inputAmount };
    console.log(args);
    const transactionData = await routerContract.methods.swapETHForExactTokens(
        outputAmout,
        path,
        myAddress,
        deadline).encodeABI();
    console.log("Created transaction data and sending transaction");
    console.log(transactionData);
    TransactionHelper.sendTransaction(web3, config.routerContractAddress, inputAmount, transactionData);
}

export default { executeTrade };
