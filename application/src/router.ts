import IUniswapV2Router02 from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { Trade } from '@uniswap/sdk';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import * as config from '../configs/secret-config.json';
import TransactionHelper from './transaction'

async function executeEthToTokenTrade(web3: Web3, trade: Trade) {
    const routerAbi = IUniswapV2Router02.abi as unknown as AbiItem;
    const routerContract = new web3.eth.Contract(routerAbi, config.routerContractAddress);
    const myAddress = web3.eth.defaultAccount;
    if (!myAddress) {
        console.log("ERROR: couldn't find my wallet address.");
        return null;
    }
    const deadline = Date.now() + (1000 * 60 * 30);
    const outputAmount = web3.utils.toBN(Math.floor(Number(trade.outputAmount.toExact())));
    const inputAmount = trade.inputAmount.toExact();
    const path = trade.route.path.map((token) => { return token.address });
    const args = { outputAmount, path, myAddress, deadline, inputAmount };
    console.log(args);
    const transactionData = await routerContract.methods.swapETHForExactTokens(
        outputAmount,
        path,
        myAddress,
        deadline).encodeABI();
    console.log("Created eth to token transaction data and sending transaction");
    console.log(transactionData);
    TransactionHelper.sendTransaction(web3, config.routerContractAddress, inputAmount, transactionData);
}

async function executeTokenToEthTrade(web3: Web3, trade: Trade) {
    const routerAbi = IUniswapV2Router02.abi as unknown as AbiItem;
    const routerContract = new web3.eth.Contract(routerAbi, config.routerContractAddress);
    const myAddress = web3.eth.defaultAccount;
    if (!myAddress) {
        console.log("ERROR: couldn't find my wallet address.");
        return null;
    }
    const deadline = Date.now() + (1000 * 60 * 30);
    const outputAmount = web3.utils.toWei(trade.outputAmount.toExact(), 'ether');
    const inputAmount = trade.inputAmount.toExact();
    const inputAmountMax = web3.utils.toBN(Math.ceil(Number(inputAmount) + 10));
    const path = trade.route.path.map((token) => { return token.address });
    const args = { outputAmount, path, myAddress, deadline, inputAmount };
    console.log("Creating tokens to eth transaction: ")
    console.log(args);
    const transactionData = await routerContract.methods.swapTokensForExactETH(
        outputAmount,
        inputAmountMax,
        path,
        myAddress,
        deadline).encodeABI();
    console.log("Created token to eth transaction data and sending transaction");
    console.log(transactionData);
    TransactionHelper.sendTransaction(web3, config.routerContractAddress, "0", transactionData);
}

export default { executeEthToTokenTrade, executeTokenToEthTrade };
