/*
75. Sort Colors
Medium

Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.

You must solve this problem without using the library's sort function.



Example 1:

Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
Example 2:

Input: nums = [2,0,1]
Output: [0,1,2]


Constraints:

n == nums.length
1 <= n <= 300
nums[i] is either 0, 1, or 2.


Follow up: Could you come up with a one-pass algorithm using only constant extra space?

 */

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */

// classic Dutch National Flag problem by Dijkstra, sort array of 0s, 1s, 2s in-place — without using a built-in sort.
var sortColors = function(nums) {
    let low = 0;
    let high = nums.length - 1;
    let current = 0;
    while(current <= high){
        if(nums[current]==0){
            [nums[low], nums[current]] = [nums[current], nums[low]];
            low++;
            current++;
        }
        else if (nums[current] === 1) {
            current++;
        }
        else {              // nums[current] === 2
            [nums[current], nums[high]] = [nums[high], nums[current]];
            high--;         // current does NOT increment — the swapped element is unknown
        }
    }
};

/*
EXPLANATION

The Dutch National Flag algorithm (by Edsger Dijkstra) sorts an array of
three distinct values in a single pass using three pointers.

The idea: maintain 4 regions at all times as `current` sweeps forward:

  [0 ........... low-1]     → all 0s  (sorted, final)
  [low ........ curr-1]     → all 1s  (sorted, final)
  [current ...... high]     → unknown (not yet examined)
  [high+1 ...... end  ]     → all 2s  (sorted, final)

At each step we look at nums[current]:

  • It's 0 → belongs in the 0-zone.
    Swap with nums[low]. Both low and current advance.
    (The element that came from low must be a 1 — it was in the 1-zone — so
     current can safely move past it.)

  • It's 1 → already in the right zone. Just advance current.

  • It's 2 → belongs in the 2-zone.
    Swap with nums[high] and shrink high.
    Do NOT advance current — the element that just arrived from high is
    unknown and must be re-examined in the next iteration.

Loop ends when current > high (unknown zone is empty).
Time: O(n) — one pass | Space: O(1) — in-place, no extra array


WALKTHROUGH
Input: nums = [2, 0, 2, 1, 1, 0]
Initial: low=0, high=5, current=0

  Regions:  [?=unknown zone: 2,0,2,1,1,0]

Step 1: nums[current=0]=2 → swap with high=5 → swap(nums[0], nums[5])
        nums: [0, 0, 2, 1, 1, 2]  high=4, current=0 (don't advance — nums[0] is unknown)

Step 2: nums[current=0]=0 → swap with low=0 → swap(nums[0], nums[0]) no-op
        nums: [0, 0, 2, 1, 1, 2]  low=1, current=1
        Regions: [0 | unknown: 0,2,1,1 | 2]

Step 3: nums[current=1]=0 → swap with low=1 → swap(nums[1], nums[1]) no-op
        nums: [0, 0, 2, 1, 1, 2]  low=2, current=2
        Regions: [0,0 | unknown: 2,1,1 | 2]

Step 4: nums[current=2]=2 → swap with high=4 → swap(nums[2], nums[4])
        nums: [0, 0, 1, 1, 2, 2]  high=3, current=2 (don't advance)
        Regions: [0,0 | unknown: 1,1 | 2,2]

Step 5: nums[current=2]=1 → already in right zone → current=3
Step 6: nums[current=3]=1 → already in right zone → current=4

current(4) > high(3) → unknown zone is empty, loop ends.
Result: [0, 0, 1, 1, 2, 2] ✓
*/