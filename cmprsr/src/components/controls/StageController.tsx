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
	const [delay, setDelay] = useState(1500)
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
			<select
				className='select select-bordered select-sm max-w-xs py-0'
				value={selectedStage}
				onChange={(event): void => setSelectedStage(Number(event.target.value))}
			>
				{[...Array.from({ length: stageCount }).keys()].map(index => (
					<option key={index} value={index}>
						{index + 1}
					</option>
				))}
			</select>

			<button
				type='button'
				onClick={(): void =>
					setSelectedStage(stage => mod(stage - 1, stageCount))
				}
				className='btn btn-outline btn-active btn-sm'
			>
				<img
					src='https://www.svgrepo.com/show/56613/back.svg'
					className='!m-0 h-3 w-3 '
					alt='Previous'
				/>
			</button>
			<button
				type='button'
				onClick={(): void => toggleIsRunning()}
				className='btn btn-outline btn-sm'
			>
				{isRunning ? (
					<img
						src='https://www.svgrepo.com/show/79225/pause.svg'
						className='!m-0 h-3 w-3'
						alt='Pause'
					/>
				) : (
					<img
						src='https://www.svgrepo.com/show/175619/play.svg'
						className='!m-0 h-3 w-3'
						alt='Play'
					/>
				)}
			</button>
			<button
				type='button'
				onClick={(): void =>
					setSelectedStage(stage => mod(stage + 1, stageCount))
				}
				className='btn btn-outline btn-sm'
			>
				<img
					src='https://www.svgrepo.com/show/45445/next.svg'
					className='!m-0 h-3 w-3'
					alt='Next'
				/>
			</button>
		</div>
	)
}

export default StageController
