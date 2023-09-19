import {getDexOfToken, getSwappedTokens} from './DexHandler'
import {getBlockNumberByTimeStamp} from "./GetBlockService";

import {getTransactionsOfTokenData} from "./CallApiService";

const enum Block_step {
    HALF_MINUTE = 1,
    TWO_MINUTES = 15,
    FIVE_MINUTES = 40,
    TEN_MINUTES = 80
}

export async function getPriceOfToken(tokenAddress: string, blockchainName: string, timestamp: number): Promise<number | null> {
    let dexPair = await getDexOfToken(tokenAddress)
    if (dexPair == null) {
        return null
    }
    console.log("DexPair: ", dexPair)
    const blockNumber = await getBlockNumberByTimeStamp(timestamp)
    console.log("Block number: " + blockNumber)
    if (blockNumber < 0) {
        return null
    }

    return getTransactionsOfToken(dexPair.pairAddress, blockNumber, Block_step.HALF_MINUTE).then(async (result) => {
        if (result == null) {
            return null
        }
        let countOfTransactions: number = result.length
        if (countOfTransactions == 0) {
            return null
        }


        let tokenPrice = null
        let index = 0
        while (tokenPrice == null && index < result.length) {
            console.log("result: " + result[index].hash + ", block: " + blockNumber)
            if (result[index].hash == undefined) {
                console.log("UNDEFINED: ", result[index])
            }
            tokenPrice = await getSwappedTokens(dexPair, tokenAddress, result[index].hash)
            index++
        }
        return tokenPrice
    })
}

async function getTransactionsOfToken(tokenAddress: string, blockNumber: number, step: Block_step){
    const data = await getTransactionsOfTokenData(tokenAddress, blockNumber, step)
    if (data == null) {
        return null
    }
    let count_of_transactions: number = data.result.length
    if (count_of_transactions == 0 && step == Block_step.TEN_MINUTES) {
        return null
    }
    if (count_of_transactions == 0) {
        return getTransactionsOfToken(tokenAddress, blockNumber, setNextBlockStep(step))
    }

    return data.result;
}

function setNextBlockStep(step: Block_step) {
    if (step == Block_step.HALF_MINUTE) {
        return Block_step.TWO_MINUTES
    }
    if (step == Block_step.TWO_MINUTES) {
        return Block_step.FIVE_MINUTES
    }
    if (step == Block_step.FIVE_MINUTES) {
        return Block_step.TEN_MINUTES
    }
}