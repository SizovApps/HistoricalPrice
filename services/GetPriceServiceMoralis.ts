import {MoralisBlockResponse} from '../models/MoralisBlockResponse'
import {MoralisHistoricalPriceResponse} from '../models/MoralisHistoricalPriceResponse'
import Moralis from "moralis"
import {IGetPriceService} from "./IGetPriceService";
import {EvmAddress, EvmChain} from "@moralisweb3/common-evm-utils";
import * as dotenv from 'dotenv'

dotenv.config()

const MORALIS_API_KEY = process.env["MORALIS_API_KEY"]

export class GetPriceServiceMoralis implements IGetPriceService {
    async getPriceOfToken(tokenAddress: string, blockchainName: string, timestamp: number): Promise<number|null> {

        if (!Moralis.Core.isStarted) {
            await Moralis.start({apiKey: MORALIS_API_KEY});
        }

        const date = new Date(timestamp).toString();
        const chain = EvmChain.ETHEREUM;

        const blockResponse = await Moralis.EvmApi.block.getDateToBlock({
            date,
            chain,
        });

        let moralisBlockResponse = new MoralisBlockResponse()
        Object.assign(moralisBlockResponse, blockResponse?.toJSON());

        const toBlock = moralisBlockResponse.block
        const address = EvmAddress.create(tokenAddress)

        try {
            const historicalPriceResponse = await Moralis.EvmApi.token.getTokenPrice({
                address,
                chain,
                toBlock
            });
            let moralisHistoricalPriceResponse = new MoralisHistoricalPriceResponse()
            Object.assign(moralisHistoricalPriceResponse, historicalPriceResponse?.toJSON());
            return moralisHistoricalPriceResponse.usdPrice
        } catch (error) {
            return null
        }
    }
}