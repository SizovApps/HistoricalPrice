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
exports.transferABI = exports.decodeData = exports.formatDecimals = exports.getDecimalsOfErc20Token = exports.getLatestBlock = exports.getBlock = exports.getUniswapV3TokenPair = exports.getUniswapV2TokenPair = void 0;
var dotenv = require("dotenv");
var DexPair_1 = require("../models/DexPair");
var EthBlock_1 = require("../models/EthBlock");
var CallApiService_1 = require("./CallApiService");
var ethers = require('ethers');
dotenv.config();
var INFURA_URL = process.env["INFURA_URL"];
var provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
var UniswapV2FactoryAbi = require('@uniswap/v2-core/build/UniswapV2Factory.json').abi;
var UniswapV3FactoryAbi = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json').abi;
var ETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
var NO_FACTORY_PAIR_ADDRESS = "0x0000000000000000000000000000000000000000";
var UNISWAP_V2_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
var UNISWAP_V3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
var FACTORY_FEES = [100, 300, 500, 1000, 3000, 5000, 10000, 30000, 5000];
var tokenDecimalsMap = new Map();
function getUniswapV2TokenPair(tokenAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var uniswapFactoryAddressV2, tokenPair;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uniswapFactoryAddressV2 = new ethers.Contract(UNISWAP_V2_FACTORY_ADDRESS, UniswapV2FactoryAbi, provider);
                    return [4 /*yield*/, uniswapFactoryAddressV2.getPair(tokenAddress, ETH_ADDRESS)];
                case 1:
                    tokenPair = _a.sent();
                    if (tokenPair == NO_FACTORY_PAIR_ADDRESS) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, new DexPair_1.DexPair(tokenPair, "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822" /* dex_swap_abi.UNISWAP_V2 */)];
            }
        });
    });
}
exports.getUniswapV2TokenPair = getUniswapV2TokenPair;
function getUniswapV3TokenPair(tokenAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var uniswapFactoryAddressV3, _i, FACTORY_FEES_1, fee, tokenPair;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uniswapFactoryAddressV3 = new ethers.Contract(UNISWAP_V3_FACTORY_ADDRESS, UniswapV3FactoryAbi, provider);
                    _i = 0, FACTORY_FEES_1 = FACTORY_FEES;
                    _a.label = 1;
                case 1:
                    if (!(_i < FACTORY_FEES_1.length)) return [3 /*break*/, 4];
                    fee = FACTORY_FEES_1[_i];
                    return [4 /*yield*/, uniswapFactoryAddressV3.getPool(tokenAddress, ETH_ADDRESS, fee)];
                case 2:
                    tokenPair = _a.sent();
                    if (tokenPair == NO_FACTORY_PAIR_ADDRESS) {
                        return [3 /*break*/, 3];
                    }
                    return [2 /*return*/, new DexPair_1.DexPair(tokenPair, "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67" /* dex_swap_abi.UNISWAP_V3 */)];
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}
exports.getUniswapV3TokenPair = getUniswapV3TokenPair;
function getBlock(block_number) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, provider.getBlock(block_number).then(function (block_response) {
                    return new EthBlock_1.EthBlock(block_response.number, block_response.timestamp);
                })];
        });
    });
}
exports.getBlock = getBlock;
function getLatestBlock() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, provider.getBlock('latest').then(function (block_response) {
                    return new EthBlock_1.EthBlock(block_response.number, block_response.timestamp);
                })];
        });
    });
}
exports.getLatestBlock = getLatestBlock;
function getDecimalsOfErc20Token(tokenAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var data, contractABI, tokenContract, decimals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (tokenDecimalsMap.has(tokenAddress)) {
                        return [2 /*return*/, tokenDecimalsMap.get(tokenAddress)];
                    }
                    return [4 /*yield*/, (0, CallApiService_1.getABIOfErc20TokenData)(tokenAddress)];
                case 1:
                    data = _a.sent();
                    if (data == null) {
                        return [2 /*return*/, 17];
                    }
                    contractABI = JSON.parse(data.result);
                    tokenContract = new ethers.Contract(tokenAddress, contractABI, provider);
                    return [4 /*yield*/, tokenContract.decimals()];
                case 2:
                    decimals = (_a.sent()).toNumber();
                    tokenDecimalsMap.set(tokenAddress, decimals);
                    return [2 /*return*/, decimals];
            }
        });
    });
}
exports.getDecimalsOfErc20Token = getDecimalsOfErc20Token;
function formatDecimals(value, decimals) {
    return ethers.utils.formatUnits(value, decimals);
}
exports.formatDecimals = formatDecimals;
function decodeData(types, data) {
    return ethers.utils.defaultAbiCoder.decode(types, data);
}
exports.decodeData = decodeData;
exports.transferABI = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)'));
