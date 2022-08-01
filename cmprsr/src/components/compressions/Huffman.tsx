import useHuffman from 'hooks/useHuffman'
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
		<div className='border-500 h-full w-full rounded-xl border-4'>
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

	return (
		<>
			<div className='btn-group m-4'>
				{[...Array.from({ length: stages.length }).keys()].map(index => (
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
				{stages[selectedStage].slice(0, 2).map(tree => (
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
						(treeSize + compressed.length) / (decompressed.length * BYTE)
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
						<HuffmanTreeVisualizer tree={tree} translate={{ x: 200, y: 10 }} />
					</div>
					<div className='flex items-center gap-1'>
						<h3 className='w-fit'>Stages</h3>
						<button
							type='button'
							className='btn tooltip tooltip-right btn-circle btn-xs'
							data-tip='This shows the next two trees that are about to be merged'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='currentColor'
								viewBox='0 0 16 16'
								stroke='none'
							>
								<path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' />
							</svg>
						</button>
					</div>
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
