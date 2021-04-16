import TransactionHelper from '../transaction';
import Web3 from 'web3';
import * as config from '../../configs/test-config.json';

const Web3PromiEvent = require('web3-core-promievent');

describe("TransactionHelper function", () => {
    const provider = config.testNodeAddress;
    const web3Provider = new Web3.providers.HttpProvider(provider);
    const web3 = new Web3(web3Provider);
    web3.eth.defaultAccount = config.walletAddress;

    const mock = jest.spyOn(web3.eth, 'sendSignedTransaction');
    mock.mockImplementation(
        (
            signedTransactionData: string,
            callback?: ((error: Error, hash: string) => void) | undefined) => {
            return new Web3PromiEvent();
        });

    it("should properly create transaction data with no value", async () => {
        const expectedTransactionDetails =
        {
            "chainId": 4,
            "data": "0x1234",
            "gas": 210000,
            "gasPrice": 0,
            "nonce": 0,
            "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            "value": "0x0"
        };
        const transactionDetails =
            await TransactionHelper.sendTransaction(web3, config.routerContractAddress, "0", "0x1234");
        expect({ ...transactionDetails, gasPrice: 0 }).toEqual(expectedTransactionDetails);
    });

    it("should properly create transaction data with value", async () => {
        const expectedTransactionDetails =
        {
            "chainId": 4,
            "data": "0x1234",
            "gas": 210000,
            "gasPrice": 0,
            "nonce": 0,
            "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            "value": "0x6aaf7c8516d0c0000"
        };
        const transactionDetails =
            await TransactionHelper.sendTransaction(web3, config.routerContractAddress, "123", "0x1234");
        expect({ ...transactionDetails, gasPrice: 0 }).toEqual(expectedTransactionDetails);
    });
});