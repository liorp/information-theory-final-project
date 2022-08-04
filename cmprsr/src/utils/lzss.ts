import {
	COMPRESSED_FLAG,
	COMPRESSED_INDEX_ADDITION,
	DEFAULT_WINDOW_SIZE,
	INT_BITS_AMOUNT,
	MAX_MATCH_LENGTH,
	MIN_MATCH_LENGTH,
	UNCOMPRESSED_FLAG,
	UNCOMPRESSED_INDEX_ADDITION
} from './consts'
import type { LZSSStage } from './types'

function getNumberBinaryForm(
	number_: number,
	zerosNumber: number = INT_BITS_AMOUNT
): string {
	const binaryString = number_.toString(2)
	return '0'.repeat(zerosNumber - binaryString.length) + binaryString
}

// TODO: Check stages
export function compress(
	inputStream: string,
	windowSize: number = DEFAULT_WINDOW_SIZE
): { compressed: string; stages: LZSSStage[] } {
	const stages: LZSSStage[] = []
	const initialWindowStart = Math.max(0, MIN_MATCH_LENGTH - windowSize)

	// Set the coding position to the minimal length we allow for a match in the window
	let codingPosition = MIN_MATCH_LENGTH
	let effectiveWindowSize = initialWindowStart
	let window = inputStream.slice(effectiveWindowSize, codingPosition)
	let lookAheadBuffer = inputStream.slice(codingPosition)
	let currentLookAheadBufferSubString = ''
	let currentCharacter = ''

	let matchFound = false
	let tentativeMatchLength = 0
	let matchLength = 0
	let matchOffset = 0
	let matchString = ''

	// First MIN_MATCH_LENGTH cannot be compressed and put as is in compressed outcome (with the UNCOMPRESSED FLAG)
	let compressed = [...inputStream.slice(0, MIN_MATCH_LENGTH)]
		.map(char => UNCOMPRESSED_FLAG + getNumberBinaryForm(char.charCodeAt(0)))
		.join('')
	let outputAddition = ''

	while (lookAheadBuffer.length >= MIN_MATCH_LENGTH) {
		currentCharacter = lookAheadBuffer.charAt(0)
		tentativeMatchLength = MIN_MATCH_LENGTH
		currentLookAheadBufferSubString = lookAheadBuffer.slice(
			0,
			tentativeMatchLength
		)

		// Find the longest match in the window for the lookahead buffer.
		while (tentativeMatchLength <= MAX_MATCH_LENGTH && !matchFound) {
			if (window.includes(currentLookAheadBufferSubString)) {
				matchFound = true
			}

			// Take a snapshot of current stage of searching lookahead buffer substrimng in window
			stages.push([
				codingPosition,
				currentCharacter,
				currentLookAheadBufferSubString,
				matchFound
			])

			currentLookAheadBufferSubString = lookAheadBuffer.slice(
				0,
				tentativeMatchLength
			)
			tentativeMatchLength++
		}

		// If no match is found in the window, append to output the UNCOMPRESSED flag and the character in current position
		if (!matchFound) {
			matchLength = 1
			outputAddition =
				UNCOMPRESSED_FLAG + getNumberBinaryForm(currentCharacter.charCodeAt(0))
		}
		// If a match is found in the window, append to output the COMPRESSED flag and the match's offset and length relative to the end of the windowes
		else {
			matchLength = tentativeMatchLength - 1
			matchString = lookAheadBuffer.slice(0, matchLength)
			matchOffset = windowSize - window.lastIndexOf(matchString)

			outputAddition =
				COMPRESSED_FLAG +
				getNumberBinaryForm(matchOffset) +
				getNumberBinaryForm(matchLength)
		}

		// Increase the coding position (and the window) and decrease lookaheadbuffer according to the length of the match
		codingPosition += matchLength
		effectiveWindowSize = Math.max(0, codingPosition - windowSize)
		window = inputStream.slice(effectiveWindowSize, codingPosition)
		lookAheadBuffer = inputStream.slice(codingPosition)

		// Update compression output
		compressed += outputAddition
	}

	// Add the final part of the input stream to the compressed stream, in case it is not compressed.
	compressed += lookAheadBuffer

	return { compressed, stages }
}

// TODO: Get rid of compressed array
// TODO: Add stages
export function decompress(compressed: string): string {
	let decompressed = ''
	let compressionFlag = ''
	let index = 0
	let indexAddition = 0

	let matchOffsetStart = 0
	let matchOffsetEnd = 0
	let matchLengthStart = 0
	let matchLengthEnd = 0
	let charStart = 0
	let charEnd = 0

	let charInBinary = ''
	let match = ''
	let matchStart = 0
	let matchEnd = 0
	let matchLength = 0
	let matchOffset = 0

	// Iterate compressed input and parse it
	while (index < compressed.length) {
		// Obtain the flag which indicates if the following bits are a comperssion outcome or the original uncompressed bits
		compressionFlag = compressed.charAt(index)

		// If data after flag is compressed, extract offset and length of repeated data and append it to output
		if (compressionFlag === COMPRESSED_FLAG) {
			// Obtain the first and last indices of the match's offset
			matchOffsetStart = index + 1
			matchOffsetEnd = matchOffsetStart + INT_BITS_AMOUNT

			// Obtain the first and last indices of the match's length		
			matchLengthStart = index + 1 + INT_BITS_AMOUNT
			matchLengthEnd = matchLengthStart + INT_BITS_AMOUNT

			// Extract match's offset
			matchOffset = Number.parseInt(
				compressed.slice(matchOffsetStart, matchOffsetEnd),
				2
			)

			// Extract match's length
			matchLength = Number.parseInt(
				compressed.slice(matchLengthStart, matchLengthEnd),
				2
			)

			// Find appropriate match in previous bits
			matchStart = index - matchOffset * INT_BITS_AMOUNT
			matchEnd = matchStart + matchLength
			match = compressed.slice(matchStart, matchEnd)

			// Calculate addition to index
			indexAddition = COMPRESSED_INDEX_ADDITION
		}

		// If data after flag is uncompressed, extract character and append it to output
		else {
			// Obtain the first and last indices of the character
			charStart = index + 1
			charEnd = charStart + INT_BITS_AMOUNT

			// Extract character
			charInBinary = compressed.slice(charStart, charEnd)
			match = String.fromCharCode(
				Number.parseInt(
					charInBinary,
					2
				)
			)

			// Calculate addition to index
			indexAddition = UNCOMPRESSED_INDEX_ADDITION
		}

		// Increase index by appropriate amount
		index += indexAddition

		// Update output with the found match
		decompressed += match
	}

	return decompressed
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest
	describe('lzss', () => {
		it('compresses and decompresses', () => {
			expect(decompress(compress('a').compressed)).toEqual('a')
			expect(decompress(compress('AABCBBABC').compressed)).toEqual('AABCBBABC')
			expect(decompress(compress('Hello World').compressed)).toEqual(
				'Hello World'
			)
			expect(decompress(compress('Hello Hello Hello').compressed)).toEqual(
				'Hello Hello Hello'
			)
			expect(decompress(compress('fffaa').compressed)).toEqual('fffaa')
			expect(decompress(compress('hellofffasdf').compressed)).toEqual(
				'hellofffasdf'
			)
			expect(decompress(compress('Hello H').compressed)).toEqual('Hello H')
			expect(decompress(compress('Hello He').compressed)).toEqual('Hello He')
			expect(decompress(compress('Hello Hel').compressed)).toEqual('Hello Hel')
			expect(decompress(compress('Hello Hell').compressed)).toEqual(
				'Hello Hell'
			)
		})
	})
}
