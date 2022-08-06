import { convertBinaryToNumber, convertNumberToBinary } from './binary'
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

export function getLetterFrequencies(text: string): Frequencies {
	const frequencies = new Map<string, number>()
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

export function createHuffmanTree(frequencies: Frequencies): HuffmanTreeNode {
	const queue = new PriorityQueue<HuffmanTreeNode>({
		comparator: (a, b) => a.frequency - b.frequency
	})
	for (const [symbols, frequency] of frequencies) {
		queue.queue({ symbols, frequency })
	}
	while (queue.length > 1) {
		const left = queue.dequeue()
		const right = queue.dequeue()
		queue.queue({
			frequency: left.frequency + right.frequency,
			left,
			right
		})
	}
	return queue.dequeue()
}

export function createHuffmanDictionary(
	tree?: HuffmanTreeNode,
	prefix?: string
): Dictionary {
	if (!tree) return {}
	if (tree.symbols) {
		return { [tree.symbols]: prefix ?? '0' }
	}
	return {
		...createHuffmanDictionary(tree.left, `${prefix ?? ''}0`),
		...createHuffmanDictionary(tree.right, `${prefix ?? ''}1`)
	}
}

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

export function getHuffmanTreeFromBinaryString(
	binaryTreeString: string
): HuffmanTreeNode {
	let stringToSearch = binaryTreeString

	// Initialize an empty stack
	const stack = []

	// Check if the root node is a leaf
	let isLeaf = stringToSearch.startsWith('0')

	// Create root node
	const root: HuffmanTreeNode = {
		frequency: 0,
		symbols: isLeaf
			? convertBinaryToNumber(
					stringToSearch.slice(1, 1 + INT_BITS_AMOUNT)
			  ).toString()
			: ''
	}
	let temporaryNode: HuffmanTreeNode

	// Push root to stack if it's a leaf and update binary string
	if (!isLeaf) {
		stack.push(root)
		stringToSearch = stringToSearch.slice(1)
	} else {
		stringToSearch = stringToSearch.slice(1 + INT_BITS_AMOUNT)
	}

	// Iterate binary string
	while (stringToSearch.length > 0) {
		// Check if cuurent node is a leaf
		isLeaf = stringToSearch.startsWith('0')

		// Create temporary node to be added to the tree later
		temporaryNode = {
			frequency: 0,
			symbols: isLeaf
				? convertBinaryToNumber(
						stringToSearch.slice(1, 1 + INT_BITS_AMOUNT)
				  ).toString()
				: ''
		}

		// Check if the top node in the stack has a left child
		if (stack.at(-1).left === undefined) {
			stack.at(-1).left = temporaryNode

			// Push current node to stack if it's a leaf and update binary string
			if (!isLeaf) {
				stack.push(temporaryNode)
				stringToSearch = stringToSearch.slice(1)
			} else {
				stringToSearch = stringToSearch.slice(1 + INT_BITS_AMOUNT)
			}
		}

		// Checking if the right position is NULL or not
		else if (stack.at(-1).right === undefined) {
			stack.at(-1).right = temporaryNode

			// Push current node to stack if it's a leaf and update binary string
			if (!isLeaf) {
				stack.push(temporaryNode)
				stringToSearch = stringToSearch.slice(1)
			} else {
				stringToSearch = stringToSearch.slice(1 + INT_BITS_AMOUNT)
			}
		}

		// If left and right of top node is already filles
		else {
			while (
				stack.at(-1).left !== undefined &&
				stack.at(-1).right !== undefined
			)
				stack.pop()
			stack.at(-1).right = temporaryNode

			// Push current node to stack if it's a leaf and update binary string
			if (!isLeaf) {
				stack.push(temporaryNode)
				stringToSearch = stringToSearch.slice(1)
			} else {
				stringToSearch = stringToSearch.slice(1 + INT_BITS_AMOUNT)
			}
		}
	}

	return root
}

/** Returns size in bits */
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

// Compress a given text into a binary form, which includes the Huffman tree used for both compression and decompression
export function compress(text: string): {
	compressed: string
	dictionary: Dictionary
	frequencies: Frequencies
	tree: HuffmanTreeNode
} {
	const frequencies = getLetterFrequencies(text)
	const tree = createHuffmanTree(frequencies)
	const dictionary = createHuffmanDictionary(tree)
	const treeBinaryString = getHuffmanTreeBinaryString(tree)
	const binaryTreeLength = convertNumberToBinary(treeBinaryString.length)

	// Compressed output is composed of the binary tree length, the tree string in binary form and the actual compressed data
	return {
		compressed:
			binaryTreeLength +
			treeBinaryString +
			[...text]
				.map(letter => dictionary[letter as keyof typeof dictionary] ?? letter)
				.join(''),
		dictionary,
		frequencies,
		tree
	}
}

function getTreeLengthFromInput(input: string): number {
	return convertBinaryToNumber(input.slice(0, INT_BITS_AMOUNT))
}

export function buildDictionaryFromInput(input: string): Dictionary {
	const treeLength = getTreeLengthFromInput(input)
	const treeStringBinary = input.slice(
		INT_BITS_AMOUNT,
		INT_BITS_AMOUNT + treeLength
	)

	return createHuffmanDictionary(
		getHuffmanTreeFromBinaryString(treeStringBinary)
	)
}

export function decompress(text: string, dictionary?: Dictionary): string {
	const invertedDictionary = invertObject(
		dictionary ?? buildDictionaryFromInput(text)
	)

	const treeLength = getTreeLengthFromInput(text)
	let startIndex = INT_BITS_AMOUNT + treeLength
	let tempCode = ''
	let decompressed = ''
	
	for (let index = startIndex; index < text.length; index++) {
		for (let innerIndex = index; innerIndex < text.length + 1; innerIndex++) {
			tempCode = text.slice(index, innerIndex)
			if (tempCode in invertedDictionary) {
				decompressed +=
					invertedDictionary[
						tempCode as keyof typeof invertedDictionary
					]
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
				const { compressed, dictionary } = compress(string)
				expect(decompress(compressed, dictionary)).toBe(string)
			}
		})
	})
}
