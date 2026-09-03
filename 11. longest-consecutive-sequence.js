/*
128. Longest Consecutive Sequence
Medium

Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in O(n) time.



Example 1:

Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.
Example 2:

Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
Example 3:

Input: nums = [1,0,1,2]
Output: 3


Constraints:

0 <= nums.length <= 105
-109 <= nums[i] <= 109

 */

// ANSWER
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    if (nums.length == 0) return 0;

    const numSet = new Set(nums); // hashset that stores all nums
    let longestSubs = 1; // longest consecutive subsequence

    for (const num of numSet){
        console.log("num",num)
        // only start counting if x is the start of a sequence
        // example [100,4,200,1,3,2]
        // start 100, on 4 skip cuz there's 3 and because that would be recounting a sequence we’ll already count when we start at 1.
        if (!numSet.has(num-1)){
            let currentNum = num; // store number we want to check
            console.log("currNum", currentNum)

            let currentSubs = 1; // get current consecutive of our current number
            while (numSet.has(currentNum+1)) {
                console.log("while currNum", currentNum)
                currentNum++;
                currentSubs++;
            }

            if (longestSubs < currentSubs) longestSubs = currentSubs;
        }
    }
    return longestSubs;
};

// Time complexity: O(n) - the inner while loop looks nested, but it only runs for numbers
// that start a sequence, and each number is visited by it at most once across the whole run
// (amortized O(n)), not O(n^2).
// Space complexity: O(n) - the Set stores all n numbers.