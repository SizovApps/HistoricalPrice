"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapDecodedParametersV3 = void 0;
var SwapDecodedParametersV3 = /** @class */ (function () {
    function SwapDecodedParametersV3(amount0In, amount1In, sqrtPriceX96, liquidity, tick) {
        this.amount0In = amount0In;
        this.amount1In = amount1In;
        this.sqrtPriceX96 = sqrtPriceX96;
        this.liquidity = liquidity;
        this.tick = tick;
    }
    return SwapDecodedParametersV3;
}());
exports.SwapDecodedParametersV3 = SwapDecodedParametersV3;
