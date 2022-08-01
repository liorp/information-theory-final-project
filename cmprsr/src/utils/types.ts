/** Basic */
/** {[symbol]: [codeword]}, e.g. {"a": 1} */
export interface Dictionary {
	string?: string
}

/** LZSS */
export type LZSSPointer = [number, number]
export type LZSSComponent = LZSSPointer | string
export type LZSSCompressed = LZSSComponent[]

/** LZW */
/** Current index, current character, current string to check, did push to dictionary */
export type LZWStage = [number, string, string, boolean]
