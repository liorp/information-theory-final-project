class Node:
    def __init__(self, value, left=None, right=None):
        self.left = left
        self.right = right
        self.value = value

    def is_leaf(self):
        """
        Check if a node is a leaf (i.e. has on children).
        :return: True if the node is a leaf and false otherwise.
        :rtype: bool.
        """
        return self.left is None and self.right is None


def list_nodes_inorder(node: Node, nodes_inorder):
    if node:
        # First recur on left child
        list_nodes_inorder(node.left, nodes_inorder)

        # then print the data of node
        nodes_inorder.append(node.value)

        # now recur on right child
        list_nodes_inorder(node.right, nodes_inorder)
