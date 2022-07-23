import type { ReactElement } from 'react'

export default function LempelZiv({
	plainText
}: {
	plainText: string
}): ReactElement {
	return (
		<div className='card flex flex-col shadow-xl'>
			<div className='card-body gap-5'>
				<div className='card-title'>
					<h2>Lempel-Ziv</h2>
				</div>
				{plainText}
			</div>
		</div>
	)
}
