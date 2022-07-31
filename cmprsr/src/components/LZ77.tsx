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
			<div className='card-body gap-5 overflow-y-auto'>
				<div className='card-title'>
					<h2>LZ77</h2>
				</div>
				<span>
					Encoded Text: {JSON.stringify(encodedText)} Size: {encodedText.length}
				</span>
				<span>
					Decoded Text: {decodedText} Size: {decodedText.length}
				</span>
			</div>
		</div>
	)
}
