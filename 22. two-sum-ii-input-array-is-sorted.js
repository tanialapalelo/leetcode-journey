/*
167. Two Sum II - Input Array Is Sorted
Medium

Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Let these two numbers be numbers[index1] and numbers[index2] where 1 <= index1 < index2 <= numbers.length.

Return the indices of the two numbers index1 and index2, each incremented by one, as an integer array [index1, index2] of length 2.

The tests are generated such that there is exactly one solution. You may not use the same element twice.

Your solution must use only constant extra space.



Example 1:

Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].
Example 2:

Input: numbers = [2,3,4], target = 6
Output: [1,3]
Explanation: The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].
Example 3:

Input: numbers = [-1,0], target = -1
Output: [1,2]
Explanation: The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2. We return [1, 2].


Constraints:

2 <= numbers.length <= 3 * 104
-1000 <= numbers[i] <= 1000
numbers is sorted in non-decreasing order.
-1000 <= target <= 1000
The tests are generated such that there is exactly one solution.
 */

// ANSWER
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
    let l = 0;
    let r = numbers.length - 1;
    while (l < r){
        if (numbers[l] + numbers[r] > target) r--;
        else if (numbers[l] + numbers[r] < target) l++;
        else return [l+1, r+1] // since it's 1-indexed array not start from 0
    }
    return null; // for not found
};

// EXPLANATION
// We can use two pointers, one starting from the beginning of the array and the other starting from the end of the array.
// We can then check if the sum of the two numbers at these pointers is equal to the target.
// If it is, we return the indices of these two numbers.
// If the sum is less than the target, we move the left pointer to the right to increase the sum.
// If the sum is greater than the target, we move the right pointer to the left to decrease the sum.
// We continue this process until we find the two numbers that add up to the target.