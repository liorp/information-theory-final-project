/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable import/prefer-default-export */

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
