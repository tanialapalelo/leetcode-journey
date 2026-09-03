/*
88. Merge Sorted Array
Easy

You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.



Example 1:

Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.
Example 2:

Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
Explanation: The arrays we are merging are [1] and [].
The result of the merge is [1].
Example 3:

Input: nums1 = [0], m = 0, nums2 = [1], n = 1
Output: [1]
Explanation: The arrays we are merging are [] and [1].
The result of the merge is [1].
Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.


Constraints:

nums1.length == m + n
nums2.length == n
0 <= m, n <= 200
1 <= m + n <= 200
-109 <= nums1[i], nums2[j] <= 109


Follow up: Can you come up with an algorithm that runs in O(m + n) time?
 */

// APPROACH 1: Naive — copy + sort
// Time: O((m+n) log(m+n)) | Space: O(1)
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge1 = function(nums1, m, nums2, n) {
  for (let i = 0; i < n; i++) {
    nums1[m + i] = nums2[i];
  }
  nums1.sort((a, b) => a - b);
};

// APPROACH 2: Two Pointers from the End (optimal)
// Time: O(m+n) | Space: O(1)
//
// Both arrays are sorted — fill nums1 from the BACK to avoid shifting.
// Compare the largest unplaced elements and place the bigger one last.
var merge = function(nums1, m, nums2, n) {
  let p1 = m - 1;       // pointer for nums1's real elements
  let p2 = n - 1;       // pointer for nums2
  let p = m + n - 1;    // pointer for nums1's last slot

  while (p2 >= 0) {
    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }
  // If p2 ran out first, remaining nums1 elements are already in place
};

// same thing as
var merge = function(nums1, m, nums2, n) {
    let nums1Tail = m + n - 1;
    let nums2Pointer = n - 1;
    let nums1Pointer = m - 1;

    while (nums2Pointer >= 0){ // only nums2 has no home so we choose it to validate loop
        if ( nums1Pointer >= 0 && nums1[nums1Pointer] > nums2[nums2Pointer]){
            nums1[nums1Tail--] = nums1[nums1Pointer--]; // post-decrement operator meaning use the index first and do -- after
        } else {
            nums1[nums1Tail--] = nums2[nums2Pointer--];
        }
    }
};

// TEST
let nums1 = [1,2,3,0,0,0];
merge(nums1, 3, [2,5,6], 3);
console.log(nums1); // [1,2,2,3,5,6]

let nums2 = [0];
merge(nums2, 0, [1], 1);
console.log(nums2); // [1]

/*
EXPLANATION

APPROACH 1 — Naive copy + sort:
  Copy all of nums2 into the empty slots at the end of nums1,
  then sort nums1. Simple but doesn't use the fact that both arrays are already sorted.
  Time: O((m+n) log(m+n)) | Space: O(1)

APPROACH 2 — Two Pointers from the End (optimal):
  Since both arrays are already sorted, we can avoid sorting altogether.
  The trick is to fill nums1 from the BACK instead of the front.
  Why from the back? Because nums1 has free space at the end — placing
  elements there doesn't overwrite anything we still need.

  We use 3 pointers:
    - nums1Pointer → last real element in nums1 (index m-1)
    - nums2Pointer → last element in nums2 (index n-1)
    - nums1Tail    → last available slot in nums1 (index m+n-1)

  At each step: compare the two pointed elements, place the LARGER one
  at nums1Tail, then move that pointer left. Repeat until nums2 is exhausted.
  (If nums1 still has leftover elements, they're already in place — no action needed.)

  Why loop on nums2Pointer only? Because nums2 has no home yet. If nums2 runs
  out first, whatever's left in nums1 is already sorted and already in place.
  Time: O(m+n) | Space: O(1)


WALKTHROUGH
Input: nums1 = [1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3

Initial:  nums1Tail=5, nums1Pointer=2, nums2Pointer=2
          nums1: [1, 2, 3, 0, 0, 0]
          nums2: [2, 5, 6]

Step 1: nums1[2]=3 vs nums2[2]=6 → 6 wins → nums1[5]=6, nums2Pointer=1, nums1Tail=4
        nums1: [1, 2, 3, 0, 0, 6]

Step 2: nums1[2]=3 vs nums2[1]=5 → 5 wins → nums1[4]=5, nums2Pointer=0, nums1Tail=3
        nums1: [1, 2, 3, 0, 5, 6]

Step 3: nums1[2]=3 vs nums2[0]=2 → 3 wins → nums1[3]=3, nums1Pointer=1, nums1Tail=2
        nums1: [1, 2, 3, 3, 5, 6]

Step 4: nums1[1]=2 vs nums2[0]=2 → equal → nums2 wins → nums1[2]=2, nums2Pointer=-1, nums1Tail=1
        nums1: [1, 2, 2, 3, 5, 6]

Loop ends (nums2Pointer < 0). nums1[0..1] = [1,2] were already in the right place.
Result: [1, 2, 2, 3, 5, 6] ✓
*/
