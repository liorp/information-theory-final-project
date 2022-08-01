import { DEFAULT_WINDOW_SIZE, MAX_MATCH_LENGTH, NULL_POINTER } from './consts'
import type { LZSSCompressed } from './types'

export function compress(
	inputStream: string,
	windowSize: number = DEFAULT_WINDOW_SIZE
): LZSSCompressed {
	// Set the coding position to the beginning of the input stream
	let codingPosition = 0
	let lookAheadBuffer = inputStream.slice(codingPosition)
	let window = ''
	let pointer = NULL_POINTER
	let forward = 0
	const compressed: LZSSCompressed = []

	while (lookAheadBuffer.length > 0) {
		for (let matchLength = 2; matchLength <= MAX_MATCH_LENGTH; matchLength++) {
			const matchString = lookAheadBuffer.slice(0, matchLength + 1)
			const matchIndex = window.lastIndexOf(matchString)

			// Find the longest match in the window for the lookahead buffer
			if (matchIndex === -1 || matchLength === lookAheadBuffer.length) {
				if (matchLength > 2) {
					// If a match is found, output the pointer P, move forward the coding position (and the window).
					// NOTE: In lzss, we only consider lengths bigger than 3
					pointer = [
						matchLength,
						window.length -
							window.lastIndexOf(lookAheadBuffer.slice(0, matchLength))
					]
					compressed.push(pointer)
					forward = matchLength
				} else {
					// If a match is not found, output the first byte in the lookahead buffer. Move the coding position (and the window) forward.
					compressed.push(lookAheadBuffer[0])
					forward = 1
				}
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
			expect(decompress(compress('AABCBBABC'))).toEqual('AABCBBABC')
			expect(decompress(compress('Hello World'))).toEqual('Hello World')
			expect(decompress(compress('Hello Hello Hello'))).toEqual(
				'Hello Hello Hello'
			)
			// TODO: FIX THE COMPRESSION
			expect(compress('fffaa')).toEqual('fffaa')
			// expect(decompress(compress('hellofffasdf'))).toEqual('hellofffasdf')
			// expect(decompress(compress('Hello H'))).toEqual('Hello H')
			// expect(decompress(compress('Hello He'))).toEqual('Hello He')
			// expect(decompress(compress('Hello Hel'))).toEqual('Hello Hel')
			// expect(decompress(compress('Hello Hell'))).toEqual('Hello Hell')
		})
	})
}
