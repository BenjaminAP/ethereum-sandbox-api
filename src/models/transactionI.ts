export interface TransactionI {
    nonce: number;
    to?: string;
    gasPrice: number;
    gasLimit: number;
    value: number;
    data?: any;
}
