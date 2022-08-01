import useLZSS from 'hooks/useLZSS'
import type { ReactElement } from 'react'
import CompressionSummary from './CompressionSummary'

export default function LZSS({
	plainText
}: {
	plainText: string
}): ReactElement {
	const { compressed, decompressed } = useLZSS(plainText)

	return (
		<div className='group card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto whitespace-pre-wrap'>
				<CompressionSummary
					name='LZSS'
					compressed={JSON.stringify(compressed)}
					compressionRatio={1}
					decompressed={decompressed}
				/>
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
					<h3>Tree</h3>
				</label>
			</label>
		</div>
	)
}
