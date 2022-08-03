import type { ReactElement } from 'react'

function InfoButton({
	tooltip,
	href,
	svg,
	alt,
	download,
	direction = 'top'
}: {
	tooltip?: string
	href?: string
	svg?: string
	alt?: string
	download?: string
	direction?: 'bottom' | 'left' | 'right' | 'top'
}): ReactElement {
	return (
		<a
			href={href}
			target='_blank'
			className={`tooltip-${direction} not-prose btn-circle btn-xs ${
				tooltip ? 'btn tooltip ' : ''
			}`}
			data-tip={tooltip}
			rel='noreferrer'
			download={download}
		>
			{svg ? (
				<img src={svg} alt={alt} />
			) : (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-6 w-6'
					fill='white'
					viewBox='0 0 16 16'
					stroke='none'
				>
					<path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' />
				</svg>
			)}
		</a>
	)
}

export default InfoButton
