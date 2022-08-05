import StagePlayer from 'components/controls/StageController'
import type { ReactElement } from 'react'
import { useState } from 'react'
import {
	CompressionOperation,
	CompressionType,
	MAX_TEXT_LENGTH_FOR_STAGES
} from 'utils/consts'
import { compress, decompress } from 'utils/lzw'
import type { LZWStage } from 'utils/types'
import CompressionSummary from './visualizer/CompressionSummary'
import Dictionary from './visualizer/Dictionary'

function LZWStagesVisualizer({
	stages,
	input
}: {
	stages: LZWStage[]
	input: string
}): ReactElement {
	const [selectedStage, setSelectedStage] = useState(0)
	const [currentIndex, , updatedString, pushedToDictionary] =
		stages[selectedStage]

	return (
		<>
			<StagePlayer
				stageCount={stages.length}
				selectedStage={selectedStage}
				setSelectedStage={setSelectedStage}
			/>
			<div className='flex w-full flex-col items-center'>
				<span className='font-mono'>
					{[...input].map((char, index) => (
						<span
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							className={`before:invisible before:content-['.'] after:invisible after:content-['.'] ${
								index === currentIndex ? 'bg-red-300 font-bold' : ''
							}`}
						>
							{char}
						</span>
					))}
				</span>
				<span>Checking string: {updatedString}</span>
				<span>
					{pushedToDictionary
						? 'Added to dictionary'
						: "Wasn't added to dictionary"}
				</span>
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
	const { dictionary, stages } =
		operation === CompressionOperation.Compress
			? compress(input, input.length < MAX_TEXT_LENGTH_FOR_STAGES)
			: decompress(input, input.length < MAX_TEXT_LENGTH_FOR_STAGES)

	return (
		<>
			<label
				htmlFor='lzw-visualizer-modal'
				className='modal-button btn rounded-t-none transition-all group-hover:h-20'
			>
				Visualize
			</label>

			<input
				type='checkbox'
				id='lzw-visualizer-modal'
				className='modal-toggle'
			/>
			<label htmlFor='lzw-visualizer-modal' className='modal cursor-pointer'>
				<label
					className='modal-box flex h-4/5 max-h-full max-w-full flex-col gap-5 overflow-y-auto'
					htmlFor=''
				>
					<h3>Dictionary</h3>
					<Dictionary dictionary={dictionary} />
					<div className='divider' />
					<h3>Stages</h3>
					{stages.length > 0 ? (
						<LZWStagesVisualizer stages={stages} input={input} />
					) : (
						<span>Visualization not available</span>
					)}
				</label>
			</label>
		</>
	)
}

export default function LZW({ input }: { input: string }): ReactElement {
	const [operation, setOperation] = useState(CompressionOperation.Compress)

	return (
		<div className='group card flex w-full max-w-lg flex-col break-all border-2 border-neutral shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto'>
				<CompressionSummary
					type={CompressionType.LZW}
					input={input}
					operation={operation}
					setOperation={setOperation}
				/>
			</div>
			<Visualizer input={input} operation={operation} />
		</div>
	)
}
