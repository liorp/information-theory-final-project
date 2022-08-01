/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-handler-names, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import Footer from 'components/Footer'
import Huffman from 'components/Huffman'
import LZ77 from 'components/LZ77'
import LZW from 'components/LZW'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const encodings = [Huffman, LZ77, LZW]

export default function Home(): ReactElement {
	const [searchParameters, setSearchParameters] = useSearchParams()
	const plaintext = searchParameters.get('plaintext')

	const [textToEncode, setTextToEncode] = useState(plaintext ?? '')

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
					setTextToEncode(nextPlaintext)
					const { files } = (event.target as HTMLFormElement).elements.plainfile
					if (files.length > 0) {
						const file = files[0] as File
						if (file.type === 'text/plain') {
							setTextToEncode(await file.text())
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
					/>
					<div className='divider divider-horizontal'>OR</div>
					<input type='file' name='plainfile' />
				</div>
				<button className='btn' type='submit'>
					Compress
				</button>
			</form>
			<div className='carousel rounded-box w-5/6 grow'>
				{textToEncode
					? encodings.map((Encoding, index) => (
							<div
								// eslint-disable-next-line react/no-array-index-key
								key={index}
								className='carousel-item prose flex-[0_0_40%] p-4 prose-headings:m-0'
							>
								<Encoding plainText={textToEncode} />
							</div>
					  ))
					: undefined}
			</div>
			<Footer />
		</div>
	)
}
