/*
SLIDING WINDOW — REFERENCE

A "window" is a contiguous subarray or substring between two indices.
Instead of recomputing from scratch for every window, you slide it:
add one element on the right, remove one from the left.

This turns O(n²) (try every subarray) into O(n) (one pass).

Two variants:
  Fixed window   — window size is given (e.g. "size k")
  Dynamic window — window size grows/shrinks based on a condition

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATTERN 1 — FIXED SIZE WINDOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Template:
  1. Build the first window of size k
  2. Slide: add nums[right], remove nums[left], advance both
*/

// EXAMPLE: Maximum sum subarray of size k
// Input: [2,1,5,1,3,2], k=3  →  9  (subarray [5,1,3])
function maxSumWindow(nums, k) {
    let windowSum = 0;

    // build first window
    for (let i = 0; i < k; i++) windowSum += nums[i];

    let maxSum = windowSum;

    // slide: right expands, left shrinks simultaneously
    for (let right = k; right < nums.length; right++) {
        windowSum += nums[right];           // add incoming element
        windowSum -= nums[right - k];       // remove outgoing element
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
}
// Time: O(n)  Space: O(1)


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATTERN 2 — DYNAMIC SIZE WINDOW (expand & shrink)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
right pointer always moves forward.
left pointer only moves when the window breaks a condition.

Template:
  left = 0
  for right from 0 to n-1:
      add nums[right] to window state
      while window is invalid:
          remove nums[left] from window state
          left++
      update answer (window is now valid)
*/

// EXAMPLE: Longest Substring Without Repeating Characters
// Input: "abcabcbb"  →  3  ("abc")
function lengthOfLongestSubstring(s) {
    const seen = new Set();
    let left = 0, maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        // window is invalid if we've seen s[right] before
        while (seen.has(s[right])) {
            seen.delete(s[left]); // shrink from left
            left++;
        }
        seen.add(s[right]);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
// Time: O(n)  Space: O(n) for the set


// EXAMPLE: Longest Repeating Character Replacement
// Input: s="AABABBA", k=1  →  4
// Idea: window is valid if (windowSize - countOfMostFreqChar) <= k
//       that expression = number of replacements needed in this window
function characterReplacement(s, k) {
    const count = {};
    let left = 0, maxCount = 0, maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        count[s[right]] = (count[s[right]] || 0) + 1;
        maxCount = Math.max(maxCount, count[s[right]]);

        // replacements needed = windowSize - most frequent char count
        while ((right - left + 1) - maxCount > k) {
            count[s[left]]--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
// Time: O(n)  Space: O(1) — only 26 letters


// EXAMPLE: Minimum Window Substring
// Input: s="ADOBECODEBANC", t="ABC"  →  "BANC"
// Idea: expand until window contains all chars of t, then shrink to minimize
function minWindow(s, t) {
    const need = {};
    for (const c of t) need[c] = (need[c] || 0) + 1;

    let left = 0, have = 0, required = Object.keys(need).length;
    let minLen = Infinity, minLeft = 0;

    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        if (need[c] !== undefined) {
            need[c]--;
            if (need[c] === 0) have++; // this char is fully satisfied
        }

        while (have === required) { // window is valid — try to shrink
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minLeft = left;
            }
            const lc = s[left];
            if (need[lc] !== undefined) {
                need[lc]++;
                if (need[lc] > 0) have--; // window no longer satisfies this char
            }
            left++;
        }
    }
    return minLen === Infinity ? '' : s.slice(minLeft, minLeft + minLen);
}
// Time: O(n + m)  Space: O(m)  where m = t.length


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO RECOGNIZE A SLIDING WINDOW PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Input is an array or string
- Asked about a CONTIGUOUS subarray or substring
- Keywords: "longest", "shortest", "minimum", "maximum", "contains all", "at most k"
- Brute force would check every subarray (O(n²) or O(n³))

KEY DECISION: fixed or dynamic?
  → "size k" given?                   → fixed window
  → "longest/shortest that satisfies" → dynamic window (expand & shrink)

WINDOW SIZE FORMULA:  right - left + 1
*/
