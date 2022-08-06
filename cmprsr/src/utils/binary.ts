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
