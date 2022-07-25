import type { Dictionary, Frequencies, HuffmanTreeNode } from 'utils/huffman'
import { decode, encode } from 'utils/huffman'

export default function useHuffman(
	plainText: string
): [Frequencies, HuffmanTreeNode, Dictionary, string, string] {
	const [encodedText, dictionary, frequencies, tree] = encode(plainText)
	const decodedText = decode(encodedText, dictionary)
	return [frequencies, tree, dictionary, encodedText, decodedText]
}
