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

function getUncompressedString(
	string_: string,
	uncompressed_flag: string = UNCOMPRESSED_FLAG
): string {
	return [...string_]
		.map(char => uncompressed_flag + getNumberBinaryForm(char.charCodeAt(0)))
		.join('')
}

function getMaximalMatchLengthAndOffset(
	window: string,
	lookAheadBuffer: string,
	minMatchLength: number = MIN_MATCH_LENGTH,
	maxMatchLength: number = MAX_MATCH_LENGTH,
	windowSize: number = DEFAULT_WINDOW_SIZE
): [number, number, LZSSStage[]] {
	let maximalMatchFound = false
	let lastIndex = 0
	let matchLength = 0
	let matchOffset = 0
	const stages: LZSSStage[] = []

	const codingPosition = window.length
	const currentCharacter = lookAheadBuffer[0]

	let windowToSearch = window
	let tentativeMatchLength = minMatchLength
	let currentLookAheadBufferSubString = lookAheadBuffer.slice(
		0,
		MIN_MATCH_LENGTH
	)

	// Search for maximal match from lookahead buffer in the window	
	while (tentativeMatchLength <= maxMatchLength && !maximalMatchFound) {
		// Get match's last index in the window
		lastIndex = window.lastIndexOf(currentLookAheadBufferSubString)

		// If a match doesn't exist, the maximal match was found in the previous iteration
		if (lastIndex === -1) {
			maximalMatchFound = true
		// If a match exists, we need to keep searching for a longer one
		} else {
			tentativeMatchLength++
		}

		// Take a snapshot of current stage of searching lookahead buffer substring in window
		stages.push([
			codingPosition,
			currentCharacter,
			currentLookAheadBufferSubString,
			maximalMatchFound
		])

		// Get current checked substring from lookahead buffer
		currentLookAheadBufferSubString = lookAheadBuffer.slice(
			0,
			tentativeMatchLength
		)

		// We only need to search the part of the window near the last index found
		window = window.slice(0, lastIndex + tentativeMatchLength)
	}

	matchLength = tentativeMatchLength - 1
	matchOffset = windowSize - lastIndex

	return [matchLength, matchOffset, stages]
}

// TODO: Check stages
export function compress(
	inputStream: string,
	windowSize: number = DEFAULT_WINDOW_SIZE
): { compressed: string; stages: LZSSStage[] } {
	let stages: LZSSStage[] = []
	const initialWindowStart: number = Math.max(0, MIN_MATCH_LENGTH - windowSize)

	// Set the coding position to the minimal length we allow for a match in the window
	let codingPosition: number = MIN_MATCH_LENGTH
	let effectiveWindowSize: number = initialWindowStart
	let window: string = inputStream.slice(effectiveWindowSize, codingPosition)
	let lookAheadBuffer: string = inputStream.slice(codingPosition)
	let currentCharacter = ''

	let lastIndex = 0
	let matchLength = 0
	let matchOffset = 0

	// First MIN_MATCH_LENGTH cannot be compressed and put as is in compressed outcome (with the UNCOMPRESSED FLAG)
	let compressed: string = getUncompressedString(
		inputStream.slice(0, MIN_MATCH_LENGTH)
	)
	let outputAddition = ''

	while (lookAheadBuffer.length >= MIN_MATCH_LENGTH) {
		// If a match is found in the window, append to output:
		// the COMPRESSED flag;
		// the match's offset;
		// and match's length relative to the end of the window
		lastIndex = window.lastIndexOf(lookAheadBuffer.slice(0, MIN_MATCH_LENGTH))
		if (lastIndex !== -1) {
			// Find the longest match in the window for the lookahead buffer
			;[matchLength, matchOffset, stages] = getMaximalMatchLengthAndOffset(
				window,
				lookAheadBuffer
			)

			outputAddition =
				COMPRESSED_FLAG +
				getNumberBinaryForm(matchOffset) +
				getNumberBinaryForm(matchLength)

			// If no match is found in the window, append to output the UNCOMPRESSED flag and the character in current position
		} else {
			matchLength = 1
			currentCharacter = lookAheadBuffer.charAt(0)

			outputAddition =
				UNCOMPRESSED_FLAG + getNumberBinaryForm(currentCharacter.charCodeAt(0))

			stages.push([codingPosition, currentCharacter, currentCharacter, true])
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
	compressed += getUncompressedString(lookAheadBuffer)

	return { compressed, stages }
}

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
			match = String.fromCharCode(Number.parseInt(charInBinary, 2))

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
