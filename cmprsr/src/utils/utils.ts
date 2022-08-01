import type { Dictionary } from 'utils/types'

export const lz = (text: string): [string, string] => [text, text]

export const huffman = (text: string): [string, string] => [text, text]

export const invertObject = (object: {
	string?: string
}): { string?: string } =>
	Object.fromEntries(Object.entries(object).map(value => [value[1], value[0]]))

export const transformArrayToObject = (dictionary: string[]): Dictionary =>
	Object.fromEntries(
		Object.entries(dictionary).map(([key, value]) => [value, key])
	)
export const range = (start: number, stop: number, step = 1): number[] =>
	Array.from(
		{ length: (stop - start - 1) / step + 1 },
		(_, index) => start + index * step
	)
