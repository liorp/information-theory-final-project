import type { Dictionary, Frequencies, HuffmanTree } from 'utils/huffman'
import {
	createHuffmanDictionary,
	createHuffmanTree,
	decode,
	encode,
	getLetterFrequencies
} from 'utils/huffman'

export default function useHuffman(
	plainText: string
): [Frequencies, HuffmanTree, Dictionary, string, string] {
	const frequencies = getLetterFrequencies(plainText)
	const tree = createHuffmanTree(frequencies)
	const dictionary = createHuffmanDictionary(tree)
	const encodedText = encode(plainText, dictionary)
	const decodedText = decode(encodedText, dictionary)
	return [frequencies, tree, dictionary, encodedText, decodedText]
}
