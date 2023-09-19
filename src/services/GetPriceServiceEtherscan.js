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
exports.getPriceOfToken = void 0;
var DexHandler_1 = require("./DexHandler");
var GetBlockService_1 = require("./GetBlockService");
var CallApiService_1 = require("./CallApiService");
function getPriceOfToken(tokenAddress, blockchainName, timestamp) {
    return __awaiter(this, void 0, void 0, function () {
        var dexPair, blockNumber;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, DexHandler_1.getDexOfToken)(tokenAddress)];
                case 1:
                    dexPair = _a.sent();
                    if (dexPair == null) {
                        return [2 /*return*/, null];
                    }
                    console.log("DexPair: ", dexPair);
                    return [4 /*yield*/, (0, GetBlockService_1.getBlockNumberByTimeStamp)(timestamp)];
                case 2:
                    blockNumber = _a.sent();
                    console.log("Block number: " + blockNumber);
                    if (blockNumber < 0) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, getTransactionsOfToken(dexPair.pairAddress, blockNumber, 1 /* Block_step.HALF_MINUTE */).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                            var countOfTransactions, tokenPrice, index;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (result == null) {
                                            return [2 /*return*/, null];
                                        }
                                        countOfTransactions = result.length;
                                        if (countOfTransactions == 0) {
                                            return [2 /*return*/, null];
                                        }
                                        tokenPrice = null;
                                        index = 0;
                                        _a.label = 1;
                                    case 1:
                                        if (!(tokenPrice == null && index < result.length)) return [3 /*break*/, 3];
                                        console.log("result: " + result[index].hash + ", block: " + blockNumber);
                                        if (result[index].hash == undefined) {
                                            console.log("UNDEFINED: ", result[index]);
                                        }
                                        return [4 /*yield*/, (0, DexHandler_1.getSwappedTokens)(dexPair, tokenAddress, result[index].hash)];
                                    case 2:
                                        tokenPrice = _a.sent();
                                        index++;
                                        return [3 /*break*/, 1];
                                    case 3: return [2 /*return*/, tokenPrice];
                                }
                            });
                        }); })];
            }
        });
    });
}
exports.getPriceOfToken = getPriceOfToken;
function getTransactionsOfToken(tokenAddress, blockNumber, step) {
    return __awaiter(this, void 0, void 0, function () {
        var data, count_of_transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, CallApiService_1.getTransactionsOfTokenData)(tokenAddress, blockNumber, step)];
                case 1:
                    data = _a.sent();
                    if (data == null) {
                        return [2 /*return*/, null];
                    }
                    count_of_transactions = data.result.length;
                    if (count_of_transactions == 0 && step == 80 /* Block_step.TEN_MINUTES */) {
                        return [2 /*return*/, null];
                    }
                    if (count_of_transactions == 0) {
                        return [2 /*return*/, getTransactionsOfToken(tokenAddress, blockNumber, setNextBlockStep(step))];
                    }
                    return [2 /*return*/, data.result];
            }
        });
    });
}
function setNextBlockStep(step) {
    if (step == 1 /* Block_step.HALF_MINUTE */) {
        return 15 /* Block_step.TWO_MINUTES */;
    }
    if (step == 15 /* Block_step.TWO_MINUTES */) {
        return 40 /* Block_step.FIVE_MINUTES */;
    }
    if (step == 40 /* Block_step.FIVE_MINUTES */) {
        return 80 /* Block_step.TEN_MINUTES */;
    }
}
