/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable react/require-default-props */
import useHuffmanTree from 'hooks/useHuffmanTree'
import type { ReactElement } from 'react'
import { getHuffmanDictionarySize } from 'utils/huffman'

export default function HuffmanTree({
	plainText
}: {
	plainText: string
}): ReactElement {
	const [frequencies, tree, dictionary, encodedText, decodedText] =
		useHuffmanTree(plainText)
	const dictionarySize = getHuffmanDictionarySize(dictionary)
	return (
		<div className='flex flex-col'>
			HuffmanTree
			<span>
				Encoded Text: {encodedText} Size: {encodedText.length}
			</span>
			<span>Frequencies: {JSON.stringify(frequencies)}</span>
			<span>Tree: {JSON.stringify(tree)}</span>
			<span>
				Dictionary: {JSON.stringify(dictionary)} Size:{dictionarySize}
			</span>
			<span>
				Decoded Text: {decodedText} Size: {decodedText.length * 8}
			</span>
			<span>
				Compression Ratio:{' '}
				{(encodedText.length + dictionarySize) / (decodedText.length * 8)}{' '}
			</span>
		</div>
	)
}
