/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable react/require-default-props */
import useHuffman from 'hooks/useHuffmanTree'
import type { ReactElement } from 'react'
import Tree from 'react-d3-tree'
import type {
	RawNodeDatum,
	TreeLinkDatum
} from 'react-d3-tree/lib/types/common'
import type { HuffmanTree } from 'utils/huffman'
import { getHuffmanDictionarySize } from 'utils/huffman'

export function parseHuffmanTreeTod3(
	tree: HuffmanTree,
	prefix = ''
): RawNodeDatum {
	return {
		name: tree.symbols ?? '',
		attributes: { ...(tree.symbols && { code: prefix }) },
		children: [tree.left, tree.right]
			.filter(child => child !== undefined)
			.map((child, index) =>
				parseHuffmanTreeTod3(child as HuffmanTree, `${prefix}${index}`)
			)
	}
}

const getDynamicPathClass = ({ source, target }: TreeLinkDatum): string => {
	if (source.children?.[0] === target) {
		return 'link__to-left'
	}
	if (source.children?.[1] === target) {
		return 'link__to-right'
	}
	// Style it as a link connecting two branch nodes by default.
	return 'link__to-branch'
}

function HuffmanTreeVisualizer({ tree }: { tree: HuffmanTree }): ReactElement {
	return (
		<div className='h-full w-full'>
			<Tree
				data={parseHuffmanTreeTod3(tree)}
				orientation='vertical'
				pathFunc='straight'
				pathClassFunc={getDynamicPathClass}
				zoom={0.4}
			/>
		</div>
	)
}

export default function Huffman({
	plainText
}: {
	plainText: string
}): ReactElement {
	const [frequencies, tree, dictionary, encodedText, decodedText] =
		useHuffman(plainText)
	const dictionarySize = getHuffmanDictionarySize(dictionary)
	return (
		<div className='card flex max-w-md flex-col break-all shadow-xl'>
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
				<span>Tree:</span>
				<HuffmanTreeVisualizer tree={tree} />
			</div>
		</div>
	)
}
