import type { LZSSPointer } from './types'
import { range } from './utils'

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
export const NULL_POINTER: LZSSPointer = [0, 0]

/** LZW */
export const MAX_DICTIONARY_SIZE = 4 * KB
export const ASCII_KEYS = [...Array.from({ length: 256 }).keys()].map(index =>
	String.fromCodePoint(index)
)
export const BASE_DICTIONARY = ASCII_KEYS.join('')
export const LENGTH_ARRAY = [
	...range(3, 11).map(index => index + 254),
	...range(11, 19).map(
		index => `${Math.trunc((index - 11) / 2) + 265} ${(index - 11) % 2}`
	),
	...range(19, 35).map(
		index => `${Math.trunc((index - 19) / 4) + 269} ${(index - 19) % 4}`
	),
	...range(35, 67).map(
		index => `${Math.trunc((index - 35) / 8) + 273} ${(index - 35) % 8}`
	),
	...range(67, 131).map(
		index => `${Math.trunc((index - 67) / 16) + 277} ${(index - 67) % 16}`
	),
	...range(131, 258).map(
		index => `${Math.trunc((index - 131) / 32) + 281} ${(index - 131) % 32}`
	),
	285
]

const DISTANCE_ARRAY: (number | string)[] = [
	...range(1, 5).map(index => index - 1),
	...range(2, 13).map(index =>
		range(2 ** index + 1, 2 ** (index + 1) + 1).map(
			_index =>
				`${Math.trunc((_index - (2 ** index + 1)) / 2) + 2 * index} ${
					(_index - (2 ** index + 1)) % 2 ** (index - 1)
				}`
		)
	)
].flat()

// for (let index = 1; index < 13; index++) {
// 	DISTANCE_ARRAY = [
// 		...DISTANCE_ARRAY,
// 		...range(2 ** index + 1, 2 ** (index + 1) + 1).map(
// 			_index =>
// 				`${Math.trunc((_index - (2 ** index + 1)) / 2) + 2 * index} ${
// 					(_index - (2 ** (index + 1) + 1)) % 2 ** (index + 1)
// 				}`
// 		)
// 	]
// }

// export const DISTANCE_ARRAY = [
// 	...range(1, 5).map(index => index - 1),
// 	...range(5, 9).map(
// 		index => `${Math.trunc((index - 5) / 2) + 4} ${(index - 5) % 2}`
// 	),
// 	...range(9, 17).map(
// 		index => `${Math.trunc((index - 9) / 4) + 6} ${(index - 9) % 4}`
// 	),
// 	...range(17, 33).map(
// 		index => `${Math.trunc((index - 17) / 8) + 8} ${(index - 17) % 8}`
// 	),
// 	...range(33, 65).map(
// 		index => `${Math.trunc((index - 33) / 16) + 10} ${(index - 33) % 16}`
// 	),
// 	...range(65, 129).map(
// 		index => `${Math.trunc((index - 65) / 32) + 12} ${(index - 65) % 32}`
// 	),
// 	...range(129, 257).map(
// 		index => `${Math.trunc((index - 129) / 64) + 14} ${(index - 129) % 64}`
// 	),
// 	285
// ]
