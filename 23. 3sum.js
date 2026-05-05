/*
15. 3Sum
Medium

Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.


Example 1:

Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.
Example 2:

Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.
Example 3:

Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.
 

Constraints:

3 <= nums.length <= 3000
-105 <= nums[i] <= 105

*/

// ANSWER
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    let result = [];
    nums.sort((a,b) => a -b); // sort the numbers first

    for (let i = 0; i < nums.length - 2; i++) {
        // Early exit: smallest number already > 0, no triplet possible
        if (nums[i] > 0) break; 
        
        let l = i + 1;               // ✅ Reset l untuk setiap i
        let r = nums.length - 1;     // ✅ Reset r untuk setiap i

        // Skip duplicate values for i
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        while (l < r && !(nums[i] > 0)){
            const target = -nums[i];
            if (nums[l] + nums[r] > target){
                r--;
            }
            else if (nums[l] + nums[r] < target) {
                l++;
            }
            else {
                result.push([nums[i], nums[l], nums[r]]);
                
                // Skip duplicates for l and r after finding a valid triplet
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;

                l++;
                r--;
            }
        }
    }

    return result;
};

// EXPLANATION
// We can sort the array first and then use two pointers to find the triplets that sum up to zero.
// We can iterate through the array and for each number, we can use two pointers to find the other two numbers that sum up to the negative of the current number.
// We also need to skip duplicate values to avoid duplicate triplets in the result.