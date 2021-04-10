import * as config from '../configs/secret-config.json';
import Web3 from 'web3';
import sendTransaction from './transaction'

const provider = config.testNodeAddress;// testing for now. use `config.ethNodeAddress;` for production
const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);
web3.eth.defaultAccount = config.walletAddress;

// Test Address and PK
// address: '0x4a9b3b57Cc8eCA33Fac7e3065cd28A119De105c8',
// privateKey: '0x805979139a2981f803717febbd1d5c458412daaded7d193f2c9fc3b30e550602',
sendTransaction(web3, "0x4a9b3b57Cc8eCA33Fac7e3065cd28A119De105c8", ".1");


