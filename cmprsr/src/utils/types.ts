/** Basic */
/** {[symbol]: [codeword]}, e.g. {"a": 1} */
export interface Dictionary {
	string?: string
}

/** LZSS */
/** Current index, current character, current string to check from lookAheadBuffer, did find what to add */
export type LZSSStage = [number, string, string, boolean]

/** LZW */
/** Current index, current character, current string to check, did push to dictionary */
export type LZWStage = [number, string, string, boolean]
