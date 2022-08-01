/* eslint-disable unicorn/filename-case */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable unicorn/filename-case */
import useLZSS from 'hooks/useLZSS'
import type { ReactElement } from 'react'

export default function LZSS({
	plainText
}: {
	plainText: string
}): ReactElement {
	const { encodedText, decodedText } = useLZSS(plainText)

	return (
		<div className='group card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto whitespace-pre-wrap'>
				<div className='card-title'>
					<h2>LZSS</h2>
				</div>
				<span>
					<h3>Encoded Text</h3>
					{JSON.stringify(encodedText)}
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