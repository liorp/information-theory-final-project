/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-handler-names, react/no-array-index-key, @typescript-eslint/no-magic-numbers, react/require-default-props */
import useHuffman from 'hooks/useHuffman'
import type { ReactElement } from 'react'
import { useState } from 'react'
import Tree from 'react-d3-tree'
import type {
	RawNodeDatum,
	TreeLinkDatum
} from 'react-d3-tree/lib/types/common'
import type { HuffmanTreeNode, HuffmanTreeStages } from 'utils/huffman'
import { getHuffmanTreeSize } from 'utils/huffman'
import CompressionSummary from './CompressionSummary'
import Dictionary from './Dictionary'

export function parseHuffmanTreeTod3(
	tree: HuffmanTreeNode,
	prefix = ''
): RawNodeDatum {
	return {
		name: tree.symbols ?? '',
		attributes: { ...(tree.symbols && { code: prefix }) },
		children: [tree.left, tree.right]
			.filter(child => child !== undefined)
			.map((child, index) =>
				parseHuffmanTreeTod3(child as HuffmanTreeNode, `${prefix}${index}`)
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

function HuffmanTreeVisualizer({
	tree
}: {
	tree: HuffmanTreeNode
}): ReactElement {
	return (
		<div className='border-500 h-full w-full rounded-xl border-4'>
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

function HuffmanTreeStagesVisualizer({
	stages
}: {
	stages: HuffmanTreeStages
}): ReactElement {
	const [selectedStage, setSelectedStage] = useState(0)

	return (
		<>
			<div className='btn-group m-4'>
				{stages.map((stage, index) => (
					<button
						key={index}
						type='button'
						className={`btn ${index === selectedStage ? 'btn-active' : ''}`}
						onClick={(): void => setSelectedStage(index)}
					>
						{index}
					</button>
				))}
			</div>
			<div className='flex grow gap-5'>
				{stages[selectedStage].slice(0, 2).map((tree, index) => (
					<HuffmanTreeVisualizer key={index} tree={tree} />
				))}
			</div>
		</>
	)
}

export default function Huffman({
	plainText
}: {
	plainText: string
}): ReactElement {
	const { stages, frequencies, tree, dictionary, compressed, decompressed } =
		useHuffman(plainText)
	const treeSize = getHuffmanTreeSize(tree)
	return (
		<div className='group card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto'>
				<CompressionSummary
					name='Huffman'
					compressed={compressed}
					compressionRatio={
						(treeSize + compressed.length) / (decompressed.length * 8)
					}
					decompressed={decompressed}
				/>
			</div>
			<label
				htmlFor='huffman-visualizer-modal'
				className='modal-button btn rounded-t-none transition-all group-hover:h-20'
			>
				Visualize
			</label>

			<input
				type='checkbox'
				id='huffman-visualizer-modal'
				className='modal-toggle'
			/>
			<label
				htmlFor='huffman-visualizer-modal'
				className='modal cursor-pointer'
			>
				<label
					className='modal-box flex h-4/5 max-h-full max-w-full flex-col overflow-y-auto'
					htmlFor=''
				>
					<h3>Tree</h3>
					<div className='h-2/5'>
						<HuffmanTreeVisualizer tree={tree} />
					</div>
					<h3>Stages</h3>
					<HuffmanTreeStagesVisualizer stages={stages} />
					<details>
						<summary>Frequencies</summary>
						<Dictionary
							dictionary={Object.fromEntries(frequencies.entries())}
							keyHeader='Symbol'
							valueHeader='Frequency'
						/>
					</details>
					<details>
						<summary>Dictionary ({treeSize} bytes)</summary>
						<Dictionary dictionary={dictionary} />
					</details>
				</label>
			</label>
		</div>
	)
}
