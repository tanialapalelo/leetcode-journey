/*
PREFIX & SUFFIX — REFERENCE

A prefix (or suffix) array precomputes a running result — sum, product,
min, max, count — for "everything up to index i" (prefix) or "everything
from index i onward" (suffix), so each index's answer becomes an O(1)
lookup instead of an O(n) re-scan.

Without prefix/suffix: answering "what's true about everything except
index i" for every i naively costs O(n²) (re-scan the array for each i).
With prefix/suffix: precompute once, combine in O(1) per index → O(n) total.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO RECOGNIZE THIS PATTERN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Signal: the problem asks for "result at index i using everything EXCEPT
index i" (or "everything before/after index i"), and it often explicitly
BANS the obvious shortcut (division, sorting, extra full pass per index).

That banned shortcut is a hint, not just a restriction — it's telling you
the intended solution decomposes the problem into a LEFT side and a RIGHT
side instead.

Self-check question: "Can I split this into a running answer built left to
right, and another running answer built right to left, then combine the two
at each index?" If yes → prefix/suffix.

Problems you've solved: Product of Array Except Self.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO DERIVE IT (don't just memorize — rebuild it from scratch)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Try brute force first (O(n²)): for each i, loop over the whole array
   again skipping i. This gets you a correct baseline and shows you the
   shape of the problem.
2. Notice the banned shortcut (e.g. totalProduct / nums[i] — breaks on
   zeros anyway, and division is often disallowed).
3. Split into two passes:
     prefix[i] = combine(nums[0..i-1])   (everything strictly before i)
     suffix[i] = combine(nums[i+1..n-1]) (everything strictly after i)
   answer[i]  = prefix[i] combined with suffix[i]
4. Build with two extra arrays first — correctness before elegance.
5. Optimize space: reuse the output array for the prefix pass, then do the
   suffix pass with a single running variable instead of a second array.
   This takes it from O(n) extra space down to O(1) extra (excluding the
   output array, which the problem usually doesn't count).
*/

// EXAMPLE: Product of Array Except Self
// Input: [1, 2, 3, 4]  →  Output: [24, 12, 8, 6]
// (answer[i] = product of every element except nums[i]; no division allowed)
function productExceptSelf(nums) {
    const n = nums.length;
    const answer = new Array(n).fill(1);

    // PASS 1 — prefix product, stored directly into answer[]
    // answer[i] = product of everything BEFORE i
    let prefix = 1;
    for (let i = 0; i < n; i++) {
        answer[i] = prefix;
        prefix *= nums[i];
    }

    // PASS 2 — suffix product, combined on the fly with a running variable
    // (no second array needed — this is the O(1)-extra-space optimization)
    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        answer[i] *= suffix;
        suffix *= nums[i];
    }

    return answer;
}
// Time: O(n) — two linear passes
// Space: O(1) extra — output array doesn't count, no second array used

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OTHER SHAPES WITH THE SAME SIGNAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Sum of array except self (same idea, + instead of *)
- Trapping Rain Water — leftMax[i] / rightMax[i] precomputed, water at i
  depends on min(leftMax[i], rightMax[i]) (see 25.trapping-rain-water.js
  for the two-pointer O(1)-space version of the same underlying idea)
- Running prefix sum for range-sum queries (precompute once, answer any
  range sum in O(1) via prefix[right] - prefix[left - 1])
- Number of subarrays with a given sum (prefix sum + hash map of counts)
*/
