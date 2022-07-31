/* eslint-disable import/prefer-default-export */
import { DEFAULT_WINDOW_SIZE } from './consts'

const MIN_LITERAL_VALUE = 0
const MAX_LITERAL_VALUE = 255
const MIN_LENGTH_VALUE = 257
const MAX_LENGTH_VALUE = 285
const MIN_LITERAL_VALUE = 0
const MAX_LITERAL_VALUE = 29
const END_OF_BLOCK_CODE = MAX_LITERAL_VALUE + 1

const LITERALS_ENCODING = []
const LENGTHS_ENCODING = []
const DISTANCES_ENCODING = []

// Create literal encoding dictionary
for (let index = MIN_LITERAL_VALUE; index <= MAX_LITERAL_VALUE; index++) {
	LITERALS_ENCODING.push(String.fromCharCode(index))
}

export function encode(
	inputStream: string,
	windowSize: number = DEFAULT_WINDOW_SIZE
): string {
	const encodedText = []
	// TODO: complete this shit.
}
