import { compress, decompress } from 'utils/lzss'
import type { LZSSStage } from 'utils/types'
import { CompressionAction } from 'utils/types'

export default function uzeLZSS(
	input: string,
	action: CompressionAction
): {
	compressed: string
	decompressed: string
	stages: LZSSStage[]
} {
	switch (action) {
		case CompressionAction.Compress: {
			const [compressed, compressedArray, stages] = compress(input)
			const decompressed = decompress(compressedArray)
			return { compressed, decompressed, stages }
		}
		case CompressionAction.Decompress: {
			const decompressed = decompress(input)
			return { compressed: input, decompressed, stages: [] }
		}
		default:
			throw new Error('Unknown compression action')
	}
}
