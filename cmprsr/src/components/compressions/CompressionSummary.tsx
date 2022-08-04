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
				<h3 className='flex items-center gap-4'>
					Compressed{' '}
					<InfoButton
						href={`data:text/plain;charset=utf-8,${compressed}`}
						download={`compressed_${name.toLowerCase()}`}
						svg='https://www.svgrepo.com/show/39042/download.svg'
					/>
				</h3>
				{compressed.length > 20 ? `${compressed.slice(0, 20)}...` : compressed}
			</span>
			<span>
				<h3>Compression Ratio</h3>
				{compressionRatio}
			</span>
			<span>
				<h3 className='flex items-center gap-4'>
					Decompressed{' '}
					<InfoButton
						href={`data:text/plain;charset=utf-8,${decompressed}`}
						download={`decompressed_${name.toLowerCase()}`}
						svg='https://www.svgrepo.com/show/39042/download.svg'
					/>
				</h3>
				{decompressed.length > 20
					? `${decompressed.slice(0, 20)}...`
					: decompressed}
			</span>
		</>
	)
}

export default CompressionSummary
