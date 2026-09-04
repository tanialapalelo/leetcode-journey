/*
169. Majority Element
Easy
Topics
premium lock icon
Companies
Given an array nums of size n, return the majority element.

The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.



Example 1:

Input: nums = [3,2,3]
Output: 3
Example 2:

Input: nums = [2,2,1,1,1,2,2]
Output: 2


Constraints:

n == nums.length
1 <= n <= 5 * 104
-109 <= nums[i] <= 109
The input is generated such that a majority element will exist in the array.


Follow-up: Could you solve the problem in linear time and in O(1) space?
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
// APPROACH 1 — HashMap: count frequencies
// Time: O(n) | Space: O(n)  ← needs extra memory proportional to unique elements
var majorityElementHash = function(nums) {
    const count = {};
    for (let num of nums) {
        count[num] = (count[num] || 0) + 1;
        if (count[num] > nums.length / 2) return num;
    }
};

// APPROACH 2 — Boyer-Moore Voting Algorithm
// Time: O(n) | Space: O(1)  ← single pass, no extra memory
var majorityElement = function(nums) {
    let candidate = null;
    let count = 0;

    for (let num of nums) {
        if (count === 0) {
            candidate = num;
        }
        count += (num === candidate) ? 1 : -1;
    }

    return candidate;
};

/*
EXPLANATION

─── APPROACH 1: HashMap ───────────────────────────────────────────────
Build a frequency map as you scan. Return the first element whose count
exceeds n/2. Straightforward, but stores all unique elements in memory.

  Time:  O(n) — one pass through the array
  Space: O(n) — in the worst case, every element is unique

─── APPROACH 2: Boyer-Moore Voting ────────────────────────────────────
Same O(n) time but O(1) space — no hash map needed.

Core intuition — "Battle Royale":
  Imagine every element in the array is a soldier fighting for their number.
  Soldiers of the same number fight together; soldiers of different numbers
  cancel each other out one-for-one.

  The majority element appears more than ⌊n/2⌋ times, which means it has
  MORE soldiers than every other number COMBINED. No matter how many
  1-for-1 battles happen, the majority's soldiers can never all be wiped out.
  It will always have survivors — and the last survivor standing is the answer.

How the algorithm simulates this:
  - `candidate` = the number currently "in power"
  - `count`     = how many net votes that candidate has

  For each num:
    • If count = 0 → the current candidate was fully cancelled out.
      Pick num as the new candidate (fresh start), count = 1.
    • If num = candidate → a vote FOR the candidate, count++
    • If num ≠ candidate → a vote AGAINST the candidate, count--

Why resetting at count=0 is safe:
  When count hits 0, the current candidate and its challengers have cancelled
  each other equally. Those elements are "consumed" — they balance out and
  can be ignored. The true majority element must still be the majority in
  whatever elements remain, so it's safe to pick fresh from the rest.

Key limitation:
  Boyer-Moore only works when a majority element is GUARANTEED to exist.
  If the problem doesn't guarantee that, you need a second pass to verify
  the candidate's actual count.

─── COMPLEXITY COMPARISON ─────────────────────────────────────────────
                    Time      Space
  HashMap           O(n)      O(n)   ← extra map grows with unique elements
  Boyer-Moore       O(n)      O(1)   ← just two variables, nothing stored

Both are linear, but Boyer-Moore wins on space. Use HashMap when you need
to know the actual counts; use Boyer-Moore when you just need the winner.


WALKTHROUGH — Boyer-Moore
Input: [1, 2, 3, 1, 1, 4, 1, 1]   majority = 1 (appears 5 out of 8 times)

  num=1 → count=0, pick new candidate=1,  count becomes 1
          [ candidate=1, count=1 ]

  num=2 → 2 ≠ 1, vote against →           count becomes 0
          [ candidate=1, count=0 ]  ← 1 and 2 cancelled each other out

  num=3 → count=0, pick new candidate=3,  count becomes 1
          [ candidate=3, count=1 ]

  num=1 → 1 ≠ 3, vote against →           count becomes 0
          [ candidate=3, count=0 ]  ← 3 and 1 cancelled each other out

  num=1 → count=0, pick new candidate=1,  count becomes 1
          [ candidate=1, count=1 ]

  num=4 → 4 ≠ 1, vote against →           count becomes 0
          [ candidate=1, count=0 ]  ← 1 and 4 cancelled each other out

  num=1 → count=0, pick new candidate=1,  count becomes 1
          [ candidate=1, count=1 ]

  num=1 → 1 = 1, vote for →               count becomes 2
          [ candidate=1, count=2 ]

Result: candidate = 1 ✓

Notice: 1 got cancelled 3 times by 2, 3, and 4 — but it still had 2 votes
left at the end because it appeared 5 times vs 3 non-1 cancellations.
The majority always survives.
*/