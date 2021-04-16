import Router from '../router';
import Web3 from 'web3';
import * as config from '../../configs/test-config.json';
import * as ethers from 'ethers';
import { Trade } from '@uniswap/sdk';
import TradeBuilder from '../uniswap';

const Web3PromiEvent = require('web3-core-promievent');

describe("Router functions", () => {
    const provider = config.testNodeAddress;
    const web3Provider = new Web3.providers.HttpProvider(provider);
    const web3 = new Web3(web3Provider);
    web3.eth.defaultAccount = config.walletAddress;

    const ethersProvider = new ethers.providers.JsonRpcProvider(config.ethNodeAddress);

    const mock = jest.spyOn(web3.eth, 'sendSignedTransaction');
    Date.now = jest.fn(() => 2618610738000);
    mock.mockImplementation(
        (
            signedTransactionData: string,
            callback?: ((error: Error, hash: string) => void) | undefined) => {
            return new Web3PromiEvent();
        });

    it("should properly create eth to token transaction deatils", async () => {
        const trade = {
            outputAmount: {
                toExact: () => { return '1857' },
            },
            route : {
                path: [
                    {address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
                    {address: '0x6B175474E89094C44Da98b954EedeAC495271d0F'},
                ],
            },
            myAddress: '0x3290968a5B50583233588F99D69Cd545bc335d2f',
            deadline: 2618610738000,
            inputAmount: {
                toExact: () => { return '0.765' },
            },
        };
        const expectedTransactionDetails =
        {
            "chainId": 4,
            "data": "0x7ff36ab500000000000000000000000000000000000000000000006420462a2cb27c000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000003290968a5b50583233588f99d69cd545bc335d2f000000000000000000000000000000000000000000000000000000009c14db3a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000006b175474e89094c44da98b954eedeac495271d0f",
            "gas": 210000,
            "gasPrice": 0,
            "nonce": 0,
            "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            "value": "0xa9dd372652c8000",
        };
        const transactionDetails =
            await Router.executeEthToTokenTrade(web3, trade as unknown as Trade);
        expect({ ...transactionDetails, gasPrice: 0 }).toEqual(expectedTransactionDetails);
    });

    it("should properly create token to eth transaction deatils", async () => {
        const trade = {
            outputAmount: {
                toExact: () => { return '955054550085528241' },
            },
            route : {
                path: [
                    {address: '0x6B175474E89094C44Da98b954EedeAC495271d0F'},
                    {address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
                ],
            },
            myAddress: '0x3290968a5B50583233588F99D69Cd545bc335d2f',
            deadline: 2618610738000,
            inputAmount: {
                toExact: () => { return '2345' },
            },
        };
        const expectedTransactionDetails =
        {
            "chainId": 4,
            "data": "0x18cbafe500000000000000000000000000000000000000000000007f1f6993a8530400000000000000000000000000000000000000b7efd326914db22c18c2b42424000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000003290968a5b50583233588f99d69cd545bc335d2f000000000000000000000000000000000000000000000000000000009c14db3a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "gas": 210000,
            "gasPrice": 0,
            "nonce": 0,
            "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            "value": "0x0",
        };
        const transactionDetails =
            await Router.executeTokenToEthTrade(web3, trade as unknown as Trade);
        expect({ ...transactionDetails, gasPrice: 0 }).toEqual(expectedTransactionDetails);
    });
});