/*
BIG O NOTATION — REFERENCE

Big O describes how an algorithm's time or space grows as input (n) grows.
It answers: "if the input doubles, what happens to the runtime?"

You always care about the WORST CASE unless told otherwise.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLEXITY RANKINGS (fastest → slowest)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
O(1)        Constant    — doesn't grow with input
O(log n)    Logarithmic — doubles input → +1 step (binary search)
O(n)        Linear      — doubles input → doubles work
O(n log n)  Log-linear  — sorting
O(n²)       Quadratic   — nested loops
O(2ⁿ)       Exponential — subsets, some recursion
O(n!)       Factorial   — permutations

Visual growth (n = 16):
  O(1)      →     1 op
  O(log n)  →     4 ops
  O(n)      →    16 ops
  O(n log n)→    64 ops
  O(n²)     →   256 ops
  O(2ⁿ)     → 65536 ops

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES FOR CALCULATING BIG O
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. DROP CONSTANTS
   O(2n) → O(n),  O(100) → O(1)
   We care about the shape of growth, not the exact multiplier.

2. DROP LOWER ORDER TERMS
   O(n² + n) → O(n²)
   At large n, n² dominates completely.

3. SEQUENTIAL STEPS ADD
   do thing A that costs O(n)
   then do thing B that costs O(n)
   total = O(n) + O(n) = O(2n) → O(n)

4. NESTED STEPS MULTIPLY
   for each of n items:        ← O(n)
     for each of n items:      ← O(n)
       do O(1) work
   total = O(n × n) = O(n²)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// O(1) — same number of steps regardless of input size
function getFirst(arr) {
    return arr[0];
}

// O(n) — one pass through the array
function findMax(arr) {
    let max = arr[0];
    for (const x of arr) {
        if (x > max) max = x;
    }
    return max;
}

// O(n²) — nested loops, each going up to n
function hasDuplicate(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) return true;
        }
    }
    return false;
}

// O(log n) — input is halved each step (binary search)
function binarySearch(arr, target) {
    let lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPACE COMPLEXITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same idea but for memory instead of time.

O(1) space  — only a few variables, no extra data structures
O(n) space  — you create an array/map proportional to input size
O(n²) space — 2D matrix sized n×n

Example:
  Two Sum with a hash map → O(n) space (map can hold n entries)
  Sorting in-place (bubble/insertion) → O(1) space
  Merge Sort → O(n) space (needs temp arrays during merge)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHEAT SHEET — COMMON OPERATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Array access by index      O(1)
Array search (unsorted)    O(n)
Array insert/delete end    O(1)
Array insert/delete middle O(n)   ← everything shifts

Hash Map get/set/delete    O(1) average
Hash Map worst case        O(n)   ← rare hash collisions

Binary Search              O(log n)  ← array must be sorted first
Sorting                    O(n log n)

Stack push/pop             O(1)
Queue enqueue/dequeue      O(1)
*/
