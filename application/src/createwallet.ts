import Web3 from 'web3';
import * as config from '../configs/secret-config.json';
import * as bip39 from 'bip39';
import * as WalletJS from 'ethereumjs-wallet';

const main = () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.testNodeAddress));
    let account = web3.eth.accounts.create(web3.utils.randomHex(32));
    let wallet = web3.eth.accounts.wallet.add(account);
    let keystore = wallet.encrypt(web3.utils.randomHex(32));
    console.log({
        account: account,
        wallet: wallet,
        keystore: keystore
    });
};

async function generateAddressesFromMnemonic(mnemonic: string) {
    const seed = await bip39.mnemonicToSeed(mnemonic)
    let hdwallet = WalletJS.hdkey.fromMasterSeed(seed);
    let wallet_hdpath = "m/44'/60'/0'/0/";

    let accounts = [];
    for (let i = 0; i < 10; i++) {
        let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
        let address = '0x' + wallet.getAddress().toString("hex");
        let privateKey = wallet.getPrivateKey().toString("hex");
        accounts.push({address: address, privateKey: privateKey});
    }

    console.log(accounts);
    return accounts;
}

main();