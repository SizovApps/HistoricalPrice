import * as dotenv from "dotenv";
import axios from "axios";
import {EtherscanTransactionReceiptResponse} from "../models/responses/EtherscanTransactionReceiptResponse";
import {EtherscanTransactionsOfTokenResponse} from "../models/responses/EtherscanTransactionsOfTokenResponse";


dotenv.config()
const ETHERSCAN_API_KEY = process.env["ETHERSCAN_API_KEY"]

const MAX_RATE_LIMIT_REACHED = "\"Max rate limit reached\""
const MAX_RATE_LIMIT_REACHED_HIGHER_RATE = "Max rate limit reached, please use API Key for higher rate limit"



export async function getSwappedTokensData(txHash: string) {
    try {
        const tx_receipt_url = 'https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=' + txHash + '&apikey=' + ETHERSCAN_API_KEY
        const {data} = await axios.get<EtherscanTransactionReceiptResponse>(
            tx_receipt_url,
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );
        if (JSON.stringify(data.result) == MAX_RATE_LIMIT_REACHED) {
            console.error(data.result)
            return null
        }
        return data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return null;
        } else {
            console.log('error in getSwappedTokensData(): ', error);
            return null;
        }
    }
}

export async function getTransactionsOfTokenData(tokenAddress: string, blockNumber: number, step: number) {
    const url = 'https://api.etherscan.io/api?module=account&action=tokentx&address=' + tokenAddress + '&apikey=' + ETHERSCAN_API_KEY + '&startblock=' + (blockNumber - step) + '&endblock=' + (blockNumber + step) + '&sort=desc'
    try {
        const { data} = await axios.get<EtherscanTransactionsOfTokenResponse>(
            url,
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );
        if (JSON.stringify(data.result) == MAX_RATE_LIMIT_REACHED) {
            console.error(data.result)
            return null
        }
        return data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return null;
        } else {
            console.log('error in getTransactionsOfTokenData(): ', error);
            return null;
        }
    }
}

export async function getABIOfErc20TokenData(tokenAddress: string) {
    const getAbiUrl = 'https://api.etherscan.io/api?module=contract&action=getabi&address=' + tokenAddress + '&apikey=' + ETHERSCAN_API_KEY
    try {
        const {data, status} = await axios.get(
            getAbiUrl,
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );
        if (data.result == MAX_RATE_LIMIT_REACHED_HIGHER_RATE) {
            console.error(data.result)
            return null
        }
        return data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return null;
        } else {
            console.log('error in getDecimalsOfErc20TokenData(): ', error);
            return null;
        }
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}





