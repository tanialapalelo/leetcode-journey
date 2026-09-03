/*
QUESTION: 347. Top K Frequent Elements

Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

 

Example 1:

Input: nums = [1,1,1,2,2,3], k = 2

Output: [1,2]

Example 2:

Input: nums = [1], k = 1

Output: [1]

Example 3:

Input: nums = [1,2,1,2,1,2,3,1,3,2], k = 2

Output: [1,2]

 

Constraints:

    1 <= nums.length <= 105
    -104 <= nums[i] <= 104
    k is in the range [1, the number of unique elements in the array].
    It is guaranteed that the answer is unique.

 

Follow up: Your algorithm's time complexity must be better than O(n log n), where n is the array's size.


*/

// ANSWER
// NEED TO STUDY MORE ABOUT HEAP DATA STRUCTURE

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
class MyMinHeap {
  constructor() {
    this.a = []; // array penyimpan heap
  }

  size() { return this.a.length; }
  peek() { return this.a[0]; } // O(1): elemen terkecil selalu di index 0

  push(val) {
    this.a.push(val);                 // taruh di akhir
    this._siftUp(this.a.length - 1);  // naikkan kalau melanggar aturan
  }

  pop() {
    if (this.a.length === 0) return undefined;

    const min = this.a[0];            // root = yang paling kecil
    const last = this.a.pop();        // ambil elemen terakhir

    if (this.a.length > 0) {
      this.a[0] = last;               // pindahkan last ke root
      this._siftDown(0);              // turunkan sampai aturan benar
    }
    return min;
  }

  _siftUp(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;         // parent index
      if (this.a[p][1] <= this.a[i][1]) break; // compare count
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }

  _siftDown(i) {
    const n = this.a.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let s = i; // smallest index (by count)

      if (l < n && this.a[l][1] < this.a[s][1]) s = l;
      if (r < n && this.a[r][1] < this.a[s][1]) s = r;

      if (s === i) break; // sudah lebih kecil dari kedua anak => valid
      [this.a[i], this.a[s]] = [this.a[s], this.a[i]];
      i = s;
    }
  }
}

var topKFrequent = function(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);

  const heap = new MyMinHeap();

  for (const [num, count] of freq) {
    heap.push([num, count]);
    if (heap.size() > k) heap.pop();
  }

  const res = [];
  while (heap.size() > 0) res.push(heap.pop()[0]);
  return res;
};

// Time complexity: O(n log k) - building freq takes O(n); for each of the up to n unique
// elements we push/pop from a heap capped at size k, each operation costing O(log k).
// Space complexity: O(n + k) - freq map holds up to n unique elements, heap holds up to k.