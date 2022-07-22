from collections import Counter

import heapdict

from binary_tree import Node


def create_huffman_tree(input_data):
    """
    Set frequency (Huffman) tree from bottom up.
    :return: The root of the Huffman tree.
    :rtype: Node
    """
    # Get counts of characters' occurrences
    characters_counter = Counter(input_data)
    sorted_characters_counts = list(reversed(characters_counter.most_common()))

    # Initialize priority queue
    priority_queue = heapdict.heapdict()
    for character, count in sorted_characters_counts:
        node = Node(value=(character, count))
        priority_queue[node] = count

    while len(priority_queue) > 1:
        # Get two least frequent characters
        left_node, left_node_count = priority_queue.popitem()
        right_node, right_node_count = priority_queue.popitem()

        # Create new node
        new_node_count = left_node_count + right_node_count
        new_node = Node(value=(None, new_node_count),
                        left=left_node,
                        right=right_node)

        # Insert new node to priority queue
        priority_queue[new_node] = new_node_count

    huffman_tree, _ = priority_queue.popitem()
    return huffman_tree


def _traverse_huffman_tree_inorder(huffman_code, root: Node, binary_representation: str = ''):
    if root is not None:
        # Traverse to left child
        _traverse_huffman_tree_inorder(huffman_code, root.left, binary_representation + '0')

        # Save node's binary representation
        if root.is_leaf():
            huffman_code[root.value] = binary_representation

        # Traverse to right child
        _traverse_huffman_tree_inorder(huffman_code, root.right, binary_representation + '1')


def create_huffman_code(huffman_tree, with_counts=False):
    huffman_code = dict()
    _traverse_huffman_tree_inorder(huffman_code, root=huffman_tree)

    if not with_counts:
        huffman_code = {character: binary_representation for (character, count), binary_representation in
                        huffman_code.items()}

    return huffman_code


def _create_compressed_data(input_data, huffman_code):
    compressed_data = ''.join([huffman_code[character] for character in input_data])
    return compressed_data


def compress(input_data, huffman_tree=None, huffman_code=None):
    if huffman_tree is None:
        huffman_tree = create_huffman_tree(input_data)

    if huffman_code is None:
        huffman_code = create_huffman_code(huffman_tree)

    compressed_data = _create_compressed_data(input_data, huffman_code)

    return compressed_data, huffman_tree


def decompress(compressed_data, huffman_tree):
    # Convert compressed binary form to compressed ascii form
    binary_list = list(compressed_data)

    # Get original data
    original_data = ''
    current_node = huffman_tree

    for binary_digit in binary_list:
        # Get left child if 0 is encountered
        if binary_digit == '0':
            current_node = current_node.left
        # Get right child if 1 is encountered
        else:
            current_node = current_node.right

        if current_node.is_leaf():
            original_data += current_node.value[0]
            current_node = huffman_tree

    return original_data
