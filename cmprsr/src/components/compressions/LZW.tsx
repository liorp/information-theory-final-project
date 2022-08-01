import useLZW from 'hooks/useLZW'
import type { ReactElement } from 'react'
import { useState } from 'react'
import type { LZWStage } from 'utils/types'
import CompressionSummary from './CompressionSummary'
import Dictionary from './Dictionary'

function LZWStagesVisualizer({
	stages,
	plainText
}: {
	stages: LZWStage[]
	plainText: string
}): ReactElement {
	const [selectedStage, setSelectedStage] = useState(0)
	const [currentIndex, character, updatedString, pushedToDictionary] =
		stages[selectedStage]

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
			<div className='flex flex-col'>
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
				<span>
					{pushedToDictionary
						? 'Added to dictionary'
						: "Wasn't added to dictionary"}
				</span>
			</div>
		</>
	)
}

export default function LZW({
	plainText
}: {
	plainText: string
}): ReactElement {
	const { dictionary, compressed, decompressed, compressedArray, stages } =
		useLZW(plainText)

	return (
		<div className='group card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto'>
				<CompressionSummary
					name='LZW'
					compressed={compressed}
					compressionRatio={1}
					decompressed={decompressed}
				/>
			</div>
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
					className='modal-box flex h-4/5 max-h-full max-w-full flex-col overflow-y-auto'
					htmlFor=''
				>
					<h3>Compressed Bytes Array</h3>
					{JSON.stringify(compressedArray)}
					<h3>Dictionary</h3>
					<Dictionary dictionary={dictionary} />
					<h3>Stages</h3>
					<LZWStagesVisualizer stages={stages} plainText={plainText} />
				</label>
			</label>
		</div>
	)
}
