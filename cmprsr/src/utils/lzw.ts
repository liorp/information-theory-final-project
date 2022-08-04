import { transformArrayToObject } from 'utils/utils'
import { BASE_DICTIONARY, KB } from './consts'
import type { Dictionary, LZWStage } from './types'

function naturalNumberEncoding(number_: number): string {
	// Representing a natural number with the encoding of natural numbers discussed in class:
	// Prefix coding for the length of the binary form of the number, then the length of the binary form of the number, then the number itself
	const numberBinRepr = number_.toString(2)
	const numberBinReprLength = numberBinRepr.length
	const binReprLengthBinRepr = numberBinReprLength.toString(2)
	const binReprLengthBinReprLength = binReprLengthBinRepr.length

	return (
		`${'1'.repeat(binReprLengthBinReprLength)}` +
		`0${binReprLengthBinRepr}${numberBinRepr}`
	)
}

function naturalNumberDecoding(string_: string): number {
	// Decoding a natural number from the encoding of natural numbers discussed in class:
	// Prefix coding for the length of the binary form of the number, then the length of the binary form of the number, then the number itself
	const firstZeroIndex = string_.indexOf('0')
	const binReprLengthBinReprLength = firstZeroIndex
	const binReprLengthBinRepr = Number.parseInt(
		string_.slice(
			firstZeroIndex + 1,
			firstZeroIndex + 1 + binReprLengthBinReprLength
		),
		2
	)
	const binRepr = string_.slice(
		firstZeroIndex + 1 + binReprLengthBinReprLength,
		firstZeroIndex + 1 + binReprLengthBinReprLength + binReprLengthBinRepr
	)
	const number = Number.parseInt(binRepr, 2)

	return number
}

function decodeNatrualNumberStream(string_: string): number[] {
	// Decoding a stream of natural numbers from the encoding of natural numbers discussed in class:
	// Prefix coding for the length of the binary form of the number, then the length of the binary form of the number, then the number itself
	const naturalNumbers: number[] = []
	let currentString = string_
	while (currentString.length > 0) {
		// Routinely decoding a natural number
		const firstZeroIndex = currentString.indexOf('0')
		const binReprLengthBinReprLength = firstZeroIndex
		const binReprLengthBinRepr = Number.parseInt(
			currentString.slice(
				firstZeroIndex + 1,
				firstZeroIndex + 1 + binReprLengthBinReprLength
			),
			2
		)
		const binRepr = currentString.slice(
			firstZeroIndex + 1 + binReprLengthBinReprLength,
			firstZeroIndex + 1 + binReprLengthBinReprLength + binReprLengthBinRepr
		)
		const number = Number.parseInt(binRepr, 2)
		naturalNumbers.push(number)
		currentString = currentString.slice(
			firstZeroIndex + 1 + binReprLengthBinReprLength + binReprLengthBinRepr
		)
	}

	return naturalNumbers
}

// TODO: Check stages
export function compress(
	text: string,
	showStages = false
): { compressed: string; dictionary: Dictionary; stages: LZWStage[] } {
	const stages: LZWStage[] = []
	const dictionary = [...BASE_DICTIONARY]
	let compressed = ''

	let currentString = ''
	let updatedString = ''
	let stringCode = 0
	let pushedToDictionary = false

	for (const [index, character] of [...`${text}\0`].entries()) {
		updatedString = (currentString + character).replace('\0', '')
		if (dictionary.includes(updatedString)) {
			// If the updated string is in the dictionary, update the current string and continue
			pushedToDictionary = false
			currentString = updatedString
		} else {
			// If the updated string is not in the dictionary, push it to the dictionary and update the current string
			pushedToDictionary = true
			stringCode = dictionary.indexOf(currentString)
			compressed += naturalNumberEncoding(stringCode)
			if (dictionary.length < 4 * KB) {
				dictionary.push(updatedString)
			}
			currentString = character
		}
		if (character !== '\0' && showStages)
			stages.push([index, character, updatedString, pushedToDictionary])
	}

	// Add the last string
	if (!pushedToDictionary) {
		stringCode = dictionary.indexOf(currentString)
		compressed += naturalNumberEncoding(stringCode)
	}

	return { compressed, dictionary: transformArrayToObject(dictionary), stages }
}

// TODO: Check stages
export function decompress(
	compressed: string,
	showStages = false
): { decompressed: string; dictionary: Dictionary; stages: LZWStage[] } {
	const numbers = decodeNatrualNumberStream(compressed)
	const stages: LZWStage[] = []
	const dictionary = [...BASE_DICTIONARY]
	let decompressed = dictionary[numbers[0]]
	let phrase = ''

	let current = dictionary[numbers[0]]
	let old = dictionary[numbers[0]]
	let pushedToDictionary = false

	for (const [index, code] of numbers.slice(1).entries()) {
		pushedToDictionary = false
		phrase = code in dictionary ? dictionary[code] : old + current
		decompressed += phrase
		current = phrase.charAt(0)
		if (dictionary.length < 4 * KB) {
			pushedToDictionary = true
			dictionary.push(old + current)
		}
		old = phrase
		if (showStages)
			stages.push([index, phrase, old + current, pushedToDictionary])
	}

	return {
		decompressed,
		dictionary: transformArrayToObject(dictionary),
		stages
	}
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest
	describe('lzw', () => {
		it('compresses and decompresses', () => {
			expect(decompress(compress('AABCBBABC').compressed).decompressed).toEqual(
				'AABCBBABC'
			)
			expect(
				decompress(compress('AABCBBABCAABCBBABC').compressed).decompressed
			).toEqual('AABCBBABCAABCBBABC')
			expect(
				decompress(compress('Hello World').compressed).decompressed
			).toEqual('Hello World')
			expect(
				decompress(compress('Hello Hello Hello').compressed).decompressed
			).toEqual('Hello Hello Hello')
			expect(decompress(compress('fffaa').compressed).decompressed).toEqual(
				'fffaa'
			)
			expect(decompress(compress('aaaaaa').compressed).decompressed).toEqual(
				'aaaaaa'
			)
			expect(
				decompress(compress('hellofffasdf').compressed).decompressed
			).toEqual('hellofffasdf')
		})
		it('encodes and decodes natural number', () => {
			expect(naturalNumberDecoding(naturalNumberEncoding(0))).toEqual(0)
			expect(naturalNumberDecoding(naturalNumberEncoding(1))).toEqual(1)
			expect(naturalNumberDecoding(naturalNumberEncoding(6))).toEqual(6)
			expect(naturalNumberDecoding(naturalNumberEncoding(125))).toEqual(125)
			expect(naturalNumberDecoding(naturalNumberEncoding(256))).toEqual(256)
		})
	})
}
