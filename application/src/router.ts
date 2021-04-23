import IUniswapV2Router02 from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { Trade } from '@uniswap/sdk';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import * as config from '../configs/secret-config.json';
import TransactionHelper from './transaction'
import BigNumberUtil from './bignumberutil';

async function executeEthToTokenTrade(web3: Web3, trade: Trade) {
    const routerAbi = IUniswapV2Router02.abi as AbiItem[];
    const routerContract = new web3.eth.Contract(routerAbi, config.routerContractAddress);
    const myAddress = web3.eth.defaultAccount;
    if (!myAddress) {
        console.log("ERROR: couldn't find my wallet address.");
        return null;
    }
    const deadline = Math.ceil((Date.now() + (1000 * 60 * 30)) / 1000);
    const outputAmount =
        BigNumberUtil.tokenAmountNumberToString(
            Math.floor(Number(trade.outputAmount.toExact()) - 10));
    const inputAmount = trade.inputAmount.toExact();
    const path = trade.route.path.map((token) => { return token.address });
    const args = { outputAmount, path, myAddress, deadline, inputAmount };
    console.log(args);
    const transactionData = await routerContract.methods.swapExactETHForTokens(
        outputAmount,
        path,
        myAddress,
        deadline).encodeABI();
    console.log("Created eth to token transaction data and sending transaction");
    console.log(transactionData);
    return TransactionHelper.sendTransaction(web3, config.routerContractAddress, inputAmount, transactionData);
}

async function executeTokenToEthTrade(web3: Web3, trade: Trade) {
    const routerAbi = IUniswapV2Router02.abi as unknown as AbiItem;
    const routerContract = new web3.eth.Contract(routerAbi, config.routerContractAddress);
    const myAddress = web3.eth.defaultAccount;
    if (!myAddress) {
        console.log("ERROR: couldn't find my wallet address.");
        return null;
    }
    const deadline = Math.ceil((Date.now() + (1000 * 60 * 30)) / 1000);
    const amountOutMin = web3.utils.toWei((Number(trade.outputAmount.toExact()) - 0.01) + '', 'ether');
    const inputAmount = BigNumberUtil.tokenAmountNumberToString(
        Math.floor(Number(trade.inputAmount.toExact())));
    const path = trade.route.path.map((token) => { return token.address });
    const args = { amountOutMin, path, myAddress, deadline, inputAmount };
    console.log("Creating tokens to eth transaction: ")
    console.log(args);
    const transactionData = await routerContract.methods.swapExactTokensForETH(
        inputAmount,
        amountOutMin,
        path,
        myAddress,
        deadline).encodeABI();
    console.log("Created token to eth transaction data and sending transaction");
    console.log(transactionData);
    return TransactionHelper.sendTransaction(web3, config.routerContractAddress, "0", transactionData);
}

export default { executeEthToTokenTrade, executeTokenToEthTrade };
