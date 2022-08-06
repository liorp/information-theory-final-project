/* eslint-disable unicorn/prefer-code-point */
import {
	convertBinaryToChar,
	convertBinaryToNumber,
	convertCharToBinary,
	convertNumberToBinary
} from './binary'
import { BYTE, INT_BITS_AMOUNT } from './consts'
import { PriorityQueue } from './priorityQueue'
import { stringsToCheck } from './testUtils'
import type { Dictionary } from './types'
import { invertObject } from './utils'

export interface HuffmanTreeNode {
	frequency: number
	symbols?: string
	left?: HuffmanTreeNode
	right?: HuffmanTreeNode
}

export type Frequencies = Map<string, number>
export type HuffmanTreeStages = HuffmanTreeNode[][]

/** Get the frequency of each symbol in a given text */
export function getLetterFrequencies(text: string): Frequencies {
	const frequencies = new Map<string, number>()

	// For each letter in the text, increase by one its documented frequency
	for (const letter of text) {
		frequencies.set(letter, (frequencies.get(letter) ?? 0) + 1)
	}
	return frequencies
}

export function createHuffmanTreeStages(
	frequencies: Frequencies
): HuffmanTreeStages {
	const stages: HuffmanTreeStages = []
	const queue = new PriorityQueue<HuffmanTreeNode>({
		comparator: (a, b) => a.frequency - b.frequency
	})
	for (const [symbols, frequency] of frequencies) {
		queue.queue({ symbols, frequency })
	}
	stages.push(structuredClone(queue.strategy.data))

	while (queue.length > 1) {
		const left = queue.dequeue()
		const right = queue.dequeue()
		queue.queue({
			frequency: left.frequency + right.frequency,
			left,
			right
		})
		stages.push(structuredClone(queue.strategy.data))
	}
	return stages
}

// Create Huffman tree based on the frequencies of the data's characters
export function createHuffmanTree(frequencies: Frequencies): HuffmanTreeNode {
	// Use priority queue which prioritize characters based on their frequency
	const queue = new PriorityQueue<HuffmanTreeNode>({
		comparator: (a, b) => a.frequency - b.frequency
	})

	// Insert all symbols to the priority queue
	for (const [symbols, frequency] of frequencies) {
		queue.queue({ symbols, frequency })
	}

	// Iterate the priority queue to build Huffman tree
	while (queue.length > 1) {
		// Get two most prioritized (lower frequency) symbols
		const left = queue.dequeue()
		const right = queue.dequeue()

		// Create new node whose frequency is the sum of the frequencies, and insert it to the queue
		queue.queue({
			frequency: left.frequency + right.frequency,
			left,
			right
		})
	}

	// The last element of the queue is the Huffman tree root
	return queue.dequeue()
}

/** Create Huffman dictionary based on the Huffman tree */
export function createHuffmanDictionary(
	tree?: HuffmanTreeNode,
	prefix?: string
): Dictionary {
	// If no tree is given, an empty dictionary is returned
	if (tree === undefined) return {}

	// If the tree is a leaf, return the dictionary with the symbol and its prefix
	if (tree.symbols) {
		return { [tree.symbols]: prefix ?? '0' }
	}

	// If the tree is not a leaf, recursively call the function on its left and right children
	return {
		...createHuffmanDictionary(tree.left, `${prefix ?? ''}0`),
		...createHuffmanDictionary(tree.right, `${prefix ?? ''}1`)
	}
}

/** Get the string representing the Huffman tree */
export function getHuffmanTreeString(root?: HuffmanTreeNode): string {
	// Leafs are represented as 0, other nodes are represented as 1
	// If we try accessing a non-existing child, we return 0
	if (root === undefined) {
		return '0'
	}

	// If root is a leaf, it takes 1 (leaf bit) + BYTE bits to represent it
	if (root.left === undefined && root.right === undefined) {
		return `0${root.symbols ?? ''}`
	}

	// Else, root is not a leaf, so it takes 1 bit to represent it
	return `1${getHuffmanTreeString(root.left)}${getHuffmanTreeString(
		root.right
	)}`
}

/** Get the binary string representing the Huffman tree */
export function getHuffmanTreeBinaryString(root?: HuffmanTreeNode): string {
	// Leafs are represented as 0, other nodes are represented as 1
	// If we try accessing a non-existing child, we return 0
	if (root === undefined) {
		return '0'
	}

	// If root is a leaf, it takes 1 (leaf bit) + BYTE bits to represent it
	if (root.left === undefined && root.right === undefined) {
		if (root.symbols === undefined) return ''
		return `0${convertCharToBinary(root.symbols)}`
	}

	// Else, root is not a leaf, so it takes 1 bit to represent it
	return `1${getHuffmanTreeBinaryString(root.left)}${getHuffmanTreeBinaryString(
		root.right
	)}`
}

/** Get Huffman tree from the binary string representing it (undefined is returned in case of an error, i.e. malformed tree) */
export function getHuffmanTreeFromBinaryString(
	binaryTreeString: string
): HuffmanTreeNode | undefined {
	let temporaryNode: HuffmanTreeNode
	let topNode: HuffmanTreeNode | undefined
	let stringToSearch = binaryTreeString

	// Initialize the stack used for further processing of non-leaves nodes
	const stack = []

	// Check if the root node is a leaf
	let isLeaf = stringToSearch.startsWith('0')

	// Create root node
	const root: HuffmanTreeNode = {
		frequency: 0,
		symbols: isLeaf
			? convertBinaryToChar(stringToSearch.slice(1, 1 + INT_BITS_AMOUNT))
			: ''
	}

	// If the root is a leaf, early exit as the tree has only one node
	if (isLeaf) return root

	// If the root is not a leaf, push it to the stack and decrease binary string appropriately
	stack.push(root)
	stringToSearch = stringToSearch.slice(1)

	// Iterate binary string
	while (stringToSearch.length > 0) {
		// Check if cuurent node is a leaf
		isLeaf = stringToSearch.startsWith('0')

		// Create temporary node to be later added to the tree
		temporaryNode = {
			frequency: 0,
			symbols: isLeaf
				? convertBinaryToChar(stringToSearch.slice(1, 1 + INT_BITS_AMOUNT))
				: ''
		}

		// Obtain the top node from the stack, and fail if it doesn't exist
		topNode = stack.at(-1)
		if (topNode === undefined) return undefined

		// If the top node in the stack has no left child, assign it to be the temporary node
		if (topNode.left === undefined) {
			topNode.left = temporaryNode
		}

		// If the top node in the stack has a left child but has no right child, assign it to be the temporary node
		else if (topNode.right === undefined) {
			topNode.right = temporaryNode
		}

		// If the top node has both left and right child, pop nodes from stack until a node with at least one child missing is found
		else {
			while (topNode?.left !== undefined && topNode.right !== undefined) {
				stack.pop()
				topNode = stack.at(-1)
			}

			// Fail if appropriate node is not found, else
			if (topNode === undefined) return undefined
			topNode.right = temporaryNode
		}

		// Push current node to stack if it's not a leaf and decrease binary string appropriately
		if (!isLeaf) {
			stack.push(temporaryNode)
			stringToSearch = stringToSearch.slice(1)
		} else {
			stringToSearch = stringToSearch.slice(1 + INT_BITS_AMOUNT)
		}
	}

	// Return the root node once the entire tree has been built
	return root
}

/** Returns Huffman tree size in bits */
export function getHuffmanTreeSize(root?: HuffmanTreeNode): number {
	// Leafs are represented as 0, other nodes are represented as 1
	// If we try accessing a non-existing child, we return 0
	if (root === undefined) {
		return 0
	}

	// If root is a leaf, it takes 1 (leaf bit) + BYTE (typically 8) bits to represent it
	if (root.left === undefined && root.right === undefined) {
		return 1 + BYTE
	}

	// Else, root is not a leaf, so it takes 1 bit to represent it
	return 1 + getHuffmanTreeSize(root.left) + getHuffmanTreeSize(root.right)
}

// Compress a given text input by using a given coding dictionary
export function compressWithDictionary(
	text: string,
	dictionary: Dictionary
): string {
	return [...text]
		.map(letter => dictionary[letter as keyof typeof dictionary])
		.join('')
}

// Compress a given text into a binary form, which includes an header (Huffman tree length + Huffman tree) and the actuall compressed data
export function compress(text: string): {
	compressed: string
	dictionary: Dictionary
	frequencies: Frequencies
	tree: HuffmanTreeNode | undefined
} {
	// Handle the case of an empty text input
	if (text.length === 0) {
		return {
			compressed: '',
			dictionary: {},
			frequencies: new Map<string, number>(),
			tree: undefined
		}
	}

	// Build input text frequencies and Huffman tree and dictionary
	const frequencies = getLetterFrequencies(text)
	const tree = createHuffmanTree(frequencies)
	const dictionary = createHuffmanDictionary(tree)
	const treeBinaryString = getHuffmanTreeBinaryString(tree)
	const binaryTreeLength = convertNumberToBinary(treeBinaryString.length)

	// Compressed output is composed of the binary tree length, the tree string in binary form and the actual compressed data
	const compressedData = compressWithDictionary(text, dictionary)

	return {
		compressed: binaryTreeLength + treeBinaryString + compressedData,
		dictionary,
		frequencies,
		tree
	}
}

/** Get the length of the tree from the input's header */
function getTreeLengthFromInput(input: string): number {
	return convertBinaryToNumber(input.slice(0, INT_BITS_AMOUNT))
}

/** Build the Huffman dictionary based on the input */
export function buildDictionaryFromInput(input: string): Dictionary {
	// Extract the binary representation of the Huffman tree from the binary input
	const treeLength = getTreeLengthFromInput(input)
	const treeStringBinary = input.slice(
		INT_BITS_AMOUNT,
		INT_BITS_AMOUNT + treeLength
	)

	// Create the Huffman dictionary based on the Huffman tree
	return createHuffmanDictionary(
		getHuffmanTreeFromBinaryString(treeStringBinary)
	)
}

/** Decompress a binary previously-compressed text into the original data */
export function decompress(text: string, dictionary?: Dictionary): string {
	let temporaryCode = ''
	let decompressed = ''

	// If the Huffman dictionary isn't given, build it from the input text
	const invertedDictionary = invertObject(
		dictionary ?? buildDictionaryFromInput(text)
	)

	// Get the offset into the binary text input where the actual compressed data is stored
	const treeLength = getTreeLengthFromInput(text)
	const compressedDataOffset = INT_BITS_AMOUNT + treeLength

	// Parse binary text input using Huffman dictionary
	for (let index = compressedDataOffset; index < text.length; index++) {
		for (let innerIndex = index; innerIndex < text.length + 1; innerIndex++) {
			temporaryCode = text.slice(index, innerIndex)
			if (temporaryCode in invertedDictionary) {
				decompressed +=
					invertedDictionary[temporaryCode as keyof typeof invertedDictionary]
				index = innerIndex - 1
				break
			}
		}
	}
	return decompressed
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest
	describe('huffman', () => {
		it('compresses and decompresses', () => {
			for (const string of stringsToCheck) {
				const { compressed } = compress(string)
				expect(decompress(compressed)).toBe(string)
			}
		})
	})
}
