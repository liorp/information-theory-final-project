import { compress, decompress } from 'utils/lzss'
import type { LZSSStage } from 'utils/types'

export function uzeLZSSCompress(input: string): {
	compressed: string
	stages: LZSSStage[]
} {
	const [compressed, , stages] = compress(input)
	return { compressed, stages }
}

export function useLZSSDecompress(input: string): {
	decompressed: string
} {
	const decompressed = decompress(input)
	return { decompressed }
}
