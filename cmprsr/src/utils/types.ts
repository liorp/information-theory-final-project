/** Basic */
/** {[symbol]: [codeword]}, e.g. {"a": 1} */
export interface Dictionary {
	string?: string
}

/** LZSS */
export type LZSSPointer = [number, number]
export type LZSSComponent = LZSSPointer | string
export type LZSSCompressed = LZSSComponent[]
