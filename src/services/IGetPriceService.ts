export interface IGetPriceService {
    getPriceOfToken(tokenAddress: string, pairAddress: string, blockchainName: string, timestamp: number): Promise<number|null>
}