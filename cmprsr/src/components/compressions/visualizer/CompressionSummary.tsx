import type { Dispatch, ReactElement, SetStateAction } from 'react'
import { BYTE, CompressionOperation, CompressionType } from 'utils/consts'
import {
	compress as compressHuffman,
	decompress as decompressHuffman
} from 'utils/huffman'
import {
	compress as compressLZSS,
	decompress as decompressLZSS
} from 'utils/lzss'
import { compress as compressLZW, decompress as decompressLZW } from 'utils/lzw'
import Link from '../../controls/Link'

const useCompression = (
	compressionType: CompressionType
): {
	compress: (plainText: string) => string
	decompress: (compressed: string) => string
} => {
	switch (compressionType) {
		case CompressionType.Huffman:
			return {
				compress: (plainText: string) => compressHuffman(plainText).compressed,
				decompress: decompressHuffman
			}
		case CompressionType.LZW:
			return {
				compress: (plainText: string) => compressLZW(plainText).compressed,
				decompress: (plainText: string) => decompressLZW(plainText).decompressed
			}
		case CompressionType.LZSS:
			return {
				compress: (plainText: string) => compressLZSS(plainText).compressed,
				decompress: decompressLZSS
			}
		default:
			throw new Error(`Unsupported compression type`)
	}
}

const compressionRatio = (
	compressedLength: number,
	decompressedLength: number
): number => {
	const ratio = decompressedLength / compressedLength
	return ratio
}

const compressionTypeToHref = (type: CompressionType): string => {
	switch (type) {
		case CompressionType.Huffman:
			return 'https://en.wikipedia.org/wiki/Huffman_coding'
		case CompressionType.LZW:
			return 'https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch_compression'
		case CompressionType.LZSS:
			return 'https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Storer%E2%80%93Szymanski'
		default:
			throw new Error(`Unsupported compression type`)
	}
}

function CompressionRatio({ ratio }: { ratio: number }): ReactElement {
	const hue = ratio > 1 ? 120 - 120 / ratio : 0
	return (
		<span>
			<h3>Compression Ratio</h3>
			<span style={{ color: `hsl(${hue},50%, 50%)` }}>{ratio.toFixed(2)}x</span>
		</span>
	)
}

function Compressed({
	type,
	input,
	compress
}: {
	type: CompressionType
	input: string
	compress: (plainText: string) => string
}): ReactElement {
	const compressed = compress(input)

	return (
		<>
			<span>
				<h3 className='flex items-center gap-4'>
					Compressed{' '}
					<Link
						href={`data:text/plain;charset=utf-8,${compressed}`}
						download={`compressed_${type.toLowerCase()}`}
						svg='https://www.svgrepo.com/show/39042/download.svg'
					/>
				</h3>
				{compressed.length > 20 ? `${compressed.slice(0, 20)}...` : compressed}
			</span>
			<CompressionRatio
				ratio={compressionRatio(compressed.length, input.length * BYTE)}
			/>
		</>
	)
}

function Decompressed({
	type,
	input,
	decompress
}: {
	type: CompressionType
	input: string
	decompress: (compressed: string) => string
}): ReactElement {
	const decompressed = decompress(input)

	return (
		<>
			<span>
				<h3 className='flex items-center gap-4'>
					Decompressed{' '}
					<Link
						href={`data:text/plain;charset=utf-8,${decompressed}`}
						download={`decompressed_${type.toLowerCase()}`}
						svg='https://www.svgrepo.com/show/39042/download.svg'
					/>
				</h3>
				{decompressed.length > 20
					? `${decompressed.slice(0, 20)}...`
					: decompressed}
			</span>
			<CompressionRatio
				ratio={compressionRatio(input.length, decompressed.length * BYTE)}
			/>
		</>
	)
}

function CompressionSummary({
	type,
	input,
	operation,
	setOperation
}: {
	type: CompressionType
	input: string
	operation: CompressionOperation
	setOperation: Dispatch<SetStateAction<CompressionOperation>>
}): ReactElement {
	const { compress, decompress } = useCompression(type)

	return (
		<>
			<div className='card-title justify-between'>
				<h2>{type}</h2>
				<div className='card-actions'>
					<Link
						href={compressionTypeToHref(type)}
						svg='https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg'
					/>
				</div>
			</div>
			<div className='divider my-1' />
			<div className='btn-group'>
				<button
					type='button'
					className={`btn ${
						operation === CompressionOperation.Compress ? 'btn-active' : ''
					}`}
					onClick={(): void => setOperation(CompressionOperation.Compress)}
				>
					Compress
				</button>
				<button
					type='button'
					className={`btn ${
						operation === CompressionOperation.Decompress ? 'btn-active' : ''
					}`}
					onClick={(): void => setOperation(CompressionOperation.Decompress)}
				>
					Decompress
				</button>
			</div>
			{operation === CompressionOperation.Compress && (
				<Compressed type={type} input={input} compress={compress} />
			)}
			{operation === CompressionOperation.Decompress && (
				<Decompressed type={type} input={input} decompress={decompress} />
			)}
		</>
	)
}

export default CompressionSummary
