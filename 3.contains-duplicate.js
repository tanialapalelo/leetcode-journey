// Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

 
// Example 1:

// Input: nums = [1,2,3,1]

// Output: true

// Explanation:

// The element 1 occurs at the indices 0 and 3.

// Example 2:

// Input: nums = [1,2,3,4]

// Output: false

// Explanation:

// All elements are distinct.

// Example 3:

// Input: nums = [1,1,1,3,3,4,3,2,4,2]

// Output: true

// Constraints:

//     1 <= nums.length <= 105
//     -109 <= nums[i] <= 109

// ANSWER
// we can use hash set (stores values with no duplicate data) and therefore we can move forward adding the data from array to the hash set with checking if the data has already stored or not in the hash set.

/* JavaScript does not have a built-in class named
 HashSet like some other languages (e.g., Java), but its native Set object provides the same functionality and performance characteristics (average constant time, O(1), for lookups, insertions, and deletions). 
 The JavaScript Set object stores a collection of unique values, meaning duplicates are automatically ignored
*/

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    const uniqueNumbers = new Set();
    for(i=0; i<nums.length; i++){
        if(uniqueNumbers.has(nums[i])) return true;
        else uniqueNumbers.add(nums[i])
    }
    return false;
};

// Time complexity: O(n) - single pass, Set.has/add are O(1) average.
// Space complexity: O(n) - the Set can store up to n unique elements.
