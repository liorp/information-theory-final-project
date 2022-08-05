import Huffman from 'components/compressions/Huffman'
import LZW from 'components/compressions/LZW'
import Footer from 'components/layout/Footer'
import type { ReactElement, SyntheticEvent } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CompressionType, InputMode } from 'utils/consts'

const compressionToComponent = {
	[CompressionType.Huffman]: Huffman,
	[CompressionType.LZW]: LZW
	// [CompressionType.LZSS]: <LZSS />
}

export default function Home(): ReactElement {
	const [searchParameters, setSearchParameters] = useSearchParams()
	const plaintext = searchParameters.get('plaintext')

	const [inputMode, setInputMode] = useState<InputMode>(InputMode.Text)
	const [input, setInput] = useState(plaintext ?? '')
	const onFormSubmit = async (event: SyntheticEvent): Promise<void> => {
		event.preventDefault()

		switch (inputMode) {
			case InputMode.File: {
				const { files } = (event.target as HTMLFormElement).elements
					.plainfile as HTMLInputElement
				if (files && files.length > 0) {
					const file = files[0]
					if (file.type === 'text/plain') {
						setInput(await file.text())
					}
				}
				break
			}
			case InputMode.Text: {
				const nextPlaintext = (
					(event.target as HTMLFormElement).elements
						.plaintext as HTMLTextAreaElement
				).value
				setSearchParameters({
					plaintext: nextPlaintext
				})
				setInput(nextPlaintext)
				break
			}
			default:
				throw new Error('Unknown mode')
		}
	}

	return (
		<div className='flex h-full flex-col items-center'>
			<form
				className='prose mx-auto grid h-1/3 w-3/4 items-center gap-2 lg:prose-lg'
				onSubmit={onFormSubmit}
			>
				<a href='/' className='h-min w-1/4 min-w-[18em]'>
					<h1
						className={`text-gradient ${
							input ? '' : 'blink-cursor'
						} !mb-0 h-min transform bg-green-300 font-vt323`}
					>
						CMPRSR
					</h1>
				</a>
				<div className='flex min-h-[20vh] w-full flex-wrap justify-center'>
					<div className='btn-group'>
						<button
							type='button'
							className={`btn ${
								inputMode === InputMode.Text ? 'btn-active' : ''
							}`}
							onClick={(): void => setInputMode(InputMode.Text)}
						>
							Text
						</button>
						<button
							type='button'
							className={`btn ${
								inputMode === InputMode.File ? 'btn-active' : ''
							}`}
							onClick={(): void => setInputMode(InputMode.File)}
						>
							File
						</button>
					</div>
					{inputMode === InputMode.Text && (
						<textarea
							id='plaintext'
							name='plaintext'
							className='border-16 textarea w-full grow border-slate-300'
							placeholder='Enter your text here'
							defaultValue={`${plaintext ?? ''}`}
							onKeyDown={(event): void => {
								if (
									event.key === 'Enter' &&
									!event.shiftKey &&
									event.nativeEvent.target
								) {
									event.preventDefault()
									;(
										(event.nativeEvent.target as Element).parentNode
											.parentNode as HTMLFormElement
									).requestSubmit()
								}
							}}
						/>
					)}
					{inputMode === InputMode.File && (
						<input type='file' name='plainfile' className='w-full' />
					)}
				</div>
				<button className='btn w-min place-self-end' type='submit'>
					Go
				</button>
			</form>
			<div className='carousel my-2 w-full grow p-4'>
				{input
					? Object.entries(compressionToComponent).map(([type, Component]) => (
							<div
								key={type}
								className='carousel-item prose flex-[0_0_40%] p-4 prose-headings:m-0'
							>
								<Component input={input} />
							</div>
					  ))
					: undefined}
			</div>
			<Footer />
		</div>
	)
}
