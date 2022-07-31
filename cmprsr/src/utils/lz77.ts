/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-plusplus */

const DEFAULT_SEARCH_SIZE = 8
const DEFAULT_LOOK_AHEAD_SIZE = 8

export function encode(
	text: string,
	searchSize: number = DEFAULT_SEARCH_SIZE,
	lookAheadSize: number = DEFAULT_LOOK_AHEAD_SIZE
): [[number, number, string]?] {
	const encodedText: [[number, number, string]?] = []
	let search = ''
	let lookAheadIndex = 0
	let lookAhead = text.slice(0, lookAheadSize)

	while (lookAhead.length > 0) {
		// Find best match in the lookahead buffer
		for (
			let index = 0;
			index < lookAhead.length && index < search.length;
			index++
		) {
			const matchString = lookAhead.slice(0, index + 1)
			const matchIndex = search.indexOf(matchString)
			if (matchIndex === -1) {
				encodedText.push([
					search.indexOf(lookAhead.slice(0, index)),
					index,
					lookAhead[0]
				])
				lookAheadIndex += index
				break
			}
		}
		lookAhead = text.slice(lookAheadIndex, lookAheadIndex + lookAheadSize)
		search = text.slice(lookAheadIndex - searchSize, lookAheadIndex)
	}

	return encodedText
}

export function decode(text: [[number, number, string]?]): string {
	let decodedText = ''
	let search = ''

	for (const a of text) {
		decodedText += `${search.slice(a?.[0], a?.[1])}${a?.[2] ?? ''}`
		search = `${search.slice(a?.[1] ?? 0)}${search.slice(0, a?.[1] ?? 0 - 1)}${
			a?.[2] ?? ''
		}`
	}

	return decodedText
}
