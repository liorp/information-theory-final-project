import type { ReactElement } from 'react'

function CompressionSummary({
	name,
	compressed,
	compressionRatio,
	decompressed
}: {
	name: 'Huffman' | 'LZSS' | 'LZW'
	compressed: string
	compressionRatio: number
	decompressed: string
}): ReactElement {
	return (
		<>
			<div className='card-title'>
				<h2>{name}</h2>
			</div>
			<div className='divider my-1' />
			<span>
				<h3>Compressed</h3>
				{compressed}
			</span>
			<span>
				<h3>Compression Ratio</h3>
				{compressionRatio}
			</span>
			<span>
				<h3>Decompressed</h3>
				{decompressed}
			</span>
		</>
	)
}

export default CompressionSummary
