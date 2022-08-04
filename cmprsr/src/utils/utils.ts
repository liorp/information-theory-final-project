import type { Dictionary } from 'utils/types'

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

export const symbolPrettyPrint = (symbol: string): string =>
	`${symbol} (${[...symbol].map(s => s.codePointAt(0) ?? '').join(', ')})`

// eslint-disable-next-line unicorn/prevent-abbreviations
export const mod = (n: number, m: number): number => ((n % m) + m) % m
