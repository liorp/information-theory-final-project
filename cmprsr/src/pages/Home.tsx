/* eslint-disable react/jsx-handler-names */
import Huffman from 'components/Huffman'
import LempelZiv from 'components/LempelZiv'
import type { ReactElement } from 'react'
import { useRef, useState } from 'react'

const encodings = [Huffman, LempelZiv]

export default function Home(): ReactElement {
	const [toggle, setToggle] = useState(false)
	const plainTextReference = useRef<HTMLTextAreaElement>(null)
	return (
		<div>
			<form className='prose mx-auto grid w-1/2 gap-1 lg:prose-xl'>
				<h1>CMPRSR</h1>
				<span>Enter your text</span>
				<textarea
					id='plaintext'
					className='textarea'
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
			<div className='flex'>
				{plainTextReference.current?.value
					? encodings.map((Encoding, index) => (
							<Encoding
								// eslint-disable-next-line react/no-array-index-key
								key={index + Number(toggle)}
								plainText={plainTextReference.current?.value ?? ''}
							/>
					  ))
					: undefined}
			</div>
		</div>
	)
}
