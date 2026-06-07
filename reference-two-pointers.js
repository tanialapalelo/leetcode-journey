/*
TWO POINTERS — REFERENCE

Two pointers means using two index variables to scan through an array
(or string) instead of one, avoiding nested loops.

Without two pointers, checking all pairs = O(n²).
With two pointers, one pass = O(n).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATTERN 1 — OPPOSITE ENDS (left & right closing in)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Start one pointer at index 0, the other at the last index.
Move them toward each other based on a condition.

Requires: sorted array (or the condition must work without order).

Problems you've solved: Two Sum II, 3Sum, Container With Most Water,
                        Trapping Rain Water, Valid Palindrome.
*/

// EXAMPLE: Two Sum II — find two numbers that add to target
// Input: [2, 7, 11, 15], target = 9  →  Output: [1, 2] (1-indexed)
function twoSumII(numbers, target) {
    let left = 0, right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];

        if (sum === target) return [left + 1, right + 1];
        else if (sum < target) left++;   // sum too small → move left right to get bigger number
        else right--;                    // sum too big  → move right left to get smaller number
    }
}
// Time: O(n)  Space: O(1)


// EXAMPLE: Valid Palindrome — is the string the same forwards and backwards?
// Input: "racecar" → true,  "hello" → false
function isPalindrome(s) {
    let left = 0, right = s.length - 1;

    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
    }
    return true;
}
// Time: O(n)  Space: O(1)


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATTERN 2 — SAME DIRECTION (slow & fast, or read & write)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Both pointers start at the left. One moves fast (reads every element),
one moves slow (only advances when a condition is met).

Also called the "fast/slow" or "read/write" pointer pattern.

Problems you've solved: Remove Duplicates from Sorted Array.
*/

// EXAMPLE: Remove Duplicates from Sorted Array — in-place, return count of unique
// Input: [1, 1, 2, 3, 3]  →  first 3 elements become [1, 2, 3], return 3
function removeDuplicates(nums) {
    let write = 1; // slow pointer — where to write the next unique value

    for (let read = 1; read < nums.length; read++) { // fast pointer
        if (nums[read] !== nums[read - 1]) {
            nums[write] = nums[read]; // write the unique value
            write++;
        }
    }
    return write; // number of unique elements
}
// Time: O(n)  Space: O(1)


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATTERN 3 — THREE POINTERS (extension of opposite ends)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fix one element with an outer loop, then use two-pointer inside.
Total: O(n²) — one O(n) outer loop × one O(n) two-pointer inner pass.

Problems you've solved: 3Sum.
*/

// EXAMPLE: 3Sum — find all triplets that sum to zero
// Input: [-1,0,1,2,-1,-4]  →  [[-1,-1,2],[-1,0,1]]
function threeSum(nums) {
    nums.sort((a, b) => a - b); // must sort first
    const result = [];

    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue; // skip duplicates

        let left = i + 1, right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;   // skip dupes
                while (left < right && nums[right] === nums[right - 1]) right--; // skip dupes
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
}
// Time: O(n²)  Space: O(1) (output not counted)


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO RECOGNIZE A TWO-POINTER PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Input is an array or string
- Asked to find a pair/triplet, or check a property (palindrome)
- Brute force would use nested loops
- Array is sorted (or can be sorted)
- "In-place" modification needed

KEY DECISION: which pattern?
  → Searching for a target pair?          → opposite ends
  → Slow/fast read, modify in-place?      → same direction
  → Finding triplets?                     → fix one, opposite ends inside
*/
