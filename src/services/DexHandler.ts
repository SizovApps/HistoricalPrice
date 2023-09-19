import {getSwappedTokensUniswapV2, getSwappedTokensUniswapV3} from "./SwappedTokensService"
import {SwappedTokens} from "../models/SwappedTokens";
import {EtherscanReceiptLogResponse} from "../models/responses/EtherscanReceiptLogResponse";
import {DexPair} from "../models/DexPair";
import {getUniswapV2TokenPair, getUniswapV3TokenPair, transferABI} from "./EthersService";
import {getSwappedTokensData} from "./CallApiService";



const ETH_PRICE = 1610
const ETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

export const enum dex_swap_abi {
    UNISWAP_V2 = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
    UNISWAP_V3 = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
}


let tokenPairMap = new Map<string, DexPair>();

export async function getSwappedTokens(dexPair: DexPair, tokenAddress: string, txHash: string) {
   const data = await getSwappedTokensData(txHash)
    if (data == null) {
        return null
    }

    let swappedTokens: SwappedTokens = null
    if (dexPair.dex == dex_swap_abi.UNISWAP_V2) {
        swappedTokens = await getSwappedTokensUniswapV2(
            tokenAddress,
            get_eth_spent_values(data.result.logs),
            get_token_spent_values(data.result.logs, tokenAddress),
            get_swap_logs(data.result.logs, dex_swap_abi.UNISWAP_V2))
    } else if (dexPair.dex == dex_swap_abi.UNISWAP_V3) {
        swappedTokens = await getSwappedTokensUniswapV3(
            tokenAddress,
            get_eth_spent_values(data.result.logs),
            get_token_spent_values(data.result.logs, tokenAddress),
            get_swap_logs(data.result.logs, dex_swap_abi.UNISWAP_V3))
    }

    if (swappedTokens == null) {
        return null
    }
    return swappedTokens.eth_amount * ETH_PRICE / swappedTokens.token_amount
}

function get_eth_spent_values(logs: [EtherscanReceiptLogResponse]): bigint[] {
    let spent_values: bigint[] = []
    logs.forEach((log) => {
        if ((log.topics[0] === transferABI) && (log.address == ETH_ADDRESS)) {
            spent_values.push(BigInt(log.data))
        }
    })
    return spent_values
}

function get_token_spent_values(logs: [EtherscanReceiptLogResponse], tokenAddress: string): bigint[] {
    let spent_values: bigint[] = []
    logs.forEach((log) => {
        if ((log.topics[0] === transferABI) && (log.address == tokenAddress)) {
            spent_values.push(BigInt(log.data))
        }
    })
    return spent_values
}

function get_swap_logs(logs: [EtherscanReceiptLogResponse], swap_abi: string): EtherscanReceiptLogResponse[] {
    return logs.filter(log => {
        return log.topics[0] == swap_abi})
}


export async function getDexOfToken(tokenAddress: string) {
    if (tokenPairMap.has(tokenAddress)) {
        return tokenPairMap.get(tokenAddress)
    }
    try {
        const uniswapV2Pair = await getUniswapV2TokenPair(tokenAddress)
        if (uniswapV2Pair != null) {
            tokenPairMap.set(tokenAddress, uniswapV2Pair)
            return uniswapV2Pair
        }
    } catch (e) {
        console.error("Can't find token by address: " + tokenAddress)
        return null
    }


    return await getUniswapV3TokenPair(tokenAddress)
}
