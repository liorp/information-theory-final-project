import { compress, decompress } from 'utils/lzw'
import type { Dictionary, LZWStage } from 'utils/types'

export function uzeLZWCompress(input: string): {
	dictionary: Dictionary
	compressed: string
	stages: LZWStage[]
} {
	const [compressed, , dictionary, stages] = compress(input)
	return {
		dictionary,
		compressed,
		stages
	}
}

export function useLZWDecompress(input: string): {
	decompressed: string
} {
	const [decompressed] = decompress(input)
	return { decompressed }
}
