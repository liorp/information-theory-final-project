import type { ReactElement } from 'react'
import type { Dictionary as DictionaryType } from 'utils/types'
import { symbolPrettyPrint } from 'utils/utils'

export default function Dictionary({
	dictionary,
	keyHeader = 'Symbol (CodePoint)',
	valueHeader = 'Codeword'
}: {
	dictionary: DictionaryType
	keyHeader?: string
	valueHeader?: string
}): ReactElement {
	return (
		<div className='overflow-x-auto'>
			<table className='table-zebra table-compact mx-auto table w-min'>
				<thead className='sticky top-0'>
					<tr>
						<th className='!rounded-none p-2'>{keyHeader}</th>
						<th className='!rounded-none p-2'>{valueHeader}</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(dictionary)
						.sort(([, codeword1], [, codeword2]) => codeword2 - codeword1)
						.map(([symbol, codeword]) => (
							<tr key={symbol}>
								<td className='p-2'>{symbolPrettyPrint(symbol)}</td>
								<td className='p-2'>{codeword}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}
