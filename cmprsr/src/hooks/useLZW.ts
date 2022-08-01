/* eslint-disable unicorn/filename-case */
import { compress, decompress } from 'utils/lzw'
import type { Dictionary } from 'utils/types'

export default function uzeLZW(plainText: string): {
	dictionary: Dictionary
	compressed: string
	decompressed: string
	compressedArray: number[]
} {
	const [compressed, compressedArray, dictionary] = compress(plainText)
	const [decompressed] = decompress(compressedArray)
	return {
		dictionary,
		compressed,
		decompressed,
		compressedArray
	}
}
