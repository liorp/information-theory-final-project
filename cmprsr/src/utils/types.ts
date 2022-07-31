/* eslint-disable @typescript-eslint/no-type-alias */
/** Basic */
/** {[symbol]: [codeword]}, e.g. {"a": 1} */
export interface Dictionary {
	string?: string
}

/** LZ77 */
export type LZ77Pointer = [number, number]
export type LZ77Component = [LZ77Pointer, string?]
export type LZ77Encoded = LZ77Component[]
