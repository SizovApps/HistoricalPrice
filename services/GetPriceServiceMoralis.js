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
exports.GetPriceServiceMoralis = void 0;
var MoralisBlockResponse_1 = require("../models/MoralisBlockResponse");
var MoralisHistoricalPriceResponse_1 = require("../models/MoralisHistoricalPriceResponse");
var moralis_1 = require("moralis");
var common_evm_utils_1 = require("@moralisweb3/common-evm-utils");
var dotenv = require("dotenv");
dotenv.config();
var MORALIS_API_KEY = process.env["MORALIS_API_KEY"];
var GetPriceServiceMoralis = /** @class */ (function () {
    function GetPriceServiceMoralis() {
    }
    GetPriceServiceMoralis.prototype.getPriceOfToken = function (tokenAddress, blockchainName, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var date, chain, blockResponse, moralisBlockResponse, toBlock, address, historicalPriceResponse, moralisHistoricalPriceResponse, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!moralis_1.default.Core.isStarted) return [3 /*break*/, 2];
                        return [4 /*yield*/, moralis_1.default.start({ apiKey: MORALIS_API_KEY })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        date = new Date(timestamp).toString();
                        chain = common_evm_utils_1.EvmChain.ETHEREUM;
                        return [4 /*yield*/, moralis_1.default.EvmApi.block.getDateToBlock({
                                date: date,
                                chain: chain,
                            })];
                    case 3:
                        blockResponse = _a.sent();
                        moralisBlockResponse = new MoralisBlockResponse_1.MoralisBlockResponse();
                        Object.assign(moralisBlockResponse, blockResponse === null || blockResponse === void 0 ? void 0 : blockResponse.toJSON());
                        toBlock = moralisBlockResponse.block;
                        address = common_evm_utils_1.EvmAddress.create(tokenAddress);
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, moralis_1.default.EvmApi.token.getTokenPrice({
                                address: address,
                                chain: chain,
                                toBlock: toBlock
                            })];
                    case 5:
                        historicalPriceResponse = _a.sent();
                        moralisHistoricalPriceResponse = new MoralisHistoricalPriceResponse_1.MoralisHistoricalPriceResponse();
                        Object.assign(moralisHistoricalPriceResponse, historicalPriceResponse === null || historicalPriceResponse === void 0 ? void 0 : historicalPriceResponse.toJSON());
                        return [2 /*return*/, moralisHistoricalPriceResponse.usdPrice];
                    case 6:
                        error_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return GetPriceServiceMoralis;
}());
exports.GetPriceServiceMoralis = GetPriceServiceMoralis;
