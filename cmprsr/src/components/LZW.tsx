/* eslint-disable unicorn/filename-case */
import useLZW from 'hooks/useLZW'
import type { ReactElement } from 'react'
import Dictionary from './Dictionary'

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
					<h3>Encoded Text</h3>
					{JSON.stringify(encodedText)}
				</span>
				<details>
					<summary>Dictionary</summary>
					<Dictionary dictionary={dictionary} />
				</details>
				<span>
					<h3>Compression Ratio</h3>
				</span>
				<span>
					<h3>Decoded Text</h3>
					{decodedText}
				</span>
				<details>
					<summary>Visualize This!</summary>
				</details>
			</div>
		</div>
	)
}
