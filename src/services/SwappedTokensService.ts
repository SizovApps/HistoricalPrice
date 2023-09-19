import {EtherscanReceiptLogResponse} from "../models/responses/EtherscanReceiptLogResponse";
import {SwappedTokens} from "../models/SwappedTokens";
import {SwapDecodedParametersV2} from "../models/SwapDecodedParametersV2";
import {SwapDecodedParametersV3} from "../models/SwapDecodedParametersV3";
import {decodeData, formatDecimals, getDecimalsOfErc20Token} from "./EthersService";

const swap_types_array_v2 = ['uint256', 'uint256', 'uint256', 'uint256']
const swap_types_array_v3 = ['int256', 'int256', 'uint160', 'uint128', 'int24']

const abs = (n) => (n < 0) ? -n : n

export async function getSwappedTokensUniswapV2(
    tokenAddress: string,
    ethSpentValue: bigint[],
    tokenSpentValue: bigint[],
    swapLogs: EtherscanReceiptLogResponse[]
) {
    const decimalsOfToken = await getDecimalsOfErc20Token(tokenAddress)
    for (const swap of swapLogs) {
        const decodedParametersResponse = decodeData(swap_types_array_v2, swap.data);
        const decodedParameters = new SwapDecodedParametersV2(decodedParametersResponse['0'], decodedParametersResponse['1'], decodedParametersResponse['2'], decodedParametersResponse['3'])
        let amountOfTokenSwappedInWei: bigint
        let amountOfEthSwappedInWei: bigint

        if (ethSpentValue.indexOf(decodedParameters.amount0In) != -1 || ethSpentValue.indexOf(decodedParameters.amount0Out) != -1) {
            amountOfTokenSwappedInWei = (decodedParameters.amount1In != BigInt(0)) ? decodedParameters.amount1In : decodedParameters.amount1Out
            amountOfEthSwappedInWei = (decodedParameters.amount0In != BigInt(0)) ? decodedParameters.amount0In : decodedParameters.amount0Out
        } else {
            amountOfTokenSwappedInWei = (decodedParameters.amount0In != BigInt(0)) ? decodedParameters.amount0In : decodedParameters.amount0Out
            amountOfEthSwappedInWei = (decodedParameters.amount1In != BigInt(0)) ? decodedParameters.amount1In : decodedParameters.amount1Out
        }

        if (isAmountInTokenSpentValue(tokenSpentValue, amountOfTokenSwappedInWei) != -1) {
            const amountOfEthSwapped = formatDecimals(amountOfEthSwappedInWei, 18)
            const amountOfTokenSwapped = formatDecimals(amountOfTokenSwappedInWei, decimalsOfToken)

            return new SwappedTokens(Number(amountOfEthSwapped), amountOfTokenSwapped)
        }
    }
    return null
}


export async function getSwappedTokensUniswapV3(
    tokenAddress: string,
    ethSpentValue: bigint[],
    tokenSpentValue: bigint[],
    swapLogs: EtherscanReceiptLogResponse[]
) {
    const decimalsOfToken = Math.pow(10, Number(await getDecimalsOfErc20Token(tokenAddress)))

    for (const swap of swapLogs) {
        const decodedParametersResponse = decodeData(swap_types_array_v3, swap.data);
        const decodedParameters = new SwapDecodedParametersV3(decodedParametersResponse['0'], decodedParametersResponse['1'], decodedParametersResponse['2'], decodedParametersResponse['3'], decodedParametersResponse['4'])

        const amountOfTokenSwappedInWei: bigint = (abs(decodedParameters.amount0In) in ethSpentValue) ? abs(decodedParameters.amount1In) : abs(decodedParameters.amount0In)
        const amountOfEthSwappedInWei = (abs(decodedParameters.amount1In) == amountOfTokenSwappedInWei) ? abs(decodedParameters.amount0In) : abs(decodedParameters.amount1In)
        if (isAmountInTokenSpentValue(tokenSpentValue, amountOfTokenSwappedInWei) != -1) {
            const amountOfEthSwapped = formatDecimals(amountOfEthSwappedInWei, 18)
            const amountOfTokenSwapped = formatDecimals(amountOfTokenSwappedInWei, decimalsOfToken)

            return new SwappedTokens(Number(amountOfEthSwapped), amountOfTokenSwapped)
        }
    }
    return null
}


function isAmountInTokenSpentValue(tokenSpentValue: bigint[], target: bigint) {
    if (target.toString().length <= 3) {
        return tokenSpentValue.indexOf(target)
    }

    let targetString = target.toString().slice(0, 3)
    for (const spent of tokenSpentValue) {
        if (spent.toString().slice(0, 3) == targetString)  {
            return 1
        }
    }
    return -1
}
