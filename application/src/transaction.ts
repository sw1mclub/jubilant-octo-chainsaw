import * as config from '../configs/secret-config.json';
import Web3 from 'web3';
import axios from 'axios';
import * as EthereumTx from 'ethereumjs-tx';

const getCurrentGasPrices = async () => {
    console.log("getting current gas prices:");
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
    }
    console.log(prices);
    return prices
}

async function sendTransaction(web3: Web3, destinationWalletAddress: string, amountToSend: string) {
    let destinationBalanceWei = await web3.eth.getBalance(destinationWalletAddress);
    let destinationBalance = web3.utils.fromWei(destinationBalanceWei, 'ether');
    console.log("Destination balance: " + destinationBalance);

    const myAddress = web3.eth.defaultAccount;
    if (!myAddress) {
        console.log("ERROR: couldn't find my wallet address.");
        return null;
    }
    let myBalanceWei = await web3.eth.getBalance(myAddress);
    let myBalance = web3.utils.fromWei(myBalanceWei, 'ether')

    console.log("My balance: " + myBalance);

    let nonce = await web3.eth.getTransactionCount(myAddress);
    let gasPrices = await getCurrentGasPrices()

    let details = {
        "to": destinationWalletAddress,
        "value": web3.utils.toHex(web3.utils.toWei(amountToSend, 'ether')),
        "gas": 21000,
        "gasPrice": gasPrices.low * 1000000000, // convert gwei to wei
        "nonce": nonce,
        "chainId": config.chainID
    };

    const transaction = new EthereumTx.Transaction(details, { 'chain': config.chain, hardfork: 'petersburg' });
    const privateKeyBuffer = Buffer.from(config.privateKey, "hex");
    transaction.sign(privateKeyBuffer);
    const serializedTransaction = transaction.serialize()

    console.log("sending transaction...");
    const transactionId = await web3.eth.sendSignedTransaction("0x" + serializedTransaction.toString('hex'),
        function (err, hash) {
            if (!err) {
                console.log("Success! See transaction here: https://rinkeby.etherscan.io/tx/" + hash);
            } else {
                console.log("something went wrong");
                console.log(err);
            }
        }
    );
}

export default sendTransaction;