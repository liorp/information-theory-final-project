/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-handler-names, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import Footer from 'components/Footer'
import Huffman from 'components/Huffman'
import LempelZiv from 'components/LempelZiv'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const encodings = [Huffman, LempelZiv]

export default function Home(): ReactElement {
	const [searchParameters, setSearchParameters] = useSearchParams()
	const plaintext = searchParameters.get('plaintext')

	const [textToEncode, setTextToEncode] = useState(plaintext ?? '')

	return (
		<div className='flex h-full flex-col'>
			<form
				className='prose mx-auto mt-2 grid w-1/2 gap-1 lg:prose-xl'
				onSubmit={async (event): Promise<void> => {
					event.preventDefault()

					const nextPlaintext = (event.target as HTMLFormElement).elements
						.plaintext.value as string
					setSearchParameters({
						plaintext: nextPlaintext
					})
					setTextToEncode(nextPlaintext)
					if (
						(event.target as HTMLFormElement).elements.plainfile.files.length >
						0
					) {
						const file = (event.target as HTMLFormElement).elements.plainfile
							.files[0] as File
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
				<div className='flex min-h-[30vh] w-full'>
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
			<div className='carousel rounded-box mx-auto w-3/4 grow'>
				{textToEncode
					? encodings.map((Encoding, index) => (
							<div
								// eslint-disable-next-line react/no-array-index-key
								key={index}
								className='carousel-item m-2'
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
