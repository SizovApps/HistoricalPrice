
export class SwapDecodedParametersV2 {
    amount0In: bigint
    amount1In: bigint
    amount0Out: bigint
    amount1Out: bigint

    constructor(amount0In: bigint, amount1In: bigint, amount0Out: bigint, amount1Out: bigint) {
        this.amount0In = amount0In;
        this.amount1In = amount1In;
        this.amount0Out = amount0Out;
        this.amount1Out = amount1Out;
    }

}