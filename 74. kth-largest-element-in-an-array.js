/*
215. Kth Largest Element in an Array
Medium

Given an integer array nums and an integer k, return the kth largest element in the array.

Note that it is the kth largest element in the sorted order, not the kth distinct element.

Can you solve it without sorting?

 

Example 1:

Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
Example 2:

Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
 

Constraints:

1 <= k <= nums.length <= 105
-104 <= nums[i] <= 104
 

*/

/*
1st Approach: BRUTE FORCE
Iterate to finc 1st max value, 2nd max value ... till the kth max value and return it.
Time Complexity: O(n*k)


2nd Approach: Sort the given input in desc order and return the kth largest element.
Time complexity: O(n log n)
But we are told not to use sorting

3rd Approach: Priority Queue (Min Heap) or Quickselect
We'll use a Min Heap of size k to keep track of the k largest elements seen so far. The top of the heap will be the kth largest element.
Time complexity: O(n log k)
Space complexity: O(k)

So, other questions like kth largest, kth smallest, and median can also be solved using similar approaches.
*/


// Min Heap approach to find the kth largest element in an array
class MinHeap {
    constructor() {
        this.heap = [];
    }

    // Get the size of the heap
    size() {
        return this.heap.length;
    }

    // Peek at the minimum element (top of the heap)
    peek() {
        return this.heap[0];
    }

    // Insert a new value into the heap
    push(val) {
        this.heap.push(val);
        this._bubbleUp(this.heap.length - 1);
    }

    // Remove and return the minimum element
    pop() {
        if (this.size() === 0) return null;
        if (this.size() === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._bubbleDown(0);
        return min;
    }

    // Helper to maintain heap property after insertion
    _bubbleUp(index) {
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex] <= this.heap[index]) break;
            
            // Swap
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    // Helper to maintain heap property after deletion
    _bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftChild = 2 * index + 1;
            let rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < length && this.heap[leftChild] < this.heap[smallest]) {
                smallest = leftChild;
            }
            if (rightChild < length && this.heap[rightChild] < this.heap[smallest]) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            // Swap
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    const minHeap = new MinHeap();

    for (let num of nums) {
        minHeap.push(num);
        
        // If the heap exceeds size k, remove the smallest element
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }

    // The top of the heap is now the kth largest element
    return minHeap.peek();
};



/*
LeetCode runs the code multiple times (across multiple test cases) within the same global execution scope 
when using class declarations at the top level, or it collides with a hidden definition.
In LeetCode's JavaScript environment, we do not need to write a custom MinHeap class at all.
LeetCode globally injects a built-in library called @datastructures-js/priority-queue. 

*/

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    // 1. Initialize LeetCode's globally available MinPriorityQueue
    const minHeap = new MinPriorityQueue();

    for (let num of nums) {
        // 2. Insert element (automatically sorted)
        minHeap.enqueue(num);
        
        // 3. Keep size at k, remove the smallest element to maintain the heap size
        if (minHeap.size() > k) {
            minHeap.dequeue();
        }
    }

    // 4. Return the front element (lowest value in the top-k)
    return minHeap.front();
};


/* WALKTHROUGH WITH TREE REPRESENTATION OF THE MIN-HEAP
nums = [3,2,1,5,6,4]; // Example array
k = 2; // Example: find the 2nd largest element

Step-by-Step Execution
Initial State: Heap is empty [] 
Step 1: Process num = 3 Action: Push 3 into the heap. Size is 1 (still <= k). 
Heap Structure:  3
or if written will be like this [3]

Step 2: Process num = 2 Action: Push 2 into the heap. 
It bubbles up to the root because it is smaller than 3. Size is 2 (still <= k).
Heap Structure:
    2
   /
  3
or if written will be like this [2,3]

Step 3: Process num = 1 Action: Push 1 into the heap. 
It bubbles up to the root.Heap Structure (Before Pop): Size becomes 3, which is greater than k.
    1
   / \
  3   2
or if written will be like this [1,3,2]
Action: Since size > k, we pop the minimum element (1). The last element (2) moves to the root.Heap Structure (After Pop): 
    2
   /
  3
or if written will be like this [2,3]
Step 4: Process num = 5 Action: Push 5 into the heap.Heap Structure (Before Pop): Size becomes 3.
    2
   / \
  3   5
or if written will be like this [2,3,5]
Action: Since size > k, we pop the minimum element (2). The last element (5) moves to the root and bubbles down because it's larger than 3.Heap Structure (After Pop): 
    3
   /
  5
or if written will be like this [3,5]

Step 5: Process num = 6 Action: Push 6 into the heap.Heap Structure (Before Pop): Size becomes 3.
    3
   / \
  5   6
or if written will be like this [3,5,6]
Action: Since size > k, we pop the minimum element (3). The last element (6) moves to the root and bubbles down because it's larger than 5.
Heap Structure (After Pop): 
    5
   /
  6
or if written will be like this [5,6]

Step 6: Process num = 4 Action: Push 4 into the heap. It bubbles up to the root because 4 < 5.Heap Structure (Before Pop): Size becomes 3.
    4
   / \
  6   5
or if written will be like this [4,6,5]
Action: Since size > k, we pop the minimum element (4). The last element (5) moves to the root.Heap Structure (After Pop): 
    5
   /
  6
or if written will be like this [5,6]

Final ResultThe array iteration is complete. 
The heap now holds the 2 largest elements from the entire array: [5, 6]. 
We read the top element using minHeap.front() (or .peek()): Output: 5 

*/