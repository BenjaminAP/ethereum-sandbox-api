import os from 'os';
import Web3 from "web3";
import {TransactionI} from "../models/transactionI";
import {AccountDetailsI} from "../models/AccountDetailsI";
import {Transaction} from "ethereumjs-tx";
import {PromiEvent, TransactionReceipt} from "web3-core";

/*/
TODO
1. Post: senders public address.
2. Post: receiving.
3. Post: ganache port.
4. Post: raw transaction values.

*/


export class EthereumUtil {

    private web3: Web3;
    private readonly ganache_url: string;
    private rawTx?: TransactionI;

    constructor(port: number) {

        this.ganache_url = `http://localhost:${port}`;
        this.web3 = new Web3(this.ganache_url);
    }

    public getAddrDetails(addr: string): Promise<AccountDetailsI>{
        try {
            return this.web3.eth.getBalance(addr)
                .then((addressBal: string) => addressBal)
                .then((addrBal: string) => {
                    const addrDetails: AccountDetailsI = {
                        addr: addr,
                        bal: addrBal
                    }

                    return addrDetails;
                });
        }catch (e) {
            return e;
        }
    }

    public async getTxCountOfAddr(addr: string): Promise<number> {

        try {
            return await this.web3.eth.getTransactionCount(addr);
        } catch (e) {
            console.log(`Error Getting Transactions count from address: ${addr}`, e);
            return e;
        }
    }

    public signTransaction(): void {

    }

    public async sendSignTransaction(transaction: Transaction): Promise<TransactionReceipt> {
        const serializedTransaction = transaction.serialize();

        try {
            return await this.web3.eth.sendSignedTransaction(serializedTransaction.toString('hex'));
        } catch (err) {
            console.log("Error Sending Transaction", err);
            return err;
        }
    }

    public setTransactionValues(raw_tx: TransactionI): void {
        this.rawTx = raw_tx;
    }


    /// TODO: If it's save. Need to figure out how to get private key from user with security.
    /// This private keys only works with my Ganache local testing environment.
    // private chooseGanachePrivetKeyFromOS(): string {
    //
    //     if (os.type().split('_')[0] === 'Windows') {
    //         return 'd400a3e73601ed8c058de578cdf3e56e6fe3a589957968777447eacb30be8b2c';
    //     } else {
    //         console.log('MacOS')
    //         return '025150d4f380c618f089a6d291b7e324308e6e5c99b413194bdcda3a1a35bce3';
    //     }
    // }
}
