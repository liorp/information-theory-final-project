import {
	DEFAULT_WINDOW_SIZE,
	MAX_MATCH_LENGTH,
	MIN_MATCH_LENGTH,
	NULL_POINTER
} from './consts'
import type { LZSSCompressed } from './types'

export function compress(
	inputStream: string,
	windowSize: number = DEFAULT_WINDOW_SIZE
): LZSSCompressed {
	// Set the coding position to the MIN_MATCH_LENGTH index of the input stream
	let codingPosition = MIN_MATCH_LENGTH
	let lookAheadBuffer = inputStream.slice(codingPosition)
	let window = inputStream.slice(0, codingPosition)
	let pointer = NULL_POINTER
	let forward = 0
	let matchLength = 0
	let matchString = ''
	let matchIndex = 0

	// We put the initial window in the compressed stream since it cannot be compressed
	const compressed: LZSSCompressed = [...window]

	while (lookAheadBuffer.length > MIN_MATCH_LENGTH - 1) {
		for (
			let tentativeMatchLength = MIN_MATCH_LENGTH;
			tentativeMatchLength <= MAX_MATCH_LENGTH;
			tentativeMatchLength++
		) {
			matchString = lookAheadBuffer.slice(0, tentativeMatchLength)
			matchIndex = window.lastIndexOf(matchString)

			// Find the longest match in the window for the lookahead buffer.
			if (
				matchIndex === -1 ||
				(matchIndex > -1 && tentativeMatchLength === lookAheadBuffer.length + 1) // We have a match in the last lookAheadBuffer.
			) {
				if (tentativeMatchLength > MIN_MATCH_LENGTH) {
					// If a match is found, output the pointer P
					// NOTE: In lzss, we only consider lengths bigger than MIN_MATCH_LENGTH.
					matchLength = tentativeMatchLength - 1
					pointer = [
						matchLength,
						window.length -
							window.lastIndexOf(lookAheadBuffer.slice(0, matchLength))
					]
					compressed.push(pointer)
					forward = matchLength
				} else {
					// If a match is not found, output the first byte in the lookahead buffer.
					compressed.push(lookAheadBuffer[0])
					forward = 1
				}

				// Move forward the coding position (and the window).
				codingPosition += forward
				lookAheadBuffer = inputStream.slice(codingPosition)
				window = inputStream.slice(
					Math.max(0, codingPosition - windowSize),
					codingPosition
				)
				break
			}
		}
	}

	// Add the final part of the input stream to the compressed stream, in case it is not compressed.
	compressed.push(...lookAheadBuffer)

	return compressed
}

export function decompress(compressed: LZSSCompressed): string {
	let decompressed = ''
	for (const component of compressed) {
		if (Array.isArray(component)) {
			const [pointerLength, pointerIndex] = component
			const matchStart = decompressed.length - pointerIndex
			decompressed += decompressed.slice(matchStart, matchStart + pointerLength)
		} else {
			decompressed += component
		}
	}
	return decompressed
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest
	describe('lzss', () => {
		it('compresses and decompresses', () => {
			expect(decompress(compress('a'))).toEqual('a')
			expect(decompress(compress('AABCBBABC'))).toEqual('AABCBBABC')
			expect(decompress(compress('Hello World'))).toEqual('Hello World')
			expect(decompress(compress('Hello Hello Hello'))).toEqual(
				'Hello Hello Hello'
			)
			expect(decompress(compress('fffaa'))).toEqual('fffaa')
			expect(decompress(compress('hellofffasdf'))).toEqual('hellofffasdf')
			expect(decompress(compress('Hello H'))).toEqual('Hello H')
			expect(decompress(compress('Hello He'))).toEqual('Hello He')
			expect(decompress(compress('Hello Hel'))).toEqual('Hello Hel')
			expect(decompress(compress('Hello Hell'))).toEqual('Hello Hell')
		})
	})
}
