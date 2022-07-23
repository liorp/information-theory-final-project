MAX_ASCII_VALUE = 256
DEFAULT_STRINGS_DICTIONARY = {chr(ascii_val): ascii_val for ascii_val in range(MAX_ASCII_VALUE)}
DEFAULT_REVERSED_STRINGS_DICTIONARY = {value: key for key, value in DEFAULT_STRINGS_DICTIONARY.items()}


def compress(input_data, strings_dictionary=None):
    # initialize dictionary of strings (default: single ascii characters)
    if strings_dictionary is None:
        strings_dictionary = DEFAULT_STRINGS_DICTIONARY
    dictionary_length = len(strings_dictionary)

    max_matched_substring = ""
    compression_output = []

    for current_char in input_data:
        # Search for maximal substring which appears in the dictionary
        new_string = max_matched_substring + current_char

        if new_string in strings_dictionary:
            # Update matching string
            max_matched_substring = new_string

        else:
            # Update output
            compression_output.append(strings_dictionary[max_matched_substring])

            # Update dictionary
            strings_dictionary[new_string] = dictionary_length
            dictionary_length += 1

            # Reset matching string
            max_matched_substring = current_char

    # Output the code for last matched substring
    if max_matched_substring:
        compression_output.append(strings_dictionary[max_matched_substring])
    return compression_output


def decompress(compressed_data, reversed_strings_dictionary=None):
    # initialize dictionary of strings (default: single ascii characters)
    if reversed_strings_dictionary is None:
        reversed_strings_dictionary = DEFAULT_REVERSED_STRINGS_DICTIONARY
    dictionary_length = len(reversed_strings_dictionary)

    # Iterate compressed data and obtain original data
    prev_code = decompression_output = reversed_strings_dictionary[compressed_data.pop(0)]
    for code in compressed_data:

        # Obtain current entry
        if code in reversed_strings_dictionary:
            entry = reversed_strings_dictionary[code]
        elif code == dictionary_length:
            entry = prev_code + prev_code[0]
        else:
            raise ValueError(f'Bad compressed code: {code}')

        # Update decompression result
        decompression_output += entry

        # Update dictionary
        reversed_strings_dictionary[dictionary_length] = prev_code + entry[0]
        dictionary_length += 1

        # Update previous code
        prev_code = entry

    return decompression_output
