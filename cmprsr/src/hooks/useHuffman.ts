import type { Frequencies, HuffmanTreeNode } from 'utils/huffman'
import { compress, createHuffmanTreeStages, decompress } from 'utils/huffman'
import type { Dictionary } from 'utils/types'

export default function useHuffman(plainText: string): {
	stages: HuffmanTreeNode[][]
	frequencies: Frequencies
	tree: HuffmanTreeNode
	dictionary: Dictionary
	compressed: string
	decompressed: string
} {
	const [compressed, dictionary, frequencies, tree] = compress(plainText)
	const decompressed = decompress(compressed, dictionary)
	const stages = createHuffmanTreeStages(frequencies)
	return { stages, frequencies, tree, dictionary, compressed, decompressed }
}
