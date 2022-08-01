/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable unicorn/filename-case */
import useLZ77 from 'hooks/useLZ77'
import type { ReactElement } from 'react'

export default function LZ77({
	plainText
}: {
	plainText: string
}): ReactElement {
	const { encodedText, decodedText } = useLZ77(plainText)

	return (
		<div className='card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto whitespace-pre-wrap'>
				<div className='card-title'>
					<h2>LZ77</h2>
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
				htmlFor='lz77-visualizer-modal'
				className='modal-button btn rounded-t-none'
			>
				Visualize
			</label>

			<input
				type='checkbox'
				id='lz77-visualizer-modal'
				className='modal-toggle'
			/>
			<label htmlFor='lz77-visualizer-modal' className='modal cursor-pointer'>
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
