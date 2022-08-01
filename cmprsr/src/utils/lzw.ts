/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-plusplus */
import { transformArrayToObject } from 'utils/utils'
import { BASE_DICTIONARY, KB } from './consts'
import type { Dictionary } from './types'

function naturalNumberEncoding(number_: number): string {
	// representing a natural number with the encoding of natural numbers discussed in class:
	// prefix coding for the length of the binary form of the number, then the length of the binary form of the number, then the number itself
	const numberBinRepr = number_.toString(2)
	const numberBinReprLength = numberBinRepr.length
	const binReprLengthBinRepr = numberBinReprLength.toString(2)
	const binReprLengthBinReprLength = binReprLengthBinRepr.length

	return (
		`${'1'.repeat(binReprLengthBinReprLength)}` +
		`0${binReprLengthBinRepr}${numberBinRepr}`
	)
}

export function encode(text: string): [string, number[], Dictionary] {
	const dictionary = [...BASE_DICTIONARY]
	const encodedTextArray: number[] = []
	let encodedText = ''

	let currentString = ''
	let updatedString = ''
	let stringCode = 0

	for (const character of `${text}\0`) {
		updatedString = currentString + character
		if (dictionary.includes(updatedString)) {
			currentString = updatedString
		} else {
			stringCode = dictionary.indexOf(currentString)
			encodedText += naturalNumberEncoding(stringCode)
			encodedTextArray.push(stringCode)
			if (dictionary.length < 4 * KB) {
				dictionary.push(updatedString)
			}
			currentString = character
		}
	}

	return [encodedText, encodedTextArray, transformArrayToObject(dictionary)]
}

export function decode(encodedText: number[]): [string, Dictionary] {
	const dictionary = [...BASE_DICTIONARY]
	let decodedText = dictionary[encodedText[0]]
	let phrase = ''

	let current = dictionary[encodedText[0]]
	let old = dictionary[encodedText[0]]

	for (const code of encodedText.slice(1)) {
		phrase = code in dictionary ? dictionary[code] : old + current
		decodedText += phrase
		current = phrase.charAt(0)
		if (dictionary.length < 4 * KB) {
			dictionary.push(old + current)
		}
		old = phrase
	}

	return [decodedText, transformArrayToObject(dictionary)]
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest
	it('encode', () => {
		expect(decode(encode('Hello World')[1])[0]).toEqual('Hello World')
		expect(decode(encode('Hello Hello Hello')[1])[0]).toEqual(
			'Hello Hello Hello'
		)
		expect(decode(encode('fffaa')[1])[0]).toEqual('fffaa')
		expect(decode(encode('hellofffasdf')[1])[0]).toEqual('hellofffasdf')
	})
}
