
export class SwappedTokens{
    eth_amount: number
    token_amount: number

    constructor(eth_amount: number, token_amount: number) {
        this.eth_amount = eth_amount;
        this.token_amount = token_amount;
    }
}