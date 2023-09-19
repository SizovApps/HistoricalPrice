"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwappedTokensUniswapV3 = exports.getSwappedTokensUniswapV2 = void 0;
var SwappedTokens_1 = require("../models/SwappedTokens");
var SwapDecodedParametersV2_1 = require("../models/SwapDecodedParametersV2");
var SwapDecodedParametersV3_1 = require("../models/SwapDecodedParametersV3");
var EthersService_1 = require("./EthersService");
var swap_types_array_v2 = ['uint256', 'uint256', 'uint256', 'uint256'];
var swap_types_array_v3 = ['int256', 'int256', 'uint160', 'uint128', 'int24'];
var abs = function (n) { return (n < 0) ? -n : n; };
function getSwappedTokensUniswapV2(tokenAddress, ethSpentValue, tokenSpentValue, swapLogs) {
    return __awaiter(this, void 0, void 0, function () {
        var decimalsOfToken, _i, swapLogs_1, swap, decodedParametersResponse, decodedParameters, amountOfTokenSwappedInWei, amountOfEthSwappedInWei, amountOfEthSwapped, amountOfTokenSwapped;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, EthersService_1.getDecimalsOfErc20Token)(tokenAddress)];
                case 1:
                    decimalsOfToken = _a.sent();
                    for (_i = 0, swapLogs_1 = swapLogs; _i < swapLogs_1.length; _i++) {
                        swap = swapLogs_1[_i];
                        decodedParametersResponse = (0, EthersService_1.decodeData)(swap_types_array_v2, swap.data);
                        decodedParameters = new SwapDecodedParametersV2_1.SwapDecodedParametersV2(decodedParametersResponse['0'], decodedParametersResponse['1'], decodedParametersResponse['2'], decodedParametersResponse['3']);
                        amountOfTokenSwappedInWei = void 0;
                        amountOfEthSwappedInWei = void 0;
                        if (ethSpentValue.indexOf(decodedParameters.amount0In) != -1 || ethSpentValue.indexOf(decodedParameters.amount0Out) != -1) {
                            amountOfTokenSwappedInWei = (decodedParameters.amount1In != BigInt(0)) ? decodedParameters.amount1In : decodedParameters.amount1Out;
                            amountOfEthSwappedInWei = (decodedParameters.amount0In != BigInt(0)) ? decodedParameters.amount0In : decodedParameters.amount0Out;
                        }
                        else {
                            amountOfTokenSwappedInWei = (decodedParameters.amount0In != BigInt(0)) ? decodedParameters.amount0In : decodedParameters.amount0Out;
                            amountOfEthSwappedInWei = (decodedParameters.amount1In != BigInt(0)) ? decodedParameters.amount1In : decodedParameters.amount1Out;
                        }
                        if (isAmountInTokenSpentValue(tokenSpentValue, amountOfTokenSwappedInWei) != -1) {
                            amountOfEthSwapped = (0, EthersService_1.formatDecimals)(amountOfEthSwappedInWei, 18);
                            amountOfTokenSwapped = (0, EthersService_1.formatDecimals)(amountOfTokenSwappedInWei, decimalsOfToken);
                            return [2 /*return*/, new SwappedTokens_1.SwappedTokens(Number(amountOfEthSwapped), amountOfTokenSwapped)];
                        }
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
exports.getSwappedTokensUniswapV2 = getSwappedTokensUniswapV2;
function getSwappedTokensUniswapV3(tokenAddress, ethSpentValue, tokenSpentValue, swapLogs) {
    return __awaiter(this, void 0, void 0, function () {
        var decimalsOfToken, _a, _b, _c, _d, _i, swapLogs_2, swap, decodedParametersResponse, decodedParameters, amountOfTokenSwappedInWei, amountOfEthSwappedInWei, amountOfEthSwapped, amountOfTokenSwapped;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _b = (_a = Math).pow;
                    _c = [10];
                    _d = Number;
                    return [4 /*yield*/, (0, EthersService_1.getDecimalsOfErc20Token)(tokenAddress)];
                case 1:
                    decimalsOfToken = _b.apply(_a, _c.concat([_d.apply(void 0, [_e.sent()])]));
                    for (_i = 0, swapLogs_2 = swapLogs; _i < swapLogs_2.length; _i++) {
                        swap = swapLogs_2[_i];
                        decodedParametersResponse = (0, EthersService_1.decodeData)(swap_types_array_v3, swap.data);
                        decodedParameters = new SwapDecodedParametersV3_1.SwapDecodedParametersV3(decodedParametersResponse['0'], decodedParametersResponse['1'], decodedParametersResponse['2'], decodedParametersResponse['3'], decodedParametersResponse['4']);
                        amountOfTokenSwappedInWei = (abs(decodedParameters.amount0In) in ethSpentValue) ? abs(decodedParameters.amount1In) : abs(decodedParameters.amount0In);
                        amountOfEthSwappedInWei = (abs(decodedParameters.amount1In) == amountOfTokenSwappedInWei) ? abs(decodedParameters.amount0In) : abs(decodedParameters.amount1In);
                        if (isAmountInTokenSpentValue(tokenSpentValue, amountOfTokenSwappedInWei) != -1) {
                            amountOfEthSwapped = (0, EthersService_1.formatDecimals)(amountOfEthSwappedInWei, 18);
                            amountOfTokenSwapped = (0, EthersService_1.formatDecimals)(amountOfTokenSwappedInWei, decimalsOfToken);
                            return [2 /*return*/, new SwappedTokens_1.SwappedTokens(Number(amountOfEthSwapped), amountOfTokenSwapped)];
                        }
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
exports.getSwappedTokensUniswapV3 = getSwappedTokensUniswapV3;
function isAmountInTokenSpentValue(tokenSpentValue, target) {
    if (target.toString().length <= 3) {
        return tokenSpentValue.indexOf(target);
    }
    var targetString = target.toString().slice(0, 3);
    for (var _i = 0, tokenSpentValue_1 = tokenSpentValue; _i < tokenSpentValue_1.length; _i++) {
        var spent = tokenSpentValue_1[_i];
        if (spent.toString().slice(0, 3) == targetString) {
            return 1;
        }
    }
    return -1;
}
