import type { ReactElement } from 'react'
import { useState } from 'react'
import { CompressionType } from 'utils/consts'
import type { LZSSStage } from 'utils/types'
import CompressionSummary from './CompressionSummary'

function LZSSStagesVisualizer({
	stages,
	plainText
}: {
	stages: LZSSStage[]
	plainText: string
}): ReactElement {
	const [selectedStage, setSelectedStage] = useState(0)
	const [currentIndex, , updatedString, pushedPointer] = stages[selectedStage]

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
			<div className='mx-auto flex flex-col'>
				<span className='font-mono'>
					{[...plainText].map((char, index) => (
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

export default function LZSS({ input }: { input: string }): ReactElement {
	return (
		<div className='group card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto whitespace-pre-wrap'>
				<CompressionSummary type={CompressionType.LZSS} input={input} />
			</div>
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
					<div className='divider' />
					<h3>Stages</h3>
					{stages.length > 0 ? (
						<LZSSStagesVisualizer stages={stages} plainText={plainText} />
					) : (
						<span>The string was not compressed</span>
					)}
				</label>
			</label>
		</div>
	)
}
