/* eslint-disable unicorn/prefer-code-point */
import {
	convertBinaryToNumber,
	convertCharToBinary,
	convertNumberToBinary
} from './binary'
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
import { stringsToCheck } from './testUtils'
import type { LZSSStage } from './types'

/* Convert a character to an uncompressed format, which means:
	converting the character to binary;
	and add the uncompressedFlag in the beginning.sed
*/
function convertCharToUncompressedFormat(
	character: string,
	uncompressedFlag: string = UNCOMPRESSED_FLAG
): string {
	return uncompressedFlag + convertCharToBinary(character)
}

/* Convert a string to an uncompressed format, that is
converting each of its characters to an uncompressed format (explained above)
*/
function convertStringToUncompressedFormat(
	string_: string,
	uncompressedFlag: string = UNCOMPRESSED_FLAG
): string {
	return [...string_]
		.map(char => convertCharToUncompressedFormat(char, uncompressedFlag))
		.join('')
}

/* Convert a <length, offset> pair to a compressed format, which means:
	converting them to binary;
	concatenate the results;
	and add the compressedFlag in the beginning.sed
*/
function convertOffsetAndLengthToCompressedFormat(
	matchOffset: number,
	matchLength: number,
	compressedFlag: string = COMPRESSED_FLAG
): string {
	return (
		compressedFlag +
		convertNumberToBinary(matchOffset) +
		convertNumberToBinary(matchLength)
	)
}

/** Returns [length, offset, stages] */
function getMaximalMatchLengthAndOffset(
	window: string,
	lookAheadBuffer: string,
	codingPosition: number,
	minMatchLength: number = MIN_MATCH_LENGTH,
	maxMatchLength: number = MAX_MATCH_LENGTH,
	showStages = false
): [number, number, LZSSStage[]] {
	let maximalMatchFound = false
	let lastIndex = 0
	let maximalMatchIndex = 0
	let matchLength = 0
	let matchOffset = 0
	const stages: LZSSStage[] = []

	const currentCharacter = lookAheadBuffer[0]
	const lookAheadBufferLength = lookAheadBuffer.length
	const maxSearchLength = Math.min(maxMatchLength, lookAheadBufferLength)

	let windowToSearch = window
	let tentativeMatchLength = minMatchLength
	let currentLookAheadBufferSubString = lookAheadBuffer.slice(0, minMatchLength)

	// If a match of length MIN_MATCH_LENGTH is not found, we early return null pointer
	if (!windowToSearch.includes(currentLookAheadBufferSubString)) {
		stages.push([
			codingPosition,
			currentCharacter,
			currentLookAheadBufferSubString,
			false
		])
		return [0, 0, stages]
	}

	// Search for maximal match from lookahead buffer in the window
	while (tentativeMatchLength <= maxSearchLength && !maximalMatchFound) {
		// Get match's last index in the window
		lastIndex = windowToSearch.lastIndexOf(currentLookAheadBufferSubString)

		if (lastIndex === -1) {
			// If a match doesn't exist, the maximal match was found in the previous iteration
			maximalMatchFound = true
		} else {
			// If a match exists, we need to keep searching for a longer one
			maximalMatchIndex = lastIndex
			tentativeMatchLength++
		}

		// Take a snapshot of current stage of searching lookahead buffer substring in window
		if (showStages)
			stages.push([
				codingPosition,
				currentCharacter,
				currentLookAheadBufferSubString,
				maximalMatchFound || tentativeMatchLength - 1 === maxSearchLength
			])

		// Get current checked substring from lookahead buffer
		currentLookAheadBufferSubString = lookAheadBuffer.slice(
			0,
			tentativeMatchLength
		)

		// We only need to search the part of the window near the last index found
		windowToSearch = windowToSearch.slice(0, lastIndex + lookAheadBufferLength)
	}

	matchLength = tentativeMatchLength - 1
	matchOffset = window.length - maximalMatchIndex

	return [matchLength, matchOffset, stages]
}

/* If a match is found in the window, compression result is:
			the COMPRESSED flag;
			the match's offset;
			and match's length relative to the end of the window.
		Otherwise, a match is not found in the window (or its size is insufficient); in this case, compression result is:
			the UNCOMPRESSED flag;
			and the current character we process.
	*/
function getCurrentCompressionOutput(
	matchLength: number,
	matchOffset: number,
	currentCharacter: string
): string {
	// Get the relevant compression output based on the length of the match (if it's positive, a match was found)
	return matchLength === 0
		? convertCharToUncompressedFormat(currentCharacter)
		: convertOffsetAndLengthToCompressedFormat(matchOffset, matchLength)
}

// TODO: Check stages
// Compress a given inputStream into a binary form
export function compress(
	inputStream: string,
	showStages = false,
	minMatchLength: number = MIN_MATCH_LENGTH,
	maxMatchLength: number = MAX_MATCH_LENGTH,
	windowSize: number = DEFAULT_WINDOW_SIZE
): { compressed: string; stages: LZSSStage[] } {
	const inputLength = inputStream.length
	const uncompressedStringBeginning = inputStream.slice(0, minMatchLength)
	const stages: LZSSStage[] = []
	let stagesToAppend: LZSSStage[] = []

	// Set the coding position, the window and the lookahead buffer according to the minimal length we allow for a match
	let codingPosition: number = minMatchLength
	let windowStart: number = Math.max(0, minMatchLength - windowSize)
	let windowEnd: number = minMatchLength
	let window: string = inputStream.slice(windowStart, windowEnd)
	let lookAheadBuffer: string = inputStream.slice(minMatchLength)

	let matchLength = 0
	let matchOffset = 0

	// First minMatchLength cannot be compressed and thus put as is in compressed outcome (with the UNCOMPRESSED FLAG)
	let compressed: string = convertStringToUncompressedFormat(
		uncompressedStringBeginning
	)

	// Push the initial stage
	if (showStages)
		stages.push([0, inputStream[0], uncompressedStringBeginning, false])

	// Iterate lookahead buffer until it gets too small
	while (lookAheadBuffer.length >= minMatchLength) {
		// Find the longest match in the window for the lookahead buffer
		;[matchLength, matchOffset, stagesToAppend] =
			getMaximalMatchLengthAndOffset(
				window,
				lookAheadBuffer,
				codingPosition,
				minMatchLength,
				maxMatchLength,
				showStages
			)

		// Append current compression output
		compressed += getCurrentCompressionOutput(
			matchLength,
			matchOffset,
			lookAheadBuffer[0]
		)

		// If no match is found in the window, only current character is considered and hence the match's length should be 1
		if (matchLength === 0) {
			matchLength = 1
		}

		// Increase the coding position by the length of the found match and decrease the lookahead buffer accordingly
		codingPosition += matchLength
		lookAheadBuffer = inputStream.slice(codingPosition)

		// Increase the window so it includes all previously processed input data
		windowStart = Math.max(0, codingPosition - windowSize)
		windowEnd = Math.min(codingPosition, inputLength)
		window = inputStream.slice(windowStart, windowEnd)

		// Push the stages showing the search for a match from the lookahead buffer in the window
		if (showStages) stages.push(...stagesToAppend)
	}

	// Add the remainder of the input stream as is, since it is too short to be compressed
	compressed += convertStringToUncompressedFormat(lookAheadBuffer)

	// Push the final stage
	if (showStages && lookAheadBuffer.length > 0)
		stages.push([
			codingPosition,
			lookAheadBuffer[0],
			lookAheadBuffer.slice(0, minMatchLength),
			false
		])

	return { compressed, stages }
}

// Decompress a binary previously-compressed text into the original data
export function decompress(compressed: string): string {
	let decompressed = ''
	let compressionFlag = ''
	let index = 0

	let matchOffsetStart = 0
	let matchOffsetEnd = 0
	let matchLengthStart = 0
	let matchLengthEnd = 0
	let charStart = 0
	let charEnd = 0

	let charInBinary = ''
	let match = ''
	let matchStart = 0
	let matchLength = 0
	let matchOffset = 0

	// Iterate compressed input and parse it
	while (index < compressed.length) {
		// Obtain the flag which indicates if the following bits are a comperssion outcome or the original uncompressed bits
		compressionFlag = compressed[index]

		// If data after flag is compressed, extract offset and length of repeated data and append it to output
		if (compressionFlag === COMPRESSED_FLAG) {
			// Obtain the first and last indices of the match's offset
			matchOffsetStart = index + 1
			matchOffsetEnd = matchOffsetStart + INT_BITS_AMOUNT

			// Obtain the first and last indices of the match's length
			matchLengthStart = matchOffsetEnd + 1
			matchLengthEnd = matchLengthStart + INT_BITS_AMOUNT

			// Extract match's offset
			matchOffset = convertBinaryToNumber(
				compressed.slice(matchOffsetStart, matchOffsetEnd)
			)

			// Extract match's length
			matchLength = convertBinaryToNumber(
				compressed.slice(matchLengthStart, matchLengthEnd)
			)

			// Find appropriate match in previous bits
			matchStart = decompressed.length - matchOffset
			match = decompressed.slice(matchStart, matchStart + matchLength)

			index += COMPRESSED_INDEX_ADDITION
		}

		// If data after flag is uncompressed, extract character and append it to output
		else {
			// Obtain the first and last indices of the character
			charStart = index + 1
			charEnd = charStart + INT_BITS_AMOUNT

			// Extract character
			charInBinary = compressed.slice(charStart, charEnd)
			match = String.fromCharCode(convertBinaryToNumber(charInBinary))

			index += UNCOMPRESSED_INDEX_ADDITION
		}
		// Update output with the found match
		decompressed += match
	}

	return decompressed
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest
	describe('lzss', () => {
		it('should getMaximalMatchLengthAndOffset', () => {
			expect(getMaximalMatchLengthAndOffset('Hello World', 'Hello', 0)).toEqual(
				[5, 11, []]
			)
			expect(
				getMaximalMatchLengthAndOffset('Hello World', 'Hello Hello Hello', 0)
			).toEqual([6, 11, []])
			expect(getMaximalMatchLengthAndOffset('abcdef', 'cde', 0)).toEqual([
				3,
				4,
				[]
			])
			expect(getMaximalMatchLengthAndOffset('abcdef', 'cdee', 0)).toEqual([
				3,
				4,
				[]
			])
			expect(getMaximalMatchLengthAndOffset('abcdef', 'acd', 0)).toEqual([
				0,
				0,
				[]
			])
		})
		it('compresses and decompresses', () => {
			for (const string of stringsToCheck) {
				const { compressed } = compress(string)
				const decompressed = decompress(compressed)
				expect(decompressed).toEqual(string)
			}
		})
	})
}
