import type { Frequencies, HuffmanTreeNode } from 'utils/huffman'
import { compress, createHuffmanTreeStages, decompress } from 'utils/huffman'
import type { Dictionary } from 'utils/types'
import { CompressionAction } from 'utils/types'

// TODO: Fix compression types in all files
export default function useHuffman(
	input: string,
	action: CompressionAction
): {
	stages: HuffmanTreeNode[][]
	frequencies: Frequencies
	tree: HuffmanTreeNode
	dictionary: Dictionary
	compressed: string
	decompressed: string
} {
	switch (action) {
		case CompressionAction.Compress: {
			const [compressed, dictionary, frequencies, tree] = compress(input)
			const decompressed = decompress(compressed, dictionary)
			const stages = createHuffmanTreeStages(frequencies)
			return { stages, frequencies, tree, dictionary, compressed, decompressed }
		}
		case CompressionAction.Decompress: {
			const decompressed = decompress(input)
			const [frequencies, tree] = createHuffmanTreeStages(input)
			const [compressed, dictionary] = compress(decompressed, frequencies)
			const stages = createHuffmanTreeStages(frequencies)
			return { stages, frequencies, tree, dictionary, compressed, decompressed }
		}
		default:
			throw new Error('Unknown compression action')
	}
}
