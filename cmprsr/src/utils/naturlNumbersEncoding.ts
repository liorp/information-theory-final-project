/* eslint-disable unicorn/prefer-code-point */
import { convertBinaryToNumber, convertNumberToBinary } from './binary'

/* Encoding a natural number with the natural numbers encoding discussed in class:
		Prefix coding for the length of the binary form of the number;
		then the length of the binary form of the number;
		and then the number itself.
*/
export function naturalNumberEncoding(number_: number): string {
	const binaryNumber = convertNumberToBinary(number_)
	const binaryNumberLengthInBinary = convertNumberToBinary(binaryNumber.length)

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
export function decodeNatrualNumberStream(string_: string): number[] {
	const naturalNumbers: number[] = []
	let currentString = string_
	let number = 0

	while (currentString.length > 0) {
		// Routinely decoding a natural number
		const firstZeroOffset = string_.indexOf('0')
		const binaryNumberOffset = 1 + 2 * firstZeroOffset
		const binaryNumberLength = convertBinaryToNumber(
			string_.slice(firstZeroOffset + 1, 2 * firstZeroOffset + 1)
		)

		number = convertBinaryToNumber(
			string_.slice(binaryNumberOffset, binaryNumberOffset + binaryNumberLength)
		)
		naturalNumbers.push(number)
		currentString = currentString.slice(binaryNumberOffset + binaryNumberLength)
	}

	return naturalNumbers
}

/* Decoding a natural number previously-encoded with the natural numbers encoding discussed in class:
		Prefix coding for the length of the binary form of the number;
		then the length of the binary form of the number;
		and then the number itself.
*/
export function naturalNumberDecoding(string_: string): number {
	return decodeNatrualNumberStream(string_)[0]
}
