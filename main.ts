
import {GetPriceServiceMoralis} from './services/GetPriceServiceMoralis'

async function getHistoricalPrice(tokenAddress: string, blockchainName: string, timestamp: number) {
    if (timestamp > Date.now()) {
        return null
    }
    return new GetPriceServiceMoralis().getPriceOfToken(tokenAddress, blockchainName, timestamp)
}

getHistoricalPrice("0x02a2eb0f234cc3fd981ee7b8b616e02fb4a3e035", "ETH", 1693913134000).then((price) => console.log("Token price: ", price))
