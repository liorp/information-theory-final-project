/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-magic-numbers */

import { invertObject } from 'utils'
import { PriorityQueue } from './priorityQueue'

export interface HuffmanTree {
	readonly frequency: number
	readonly symbols?: string
	readonly left?: HuffmanTree
	readonly right?: HuffmanTree
}

export type Frequencies = Map<string, number>

export interface Dictionary {
	string?: string
}

export function getLetterFrequencies(text: string): Frequencies {
	const frequencies = new Map<string, number>()
	for (const letter of text) {
		frequencies.set(letter, (frequencies.get(letter) ?? 0) + 1)
	}
	return frequencies
}

export function createHuffmanTree(frequencies: Frequencies): HuffmanTree {
	const queue = new PriorityQueue<HuffmanTree>({
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
	tree?: HuffmanTree,
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

export function getHuffmanDictionarySize(dictionary: Dictionary): number {
	// 8 bits for every symbol, and then 1 bit for the prefix
	const keys = Object.keys(dictionary).length * 8
	const values = Object.values(dictionary).reduce(
		(accumulator: number, value: string) => accumulator + value.length,
		0
	) as number
	return keys + values
}

export function encode(text: string, dictionary: Dictionary): string {
	return text.replace(
		/[\d\sA-Za-z]/g,
		letter => dictionary[letter as keyof typeof dictionary] ?? letter
	)
}

export function decode(text: string, dictionary: Dictionary): string {
	const invertedDictionary = invertObject(dictionary)
	let decryptedText = ''
	for (let index = 0; index < text.length; index++) {
		// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
		for (let index_ = index; index_ < text.length + 1; index_++) {
			if (text.slice(index, index_) in invertedDictionary) {
				decryptedText +=
					invertedDictionary[
						text.slice(index, index_) as keyof typeof invertedDictionary
					]
				index = index_ - 1
				break
			}
		}
	}
	return decryptedText
}