/* eslint-disable react/jsx-handler-names */
import Footer from 'components/Footer'
import Huffman from 'components/Huffman'
import LempelZiv from 'components/LempelZiv'
import type { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'

const encodings = [Huffman, LempelZiv]

export default function Home(): ReactElement {
	const [searchParameters, setSearchParameters] = useSearchParams()
	const plaintext = searchParameters.get('plaintext')
	return (
		<div className='flex h-full flex-col'>
			<form
				className='prose mx-auto mt-2 grid w-1/2 gap-1 lg:prose-xl'
				onSubmit={(event): void => {
					setSearchParameters({
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
						plaintext: (event.target as HTMLFormElement).elements.plaintext
							.value
					})
					event.preventDefault()
				}}
			>
				<a href='/'>
					<h1 className='text-gradient w-min transform bg-green-300 font-vt323 transition hover:-rotate-6'>
						CMPRSR
					</h1>
				</a>
				<textarea
					id='plaintext'
					name='plaintext'
					className='textarea'
					placeholder='Enter your text here'
					defaultValue={`${plaintext ?? ''}`}
					required
				/>
				<button className='btn' type='submit'>
					Compress
				</button>
			</form>
			<div className='carousel rounded-box mx-auto w-3/4 grow'>
				{plaintext
					? encodings.map((Encoding, index) => (
							<div
								// eslint-disable-next-line react/no-array-index-key
								key={index}
								className='carousel-item m-2'
							>
								<Encoding plainText={plaintext} />
							</div>
					  ))
					: undefined}
			</div>
			<Footer />
		</div>
	)
}
