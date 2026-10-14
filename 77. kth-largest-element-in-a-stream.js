/*
703. Kth Largest Element in a Stream
Easy

You are part of a university admissions office and need to keep track of the kth highest test score from applicants in real-time. 
This helps to determine cut-off marks for interviews and admissions dynamically as new applicants submit their scores.

You are tasked to implement a class which, for a given integer k, maintains a stream of test scores and continuously returns the kth highest test score after a new score has been submitted. 
More specifically, we are looking for the kth highest score in the sorted list of all scores.

Implement the KthLargest class:

KthLargest(int k, int[] nums) Initializes the object with the integer k and the stream of test scores nums.
int add(int val) Adds a new test score val to the stream and returns the element representing the kth largest element in the pool of test scores so far.
 

Example 1:

Input:
["KthLargest", "add", "add", "add", "add", "add"]
[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]

Output: [null, 4, 5, 5, 8, 8]

Explanation:

KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);
kthLargest.add(3); // return 4
kthLargest.add(5); // return 5
kthLargest.add(10); // return 5
kthLargest.add(9); // return 8
kthLargest.add(4); // return 8

Example 2:

Input:
["KthLargest", "add", "add", "add", "add"]
[[4, [7, 7, 7, 7, 8, 3]], [2], [10], [9], [9]]

Output: [null, 7, 7, 7, 8]

Explanation:

KthLargest kthLargest = new KthLargest(4, [7, 7, 7, 7, 8, 3]);
kthLargest.add(2); // return 7
kthLargest.add(10); // return 7
kthLargest.add(9); // return 7
kthLargest.add(9); // return 8

Manual walkthrough (mental model: keep a "top-k pool" of the k largest scores seen so far;
the answer is always the SMALLEST value currently sitting in that pool, since that's the
weakest member of the top-k, i.e. the kth largest overall):

Example 1, k=3, initial nums=[4,5,8,2]
  Start:        all scores sorted desc = [8,5,4,2] -> keep only the top 3 -> pool = {8,5,4}
  add(3):  pool+val = {8,5,4,3} (4 elements, over the k=3 limit)
           -> evict the smallest (3) -> pool = {8,5,4} -> answer = smallest in pool = 4
  add(5):  pool+val = {8,5,4,5} -> evict smallest (4) -> pool = {8,5,5} -> answer = 5
  add(10): pool+val = {8,5,5,10} -> evict smallest (5) -> pool = {8,5,10} -> answer = 5
  add(9):  pool+val = {8,5,10,9} -> evict smallest (5) -> pool = {8,10,9} -> answer = 8
  add(4):  pool+val = {8,10,9,4} -> evict smallest (4) -> pool = {8,10,9} -> answer = 8
  Matches output: [null, 4, 5, 5, 8, 8]

Example 2, k=4, initial nums=[7,7,7,7,8,3] (duplicates each count as their own entry!)
  Start:        all scores sorted desc = [8,7,7,7,7,3] -> keep only the top 4 -> pool = {8,7,7,7}
  add(2):  pool+val = {8,7,7,7,2} -> evict smallest (2) -> pool = {8,7,7,7} -> answer = 7
  add(10): pool+val = {8,7,7,7,10} -> evict smallest (7) -> pool = {8,7,7,10} -> answer = 7
  add(9):  pool+val = {8,7,7,10,9} -> evict smallest (7) -> pool = {8,7,10,9} -> answer = 7
  add(9):  pool+val = {8,7,10,9,9} -> evict smallest (7) -> pool = {8,10,9,9} -> answer = 8
  Matches output: [null, 7, 7, 7, 8]

The "pool" above is exactly what the min-heap in Approach 3 holds: at most k elements, and its
root (the minimum of the heap) is always the smallest member of the pool - which is the answer.
 

Constraints:

0 <= nums.length <= 104
1 <= k <= nums.length + 1
-104 <= nums[i] <= 104
-104 <= val <= 104
At most 104 calls will be made to add.
*/

/*
1st Approach: BRUTE FORCE
Keep every score ever seen in a plain array. On every add(), push the new value, sort the whole
array descending, and return the element at index k-1.
Time complexity: O(n log n) per add call, where n = scores seen so far (keeps growing).
Space complexity: O(n).

2nd Approach: Sorted insertion
Keep the array always sorted (instead of re-sorting from scratch each time). On add(), binary
search for the correct insertion index, then splice the value in.
Time complexity: O(log n) to find the position + O(n) to shift elements during insertion = O(n)
per add. Same order as brute force, but cheaper in practice (no full re-sort each call).
Space complexity: O(n).

3rd Approach (optimal): Min-Heap capped at size k
We only ever care about the k largest scores, so keep a min-heap that never holds more than k
elements. Its root (the smallest of the current top-k) IS the kth largest overall. On add(val):
push val, and if the heap now has more than k elements, pop the smallest (evict it) - the root
after that is the answer. The constructor just runs add() for every initial num, which naturally
caps the heap at k as it goes.
Time complexity: O(log k) per add call, O(n log k) for the constructor (n = nums.length).
Space complexity: O(k).

How the array represents a tree: for any index i, parentIndex = floor((i-1)/2),
leftChild = 2i+1, rightChild = 2i+2. A min-heap's rule: every parent <= both its children
(so the smallest value is always at index 0 - the root).

_bubbleUp walkthrough - pushing 8, then 5, then 4, then 3 into an empty heap one at a time:
  push(8): heap=[8]                                 tree:  8
  push(5): heap=[8,5] -> 5 is at index 1, its parent (index 0) is 8.
           8 <= 5? No -> swap -> heap=[5,8]          tree:  5
                                                             /
                                                            8
  push(4): heap=[5,8,4] -> 4 is at index 2, parentIndex=floor((2-1)/2)=0, which is 5.
           5 <= 4? No -> swap -> heap=[4,8,5]         tree:  4
                                                             /  \
                                                            8    5
  push(3): heap=[4,8,5,3] -> 3 is at index 3, parentIndex=floor((3-1)/2)=1, which is 8.
           8 <= 3? No -> swap -> heap=[4,3,5,8], now 3 moved to index 1.
           Repeat from index 1: parentIndex=floor((1-1)/2)=0, which is 4.
           4 <= 3? No -> swap -> heap=[3,4,5,8]        tree:      3
           index is now 0 (the root), loop stops.               /  \
                                                                 4    5
                                                                /
                                                               8
  Each step only compares the NEW value against its own ancestors on the way up (not the
  whole tree) - that's why it's O(log k): a heap of k elements has only ~log2(k) levels.

_bubbleDown walkthrough - calling pop() on heap=[3,4,5,8] from above:
  min = heap[0] = 3 (this is what gets returned)
  last = heap.pop() -> removes the LAST array slot (8), heap is temporarily [3,4,5]
  heap[0] = last -> overwrite the root with that last value -> heap=[8,4,5]   tree:  8
                                                                                     /  \
                                                                                    4    5
  Now 8 is probably too big for the root, so sift it down:
    index=0: leftChild=1 (val 4), rightChild=2 (val 5). Smaller child is 4 (index 1).
    8 <= 4? No -> swap -> heap=[4,8,5], index becomes 1.    tree:  4
                                                                    /  \
                                                                   8    5
    index=1: leftChild=2*1+1=3, rightChild=4 - both out of bounds (heap.length=3) -> no
    children left to compare -> loop stops.
  Final heap=[4,8,5], returned value = 3 (the old root/minimum).
  Why move the LAST element to the root instead of just deleting index 0? Because deleting
  index 0 directly would leave a hole in the middle of the array and break every index
  formula above - moving the last element in is the cheapest way to keep the array fully
  packed (no gaps) while still being length-1.
*/

// Approach 3 (optimal) - Min-Heap capped at size k
class MinHeap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    // the smallest of the current top-k, i.e. the kth largest overall
    peek() {
        return this.heap[0];
    }

    push(val) {
        this.heap.push(val);
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        const min = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._bubbleDown(0);
        }
        return min;
    }

    // after push(): the new value sits at the last slot (bottom of the tree) and may be
    // smaller than its parent, so swap it upward until every parent <= its children again
    _bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex] <= this.heap[index]) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    // after pop(): the last element was moved up to the root and may be bigger than its
    // children, so swap it downward into whichever child is smaller until it settles in place
    _bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            let smallest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < length && this.heap[leftChild] < this.heap[smallest]) smallest = leftChild;
            if (rightChild < length && this.heap[rightChild] < this.heap[smallest]) smallest = rightChild;
            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

/**
 * @param {number} k
 * @param {number[]} nums
 */
var KthLargest3A = function(k, nums) {
    this.k = k;
    this.heap = new MinHeap();
    for (const num of nums) {
        this.add(num); // reuses add() below, so the heap is capped at k from the start
    }
};

/**
 * @param {number} val
 * @return {number}
 */
KthLargest3A.prototype.add = function(val) {
    this.heap.push(val);
    if (this.heap.size() > this.k) this.heap.pop(); // evict the smallest once we exceed k elements
    return this.heap.peek();
};


// Approach 3b - same idea, but using LeetCode's built-in MinPriorityQueue instead of our own
// MinHeap class (LeetCode's JS judge provides MinPriorityQueue/MaxPriorityQueue as globals -
// no import needed - but its API differs: enqueue/dequeue/front/isEmpty, no peek/push/pop).
/**
 * @param {number} k
 * @param {number[]} nums
 */
var KthLargest = function(k, nums) {
    this.k = k;
    this.heap = new MinPriorityQueue();
    
    for (const num of nums) {
        this.add(num);
    }
};

/** 
 * @param {number} val
 * @return {number}
 */
KthLargest.prototype.add = function(val) {
    this.heap.enqueue(val);
    
    // Jika ukuran heap melebihi k, buang elemen terkecil
    if (this.heap.size() > this.k) {
        this.heap.dequeue();
    }
    
    // Langsung kembalikan elemen teratas dari heap
    return this.heap.front(); 
};

/**
 * Your KthLargest object will be instantiated and called as such:
 * var obj = new KthLargest(k, nums)
 * var param_1 = obj.add(val)
 */



// Approach 1 (brute force) - re-sort the whole pool on every add
var KthLargest1 = function(k, nums) {
    this.k = k;
    this.nums = [...nums];
};

KthLargest1.prototype.add = function(val) {
    this.nums.push(val);
    this.nums.sort((a, b) => b - a);
    return this.nums[this.k - 1];
};


// Approach 2 - keep the array sorted, insert new values at the right spot via binary search
var KthLargest2 = function(k, nums) {
    this.k = k;
    this.nums = [...nums].sort((a, b) => b - a); // sorted descending
};

KthLargest2.prototype.add = function(val) {
    // binary search for the first index whose value is <= val (descending order)
    let lo = 0, hi = this.nums.length;
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (this.nums[mid] > val) lo = mid + 1;
        else hi = mid;
    }
    this.nums.splice(lo, 0, val);
    return this.nums[this.k - 1];
};