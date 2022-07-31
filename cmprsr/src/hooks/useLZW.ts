/* eslint-disable unicorn/filename-case */
import { decode, encode } from 'utils/lzw'
import type { Dictionary } from 'utils/types'

export default function uzeLZW(plainText: string): {
	dictionary: Dictionary
	encodedText: number[]
	decodedText: string
} {
	const [encodedText, dictionary] = encode(plainText)
	const [decodedText] = decode(encodedText)
	return { dictionary, encodedText, decodedText }
}
