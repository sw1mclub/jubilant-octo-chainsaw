import * as config from '../configs/secret-config.json';
import Web3 from 'web3';

const provider = config.ethNodeAddress;
const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);
web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ",result);
});
