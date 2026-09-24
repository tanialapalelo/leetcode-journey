/*
HEAPS (PRIORITY QUEUES) — REFERENCE

A heap is a tree-based structure that always gives you the min or max element
in O(1), and lets you insert/remove in O(log n).

Think of it as a "smart queue" where instead of first-in-first-out,
the highest priority item always comes out first.

Two types:
  Min-Heap — smallest element is always at the top
  Max-Heap — largest element is always at the top

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEAP PROPERTY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Min-Heap: every parent ≤ its children
         1
        / \
       3   2
      / \
     7   5
→ root is always the minimum

After insert/remove, the heap "fixes itself" (heapify) to maintain this property.
That fix takes O(log n) — proportional to the height of the tree.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLEXITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  peek min/max      O(1)
  insert            O(log n)
  remove min/max    O(log n)
  build heap        O(n)   ← better than sorting!
  search            O(n)   ← heap doesn't help with arbitrary search

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEAP vs BST, why the complexities differ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Both are binary trees, so it's easy to assume they behave the same.
They don't, because each one enforces a DIFFERENT kind of ordering rule,
and that single difference is the reason every complexity below differs.

  BST rule (see references/9.reference-trees-and-graphs.js):
    left subtree < node < right subtree, and this holds at EVERY node,
    all the way down. That is a GLOBAL rule: for any node, you instantly
    know a whole subtree is entirely smaller or entirely larger than it.

  Heap rule:
    parent <= children (min-heap), but ONLY between a node and its direct
    children. Nothing is said about how the left child compares to the
    right child, or how one subtree compares to another. That is a LOCAL
    rule, it only constrains neighbors one edge apart.

That's the whole story. A global rule lets you binary search (throw away
half the tree every step). A local rule doesn't, but it's cheap to keep
true after every insert/remove because it only involves one path.

  operation          BST (average)   BST (worst)    Heap
  peek min/max        O(log n)*       O(n)*          O(1)
  insert               O(log n)        O(n)           O(log n)  guaranteed
  remove min/max        O(log n)        O(n)           O(log n)  guaranteed
  search (any value)   O(log n)        O(n)          O(n)
  build from n items   O(n log n)      O(n^2)         O(n)

  * a plain BST has no shortcut to "the minimum", you walk all the way
    left from the root to find it, so it costs O(height), not O(1).

WHY HEAP PEEK IS O(1) BUT BST MIN IS NOT
  Heap: the min-heap RULE directly says "the root is smaller than both
  its children, which are smaller than THEIR children", so by definition
  nothing anywhere in the tree can be smaller than the root. Look at
  data[0], done, no walking required.

  BST: the smallest value is the LEFTMOST node, not the root. The root
  is just "some value with everything smaller to its left." To actually
  find the minimum you must walk left, left, left... until there's no
  more left child. That walk costs one step per level, O(height).

WHY BOTH insert/remove ARE O(log n)... BUT ONLY THE HEAP GUARANTEES IT
  Heap insert: push the new value onto the END of the array (this keeps
  the tree "complete", explained below), then "bubble up": compare it
  to its parent, swap if it broke the rule, move up, repeat. This only
  ever touches ONE path from a leaf to the root, so the cost is exactly
  the height of the tree.

  BST insert: start at the root, go left or right depending on the
  comparison, until you fall off the tree, then attach the new node
  there. This also only touches ONE path from the root to a leaf, so
  the cost is also exactly the height of the tree.

  Same idea, "walk one path top to bottom (or bottom to top)." The
  difference is what the height IS ALLOWED TO BE:

  A heap must always be a COMPLETE tree: every level is fully filled
  before the next level starts, and the last level fills left to right
  with no gaps. There is only one way to arrange n items into a complete
  tree, so its height is always fixed at floor(log2 n), no matter what
  order the values were inserted in or what the values even are.

  A plain BST has no such rule. Its shape depends entirely on the order
  values were inserted. Insert 1, 2, 3, 4, 5, 6, 7 in that exact order
  and every new value is bigger than everything before it, so each one
  becomes the right child of the previous one. Verified by actually
  building both:

    insert 1,2,3,4,5,6,7 into a BST, in that order
      1
       \
        2
         \
          3
           \
            4
             \
              5
               \
                6
                 \
                  7
    height = 7, and searching for 7 takes 7 steps. That's just a
    linked list wearing a tree costume, O(n) behavior.

    insert 4,2,6,1,3,5,7 into a BST (same 7 values, shuffled order)
              4
            /   \
           2     6
          / \   / \
         1   3 5   7
    height = 3, and searching for 7 takes 3 steps. O(log n) behavior.

    a heap holding those same 7 values, ANY insertion order
    height = 3, always, because "complete tree with 7 nodes" only has
    one possible shape.

  So: heap insert/remove are O(log n) GUARANTEED, because the tree
  literally cannot become lopsided. Plain BST insert/remove are only
  O(log n) on AVERAGE (roughly balanced input) and degrade to O(n) in
  the worst case (sorted or near-sorted input), unless you use a
  self-balancing variant (AVL tree, Red-Black tree) that does extra
  work on every insert specifically to keep the height near log n.

WHY HEAP SEARCH FOR AN ARBITRARY VALUE IS O(n), EVEN THOUGH INSERT IS FAST
  This is the one that trips people up: "insert is O(log n), so search
  should be too, right?" No, because insert and search need different
  information, and the heap rule only gives you one of them.

  BST search: at each node, compare the target to that node's value.
  Smaller means "only look left," larger means "only look right." The
  GLOBAL ordering rule is what lets you safely ignore half the tree at
  every step, that's the entire reason it's a binary "search."

  Heap search: at each node, comparing the target to that node tells
  you NOTHING about whether the target is in the left subtree or the
  right subtree, because the heap rule never compares siblings or
  subtrees to each other, only a parent to its own children. The only
  safe move is to check every node, O(n).

  (One shortcut still works: if the target is SMALLER than the current
  node in a min-heap, you can stop early, since nothing below can be
  smaller than its own parent, that subtree cannot contain it. That
  helps in the best case but does not change the O(n) worst case.)

WHY BUILDING A HEAP FROM AN ARRAY IS O(n)
  Naively you might expect n inserts x O(log n) each = O(n log n), and
  that IS what you get if you build a heap by pushing items one at a
  time. But there's a cheaper way: dump all n items into the array as
  is, then "bubble down" starting from the last PARENT node up to the
  root. Most nodes live near the bottom of the tree, where a bubble-down
  has almost no distance to fall, so the total work sums to O(n), not
  O(n log n). (Not shown in code here, it's a standard build-heap
  algorithm you can look up as "heapify" if you want the proof.)

WHY THEY ARE STORED DIFFERENTLY (array vs pointers)
  A heap's shape is 100% predictable, it's always a complete tree of a
  known size, so "where is the parent of index i" is pure arithmetic
  (see the index formulas below). No left/right pointers needed at all,
  which is why MinHeap here just uses a plain array.

  A BST's shape depends on the actual data, so there's no formula for
  "where is my parent," you have to store an explicit pointer to each
  child (as in BSTNode { left, right } style). That's extra memory per
  node that a heap doesn't need.

WHEN TO REACH FOR WHICH
  Heap: you only ever need "give me the current min/max, repeatedly,"
  and don't care about anything else's relative order. Top K, k-th
  largest, merge k sorted lists, Dijkstra's shortest path.

  BST: you need to search for arbitrary values, walk values in sorted
  order, or find a value's predecessor/successor. A heap cannot do any
  of those in better than O(n), a BST does all of them in O(log n)
  average (or guaranteed, with a self-balancing variant).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JAVASCRIPT DOESN'T HAVE A BUILT-IN HEAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In interviews you either:
  1. Implement a min-heap class (shown below)
  2. Simulate with a sorted array (only works for small n)
  3. Use a library like 'heap' or '@datastructures-js/priority-queue'

In Python: heapq module (min-heap built-in) — much easier.
In Java:   PriorityQueue class.
*/

// MIN-HEAP IMPLEMENTATION
class MinHeap {
    constructor() {
        this.data = [];
    }

    size() { return this.data.length; }
    peek() { return this.data[0]; } // O(1)

    // index helpers for navigating the tree stored as array
    parent(i) { return Math.floor((i - 1) / 2); }
    left(i)   { return 2 * i + 1; }
    right(i)  { return 2 * i + 2; }
    swap(i, j) { [this.data[i], this.data[j]] = [this.data[j], this.data[i]]; }

    // insert: add to end, bubble up until heap property restored
    push(val) {
        this.data.push(val);
        let i = this.data.length - 1;
        while (i > 0 && this.data[i] < this.data[this.parent(i)]) {
            this.swap(i, this.parent(i));
            i = this.parent(i);
        }
    } // O(log n)

    // remove min: swap root with last, remove last, bubble down
    pop() {
        if (this.size() === 1) return this.data.pop();
        const min = this.data[0];
        this.data[0] = this.data.pop(); // move last element to root
        this._bubbleDown(0);
        return min;
    } // O(log n)

    _bubbleDown(i) {
        let smallest = i;
        const l = this.left(i), r = this.right(i);
        if (l < this.size() && this.data[l] < this.data[smallest]) smallest = l;
        if (r < this.size() && this.data[r] < this.data[smallest]) smallest = r;
        if (smallest !== i) {
            this.swap(i, smallest);
            this._bubbleDown(smallest);
        }
    }
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW THE HEAP IS STORED AS AN ARRAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The tree is flattened into an array level by level:

         1           index 0
        / \
       3   2         index 1, 2
      / \
     7   5           index 3, 4

Array: [1, 3, 2, 7, 5]

For node at index i:
  parent      → Math.floor((i-1) / 2)
  left child  → 2*i + 1
  right child → 2*i + 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// PATTERN 1: Top K Frequent Elements
// Use a min-heap of size k — if heap exceeds k, pop the smallest.
// What remains is the k largest.
// Problem you've solved: 8. Top K Frequent Elements
function topKFrequent(nums, k) {
    const freq = new Map();
    for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

    // sort by frequency — in practice would use a heap for O(n log k)
    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, k)
        .map(([num]) => num);
}

// PATTERN 2: K-th Largest Element
// Min-heap of size k: the top is always the k-th largest seen so far.
function findKthLargest(nums, k) {
    const heap = new MinHeap();
    for (const n of nums) {
        heap.push(n);
        if (heap.size() > k) heap.pop(); // keep only k largest
    }
    return heap.peek(); // smallest of the k largest = k-th largest overall
}
// Time: O(n log k)  Space: O(k)

// PATTERN 3: Merge K Sorted Lists / Arrays
// Push the first element of each list into a min-heap.
// Repeatedly pop the min and push the next element from that list.
// Time: O(n log k) where n = total elements, k = number of lists

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO RECOGNIZE A HEAP PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- "Top K...", "K-th largest/smallest"
- "Find the median of a stream"
- "Merge K sorted..."
- "Minimum cost to..." (greedy + always picking the smallest)
- Need repeated access to min/max efficiently

Heap vs Sort:
  If you need ALL elements sorted           → sort O(n log n)
  If you only need the K smallest/largest   → heap O(n log k)  ← faster when k << n

Max-Heap trick in JS: negate all values when pushing/popping to turn a min-heap into a max-heap.
  push(-val) instead of push(val)
  result = -heap.pop()
*/
