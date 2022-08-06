/* eslint-disable unicorn/prefer-code-point */
import { INT_BITS_AMOUNT } from './consts'

// Convert a number to a binary form with a minimal length (padding the result with zeros if needed)
export function convertNumberToBinary(
	number_: number,
	minimalBinaryLength: number = INT_BITS_AMOUNT
): string {
	const binaryString = number_.toString(2)
	const binaryLength = binaryString.length

	// Determine if padding is needed
	if (minimalBinaryLength < binaryLength) return binaryString

	return '0'.repeat(minimalBinaryLength - binaryLength) + binaryString
}

// Convert a binary string representing a number into a number
export function convertBinaryToNumber(binaryString: string): number {
	return Number.parseInt(binaryString, 2)
}

// Convert a character into its ascii value in binary form
export function convertCharToBinary(character: string): string {
	return convertNumberToBinary(character.charCodeAt(0))
}

// Convert a binary number representing the ascii value of a character, into that character
export function convertBinaryToChar(binaryString: string): string {
	return String.fromCharCode(convertBinaryToNumber(binaryString))
}
