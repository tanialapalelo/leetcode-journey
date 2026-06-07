/*
TREES & GRAPHS — REFERENCE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TREES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A tree is a connected graph with no cycles. Every node (except the root)
has exactly one parent. A binary tree has at most 2 children per node.

         1         ← root
        / \
       2   3
      / \
     4   5         ← leaves (no children)

Vocabulary:
  Root   — top node (no parent)
  Leaf   — node with no children
  Height — longest path from root to a leaf
  Depth  — distance from root to a node

Node structure:
*/
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TREE TRAVERSALS — ORDER MATTERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DFS (Depth First Search) — go deep before going wide.
Three orderings depending on when you process the current node:

  Pre-order:  ROOT → left → right   [current first]
  In-order:   left → ROOT → right   [current middle] ← gives sorted order in BST
  Post-order: left → right → ROOT   [current last]

All three are O(n) time, O(h) space where h = tree height.
*/

// Pre-order DFS (recursive)
function preorder(root, result = []) {
    if (root === null) return result;
    result.push(root.val);    // process NOW (before children)
    preorder(root.left, result);
    preorder(root.right, result);
    return result;
}

// In-order DFS (recursive) — visits nodes in sorted order for a BST
function inorder(root, result = []) {
    if (root === null) return result;
    inorder(root.left, result);
    result.push(root.val);    // process AFTER left subtree
    inorder(root.right, result);
    return result;
}

// Post-order DFS (recursive) — children processed before parent
function postorder(root, result = []) {
    if (root === null) return result;
    postorder(root.left, result);
    postorder(root.right, result);
    result.push(root.val);    // process AFTER both children
    return result;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BFS (Breadth First Search) — level by level
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Uses a QUEUE. Visit all nodes at depth 1 before depth 2, etc.

         1          Level 0
        / \
       2   3        Level 1
      / \
     4   5          Level 2

BFS visits: 1, 2, 3, 4, 5
DFS visits: 1, 2, 4, 5, 3  (pre-order)

Use BFS when: finding shortest path, level-order output, nearest neighbor.
Use DFS when: exploring all paths, tree structure problems, backtracking.
*/
function levelOrder(root) {
    if (!root) return [];
    const result = [], queue = [root];

    while (queue.length > 0) {
        const levelSize = queue.length; // nodes at current level
        const level = [];

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();        // dequeue
            level.push(node.val);
            if (node.left) queue.push(node.left);   // enqueue children
            if (node.right) queue.push(node.right);
        }
        result.push(level);
    }
    return result; // [[1],[2,3],[4,5]]
}
// Time: O(n)  Space: O(n)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BINARY SEARCH TREE (BST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A BST has the property: left child < parent < right child.
This makes search, insert, delete O(log n) average.
In-order traversal of a BST gives a sorted sequence.

         5
        / \
       3   7
      / \ / \
     2  4 6  8
*/

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRAPHS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A graph is a set of nodes (vertices) connected by edges.
Unlike trees, graphs can have cycles and disconnected components.

Types:
  Directed   — edges have direction (A → B doesn't mean B → A)
  Undirected — edges go both ways (A — B)
  Weighted   — edges have costs (used in shortest path problems)

Representation:
  Adjacency List  — Map of node → [neighbors]  (preferred, O(V+E) space)
  Adjacency Matrix — 2D grid, grid[i][j]=1 means edge i→j (O(V²) space)
*/

// Adjacency list — most common in interviews
const graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0],
    3: [1]
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRAPH DFS — explore as deep as possible before backtracking
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Must track VISITED nodes to avoid infinite loops in cyclic graphs.
*/
function dfs(graph, start) {
    const visited = new Set();
    const result = [];

    function explore(node) {
        if (visited.has(node)) return;
        visited.add(node);
        result.push(node);
        for (const neighbor of graph[node]) {
            explore(neighbor);
        }
    }

    explore(start);
    return result;
}
// Time: O(V + E)  Space: O(V)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRAPH BFS — shortest path in unweighted graphs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BFS in a graph = same as tree BFS but with a visited set.
Guarantees the SHORTEST PATH in an unweighted graph.
*/
function bfs(graph, start) {
    const visited = new Set([start]);
    const queue = [start];
    const result = [];

    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);

        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return result;
}
// Time: O(V + E)  Space: O(V)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRID PROBLEMS (special case of graphs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Many graph problems are given as 2D grids. Each cell is a node.
Neighbors are up/down/left/right (sometimes diagonals).
Problems: Number of Islands, Rotting Oranges, Word Search.
*/
const DIRS = [[-1,0],[1,0],[0,-1],[0,1]]; // up, down, left, right

// EXAMPLE: Number of Islands — count connected groups of '1's
function numIslands(grid) {
    let count = 0;
    const rows = grid.length, cols = grid[0].length;

    function dfs(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return; // out of bounds
        if (grid[r][c] !== '1') return; // water or already visited
        grid[r][c] = '#'; // mark visited by overwriting
        for (const [dr, dc] of DIRS) dfs(r + dr, c + dc);
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                dfs(r, c); // flood-fill the whole island
                count++;
            }
        }
    }
    return count;
}
// Time: O(rows × cols)  Space: O(rows × cols) call stack

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUICK DECISION GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use DFS when:
  - Exploring all paths
  - Connected components, cycle detection
  - Tree problems (pre/in/post-order)
  - Backtracking on a graph

Use BFS when:
  - Shortest path in an unweighted graph
  - Level-by-level processing
  - "Nearest" anything (nearest exit, nearest 0)

Time: O(V + E)  where V = vertices (nodes), E = edges
Space: O(V) for visited set + queue/stack
*/
