/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-handler-names, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import Huffman from 'components/compressions/Huffman'
import LZSS from 'components/compressions/LZSS'
import LZW from 'components/compressions/LZW'
import Footer from 'components/layout/Footer'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const encodings = [Huffman, LZSS, LZW]

export default function Home(): ReactElement {
	const [searchParameters, setSearchParameters] = useSearchParams()
	const plaintext = searchParameters.get('plaintext')

	const [textToCompress, setTextToCompress] = useState(plaintext ?? '')

	return (
		<div className='flex h-full flex-col items-center'>
			<form
				className='prose mx-auto grid h-1/2 w-3/4 gap-2 lg:prose-xl'
				onSubmit={async (event): Promise<void> => {
					event.preventDefault()

					const nextPlaintext = (event.target as HTMLFormElement).elements
						.plaintext.value as string
					setSearchParameters({
						plaintext: nextPlaintext
					})
					setTextToCompress(nextPlaintext)
					const { files } = (event.target as HTMLFormElement).elements.plainfile
					if (files.length > 0) {
						const file = files[0] as File
						if (file.type === 'text/plain') {
							setTextToCompress(await file.text())
						}
					}
				}}
			>
				<a href='/'>
					<h1 className='text-gradient w-min transform bg-green-300 font-vt323 transition hover:-rotate-6'>
						CMPRSR
					</h1>
				</a>
				<div className='flex min-h-[20vh] w-full'>
					<textarea
						id='plaintext'
						name='plaintext'
						className='textarea grow'
						placeholder='Enter your text here'
						defaultValue={`${plaintext ?? ''}`}
						onKeyDown={event => {
							if (event.key === 'Enter' && !event.shiftKey) {
								event.preventDefault()
								;(
									event.nativeEvent.target?.parentNode
										.parentNode as HTMLFormElement
								).requestSubmit()
							}
						}}
					/>
					<div className='divider divider-horizontal'>OR</div>
					<input type='file' name='plainfile' />
				</div>
				<button className='btn' type='submit'>
					Compress
				</button>
			</form>
			<div className='carousel rounded-box w-5/6 grow'>
				{textToCompress
					? encodings.map((Encoding, index) => (
							<div
								// eslint-disable-next-line react/no-array-index-key
								key={index}
								className='carousel-item prose flex-[0_0_40%] p-4 prose-headings:m-0'
							>
								<Encoding plainText={textToCompress} />
							</div>
					  ))
					: undefined}
			</div>
			<Footer />
		</div>
	)
}
