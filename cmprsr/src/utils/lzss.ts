import {
	COMPRESSED_FLAG,
	DEFAULT_WINDOW_SIZE,
	INT_BITS_AMOUNT,
	MAX_MATCH_LENGTH,
	MIN_MATCH_LENGTH,
	UNCOMPRESSED_FLAG
} from './consts'
import type { LZSSStage } from './types'

function getBinaryForm(
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
): [string, string[], LZSSStage[]] {
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

	// First MIN_MATCH_LENGTH cannot be compressed and put as is in compressed outcome
	let compressed = inputStream.slice(0, MIN_MATCH_LENGTH)
	const compressedArray = [...compressed]

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
			compressed +=
				UNCOMPRESSED_FLAG + getBinaryForm(currentCharacter.charCodeAt(0))
			compressedArray.push(UNCOMPRESSED_FLAG, currentCharacter)
		}
		// If a match is found in the window, append to output the COMPRESSED flag and the match's offset and length relative to the end of the windowes
		else {
			matchLength = tentativeMatchLength - 1
			matchString = lookAheadBuffer.slice(0, matchLength)
			matchOffset = windowSize - window.lastIndexOf(matchString)

			compressed +=
				COMPRESSED_FLAG +
				getBinaryForm(matchOffset) +
				getBinaryForm(matchLength)

			compressedArray.push(
				COMPRESSED_FLAG,
				matchOffset.toString(),
				matchLength.toString()
			)
		}

		// Increase the coding position (and the window) and decrease lookaheadbuffer according to the length of the match
		codingPosition += matchLength
		effectiveWindowSize = Math.max(0, codingPosition - windowSize)
		window = inputStream.slice(effectiveWindowSize, codingPosition)
		lookAheadBuffer = inputStream.slice(codingPosition)
	}

	// Add the final part of the input stream to the compressed stream, in case it is not compressed.
	compressed += lookAheadBuffer
	compressedArray.push(...lookAheadBuffer)

	return [compressed, compressedArray, stages]
}

// TODO: Get rid of compressed array
// TODO: Add stages
export function decompress(
	compressed: string,
): string {
	let decompressed = ''
	let index = 0
	let flag = ''
	let matchLength = 0
	let matchOffset = 0

	while (index < compressed.length) {
		// Obtain the flag which indicates if the following bits are a comperssion outcome or the original uncompressed bits
		flag = compressed.charAt(index)

		// If data after flag is compressed, extract offset and length of repeated data and append it to output
		if (flag === COMPRESSED_FLAG) {
			matchOffset = Number.parseInt(
				compressed.slice(index + 1, index + INT_BITS_AMOUNT - 1),
				2
			)
			matchLength = Number.parseInt(
				compressed.slice(
					index + 1 + INT_BITS_AMOUNT,
					index + 2 * INT_BITS_AMOUNT
				),
				2
			)
			index += 2 * INT_BITS_AMOUNT + 1 // check this...

			output += dictionary.substr(dictionary.length - offset, matchLength)
			dictionary =
				dictionary.slice(matchLength) +
				decompressed.substr(output.length - matchLength, matchLength)
		}
		// If data after flag is uncompressed, extract character and append it to output
		else {
			decompressed += compress.charAt(codingPosition + 1)
			dictionary = dictionary.slice(1) + decompressed.slice(-1)
			codingPosition += 2
		}

		index++
	}

	return decompressed
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest
	describe('lzss', () => {
		it('compresses and decompresses', () => {
			expect(decompress(compress('a')[0])).toEqual('a')
			expect(decompress(compress('AABCBBABC')[0])).toEqual('AABCBBABC')
			expect(decompress(compress('Hello World')[0])).toEqual('Hello World')
			expect(decompress(compress('Hello Hello Hello')[0])).toEqual(
				'Hello Hello Hello'
			)
			expect(decompress(compress('fffaa')[0])).toEqual('fffaa')
			expect(decompress(compress('hellofffasdf')[0])).toEqual('hellofffasdf')
			expect(decompress(compress('Hello H')[0])).toEqual('Hello H')
			expect(decompress(compress('Hello He')[0])).toEqual('Hello He')
			expect(decompress(compress('Hello Hel')[0])).toEqual('Hello Hel')
			expect(decompress(compress('Hello Hell')[0])).toEqual('Hello Hell')
		})
	})
}
