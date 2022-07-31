/* eslint-disable unicorn/filename-case */
import type { ReactElement } from 'react'

export default function LZ77({
	plainText
}: {
	plainText: string
}): ReactElement {
	return (
		<div className='card flex w-full max-w-lg flex-col break-all shadow-xl'>
			<div className='card-body gap-5'>
				<div className='card-title'>
					<h2>LZ77</h2>
				</div>
				{plainText}
			</div>
		</div>
	)
}
