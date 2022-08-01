/* eslint-disable unicorn/filename-case */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable unicorn/filename-case */
import useLZW from 'hooks/useLZW'
import type { ReactElement } from 'react'
import Dictionary from './Dictionary'

export default function LZW({
	plainText
}: {
	plainText: string
}): ReactElement {
	const { dictionary, encodedText, decodedText, encodedTextArray } =
		useLZW(plainText)

	return (
		<div className='group card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto'>
				<div className='card-title'>
					<h2>LZW</h2>
				</div>
				<span>
					<h3>Encoded Text</h3>
					{encodedText}
				</span>
				<span>
					<h3>Compression Ratio</h3>
				</span>
				<span>
					<h3>Decoded Text</h3>
					{decodedText}
				</span>
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
					<h3>Encoded Text Array</h3>
					{JSON.stringify(encodedTextArray)}
					<h3>Dictionary</h3>
					<Dictionary dictionary={dictionary} />
				</label>
			</label>
		</div>
	)
}
