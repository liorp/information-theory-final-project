/* eslint-disable no-plusplus */
import type { Dictionary } from './types'

const transformArrayToObject = (dictionary: string[]): Dictionary =>
	Object.fromEntries(
		Object.entries(dictionary).map(([key, value]) => [value, key])
	)

export function encode(text: string): [string, Dictionary] {
	const dictionary = [
		..." !\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'"
	]
	let encodedText = ''
	let w = ''

	for (const element of text) {
		if (dictionary.includes(w + element)) {
			w += element
		} else {
			encodedText += dictionary.indexOf(w)
			dictionary.push(w + element)
			w = element
		}
	}

	return [encodedText, transformArrayToObject(dictionary)]
}

export function decode(text: string): [string, Dictionary] {
	const dictionary = [
		..." !\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'"
	]
	let decodedText = ''
	let w = ''

	for (const element of text) {
		if (dictionary.includes(w + element)) {
			decodedText += element
			w += element
		} else {
			decodedText += dictionary.indexOf(w)
			dictionary.push(w + element)
			w = element
		}
	}

	return [decodedText, transformArrayToObject(dictionary)]
}
