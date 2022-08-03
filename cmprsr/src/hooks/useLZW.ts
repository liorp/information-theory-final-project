import { compress, decompress } from 'utils/lzw'
import type { Dictionary, LZWStage } from 'utils/types'
import { CompressionAction } from 'utils/types'

export default function uzeLZW(
	input: string,
	action: CompressionAction
): {
	dictionary: Dictionary
	compressed: string
	decompressed: string
	compressedArray: number[]
	stages: LZWStage[]
} {
	switch (action) {
		case CompressionAction.Compress: {
			const [compressed, compressedArray, dictionary, stages] = compress(input)
			const [decompressed] = decompress(compressedArray)
			return {
				dictionary,
				compressed,
				decompressed,
				compressedArray,
				stages
			}
		}
		case CompressionAction.Decompress: {
			const [decompressed] = decompress(input)
			return {
				dictionary: {},
				compressed: input,
				decompressed,
				compressedArray: [],
				stages: []
			}
		}
		default:
			throw new Error('Unknown compression action')
	}
}
