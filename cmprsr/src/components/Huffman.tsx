/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable react/require-default-props */
import useHuffman from 'hooks/useHuffmanTree'
import type { ReactElement } from 'react'
import { getHuffmanDictionarySize } from 'utils/huffman'

export default function Huffman({
	plainText
}: {
	plainText: string
}): ReactElement {
	const [frequencies, tree, dictionary, encodedText, decodedText] =
		useHuffman(plainText)
	const dictionarySize = getHuffmanDictionarySize(dictionary)
	return (
		<div className='card flex flex-col shadow-xl'>
			<div className='card-body gap-5'>
				<div className='card-title'>
					<h2>Huffman</h2>
				</div>
				<span>
					Encoded Text: {encodedText} Size: {encodedText.length}
				</span>
				<span>
					Frequencies:{' '}
					{JSON.stringify(Object.fromEntries(frequencies.entries()))}
				</span>
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
		</div>
	)
}
