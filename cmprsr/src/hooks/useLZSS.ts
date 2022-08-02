import { compress, decompress } from 'utils/lzss'
import type { LZSSComponent, LZSSStage } from 'utils/types'

export default function uzeLZSS(plainText: string): {
	compressed: LZSSComponent[]
	decompressed: string
	stages: LZSSStage[]
} {
	const [compressed, stages] = compress(plainText)
	const decompressed = decompress(compressed)
	return { compressed, decompressed, stages }
}
