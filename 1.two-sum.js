// Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
// You may assume that each input would have exactly one solution, and you may not use the same element twice.
// You can return the answer in any order.


// Example 1:
// Input: nums = [2,7,11,15], target = 9
// Output: [0,1]
// Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

// Example 2:
// Input: nums = [3,2,4], target = 6
// Output: [1,2]

// Example 3:
// Input: nums = [3,3], target = 6
// Output: [0,1]



// Constraints:
//     2 <= nums.length <= 104
//     -109 <= nums[i] <= 109
//     -109 <= target <= 109
//     Only one valid answer exists.

 
// Follow-up: Can you come up with an algorithm that is less than O(n2) time complexity?


// ANSWER
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const tempMap = new Map();
    for (i=0; i<nums.length; i++){
        const pengurangan = target - nums[i];
        if(tempMap.has(pengurangan)) return new Array(tempMap.get(pengurangan),i)
        else tempMap.set(nums[i],i)
    }
    return [];
};

// Time complexity: O(n) - single pass through nums, Map.has/set are O(1) average.
// Space complexity: O(n) - map can store up to n entries.

const percobaan = twoSum([2,7,11,15], 9)
console.log(percobaan)


/*
Time Complexity: O(n)

You iterate through the array at most once.
Inside the loop, the operations tempMap.has(subtract) and tempMap.get(subtract) are average case $O(1)$ because they use a Map (which is a hash table).
Therefore, the total time complexity is $O(n)$.
Space Complexity: O(n)

In the worst-case scenario (e.g., the two numbers are at the very end of the array, or no solution exists although the problem guarantees one), you will store $n-1$ elements in the tempMap.
Therefore, the space complexity is proportional to the input size, which is $O(n)$.
Your solution is optimal for this problem. The use of a hash map (Map) is the standard way to achieve $O(n)$ time complexity for the "Two Sum" problem, as opposed to the $O(n^2)$ brute force approach.