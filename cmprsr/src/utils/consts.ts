/* eslint-disable @typescript-eslint/no-magic-numbers */

import type { LZ77Pointer } from './types'

/** Basic */
export const BIT = 1
export const BYTE = 8 * BIT
export const KB = 1024 * BYTE
export const MB = 1024 * KB

/** LZ77 */
export const DEFAULT_WINDOW_SIZE = 32 * KB
export const MAX_MATCH_LENGTH = 258
export const NULL_POINTER: LZ77Pointer = [0, 0]

/** LZW */
export const BASE_DICTIONARY =
	" !\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'"
export const MAX_DICTIONARY_SIZE = 4 * KB
