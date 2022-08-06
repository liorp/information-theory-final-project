/* eslint-disable unicorn/prefer-code-point */
import { convertBinaryToNumber, convertNumberToBinary } from './binary'

/* Encoding a natural number with the natural numbers encoding discussed in class:
		Prefix coding for the length of the binary form of the number;
		then the length of the binary form of the number;
		and then the number itself.
*/
export function naturalNumberEncoding(number_: number): string {
	const binaryNumber = convertNumberToBinary(number_, 0)
	const binaryNumberLengthInBinary = convertNumberToBinary(
		binaryNumber.length,
		0
	)

	return (
		`${'1'.repeat(binaryNumberLengthInBinary.length)}` +
		`0${binaryNumberLengthInBinary}${binaryNumber}`
	)
}

/* Decoding a stream of natural numbers which were priviously encoded using the encoding of natural numbers discussed in class:
		Prefix coding for the length of the binary form of the number;
		then the length of the binary form of the number;
		and then the number itself.
*/
export function decodeNaturalNumberStream(string_: string): number[] {
	const naturalNumbers: number[] = []
	let stringToDecode = string_
	let firstZeroOffset = 0
	let binaryNumberOffset = 0
	let binaryNumberLength = 0
	let number = 0

	// Routinely decoding a natural number
	while (stringToDecode.length > 0) {
		firstZeroOffset = stringToDecode.indexOf('0')
		binaryNumberOffset = 1 + 2 * firstZeroOffset
		binaryNumberLength = convertBinaryToNumber(
			stringToDecode.slice(firstZeroOffset + 1, binaryNumberOffset)
		)

		// Extract number from binary and push it
		number = convertBinaryToNumber(
			stringToDecode.slice(
				binaryNumberOffset,
				binaryNumberOffset + binaryNumberLength
			)
		)
		naturalNumbers.push(number)

		// Decrease decoded string by appropriate amount
		stringToDecode = stringToDecode.slice(
			binaryNumberOffset + binaryNumberLength
		)
	}

	return naturalNumbers
}

/* Decoding a natural number previously-encoded with the natural numbers encoding discussed in class:
		Prefix coding for the length of the binary form of the number;
		then the length of the binary form of the number;
		and then the number itself.
*/
export function naturalNumberDecoding(string_: string): number {
	return decodeNaturalNumberStream(string_)[0]
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest
	describe('natural numbers encoding', () => {
		it('encodes and decodes natural number', () => {
			expect(naturalNumberDecoding(naturalNumberEncoding(0))).toEqual(0)
			expect(naturalNumberDecoding(naturalNumberEncoding(1))).toEqual(1)
			expect(naturalNumberDecoding(naturalNumberEncoding(2))).toEqual(2)
			expect(naturalNumberDecoding(naturalNumberEncoding(6))).toEqual(6)
			expect(naturalNumberDecoding(naturalNumberEncoding(125))).toEqual(125)
			expect(naturalNumberDecoding(naturalNumberEncoding(256))).toEqual(256)
			expect(
				decodeNaturalNumberStream(
					[1, 2, 3, 4, 5].map(v => naturalNumberEncoding(v)).join('')
				)
			).toEqual([1, 2, 3, 4, 5])
			expect(
				decodeNaturalNumberStream(
					[256, 100, 2000].map(v => naturalNumberEncoding(v)).join('')
				)
			).toEqual([256, 100, 2000])
		})
	})
}
