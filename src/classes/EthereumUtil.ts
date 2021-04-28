import os from 'os';
import Web3 from "web3";
import {TransactionI} from "../models/transactionI";
import {TestingAccounts} from "../models/TestingAccounts";

export class EthereumUtil {

   private web3: Web3;
   private rawTx: TransactionI;
   private ganache_url: string;
   private privateKeySender: string;
   private accountsTemp: TestingAccounts;

    constructor() {

        this.ganache_url = 'HTTP://127.0.0.1:7545';
        this.web3 = new Web3(this.ganache_url);
        this.privateKeySender = this.chooseGanachePrivetKeyFromOS();

        this.accountsTemp = {
            senderAccount: '',
            receivingAccount: ''
        }

        this.rawTx = {
            nonce: 0,
            to: undefined,
            gasPrice: 20000,
            gasLimit: 30000,
            value: 100,
            data: undefined
        }

    }

    /// TODO: If it's save. Need to figure out how to get private key from user with security.
    /// This private keys only works with my Ganache local testing environment.
    private chooseGanachePrivetKeyFromOS(): string {

        if (os.type().split('_')[0] === 'Windows') {
            return 'd400a3e73601ed8c058de578cdf3e56e6fe3a589957968777447eacb30be8b2c';
        } else {
            console.log('MacOS')
            return '025150d4f380c618f089a6d291b7e324308e6e5c99b413194bdcda3a1a35bce3';
        }
    }

}
