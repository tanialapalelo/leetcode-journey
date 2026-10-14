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
        this.#bubbleUp(this.heap.length - 1);
    }

    pop() {
        const min = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.#bubbleDown(0);
        }
        return min;
    }

    #bubbleUp(i) {
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (this.heap[parent] <= this.heap[i]) break;
            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
            i = parent;
        }
    }

    #bubbleDown(i) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
            if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;
            if (smallest === i) break;
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
}

/**
 * @param {number} k
 * @param {number[]} nums
 */
var KthLargest = function(k, nums) {
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
KthLargest.prototype.add = function(val) {
    this.heap.push(val);
    if (this.heap.size() > this.k) this.heap.pop(); // evict the smallest once we exceed k elements
    return this.heap.peek();
};


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
        const mid = (lo + hi) >> 1;
        if (this.nums[mid] > val) lo = mid + 1;
        else hi = mid;
    }
    this.nums.splice(lo, 0, val);
    return this.nums[this.k - 1];
};