/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-plusplus */

type Pointer = [number, number]
type LZ77Component = [Pointer, string?]
type LZ77Encoded = LZ77Component[]

const BIT = 1
const BYTE = 8 * BIT
const DEFAULT_WINDOW_SIZE = 8
const NULL_POINTER: Pointer = [0, 0]

export function encode(
	inputStream: string,
	windowSize: number = DEFAULT_WINDOW_SIZE
): LZ77Encoded {
	// Set the coding position to the beginning of the input stream
	let codingPosition = 0
	let lookAheadBuffer = inputStream.slice(codingPosition)
	let window = ''
	let pointer = NULL_POINTER
	const encodedText: LZ77Encoded = []

	while (lookAheadBuffer.length > 0) {
		for (
			let matchLength = 0;
			matchLength <= lookAheadBuffer.length;
			matchLength++
		) {
			const matchString = lookAheadBuffer.slice(0, matchLength + 1)
			const matchIndex = window.lastIndexOf(matchString)

			// Find the longest match in the window for the lookahead buffer
			if (matchIndex === -1 || matchLength === lookAheadBuffer.length) {
				if (matchLength > 0) {
					// If a match is found, output the pointer P, move the coding position (and the window) L bytes forward.
					pointer = [
						window.length -
							window.lastIndexOf(lookAheadBuffer.slice(0, matchLength)),
						matchLength
					]
					encodedText.push([pointer])
				} else {
					// If a match is not found, output a null pointer and the first byte in the lookahead buffer. Move the coding position (and the window) one byte forward.
					pointer = NULL_POINTER
					encodedText.push([pointer, lookAheadBuffer[0]])
				}
				codingPosition += Math.max(1, matchLength)
				lookAheadBuffer = inputStream.slice(codingPosition)
				window = inputStream.slice(
					Math.max(0, codingPosition - windowSize),
					codingPosition
				)
				break
				// TODO: Add an option for negative pointers
			}
		}
	}
	return encodedText
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest
	it('encode', () => {
		expect(encode('AABCBBABC')).toEqual([
			[[0, 0], 'A'],
			[[1, 1]],
			[[0, 0], 'B'],
			[[0, 0], 'C'],
			[[2, 1]],
			[[1, 1]],
			[[5, 3]]
		])
	})
}

export function decode(encodedText: LZ77Encoded): string {
	let decodedText = ''
	for (const [pointer, character] of encodedText) {
		const [pointerIndex, pointerLength] = pointer
		const matchStart = decodedText.length - pointerIndex
		decodedText +=
			character ?? decodedText.slice(matchStart, matchStart + pointerLength)
	}
	return decodedText
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest
	it('decode', () => {
		expect(
			decode([
				[[0, 0], 'A'],
				[[1, 1]],
				[[0, 0], 'B'],
				[[0, 0], 'C'],
				[[2, 1]],
				[[1, 1]],
				[[5, 3]]
			])
		).toEqual('AABCBBABC')
	})
}
