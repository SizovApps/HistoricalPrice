import {getBlock, getLatestBlock} from "./EthersService";


export async function getBlockNumberByTimeStamp(timestamp: number) {
    const latestBlock = await getLatestBlock()
    const timeSpent = latestBlock.timestamp - timestamp
    const averageBlockSpent = timeSpent / await getAverageBlockTime()
    return Math.floor(latestBlock.number - averageBlockSpent)
}

async function getAverageBlockTime() {
    const currentBlock = await getLatestBlock()
    const thenBlock = await getBlock(currentBlock.number - 500)
    return (currentBlock.timestamp - thenBlock.timestamp) / 500
}
