import StagePlayer from 'components/controls/StageController'
import type { ReactElement } from 'react'
import { useState } from 'react'
import {
	CompressionOperation,
	CompressionType,
	MAX_TEXT_LENGTH_FOR_STAGES
} from 'utils/consts'
import { compress } from 'utils/lzss'
import type { LZSSStage } from 'utils/types'
import CompressionSummary from './visualizer/CompressionSummary'

function LZSSStagesVisualizer({
	stages,
	input
}: {
	stages: LZSSStage[]
	input: string
}): ReactElement {
	const [selectedStage, setSelectedStage] = useState(0)
	const [currentIndex, , updatedString, pushedPointer] = stages[selectedStage]

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
				<span>{pushedPointer ? 'Pushed pointer' : "Didn't push pointer"}</span>
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
	const { stages } = compress(input, input.length < MAX_TEXT_LENGTH_FOR_STAGES)

	return (
		<>
			<label
				htmlFor='lzss-visualizer-modal'
				className='modal-button btn rounded-t-none transition-all group-hover:h-20'
			>
				Visualize
			</label>

			<input
				type='checkbox'
				id='lzss-visualizer-modal'
				className='modal-toggle'
			/>
			<label htmlFor='lzss-visualizer-modal' className='modal cursor-pointer'>
				<label
					className='modal-box flex h-4/5 max-h-full max-w-full flex-col overflow-y-auto'
					htmlFor=''
				>
					<h3>Stages</h3>
					{operation === CompressionOperation.Compress && stages.length > 0 ? (
						<LZSSStagesVisualizer stages={stages} input={input} />
					) : (
						<span>Visualization not available for this string</span>
					)}
				</label>
			</label>
		</>
	)
}

export default function LZSS({ input }: { input: string }): ReactElement {
	const [operation, setOperation] = useState(CompressionOperation.Compress)

	return (
		<div className='group card flex w-full max-w-lg flex-col break-all border-2 border-neutral shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto whitespace-pre-wrap'>
				<CompressionSummary
					type={CompressionType.LZSS}
					input={input}
					operation={operation}
					setOperation={setOperation}
				/>
			</div>
			<Visualizer input={input} operation={operation} />
		</div>
	)
}
