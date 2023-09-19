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
exports.getDexOfToken = exports.getSwappedTokens = void 0;
var SwappedTokensService_1 = require("./SwappedTokensService");
var EthersService_1 = require("./EthersService");
var CallApiService_1 = require("./CallApiService");
var ETH_PRICE = 1610;
var ETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
var tokenPairMap = new Map();
function getSwappedTokens(dexPair, tokenAddress, txHash) {
    return __awaiter(this, void 0, void 0, function () {
        var data, swappedTokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, CallApiService_1.getSwappedTokensData)(txHash)];
                case 1:
                    data = _a.sent();
                    if (data == null) {
                        return [2 /*return*/, null];
                    }
                    swappedTokens = null;
                    if (!(dexPair.dex == "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822" /* dex_swap_abi.UNISWAP_V2 */)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, SwappedTokensService_1.getSwappedTokensUniswapV2)(tokenAddress, get_eth_spent_values(data.result.logs), get_token_spent_values(data.result.logs, tokenAddress), get_swap_logs(data.result.logs, "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822" /* dex_swap_abi.UNISWAP_V2 */))];
                case 2:
                    swappedTokens = _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    if (!(dexPair.dex == "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67" /* dex_swap_abi.UNISWAP_V3 */)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, SwappedTokensService_1.getSwappedTokensUniswapV3)(tokenAddress, get_eth_spent_values(data.result.logs), get_token_spent_values(data.result.logs, tokenAddress), get_swap_logs(data.result.logs, "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67" /* dex_swap_abi.UNISWAP_V3 */))];
                case 4:
                    swappedTokens = _a.sent();
                    _a.label = 5;
                case 5:
                    if (swappedTokens == null) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, swappedTokens.eth_amount * ETH_PRICE / swappedTokens.token_amount];
            }
        });
    });
}
exports.getSwappedTokens = getSwappedTokens;
function get_eth_spent_values(logs) {
    var spent_values = [];
    logs.forEach(function (log) {
        if ((log.topics[0] === EthersService_1.transferABI) && (log.address == ETH_ADDRESS)) {
            spent_values.push(BigInt(log.data));
        }
    });
    return spent_values;
}
function get_token_spent_values(logs, tokenAddress) {
    var spent_values = [];
    logs.forEach(function (log) {
        if ((log.topics[0] === EthersService_1.transferABI) && (log.address == tokenAddress)) {
            spent_values.push(BigInt(log.data));
        }
    });
    return spent_values;
}
function get_swap_logs(logs, swap_abi) {
    return logs.filter(function (log) {
        return log.topics[0] == swap_abi;
    });
}
function getDexOfToken(tokenAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var uniswapV2Pair, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (tokenPairMap.has(tokenAddress)) {
                        return [2 /*return*/, tokenPairMap.get(tokenAddress)];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, EthersService_1.getUniswapV2TokenPair)(tokenAddress)];
                case 2:
                    uniswapV2Pair = _a.sent();
                    if (uniswapV2Pair != null) {
                        tokenPairMap.set(tokenAddress, uniswapV2Pair);
                        return [2 /*return*/, uniswapV2Pair];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error("Can't find token by address: " + tokenAddress);
                    return [2 /*return*/, null];
                case 4: return [4 /*yield*/, (0, EthersService_1.getUniswapV3TokenPair)(tokenAddress)];
                case 5: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getDexOfToken = getDexOfToken;
