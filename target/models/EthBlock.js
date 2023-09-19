"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthBlock = void 0;
var EthBlock = /** @class */ (function () {
    function EthBlock(number, timestamp) {
        this.number = Number(number);
        this.timestamp = Number(timestamp);
    }
    return EthBlock;
}());
exports.EthBlock = EthBlock;
