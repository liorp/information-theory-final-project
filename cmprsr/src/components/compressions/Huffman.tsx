import type { ReactElement } from 'react'
import { useState } from 'react'
import Tree from 'react-d3-tree'
import type {
	Point,
	RawNodeDatum,
	TreeLinkDatum
} from 'react-d3-tree/lib/types/common'
import { CompressionOperation, CompressionType } from 'utils/consts'
import type { HuffmanTreeNode, HuffmanTreeStages } from 'utils/huffman'
import {
	compress,
	createHuffmanTreeStages,
	decompress,
	getHuffmanTreeSize,
	getHuffmanTreeString
} from 'utils/huffman'
import { symbolPrettyPrint } from 'utils/utils'
import { InfoSVG } from '../controls/Link'
import StagePlayer from '../controls/StageController'
import CompressionSummary from './visualizer/CompressionSummary'
import Dictionary from './visualizer/Dictionary'

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
			<StagePlayer
				stageCount={stages.length}
				selectedStage={selectedStage}
				setSelectedStage={setSelectedStage}
			/>
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

function Visualizer({
	input,
	operation
}: {
	input: string
	operation: CompressionOperation
}): ReactElement {
	const { dictionary, frequencies, tree } =
		operation === CompressionOperation.Compress
			? compress(input)
			: decompress(input)
	const treeSize = tree && getHuffmanTreeSize(tree)
	const stages = frequencies ? createHuffmanTreeStages(frequencies) : []

	return (
		<>
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
					<div className='h-3/5'>
						{tree ? (
							<HuffmanTreeVisualizer
								tree={tree}
								translate={{ x: 200, y: 10 }}
							/>
						) : (
							<span>Visualization is not available for this string</span>
						)}
					</div>
					<div className='divider' />
					<div className='flex items-center gap-1'>
						<h3 className='w-fit'>Stages</h3>
						<button
							type='button'
							className='not-prose btn tooltip tooltip-right btn-circle btn-xs'
							data-tip='Stages are the different steps of the Huffman coding compression algorithm. This shows the next two trees that are about to be merged'
						>
							{InfoSVG}
						</button>
					</div>
					{stages.length > 0 ? (
						<HuffmanTreeStagesVisualizer stages={stages} />
					) : (
						<span>Visualization is not available for this string</span>
					)}
					<div className='divider' />

					<details>
						<summary>Frequencies</summary>
						{frequencies ? (
							<Dictionary
								dictionary={Object.fromEntries(frequencies.entries())}
								keyHeader='Symbol'
								valueHeader='Frequency'
							/>
						) : (
							<span>Visualization is not available for this string</span>
						)}
					</details>
					<details>
						<summary>Dictionary ({treeSize} bytes)</summary>
						<Dictionary dictionary={dictionary} />
					</details>
				</label>
			</label>
		</>
	)
}

export default function Huffman({ input }: { input: string }): ReactElement {
	const [operation, setOperation] = useState(CompressionOperation.Compress)
	return (
		<div className='group card flex w-full max-w-lg flex-col break-all border-2 border-neutral shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto'>
				<CompressionSummary
					type={CompressionType.Huffman}
					input={input}
					operation={operation}
					setOperation={setOperation}
				/>
			</div>
			<Visualizer input={input} operation={operation} />
		</div>
	)
}
