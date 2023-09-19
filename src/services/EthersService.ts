import * as dotenv from "dotenv";
import {DexPair} from "../models/DexPair";
import {dex_swap_abi} from "./DexHandler";
import {EthBlock} from "../models/EthBlock";
import {getABIOfErc20TokenData} from "./CallApiService";

const ethers = require('ethers')

dotenv.config()
const INFURA_URL = process.env["INFURA_URL"]

const provider = new ethers.providers.JsonRpcProvider(INFURA_URL)
const { abi: UniswapV2FactoryAbi } = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const { abi: UniswapV3FactoryAbi } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')

const ETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

const NO_FACTORY_PAIR_ADDRESS = "0x0000000000000000000000000000000000000000"
const UNISWAP_V2_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const UNISWAP_V3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984"

const FACTORY_FEES = [100, 300, 500, 1000, 3000, 5000, 10000, 30000, 5000]

let tokenDecimalsMap = new Map<string, number>();


export async function getUniswapV2TokenPair(tokenAddress: string): Promise<DexPair> {
    const uniswapFactoryAddressV2 = new ethers.Contract(
        UNISWAP_V2_FACTORY_ADDRESS,
        UniswapV2FactoryAbi,
        provider
    )

    const tokenPair = await uniswapFactoryAddressV2.getPair(tokenAddress, ETH_ADDRESS)
    if (tokenPair == NO_FACTORY_PAIR_ADDRESS) {
        return null
    }
    return new DexPair(tokenPair, dex_swap_abi.UNISWAP_V2)
}

export async function getUniswapV3TokenPair(tokenAddress: string): Promise<DexPair> {
    const uniswapFactoryAddressV3 = new ethers.Contract(
        UNISWAP_V3_FACTORY_ADDRESS,
        UniswapV3FactoryAbi,
        provider
    )

    for (const fee of FACTORY_FEES) {
        const tokenPair = await uniswapFactoryAddressV3.getPool(tokenAddress, ETH_ADDRESS, fee)
        if (tokenPair == NO_FACTORY_PAIR_ADDRESS) {
            continue
        }
        return new DexPair(tokenPair, dex_swap_abi.UNISWAP_V3)
    }

    return null
}

export async function getBlock(block_number: number): Promise<EthBlock> {
    return provider.getBlock(block_number).then((block_response: { number: bigint; timestamp: bigint; }) => {
        return new EthBlock(block_response.number, block_response.timestamp)
    })
}

export async function getLatestBlock(): Promise<EthBlock> {
    return provider.getBlock('latest').then((block_response: { number: bigint; timestamp: bigint; }) => {
        return new EthBlock(block_response.number, block_response.timestamp)
    })
}

export async function getDecimalsOfErc20Token(tokenAddress: string): Promise<number | null> {
    if (tokenDecimalsMap.has(tokenAddress)) {
        return tokenDecimalsMap.get(tokenAddress)
    }
    const data = await getABIOfErc20TokenData(tokenAddress)
    if (data == null) {
        return 17
    }

    const contractABI = JSON.parse(data.result);

    const tokenContract = new ethers.Contract(
        tokenAddress,
        contractABI,
        provider
    )

    const decimals = (await tokenContract.decimals()).toNumber()
    tokenDecimalsMap.set(tokenAddress, decimals)
    return decimals
}

export function formatDecimals(value: bigint, decimals: number) {
    return ethers.utils.formatUnits(value, decimals);
}

export function decodeData(types: string[], data: string) {
    return ethers.utils.defaultAbiCoder.decode(types, data)
}

export const transferABI = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)'))

