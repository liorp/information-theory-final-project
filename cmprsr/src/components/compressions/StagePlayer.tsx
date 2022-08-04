import type { Dispatch, ReactElement, SetStateAction } from 'react'
import { useState } from 'react'
import { useBoolean, useInterval } from 'react-use'
import { mod } from 'utils/utils'

function StageController({
	stageCount,
	selectedStage,
	setSelectedStage
}: {
	stageCount: number
	selectedStage: number
	setSelectedStage: Dispatch<SetStateAction<number>>
}): ReactElement {
	const [delay, setDelay] = useState(1000)
	const [isRunning, toggleIsRunning] = useBoolean(true)

	useInterval(
		() => {
			setSelectedStage(stage => mod(stage + 1, stageCount))
		},
		// eslint-disable-next-line unicorn/no-null
		isRunning ? delay : null
	)
	return (
		<div className='flex items-center gap-4'>
			<select className='select select select-bordered max-w-xs'>
				{[...Array.from({ length: stageCount }).keys()].map(index => (
					<option
						key={index}
						onClick={(): void => setSelectedStage(index)}
						selected={index === selectedStage}
					>
						{index + 1}
					</option>
				))}
			</select>

			<button
				type='button'
				onClick={(): void =>
					setSelectedStage(stage => mod(stage - 1, stageCount))
				}
				className='btn btn-outline btn-active'
			>
				<img
					src='https://www.svgrepo.com/show/56613/back.svg'
					className='!m-0 h-6 w-6'
					alt='Previous'
				/>
			</button>
			<button
				type='button'
				onClick={(): void => toggleIsRunning()}
				className='btn btn-outline'
			>
				{isRunning ? (
					<img
						src='https://www.svgrepo.com/show/79225/pause.svg'
						className='!m-0 h-6 w-6'
						alt='Pause'
					/>
				) : (
					<img
						src='https://www.svgrepo.com/show/175619/play.svg'
						className='!m-0 h-6 w-6'
						alt='Play'
					/>
				)}
			</button>
			<button
				type='button'
				onClick={(): void =>
					setSelectedStage(stage => mod(stage + 1, stageCount))
				}
				className='btn btn-outline'
			>
				<img
					src='https://www.svgrepo.com/show/45445/next.svg'
					className='!m-0 h-6 w-6'
					alt='Next'
				/>
			</button>
		</div>
	)
}

export default StageController
