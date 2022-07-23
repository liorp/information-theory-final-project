/* eslint-disable react/jsx-handler-names */
import HuffmanTree from 'components/HuffmanTree'
import type { ReactElement } from 'react'
import { useRef, useState } from 'react'

export default function Home(): ReactElement {
	const [toggle, setToggle] = useState(false)
	const plainTextReference = useRef<HTMLTextAreaElement>(null)
	return (
		<div>
			<form className='flex flex-col'>
				<h1>CMPRSR</h1>
				<h2>Huffman</h2>
				<span>Enter your text</span>
				<textarea id='plaintext' ref={plainTextReference} />
				<button
					type='submit'
					onClick={(event: React.MouseEvent<HTMLButtonElement>): void => {
						setToggle(t => !t)
						console.log(plainTextReference.current?.value)
						event.preventDefault()
					}}
				>
					Compress
				</button>
				{plainTextReference.current?.value ? (
					<HuffmanTree
						key={Number(toggle)}
						plainText={plainTextReference.current.value}
					/>
				) : undefined}
			</form>
		</div>
	)
}
