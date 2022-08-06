import StagePlayer from 'components/controls/StageController'
import type { ReactElement, ReactNode } from 'react'
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
			<div className='mx-auto flex flex-col'>
				<span className='font-mono'>
					{[...input].map((char, index) => (
						<span
							key={char}
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

function Visualizer({ input }: { input: string }): ReactNode {
	const { stages } = compress(input, input.length < MAX_TEXT_LENGTH_FOR_STAGES)

	if (stages.length === 0) return undefined

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
					<LZSSStagesVisualizer stages={stages} input={input} />
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
			{operation === CompressionOperation.Compress && (
				<Visualizer input={input} />
			)}
		</div>
	)
}
