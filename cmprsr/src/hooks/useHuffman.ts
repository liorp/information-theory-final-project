import type { Frequencies, HuffmanTreeNode } from 'utils/huffman'
import { compress, createHuffmanTreeStages, decompress } from 'utils/huffman'
import type { Dictionary } from 'utils/types'

// TODO: Fix compression types in all files
export function useHuffmanCompress(input: string): {
	stages: HuffmanTreeNode[][]
	frequencies: Frequencies
	tree: HuffmanTreeNode
	dictionary: Dictionary
	compressed: string
} {
	const [compressed, dictionary, frequencies, tree] = compress(input)
	const stages = createHuffmanTreeStages(frequencies)
	return { stages, frequencies, tree, dictionary, compressed }
}

export function useHuffmanDecompress(input: string): {
	decompressed: string
} {
	const decompressed = decompress(input)
	return { decompressed }
}
