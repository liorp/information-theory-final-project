/* eslint-disable react/require-default-props */
import type { ReactElement } from 'react'
import type { Dictionary as DictionaryType } from 'utils/types'

export default function Dictionary({
	dictionary,
	keyHeader = 'Symbol',
	valueHeader = 'Codeword'
}: {
	dictionary: DictionaryType
	keyHeader?: string
	valueHeader?: string
}): ReactElement {
	return (
		<div className='overflow-x-auto'>
			<table className='table-compact table w-full'>
				<thead>
					<tr>
						<th>{keyHeader}</th>
						<th>{valueHeader}</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(dictionary)
						.sort(([, codeword1], [, codeword2]) => codeword2 - codeword1)
						.map(([symbol, codeword]) => (
							<tr key={symbol}>
								<td>{symbol}</td>
								<td>{codeword}</td>
							</tr>
						))}
				</tbody>
				<tfoot>
					<tr>
						<th>Symbol</th>
						<th>Codeword</th>
					</tr>
				</tfoot>
			</table>
		</div>
	)
}
