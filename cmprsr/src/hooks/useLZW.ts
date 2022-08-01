/* eslint-disable unicorn/filename-case */
import { decode, encode } from 'utils/lzw'
import type { Dictionary } from 'utils/types'

export default function uzeLZW(plainText: string): {
	dictionary: Dictionary
	encodedText: string
	decodedText: string
	encodedTextArray: number[]
} {
	const [encodedText, encodedTextArray, dictionary] = encode(plainText)
	const [decodedText] = decode(encodedTextArray)
	return { dictionary, encodedText, decodedText, encodedTextArray }
}
