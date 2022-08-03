import Huffman from 'components/compressions/Huffman'
import LZSS from 'components/compressions/LZSS'
import LZW from 'components/compressions/LZW'
import Footer from 'components/layout/Footer'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const encodings = [
	{ name: 'huffman', Component: Huffman },
	{ name: 'lzss', Component: LZSS },
	{ name: 'lzw', Component: LZW }
]

export default function Home(): ReactElement {
	const [searchParameters, setSearchParameters] = useSearchParams()
	const plaintext = searchParameters.get('plaintext')

	const [textToCompress, setTextToCompress] = useState(plaintext ?? '')

	return (
		<div className='flex h-full flex-col items-center'>
			<form
				className='prose mx-auto grid h-1/3 w-3/4 gap-2 lg:prose-lg'
				onSubmit={async (event): Promise<void> => {
					event.preventDefault()

					const nextPlaintext = (
						(event.target as HTMLFormElement).elements
							.plaintext as HTMLTextAreaElement
					).value
					setSearchParameters({
						plaintext: nextPlaintext
					})
					setTextToCompress(nextPlaintext)
					const { files } = (event.target as HTMLFormElement).elements
						.plainfile as HTMLInputElement
					if (files && files.length > 0) {
						const file = files[0]
						if (file.type === 'text/plain') {
							setTextToCompress(await file.text())
						}
					}
				}}
			>
				<a href='/' className='h-min w-1/4 min-w-[18em]'>
					<h1
						className={`text-gradient ${
							textToCompress ? '' : 'blink-cursor'
						} !mb-0 h-min transform bg-green-300 font-vt323`}
					>
						CMPRSR
					</h1>
				</a>
				<div className='flex min-h-[20vh] w-full flex-wrap'>
					<textarea
						id='plaintext'
						name='plaintext'
						className='textarea basis-[46%]'
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
					<div className='divider divider-horizontal'>OR</div>
					<input type='file' name='plainfile' className='basis-5/12' />
				</div>
				<div className='flex w-full gap-4'>
					<button className='btn grow' type='submit'>
						Compress
					</button>
					<button className='btn grow' type='submit'>
						Decompress
					</button>
				</div>
			</form>
			<div className='carousel my-2 w-full grow p-4'>
				{textToCompress
					? encodings.map(({ name, Component }) => (
							<div
								key={name}
								className='carousel-item prose flex-[0_0_40%] p-4 prose-headings:m-0'
							>
								<Component plainText={textToCompress} />
							</div>
					  ))
					: undefined}
			</div>
			<Footer />
		</div>
	)
}
