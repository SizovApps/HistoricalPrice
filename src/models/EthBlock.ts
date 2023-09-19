
export class EthBlock {
    number: number
    timestamp: number
    constructor(number: bigint, timestamp: bigint) {
        this.number = Number(number)
        this.timestamp = Number(timestamp)
    }

}