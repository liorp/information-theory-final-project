/** Basic */
export const BIT = 1
export const BYTE = 8 * BIT
export const KB = 1024 * BYTE
export const MB = 1024 * KB

/** LZSS */
export const DEFAULT_WINDOW_SIZE = 32 * KB
/** These values are inclusive */
export const MAX_MATCH_LENGTH = 258
export const MIN_MATCH_LENGTH = 3
export const COMPRESSED_FLAG = '0'
export const UNCOMPRESSED_FLAG = '1'
export const INT_BITS_AMOUNT = 8
export const COMPRESSED_INDEX_ADDITION = 1 + 2 * INT_BITS_AMOUNT
export const UNCOMPRESSED_INDEX_ADDITION = 1 + INT_BITS_AMOUNT

/** LZW */
export const MAX_DICTIONARY_SIZE = 4 * KB
export const ASCII_KEYS = [...Array.from({ length: 256 }).keys()].map(index =>
	String.fromCodePoint(index)
)
export const BASE_DICTIONARY = ASCII_KEYS.join('')

export enum InputMode {
	File,
	Text
}
export const MAX_TEXT_LENGTH_FOR_STAGES = 20

export enum CompressionType {
	LZSS = 'LZSS',
	LZW = 'LZW',
	Huffman = 'Huffman'
}

export enum CompressionAction {
	Compress = 'Compress',
	Decompress = 'Decompress'
}
