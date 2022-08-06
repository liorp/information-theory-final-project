/* eslint-disable unicorn/prefer-code-point */
import { INT_BITS_AMOUNT } from './consts'

export function convertNumberToBinary(
	number_: number,
	zerosNumber: number = INT_BITS_AMOUNT
): string {
	const binaryString = number_.toString(2)
	return '0'.repeat(zerosNumber - binaryString.length) + binaryString
}

export function convertBinaryToNumber(binaryString: string): number {
	return Number.parseInt(binaryString, 2)
}

export function convertCharToBinary(character: string): string {
	return convertNumberToBinary(character.charCodeAt(0))
}

export function convertBinaryToChar(binaryString: string): string {
	return String.fromCharCode(convertBinaryToNumber(binaryString))
}
