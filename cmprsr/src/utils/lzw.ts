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

export function compress(
	text: string,
	showStages = false
): [string, number[], Dictionary, LZWStage[]] {
	const stages: LZWStage[] = []
	const dictionary = [...BASE_DICTIONARY]
	const compressedArray: number[] = []
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
			compressedArray.push(stringCode)
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
		compressedArray.push(stringCode)
	}

	return [
		compressed,
		compressedArray,
		transformArrayToObject(dictionary),
		stages
	]
}

export function decompress(compressed: number[]): [string, Dictionary] {
	const dictionary = [...BASE_DICTIONARY]
	let decompressed = dictionary[compressed[0]]
	let phrase = ''

	let current = dictionary[compressed[0]]
	let old = dictionary[compressed[0]]

	for (const code of compressed.slice(1)) {
		phrase = code in dictionary ? dictionary[code] : old + current
		decompressed += phrase
		current = phrase.charAt(0)
		if (dictionary.length < 4 * KB) {
			dictionary.push(old + current)
		}
		old = phrase
	}

	return [decompressed, transformArrayToObject(dictionary)]
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest
	describe('lzw', () => {
		it('compresses and decompresses', () => {
			expect(decompress(compress('AABCBBABC')[1])[0]).toEqual('AABCBBABC')
			expect(decompress(compress('AABCBBABCAABCBBABC')[1])[0]).toEqual(
				'AABCBBABCAABCBBABC'
			)
			expect(decompress(compress('Hello World')[1])[0]).toEqual('Hello World')
			expect(decompress(compress('Hello Hello Hello')[1])[0]).toEqual(
				'Hello Hello Hello'
			)
			expect(decompress(compress('fffaa')[1])[0]).toEqual('fffaa')
			expect(decompress(compress('aaaaaa')[1])[0]).toEqual('aaaaaa')
			expect(decompress(compress('hellofffasdf')[1])[0]).toEqual('hellofffasdf')
		})
	})
}
