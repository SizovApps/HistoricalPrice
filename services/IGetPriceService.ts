export interface IGetPriceService {
    getPriceOfToken(tokenAddress: string, blockchainName: string, timestamp: number): Promise<number>
}