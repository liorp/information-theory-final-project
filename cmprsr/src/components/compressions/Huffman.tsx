import { useHuffmanCompress, useHuffmanDecompress } from 'hooks/useHuffman'
import type { ReactElement } from 'react'
import { useState } from 'react'
import Tree from 'react-d3-tree'
import type {
	Point,
	RawNodeDatum,
	TreeLinkDatum
} from 'react-d3-tree/lib/types/common'
import { BYTE } from 'utils/consts'
import type { HuffmanTreeNode, HuffmanTreeStages } from 'utils/huffman'
import { getHuffmanTreeSize, getHuffmanTreeString } from 'utils/huffman'
import { symbolPrettyPrint } from 'utils/utils'
import CompressionSummary from './CompressionSummary'
import Dictionary from './Dictionary'
import InfoButton from './InfoButton'

export function parseHuffmanTreeTod3(
	tree: HuffmanTreeNode,
	prefix = ''
): RawNodeDatum {
	return {
		name: symbolPrettyPrint(tree.symbols ?? ''),
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
	tree,
	translate
}: {
	tree: HuffmanTreeNode
	translate?: Point
}): ReactElement {
	return (
		<div className='h-full w-full rounded-xl border-4'>
			<Tree
				translate={translate}
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
	const stage = stages[selectedStage]

	return (
		<>
			<div className='btn-group m-4 mx-auto'>
				{[...Array.from({ length: stages.length }).keys()].map(index => (
					<button
						key={index}
						type='button'
						className={`btn ${index === selectedStage ? 'btn-active' : ''}`}
						onClick={(): void => setSelectedStage(index)}
					>
						{index + 1}
					</button>
				))}
			</div>
			<div className='flex grow gap-5'>
				{stage.slice(0, 2).map(tree => (
					<HuffmanTreeVisualizer
						key={getHuffmanTreeString(tree)}
						tree={tree}
						translate={{ x: 200, y: 10 }}
					/>
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
	const { stages, frequencies, tree, dictionary, compressed } =
		useHuffmanCompress(plainText)
	const { decompressed } = useHuffmanDecompress(plainText)
	const treeSize = getHuffmanTreeSize(tree)

	return (
		<div className='group card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto'>
				<CompressionSummary
					name='Huffman'
					href='https://en.wikipedia.org/wiki/Huffman_coding'
					compressed={compressed}
					compressionRatio={
						(treeSize + compressed.length) / (plainText.length * BYTE)
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
					className='modal-box flex h-4/5 max-h-full max-w-full flex-col gap-5 overflow-y-auto'
					htmlFor=''
				>
					<h3>Tree</h3>
					<div className='h-2/5'>
						<HuffmanTreeVisualizer tree={tree} translate={{ x: 200, y: 10 }} />
					</div>
					<div className='divider' />
					<div className='flex items-center gap-1'>
						<h3 className='w-fit'>Stages</h3>
						<InfoButton
							tooltip='Stages are the different steps of the Huffman coding compression algorithm. This shows the next two trees that are about to be merged'
							direction='right'
						/>
					</div>
					<HuffmanTreeStagesVisualizer stages={stages} />
					<div className='divider' />

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
