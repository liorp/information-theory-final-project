/* eslint-disable unicorn/filename-case */
import { compress, decompress } from 'utils/lzss'
import type { LZSSCompressed } from 'utils/types'

export default function uzeLZSS(plainText: string): {
	compressed: LZSSCompressed
	decompressed: string
} {
	const compressed = compress(plainText)
	const decompressed = decompress(compressed)
	return { compressed, decompressed }
}
