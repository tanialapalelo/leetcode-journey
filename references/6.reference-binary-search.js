/*
BINARY SEARCH — REFERENCE

Binary search finds a target in a SORTED array in O(log n) time
by halving the search space each step.

Key idea: if the middle element is too big, the answer must be on the left.
          if it's too small, the answer must be on the right.
          Either way, you eliminate half the array every step.

Why O(log n)? Starting with n elements:
  After 1 step → n/2
  After 2 steps → n/4
  After k steps → n/2^k = 1  →  k = log₂n

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEMPLATE (the one that always works)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// CLASSIC: find exact target, return index (-1 if not found)
// Input: [1,3,5,7,9], target=7  →  3
function binarySearch(arr, target) {
    let lo = 0, hi = arr.length - 1;

    while (lo <= hi) {                          // <= not <  (handles 1-element arrays)
        const mid = Math.floor((lo + hi) / 2);  // never (lo+hi)/2 without floor

        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) lo = mid + 1; // target is to the RIGHT
        else hi = mid - 1;                        // target is to the LEFT
    }
    return -1; // not found
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WALKTHROUGH: [1,3,5,7,9], target=7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
lo=0, hi=4 → mid=2, arr[2]=5 → 5<7 → lo=3
lo=3, hi=4 → mid=3, arr[3]=7 → found! return 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VARIANT 1 — FIND LEFTMOST (first occurrence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Useful when duplicates exist and you want the first position.
*/
function findFirst(arr, target) {
    let lo = 0, hi = arr.length - 1, result = -1;

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (arr[mid] === target) {
            result = mid;   // record it, but keep searching LEFT
            hi = mid - 1;
        } else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return result;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VARIANT 2 — FIND RIGHTMOST (last occurrence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
function findLast(arr, target) {
    let lo = 0, hi = arr.length - 1, result = -1;

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (arr[mid] === target) {
            result = mid;   // record it, but keep searching RIGHT
            lo = mid + 1;
        } else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return result;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VARIANT 3 — SEARCH ON ANSWER (binary search on a range of values)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sometimes you binary search not on an array index but on the ANSWER itself.

Pattern: "find the minimum/maximum value that satisfies a condition"
Ask: "can I achieve X?" → yes/no → binary search on X.

Example: "Minimum days to make m bouquets" — binary search on the number of days.
Example: "Koko Eating Bananas" — binary search on eating speed.

Template:
  lo = minimum possible answer
  hi = maximum possible answer
  while lo < hi:
      mid = (lo + hi) // 2
      if canAchieve(mid):
          hi = mid        ← looking for minimum that works
      else:
          lo = mid + 1
*/

// EXAMPLE: find the square root (integer part) of n
// Binary search on the answer space [0, n]
function mySqrt(n) {
    if (n < 2) return n;
    let lo = 1, hi = Math.floor(n / 2);

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (mid * mid === n) return mid;
        else if (mid * mid < n) lo = mid + 1;
        else hi = mid - 1;
    }
    return hi; // floor of sqrt
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Using < instead of <= in the while condition
   → misses the case where lo === hi (1-element search space)

2. mid = (lo + hi) / 2 without Math.floor
   → can get a decimal index

3. Forgetting to update lo/hi (infinite loop)
   → always do lo = mid + 1 or hi = mid - 1, never lo = mid or hi = mid
      (unless you're using the <-based template which handles it differently)

4. Binary searching an unsorted array
   → won't work — sorting is a prerequisite

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO RECOGNIZE A BINARY SEARCH PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Input is sorted (or rotated sorted)
- "Find target", "find minimum/maximum that satisfies X"
- Search space can be halved each step
- O(log n) is expected or hinted

Time: O(log n)   Space: O(1)
*/
