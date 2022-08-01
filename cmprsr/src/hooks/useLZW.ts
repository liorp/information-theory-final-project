import { compress, decompress } from 'utils/lzw'
import type { Dictionary, LZWStage } from 'utils/types'

export default function uzeLZW(plainText: string): {
	dictionary: Dictionary
	compressed: string
	decompressed: string
	compressedArray: number[]
	stages: LZWStage[]
} {
	const [compressed, compressedArray, dictionary, stages] = compress(plainText)
	const [decompressed] = decompress(compressedArray)
	return {
		dictionary,
		compressed,
		decompressed,
		compressedArray,
		stages
	}
}
