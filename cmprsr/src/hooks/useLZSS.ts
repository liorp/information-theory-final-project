/* eslint-disable unicorn/filename-case */
import { decode, encode } from 'utils/lzss'
import type { LZSSEncoded } from 'utils/types'

export default function uzeLZSS(plainText: string): {
	encodedText: LZSSEncoded
	decodedText: string
} {
	const encodedText = encode(plainText)
	const decodedText = decode(encodedText)
	return { encodedText, decodedText }
}
