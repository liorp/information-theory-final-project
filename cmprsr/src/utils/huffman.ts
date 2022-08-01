import { invertObject } from 'utils/utils'
import { BYTE } from './consts'
import { PriorityQueue } from './priorityQueue'
import type { Dictionary } from './types'

export interface HuffmanTreeNode {
	readonly frequency: number
	readonly symbols?: string
	readonly left?: HuffmanTreeNode
	readonly right?: HuffmanTreeNode
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
	stages.push(structuredClone(queue.strategy.data) as HuffmanTreeNode[])

	while (queue.length > 1) {
		const left = queue.dequeue()
		const right = queue.dequeue()
		queue.queue({
			frequency: left.frequency + right.frequency,
			left,
			right
		})
		stages.push(structuredClone(queue.strategy.data) as HuffmanTreeNode[])
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
	prefix = ''
): Dictionary {
	if (!tree) return {}
	if (tree.symbols) {
		return { [tree.symbols]: prefix }
	}
	return {
		...createHuffmanDictionary(tree.left, `${prefix}0`),
		...createHuffmanDictionary(tree.right, `${prefix}1`)
	}
}

export function getHuffmanTreeString(root?: HuffmanTreeNode): string {
	// Leafs are represented as 0, other nodes are represented as 1
	// If we try accessing a non-existing child, we return 0
	if (root === undefined) {
		return '0'
	}

	// If root is a leaf, it takes 1 (leaf bit) + BYTE (typically 8) bits to represent it
	if (root.left === undefined && root.right === undefined) {
		return `0${root.symbols ?? ''}`
	}

	// Else, root is not a leaf, so it takes 1 bit to represent it
	return `1${getHuffmanTreeString(root.left)}${getHuffmanTreeString(
		root.right
	)}`
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

export function compress(
	text: string
): [string, Dictionary, Frequencies, HuffmanTreeNode] {
	const frequencies = getLetterFrequencies(text)
	const tree = createHuffmanTree(frequencies)
	const dictionary = createHuffmanDictionary(tree)

	return [
		text.replace(
			/[\d\sA-Za-z]/g,
			letter => dictionary[letter as keyof typeof dictionary] ?? letter
		),
		dictionary,
		frequencies,
		tree
	]
}

export function decompress(text: string, dictionary: Dictionary): string {
	const invertedDictionary = invertObject(dictionary)
	let decompressed = ''
	for (let index = 0; index < text.length; index++) {
		for (let innerIndex = index; innerIndex < text.length + 1; innerIndex++) {
			if (text.slice(index, innerIndex) in invertedDictionary) {
				decompressed +=
					invertedDictionary[
						text.slice(index, innerIndex) as keyof typeof invertedDictionary
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
			expect(decompress(...compress('AABCBBABC'))).toEqual('AABCBBABC')
			expect(decompress(...compress('Hello World'))).toEqual('Hello World')
			expect(decompress(...compress('Hello Hello Hello'))).toEqual(
				'Hello Hello Hello'
			)
			expect(decompress(...compress('fffaa'))).toEqual('fffaa')
			expect(decompress(...compress('hellofffasdf'))).toEqual('hellofffasdf')
		})
	})
}
