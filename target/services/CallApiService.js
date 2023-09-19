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
exports.getABIOfErc20TokenData = exports.getTransactionsOfTokenData = exports.getSwappedTokensData = void 0;
var dotenv = require("dotenv");
var axios_1 = require("axios");
dotenv.config();
var ETHERSCAN_API_KEY = process.env["ETHERSCAN_API_KEY"];
var MAX_RATE_LIMIT_REACHED = "\"Max rate limit reached\"";
var MAX_RATE_LIMIT_REACHED_HIGHER_RATE = "Max rate limit reached, please use API Key for higher rate limit";
function getSwappedTokensData(txHash) {
    return __awaiter(this, void 0, void 0, function () {
        var tx_receipt_url, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    tx_receipt_url = 'https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=' + txHash + '&apikey=' + ETHERSCAN_API_KEY;
                    return [4 /*yield*/, axios_1.default.get(tx_receipt_url, {
                            headers: {
                                Accept: 'application/json',
                            },
                        })];
                case 1:
                    data = (_a.sent()).data;
                    if (JSON.stringify(data.result) == MAX_RATE_LIMIT_REACHED) {
                        console.error(data.result);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data];
                case 2:
                    error_1 = _a.sent();
                    if (axios_1.default.isAxiosError(error_1)) {
                        console.log('error message: ', error_1.message);
                        return [2 /*return*/, null];
                    }
                    else {
                        console.log('error in getSwappedTokensData(): ', error_1);
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getSwappedTokensData = getSwappedTokensData;
function getTransactionsOfTokenData(tokenAddress, blockNumber, step) {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://api.etherscan.io/api?module=account&action=tokentx&address=' + tokenAddress + '&apikey=' + ETHERSCAN_API_KEY + '&startblock=' + (blockNumber - step) + '&endblock=' + (blockNumber + step) + '&sort=desc';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(url, {
                            headers: {
                                Accept: 'application/json',
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    if (JSON.stringify(data.result) == MAX_RATE_LIMIT_REACHED) {
                        console.error(data.result);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data];
                case 3:
                    error_2 = _a.sent();
                    if (axios_1.default.isAxiosError(error_2)) {
                        console.log('error message: ', error_2.message);
                        return [2 /*return*/, null];
                    }
                    else {
                        console.log('error in getTransactionsOfTokenData(): ', error_2);
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getTransactionsOfTokenData = getTransactionsOfTokenData;
function getABIOfErc20TokenData(tokenAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var getAbiUrl, _a, data, status_1, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    getAbiUrl = 'https://api.etherscan.io/api?module=contract&action=getabi&address=' + tokenAddress + '&apikey=' + ETHERSCAN_API_KEY;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(getAbiUrl, {
                            headers: {
                                Accept: 'application/json',
                            },
                        })];
                case 2:
                    _a = _b.sent(), data = _a.data, status_1 = _a.status;
                    if (data.result == MAX_RATE_LIMIT_REACHED_HIGHER_RATE) {
                        console.error(data.result);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data];
                case 3:
                    error_3 = _b.sent();
                    if (axios_1.default.isAxiosError(error_3)) {
                        console.log('error message: ', error_3.message);
                        return [2 /*return*/, null];
                    }
                    else {
                        console.log('error in getDecimalsOfErc20TokenData(): ', error_3);
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getABIOfErc20TokenData = getABIOfErc20TokenData;
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
