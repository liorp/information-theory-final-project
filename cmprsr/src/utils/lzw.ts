import { transformArrayToObject } from 'utils/utils'
import { BASE_DICTIONARY, KB } from './consts'
import {
	decodeNaturalNumberStream,
	naturalNumberEncoding
} from './naturalNumbersEncoding'
import { stringsToCheck } from './testUtils'
import type { Dictionary, LZWStage } from './types'

// TODO: Check stages
// Compress a given inputStream into a binary form
// TODO: LAPIK add more documentation on the algorithm's different phases
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

	for (const [index, character] of [...text].entries()) {
		updatedString = currentString + character
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
		if (showStages)
			stages.push([index, character, updatedString, pushedToDictionary])
	}

	// Add the last string
	if (updatedString) {
		stringCode = dictionary.indexOf(currentString)
		compressed += naturalNumberEncoding(stringCode)
	}

	return { compressed, dictionary: transformArrayToObject(dictionary), stages }
}

// TODO: Check stages
// TODO: LAPIK add more documentation on the algorithm's different phases
// Decompress a binary previously-compressed text into the original data
export function decompress(
	compressed: string,
	showStages = false
): { decompressed: string; dictionary: Dictionary; stages: LZWStage[] } {
	const numbers = decodeNaturalNumberStream(compressed)
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
		;[current] = phrase
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
			for (const string of stringsToCheck) {
				const { compressed } = compress(string)
				const { decompressed } = decompress(compressed)
				expect(decompressed).toEqual(string)
			}
		})
	})
}
