import Web3 from 'web3';
import * as config from '../configs/secret-config.json';

const main = () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.ethNodeAddress));
    let account = web3.eth.accounts.create(web3.utils.randomHex(32));
    let wallet = web3.eth.accounts.wallet.add(account);
    let keystore = wallet.encrypt(web3.utils.randomHex(32));
    console.log({
        account: account,
        wallet: wallet,
        keystore: keystore
    });
};
main();