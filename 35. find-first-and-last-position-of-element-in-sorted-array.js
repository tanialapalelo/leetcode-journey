/*
34. Find First and Last Position of Element in Sorted Array
Medium

Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.

If target is not found in the array, return [-1, -1].

You must write an algorithm with O(log n) runtime complexity.

 

Example 1:

Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
Example 2:

Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
Example 3:

Input: nums = [], target = 0
Output: [-1,-1]
 

Constraints:

0 <= nums.length <= 105
-109 <= nums[i] <= 109
nums is a non-decreasing array.
-109 <= target <= 109
 


*/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    const first = findBound(nums, target, true);
    if (first === -1) return [-1, -1];
    const last = findBound(nums, target, false);
    return [first, last];
};

function findBound(nums, target, isFirst) {
    let start = 0;
    let end = nums.length - 1;

    while (start <= end) {
        const mid = Math.floor(start + (end - start) / 2); // ✅ overflow-safe

        if (nums[mid] === target) {
            if (isFirst) {
                if (mid === start || nums[mid - 1] !== target) return mid; // ✅ check left neighbor
                end = mid - 1; // target found but go further left
            } else {
                if (mid === end || nums[mid + 1] !== target) return mid;   // ✅ check right neighbor
                start = mid + 1; // target found but go further right
            }
        } else if (nums[mid] > target) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }

    return -1;
}


/*
EXPLANATIONq

We can use binary search to find the leftmost and rightmost occurrences of the target in O(log n) time.

1. To find the leftmost index of the target:
   - Perform a binary search. When we find the target, we check if it's the first occurrence by comparing it with its left neighbor. 
   - If it's the first occurrence, we return its index. Otherwise, we continue searching in the left half.

2. To find the rightmost index of the target:
   - Perform a binary search. When we find the target, we check if it's the last occurrence by comparing it with its right neighbor.
   - If it's the last occurrence, we return its index. Otherwise, we continue searching in the right half.
Time complexity: O(log n) for each binary search, so O(log n) overall.
Space complexity: O(1) since we are using a constant amount of space.


WALKTHROUGH
Input: nums = [5,7,7,8,8,10], target = 8
Find leftmost index:
start=0, end=5, mid=2 → nums[2]=7 < 8 → start=3 (start is from mid+1, so we move right from the mid)
start=3, end=5, mid=4 → nums[4]=8 == 8 → check left neighbor nums[3]=8 == 8 → end=3 (end is from mid-1, so we move left from the mid)
start=3, end=3, mid=3 → nums[3]=8 == 8 → check left neighbor nums[2]=7 != 8 → return 3
Find rightmost index:
start=0, end=5, mid=2 → nums[2]=7 < 8 → start=3 (start is from mid+1, so we move right from the mid)
start=3, end=5, mid=4 → nums[4]=8 == 8 → check right neighbor nums[5]=10 != 8 → return 4
Result: [3, 4] ✓
*/