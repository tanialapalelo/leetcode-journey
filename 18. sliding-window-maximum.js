/*
239. Sliding Window Maximum
Hard

You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

 

Example 1:

Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation: 
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
Example 2:

Input: nums = [1], k = 1
Output: [1]
 

Constraints:

1 <= nums.length <= 105
-104 <= nums[i] <= 104
1 <= k <= nums.length

*/

// ANSWER
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
  const res = [];
  const dq = []; // store indices, nums[dq] is decreasing

  for (let right = 0; right < nums.length; right++) {
    // 1) remove weaker candidates from the back
    while (dq.length > 0 && nums[dq[dq.length - 1]] <= nums[right]) {
      dq.pop();
    }

    // 2) add current index
    dq.push(right);

    // 3) remove front if out of this window
    const leftBound = right - k + 1;
    if (dq[0] < leftBound) {
      dq.shift();
    }

    // 4) record max once window size reaches k
    if (right >= k - 1) {
      res.push(nums[dq[0]]);
    }
  }

  return res;
};

/* EXPLANATION
Big idea: keep only “useful candidates” for max

Use a deque (double-ended queue) of indices.

Why indices, not values?

    Need to know if an element is out of current window.
    “Out” depends on position.

Deque invariant:

    Indices are in increasing order (naturally as we move right).
    Values are in decreasing order from front to back: nums[dq[0]] >= nums[dq[1]] >= ...
    So front is always current max index.

What happens when a new element comes in?

Suppose new index is right, value nums[right].
Rule A: Remove smaller/equal values from back

While back value <= nums[right], pop back.

Why?

    If new value is bigger (or equal), older smaller one can never become max again.
    New one stays longer (it’s newer), so older equal/smaller is useless.

Rule B: Push right

Now this new index becomes a candidate.
Rule C: Remove out-of-window from front

Current window left boundary is: leftBound = right - k + 1

If dq[0] < leftBound, it’s outside window, pop front.
Rule D: Record answer when first full window exists

When right >= k-1, window size is at least k. Current max is nums[dq[0]].
Full dry run (short but complete)

nums = [1,3,-1,-3,5,3,6,7], k=3

Deque as [index:value]:

    right=0 (1)
        pop back? none
        push -> [0:1]
        window not full

    right=1 (3)
        pop back while <=3: pop [0:1]
        push -> [1:3]
        not full

    right=2 (-1)
        pop back while <=-1? no (3 > -1)
        push -> [1:3, 2:-1]
        full window [0..2], max = 3 -> output 3

    right=3 (-3)
        pop back while <=-3? no
        push -> [1:3,2:-1,3:-3]
        leftBound = 1, front idx=1 valid
        output 3

    right=4 (5)
        pop back <=5: pop 3:-3, 2:-1, 1:3
        push -> [4:5]
        leftBound=2, valid
        output 5

    right=5 (3)
        pop back <=3? no (5 bigger)
        push -> [4:5,5:3]
        output 5

    right=6 (6)
        pop back <=6: pop 5:3, 4:5
        push -> [6:6]
        output 6

    right=7 (7)
        pop back <=7: pop 6:6
        push -> [7:7]
        output 7

Result: [3,3,5,5,6,7]

*/