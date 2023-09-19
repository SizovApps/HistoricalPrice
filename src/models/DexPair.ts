import {dex_swap_abi} from '../services/DexHandler'

export class DexPair {
    pairAddress: string
    dex: dex_swap_abi
    constructor(pairAddress: string, dex: dex_swap_abi) {
        this.pairAddress = pairAddress
        this.dex = dex
    }
}