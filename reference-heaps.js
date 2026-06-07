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
