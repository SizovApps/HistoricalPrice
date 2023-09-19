import {getPriceOfToken} from './services/GetPriceServiceEtherscan'

async function getHistoricalPrice(tokenAddress: string, blockchainName: string, timestamp: number) {

    if (timestamp > Date.now()) {
        return null
    }
    return getPriceOfToken(tokenAddress, blockchainName, timestamp)
}

getHistoricalPrice("0x6213f40e00f4595aa038fa710e3f837b492d6757", "ETH", 1695110749).then((price) => console.log("Token price: ", price))

