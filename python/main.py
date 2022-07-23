import numpy as np

import huffman_lib
import lzw_lib
from timer import Timer

NUM_OF_BITS_IN_ASCII_CHAR = 8
FILE_PATH = r'C:\temp\dickens.txt'
SEPARATOR = 100 * '-'


def get_huffman_compression_results(input_data, compression_results, decompression_results, compression_sizes, timer):
    timer.start()

    # Compress and decompress using Huffman Code
    huffman_tree = huffman_lib.create_huffman_tree(input_data=input_data)
    timer.stop(message='Huffman tree creation time',
               start_again=True)

    huffman_code = huffman_lib.create_huffman_code(huffman_tree=huffman_tree)
    timer.stop(message='Huffman code creation time',
               start_again=True)

    compression_results['Huffman'], _ = huffman_lib.compress(input_data=input_data,
                                                             huffman_tree=huffman_tree,
                                                             huffman_code=huffman_code)
    timer.stop(message='Huffman compression time',
               start_again=True)

    decompression_results['Huffman'] = huffman_lib.decompress(compressed_data=compression_results['Huffman'],
                                                              huffman_tree=huffman_tree)
    timer.stop(message='Huffman decompression time',
               start_again=False)

    compression_sizes['Huffman'] = get_huffman_compression_size(huffman_code, compression_results)


def get_lzw_compression_results(input_data, compression_results, decompression_results, compression_sizes, timer):
    timer.start()

    compression_results['LZW'] = lzw_lib.compress(input_data=input_data)
    timer.stop(message='LZW compression time',
               start_again=True)

    decompression_results['LZW'] = lzw_lib.decompress(compressed_data=compression_results['LZW'])
    timer.stop(message='LZW decompression time',
               start_again=False)

    compression_sizes['LZW'] = get_lzw_compression_size(compression_results)


def get_huffman_compression_size(huffman_code, compression_results):
    # Assumption: The Huffman tree is passed bit by bit
    # TODO: Figure out why the formula below works ¯\_(ツ)_/¯ (found it online)
    huffman_tree_size = 10 * len(huffman_code) - 1
    huffman_output_size = len(compression_results['Huffman'])
    return huffman_tree_size + huffman_output_size


def get_lzw_compression_size(compression_results):
    # Assumption: Integers are passed using the integer encoding method learnt in class
    # To pass the integer N, ceil(log(N+1)) + 1 + ceil(log(ceil(log(N+1)) + 1)) bits are required
    # NOTE: No other information but the compressed message is needed for decompression with LZW
    return sum([np.ceil(np.log2(num + 1)) + 1 + np.ceil(np.log2(np.ceil(np.log2(num + 1)) + 1)) for num in
                compression_results['LZW']])


def get_compression_ratio_str(original_size, compressed_size):
    compression_ratio = compressed_size / original_size
    if compression_ratio > 1:
        arrow_unicode_char = '\u2191'
    elif compression_ratio < 1:
        arrow_unicode_char = '\u2193'
    else:
        arrow_unicode_char = '='

    return f'{abs(compression_ratio - 1):.4%} {arrow_unicode_char}'


def compare_compression_sizes_to_original_data(data_size, compression_sizes):
    for compression_algorithm, compression_output_size in compression_sizes.items():
        compression_ratio_str = get_compression_ratio_str(original_size=data_size,
                                                          compressed_size=compression_output_size)
        print(f'{compression_algorithm}: {compression_ratio_str}')


def display_decompression_status(input_data, decompression_results):
    for compression_algorithm, decompression_output in decompression_results.items():
        is_equal = '\u2713' if decompression_output == input_data else '\u2717'
        print(f'{compression_algorithm}: {is_equal}')


def main():
    # Get data from file and calculate its size
    # Assumption: regular size means representing each character using a constant number of bites (8 in our case)
    with open(FILE_PATH, 'rb') as file:
        input_data = str(file.read())

    data_size = NUM_OF_BITS_IN_ASCII_CHAR * len(input_data)
    print(f'Original data size: {data_size}')

    # Create empty dictionaries for compression and decompression outcomes of different algorithms
    compression_results = dict()
    decompression_results = dict()
    compression_sizes = dict()

    # Create a timer for measuring elapsed times between significant events
    timer = Timer()

    # Get compression results of different algorithms
    # TODO: Check why decompression time in Huffman is long AF and try reducing it
    # TODO: Check if LZW compression and decompression even work...
    get_huffman_compression_results(input_data, compression_results, decompression_results, compression_sizes, timer)
    get_lzw_compression_results(input_data, compression_results, decompression_results, compression_sizes, timer)
    timer.report()

    # Compare compressed data sizes for each algorithm
    print('Compression outcomes sizes:')
    compare_compression_sizes_to_original_data(data_size, compression_sizes)
    print(SEPARATOR)

    # Check if decompression works
    print('Is decompression working?')
    display_decompression_status(input_data, decompression_results)
    print(SEPARATOR)


if __name__ == '__main__':
    main()
