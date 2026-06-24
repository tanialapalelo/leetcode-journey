/*
704. Binary Search
Easy

Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.

 

Example 1:

Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
Example 2:

Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1
 

Constraints:

1 <= nums.length <= 104
-104 < nums[i], target < 104
All the integers in nums are unique.
nums is sorted in ascending order.
*/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right){
        const mid = Math.floor(left + (right - left) / 2);
        if(nums[mid] == target) return mid;
        else if(nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // not found
};

/* 

EXPLANATION

Binary Search: O(log n) time, O(1) space
We maintain two pointers, left and right, which represent the current search range. 
We calculate the middle index and compare the middle element with the target. 
If they match, we return the middle index. 
If the middle element is less than the target, we move the left pointer to mid + 1 to search in the right half. 
If the middle element is greater than the target, we move the right pointer to mid - 1 to search in the left half. 
We repeat this process until we find the target or until left exceeds right, which means the target is not in the array.

*/