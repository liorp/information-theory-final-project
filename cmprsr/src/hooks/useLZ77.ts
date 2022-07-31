/* eslint-disable unicorn/filename-case */
import { decode, encode } from 'utils/lz77'
import type { LZ77Encoded } from 'utils/types'

export default function uzeLZ77(plainText: string): {
	encodedText: LZ77Encoded
	decodedText: string
} {
	const encodedText = encode(plainText)
	const decodedText = decode(encodedText)
	return { encodedText, decodedText }
}
