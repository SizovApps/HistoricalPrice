
export class SwapDecodedParametersV3 {
    amount0In: bigint
    amount1In: bigint
    sqrtPriceX96: bigint
    liquidity: bigint
    tick: number

    constructor(amount0In: bigint, amount1In: bigint, sqrtPriceX96: bigint, liquidity: bigint, tick: number) {
        this.amount0In = amount0In;
        this.amount1In = amount1In;
        this.sqrtPriceX96 = sqrtPriceX96;
        this.liquidity = liquidity;
        this.tick = tick;
    }

}