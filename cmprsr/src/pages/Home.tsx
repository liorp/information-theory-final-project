/* eslint-disable react/jsx-handler-names */
import Footer from 'components/Footer'
import Huffman from 'components/Huffman'
import LempelZiv from 'components/LempelZiv'
import type { ReactElement } from 'react'
import { useRef, useState } from 'react'

const encodings = [Huffman, LempelZiv]

export default function Home(): ReactElement {
	const [toggle, setToggle] = useState(false)
	const plainTextReference = useRef<HTMLTextAreaElement>(null)
	return (
		<div className='flex h-full flex-col'>
			<form className='prose mx-auto mt-2 grid w-1/2 gap-1 lg:prose-xl'>
				<h1 className='text-gradient w-min transform bg-green-300 font-vt323 transition hover:-rotate-6'>
					CMPRSR
				</h1>
				<textarea
					id='plaintext'
					className='textarea'
					placeholder='Enter your text here'
					ref={plainTextReference}
				/>
				<button
					className='btn'
					type='submit'
					onClick={(event: React.MouseEvent<HTMLButtonElement>): void => {
						setToggle(t => !t)
						event.preventDefault()
					}}
				>
					Compress
				</button>
			</form>
			<div className='carousel rounded-box mx-auto w-3/4 grow'>
				{plainTextReference.current?.value
					? encodings.map((Encoding, index) => (
							<div
								// eslint-disable-next-line react/no-array-index-key
								key={index + Number(toggle)}
								className='carousel-item m-2'
							>
								<Encoding plainText={plainTextReference.current?.value ?? ''} />
							</div>
					  ))
					: undefined}
			</div>
			<Footer />
		</div>
	)
}
