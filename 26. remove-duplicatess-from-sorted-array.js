/*

26. Remove Duplicates from Sorted Array
Easy

Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.

Consider the number of unique elements in nums to be k​​​​​​​​​​​​​​. After removing duplicates, return the number of unique elements k.

The first k elements of nums should contain the unique numbers in sorted order. The remaining elements beyond index k - 1 can be ignored.

Custom Judge:

The judge will test your solution with the following code:

int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length

int k = removeDuplicates(nums); // Calls your implementation

assert k == expectedNums.length;
for (int i = 0; i < k; i++) {
    assert nums[i] == expectedNums[i];
}
If all assertions pass, then your solution will be accepted.

 

Example 1:

Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
Example 2:

Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
 

Constraints:

1 <= nums.length <= 3 * 104
-100 <= nums[i] <= 100
nums is sorted in non-decreasing order.

*/

/* EXPLANATION

Problem Understanding

LeetCode 26: Remove Duplicates from Sorted Array

You're given a sorted array of integers, and you need to:

    Remove all duplicates in-place (modify the original array)
    Return the number of unique elements
    The first k elements should contain the unique values (order doesn't matter after position k)

Constraints:

    Array is sorted
    You must do this in-place with O(1) extra space
    You only care about the first k elements returned

Solution Approach

Two Pointers Technique:
    Use two pointers, i and j.
    i will track the position of the last unique element found.
    j will iterate through the array to find unique elements.
    When nums[j] is different from nums[i], it means we've found a new unique element.
    Increment i and update nums[i] to nums[j].
    Continue until j reaches the end of the array.
Time Complexity: O(n) - We traverse the array once.
Space Complexity: O(1) - We only use a constant amount of extra space.

Example Walkthrough
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Initial State:
i = 0, j = 1
nums[i] = 0, nums[j] = 0 (duplicate, move j)
j = 2
nums[i] = 0, nums[j] = 1 (unique, move i and update)
i = 1, nums[i] = 1
j = 3
nums[i] = 1, nums[j] = 1 (duplicate, move j)
j = 4
nums[i] = 1, nums[j] = 1 (duplicate, move j)
j = 5
nums[i] = 1, nums[j] = 2 (unique, move i and update)
i = 2, nums[i] = 2
j = 6
nums[i] = 2, nums[j] = 2 (duplicate, move j)
j = 7
nums[i] = 2, nums[j] = 3 (unique, move i and update)
i = 3, nums[i] = 3
j = 8
nums[i] = 3, nums[j] = 3 (duplicate, move j)
j = 9
nums[i] = 3, nums[j] = 4 (unique, move i and update)
i = 4, nums[i] = 4
j = 10 (end of array)
Return i + 1 = 5, and the first 5 elements of nums are [0, 1, 2, 3, 4].

*/


// ANSWER
var removeDuplicates = function(nums) {
    let i = 0;
    for (let j = 1; j < nums.length; j++){
        if (nums[j] !== nums[j-1]){
            i++;
            nums[i] = nums[j]
        }
    }
    return i + 1;
};