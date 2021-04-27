import {TransactionI} from "../models/transactionI";
import {TestingAccounts} from "../models/TestingAccounts";
import Web3 from "web3";
import {Transaction} from "ethereumjs-tx";


export class SimpleTransactions {

    web3: Web3;
    rawTx: TransactionI;
    ganache_url: string;
    privateKeySender: string;
    accountsTemp: TestingAccounts;

    constructor() {
        // this.privateKeySender = '025150d4f380c618f089a6d291b7e324308e6e5c99b413194bdcda3a1a35bce3'; /// MacOS
        this.privateKeySender = 'd400a3e73601ed8c058de578cdf3e56e6fe3a589957968777447eacb30be8b2c'; /// WinOS
        this.ganache_url = 'HTTP://127.0.0.1:7545';

        this.accountsTemp = {
            senderAccount: '',
            receivingAccount: ''
        }

        this.web3 = new Web3(this.ganache_url);

        this.rawTx = {
            nonce: 0,
            to: undefined,
            gasPrice: 20000,
            gasLimit: 30000,
            value: 100,
            data: undefined
        }

        this.makeTestTransaction();
    }

    makeTestTransaction(): void {
        try {
            this.getFirst2Accounts()
                .then(async (accounts: TestingAccounts) => {

                    this.accountsTemp = accounts;
                    return await this.web3.eth.getTransactionCount(accounts.senderAccount);
                })
                .then((senderTransactionCount: number) => {

                    this.rawTx.nonce = senderTransactionCount;

                    const transaction = this.signTransaction();
                    this.sendSignTransaction(transaction);
                })
                .then(() => {
                    this.getAccountBalance(this.accountsTemp.senderAccount);
                    this.getAccountBalance(this.accountsTemp.receivingAccount);
                })

        } catch (e) {
            console.log('Error happened', e);
        }
    }

    addressHasHex(address: string): Buffer {
        return Buffer.from(address, 'hex');
    }

    async getFirst2Accounts(): Promise<TestingAccounts> {

        return await this.web3.eth.getAccounts()
            .then((accounts: string[]): TestingAccounts => {
                const returnAcc: TestingAccounts = {
                    senderAccount: accounts[0],
                    receivingAccount: accounts[1]
                }

                this.rawTx.to = accounts[1];

                return returnAcc;
            });
    }

    getAccountBalance(account: string): void {

        this.web3.eth.getBalance(account).then(console.log);
    }

    signTransaction(): Transaction {

        const privKeySenderHex = this.addressHasHex(this.privateKeySender);
        const transaction = new Transaction(this.rawTx);

        try {
            transaction.sign(privKeySenderHex);
        } catch (e) {
            console.log('Error Signing Transaction', e);
        }

        return transaction;
    }

    sendSignTransaction(transaction: Transaction): void {
        const serializedTransaction = transaction.serialize();

        try {
            this.web3.eth.sendSignedTransaction(serializedTransaction.toString('hex'));
        } catch (err) {
            console.log("Error Sending Transaction", err);
        }

    }

}
