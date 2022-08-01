import type { ReactElement } from 'react'
import InfoButton from './InfoButton'

function CompressionSummary({
	name,
	href,
	compressed,
	compressionRatio,
	decompressed
}: {
	name: 'Huffman' | 'LZSS' | 'LZW'
	href: string
	compressed: string
	compressionRatio: number
	decompressed: string
}): ReactElement {
	return (
		<>
			<div className='card-title justify-between'>
				<h2>{name}</h2>
				<div className='card-actions'>
					<InfoButton
						href={href}
						svg='https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg'
					/>
				</div>
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
