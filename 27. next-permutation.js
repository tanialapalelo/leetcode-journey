/* 
31. Next Permutation (NEEDS REVIEW)
Medium

A permutation of an array of integers is an arrangement of its members into a sequence or linear order.

For example, for arr = [1,2,3], the following are all the permutations of arr: [1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1].
The next permutation of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the next permutation of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).

For example, the next permutation of arr = [1,2,3] is [1,3,2].
Similarly, the next permutation of arr = [2,3,1] is [3,1,2].
While the next permutation of arr = [3,2,1] is [1,2,3] because [3,2,1] does not have a lexicographical larger rearrangement.
Given an array of integers nums, find the next permutation of nums.

The replacement must be in place and use only constant extra memory.

 

Example 1:

Input: nums = [1,2,3]
Output: [1,3,2]
Example 2:

Input: nums = [3,2,1]
Output: [1,2,3]
Example 3:

Input: nums = [1,1,5]
Output: [1,5,1]
 

Constraints:

1 <= nums.length <= 100
0 <= nums[i] <= 100

*/


/* EXPLANATION

Problem Understanding
LeetCode 31: Next Permutation

You're given an array of integers, and you need to:

    Rearrange the numbers to get the next lexicographically greater permutation
    If such a permutation doesn't exist, rearrange to the lowest order (sorted in ascending order)
    Do this in-place with O(1) extra memory
Constraints:

    1 <= nums.length <= 100
    0 <= nums[i] <= 100

--------------------------------------------------------------

What is a Permutation?

A permutation is just a rearrangement of numbers. For example, all permutations of [1,2,3] are:
Code

[1,2,3]
[1,3,2]
[2,1,3]
[2,3,1]
[3,1,2]
[3,2,1]

What is the "Next" Permutation?

If you order all permutations lexicographically (like dictionary order), the "next permutation" is the one that comes immediately after the current one:
Code

[1,2,3] → next is [1,3,2]
[1,3,2] → next is [2,1,3]
[2,1,3] → next is [2,3,1]
[2,3,1] → next is [3,1,2]
[3,1,2] → next is [3,2,1]
[3,2,1] → next is [1,2,3] (wraps around!)

The Task

Given an array, modify it in-place to be the next permutation. If it's the last permutation, wrap around to the first one.

Examples:
Code

Input: [1,2,3]
Output: [1,3,2]

Input: [3,2,1]
Output: [1,2,3]  (wraps around)

Input: [1,1]
Output: [1,1]

Let me break down LeetCode 31: Next Permutation for you in a way that makes sense.
Understanding the Problem First
What is a Permutation?

A permutation is just a rearrangement of numbers. For example, all permutations of [1,2,3] are:
Code

[1,2,3]
[1,3,2]
[2,1,3]
[2,3,1]
[3,1,2]
[3,2,1]

What is the "Next" Permutation?

If you order all permutations lexicographically (like dictionary order), the "next permutation" is the one that comes immediately after the current one:
Code

[1,2,3] → next is [1,3,2]
[1,3,2] → next is [2,1,3]
[2,1,3] → next is [2,3,1]
[2,3,1] → next is [3,1,2]
[3,1,2] → next is [3,2,1]
[3,2,1] → next is [1,2,3] (wraps around!)

The Task

Given an array, modify it in-place to be the next permutation. If it's the last permutation, wrap around to the first one.

Understanding [2,5,4,3,1]
Step 1: Find Where Order "Breaks"

Read from RIGHT to LEFT looking for where the increasing order breaks:
Code

[2, 5, 4, 3, 1]
    ↑  ↑
    
Right to left:
- 1: (nothing to compare)
- 3 > 1 ✓ (increasing)
- 4 > 3 ✓ (increasing)
- 5 > 4 ✓ (increasing)
- 2 < 5 ✗ (BREAKS HERE!)

So: [2 | 5, 4, 3, 1]
     ↑    suffix (all in increasing order)
     pivot (breaks the pattern)

Key insight: Everything to the right of 2 is already in perfect descending order (5,4,3,1 when read right-to-left is 1,3,4,5 ascending).
Step 2: Find Next Greater Than Pivot

Now look at the suffix [5,4,3,1] and find the smallest number that's still larger than 2:
Code

[2, 5, 4, 3, 1]
 ↑
 pivot = 2

Looking at: [5, 4, 3, 1]
Which are > 2?  5 ✓, 4 ✓, 3 ✓, 1 ✗

The SMALLEST one > 2 is: 3

Step 3: Swap Pivot with That Number
Code

[2, 5, 4, 3, 1]
 ↑        ↑
     swap these

Result: [3, 5, 4, 2, 1]

Step 4: Reverse the Suffix

Now reverse everything after the pivot position:
Code

[3, 5, 4, 2, 1]
    ↑  ↑  ↑  ↑ 
    reverse [5,4,2,1]

Result: [3, 1, 2, 4, 5] ✓ ANSWER

Why Reverse Works

After swapping, the suffix [5,4,2,1] is still in descending order (because we only swapped the pivot out).

To get the next smallest permutation, we want this suffix in ascending order. So we reverse it!
Code

Descending: [5, 4, 2, 1]
Reverse to: [1, 2, 4, 5] ✓ ascending (smallest arrangement)

Another Example to Cement Understanding

Let's try [1,3,5,4,2] (from before):
Code

Step 1: Find where order breaks (right to left)
[1, 3, 5, 4, 2]
       ↑  ↑
       
- 2: nothing
- 4 > 2 ✓ increasing
- 5 > 4 ✓ increasing
- 3 < 5 ✗ BREAKS!

Pivot = 3 at index 1
Suffix = [5, 4, 2]

Step 2: Find smallest > 3 in [5, 4, 2]
Numbers > 3: 5 ✓, 4 ✓, 2 ✗
Smallest = 4

Step 3: Swap 3 and 4
[1, 3, 5, 4, 2] → [1, 4, 5, 3, 2]

Step 4: Reverse suffix [5, 3, 2]
Reverse to get: [2, 3, 5]

Final: [1, 4, 2, 3, 5] ✓

*/

// ANSWER
var nextPermutation = function(nums) {
    const n = nums.length;
    
    // Step 1: Find pivot (where ascending order from right breaks)
    // Scan from right to left, find first i where nums[i] < nums[i+1]
    let i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    
    // If no pivot found, entire array is descending (last permutation)
    if (i === -1) {
        // Reverse entire array to get first permutation
        reverse(nums, 0, n - 1);
        return;
    }
    
    // Step 2: Find smallest number in suffix that's > pivot
    // Scan from right to left in suffix, find first j where nums[j] > nums[i]
    let j = n - 1;
    while (j > i && nums[j] <= nums[i]) {
        j--;
    }
    
    // Step 3: Swap pivot with that number
    [nums[i], nums[j]] = [nums[j], nums[i]];
    
    // Step 4: Reverse the suffix to get smallest arrangement
    reverse(nums, i + 1, n - 1);
};

function reverse(nums, start, end) {
    while (start < end) {
        [nums[start], nums[end]] = [nums[end], nums[start]];
        start++;
        end--;
    }
}

// Time complexity: O(n) - three separate linear scans (find pivot, find swap target, reverse
// suffix) run one after another, not nested, so they add up to O(n) instead of multiplying.
// Space complexity: O(1) - all swaps happen in place.