/* eslint-disable no-plusplus */
import { transformArrayToObject } from 'utils'
import type { Dictionary } from './types'

const BASE_DICTIONARY =
	" !\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'"

export function encode(text: string): [number[], Dictionary] {
	const dictionary = [...BASE_DICTIONARY]
	const encodedText: number[] = []
	let currentString = ''
	let updatedString = ''

	for (const character of `${text}\0`) {
		updatedString = currentString + character
		if (dictionary.includes(updatedString)) {
			currentString = updatedString
		} else {
			encodedText.push(dictionary.indexOf(currentString))
			dictionary.push(updatedString)
			currentString = character
		}
	}

	return [encodedText, transformArrayToObject(dictionary)]
}

export function decode(encodedText: number[]): [string, Dictionary] {
	const dictionary = [...BASE_DICTIONARY]

	let decodedText = ''
	let currentString = ''

	for (const codeword of encodedText) {
		decodedText += dictionary[codeword]
		currentString += dictionary[codeword]
		if (!dictionary.includes(currentString)) {
			dictionary.push(currentString)
			currentString = dictionary[codeword]
		}
	}

	return [decodedText, transformArrayToObject(dictionary)]
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest
	it('encode', () => {
		expect(decode(encode('Hello World')[0])[0]).toEqual('Hello World')
		expect(decode(encode('Hello Hello')[0])[0]).toEqual('Hello Hello')
	})
}
