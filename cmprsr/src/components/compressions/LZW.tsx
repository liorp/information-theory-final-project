import type { ReactElement } from 'react'
import { useState } from 'react'
import { compress, decompress } from 'utils/lzw'
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
	const [currentIndex, , updatedString, pushedToDictionary] =
		stages[selectedStage]

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

export default function LZW({
	plainText
}: {
	plainText: string
}): ReactElement {
	const [compressed, , dictionary, stages] = compress(plainText)
	const [decompressed] = decompress(plainText)

	return (
		<div className='group card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto'>
				<CompressionSummary
					name='LZW'
					href='https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch_compression'
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
					className='modal-box flex h-4/5 max-h-full max-w-full flex-col gap-5 overflow-y-auto'
					htmlFor=''
				>
					<h3>Dictionary</h3>
					<Dictionary dictionary={dictionary} />
					<div className='divider' />
					<h3>Stages</h3>
					<LZWStagesVisualizer stages={stages} plainText={plainText} />
				</label>
			</label>
		</div>
	)
}
