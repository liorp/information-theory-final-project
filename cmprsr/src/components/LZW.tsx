/* eslint-disable unicorn/filename-case */
import useLZW from 'hooks/useLZW'
import type { ReactElement } from 'react'

export default function LZW({
	plainText
}: {
	plainText: string
}): ReactElement {
	const { dictionary, encodedText, decodedText } = useLZW(plainText)

	return (
		<div className='card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5 overflow-y-auto'>
				<div className='card-title'>
					<h2>LZW</h2>
				</div>
				<span>
					Encoded Text: {JSON.stringify(encodedText)} Size: {encodedText.length}
				</span>
				<span>
					Decoded Text: {decodedText} Size: {decodedText.length}
				</span>
				<span>Dictionary: {JSON.stringify(dictionary)}</span>
			</div>
		</div>
	)
}
