import type { Frequencies, HuffmanTreeNode } from 'utils/huffman'
import { createHuffmanTreeStages, decode, encode } from 'utils/huffman'
import type { Dictionary } from 'utils/types'

export default function useHuffman(plainText: string): {
	stages: HuffmanTreeNode[][]
	frequencies: Frequencies
	tree: HuffmanTreeNode
	dictionary: Dictionary
	encodedText: string
	decodedText: string
} {
	const [encodedText, dictionary, frequencies, tree] = encode(plainText)
	const decodedText = decode(encodedText, dictionary)
	const stages = createHuffmanTreeStages(frequencies)
	return { stages, frequencies, tree, dictionary, encodedText, decodedText }
}
