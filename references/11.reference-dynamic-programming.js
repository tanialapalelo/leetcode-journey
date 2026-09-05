/*
DYNAMIC PROGRAMMING — REFERENCE

Dynamic Programming (DP) solves problems by breaking them into overlapping
subproblems and storing results so you never solve the same subproblem twice.

The key insight: recursive solutions often recalculate the same thing many times.
DP eliminates that repeated work.

Two approaches — same idea, different direction:
  Top-down (Memoization) — recursion + cache results
  Bottom-up (Tabulation) — build up from smallest subproblems iteratively

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLE: FIBONACCI — the classic DP intro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Naive recursion recomputes fib(3), fib(2) etc. many times → O(2ⁿ)

fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2) ← computed again below!
│   │   └── fib(1)
│   └── fib(2) ← duplicate work
└── fib(3) ← computed again!
*/

// APPROACH 1 — Top-down (Memoization): recursion + cache
// "memo" stores answers we've already computed
function fibMemo(n, memo = {}) {
    if (n <= 1) return n;
    if (memo[n] !== undefined) return memo[n]; // already solved — return cached result
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo); // solve and cache
    return memo[n];
}
// Time: O(n)  Space: O(n) for memo + call stack


// APPROACH 2 — Bottom-up (Tabulation): fill a table from small → large
// No recursion, no call stack risk
function fibTab(n) {
    if (n <= 1) return n;
    const dp = new Array(n + 1);
    dp[0] = 0; dp[1] = 1;

    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]; // each answer built from previous answers
    }
    return dp[n];
}
// Time: O(n)  Space: O(n)

// APPROACH 3 — Bottom-up space optimized (only need last 2 values)
function fibOpt(n) {
    if (n <= 1) return n;
    let prev2 = 0, prev1 = 1;
    for (let i = 2; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
// Time: O(n)  Space: O(1)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO THINK ABOUT DP PROBLEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: Define what dp[i] means in plain English
Step 2: Find the recurrence — how does dp[i] depend on smaller values?
Step 3: Identify base cases
Step 4: Fill the table in order (bottom-up) or add memoization (top-down)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLE: Climbing Stairs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You can climb 1 or 2 steps at a time. How many ways to reach step n?

dp[i] = number of ways to reach step i
dp[i] = dp[i-1] + dp[i-2]  ← from step i-1 (take 1) OR step i-2 (take 2)
Base: dp[1]=1, dp[2]=2
*/
function climbStairs(n) {
    if (n <= 2) return n;
    let prev2 = 1, prev1 = 2;
    for (let i = 3; i <= n; i++) {
        [prev2, prev1] = [prev1, prev1 + prev2];
    }
    return prev1;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLE: House Robber
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Can't rob adjacent houses. Maximize total.
Input: [2,7,9,3,1]  →  12  (rob 2 + 9 + 1)

dp[i] = max money robbing houses 0..i
dp[i] = max(dp[i-1],          ← skip house i
            dp[i-2] + nums[i]) ← rob house i (can't rob i-1)
*/
function rob(nums) {
    if (nums.length === 1) return nums[0];
    let prev2 = nums[0], prev1 = Math.max(nums[0], nums[1]);

    for (let i = 2; i < nums.length; i++) {
        const curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLE: Longest Common Subsequence (2D DP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input: text1="abcde", text2="ace"  →  3  ("ace")

dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]

If chars match:  dp[i][j] = dp[i-1][j-1] + 1
If not:          dp[i][j] = max(dp[i-1][j], dp[i][j-1])
*/
function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}
// Time: O(m × n)  Space: O(m × n)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO RECOGNIZE A DP PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- "How many ways..." or "maximum/minimum..."
- Optimal substructure: the best solution to the whole problem
  uses the best solutions to its subproblems
- Overlapping subproblems: naive recursion solves the same thing many times
- Keywords: "count ways", "max profit", "min cost", "longest", "can you reach"

DECISION: top-down vs bottom-up?
  Top-down (memo)  → easier to write, start from the recursive solution
  Bottom-up (tab)  → no stack overflow risk, usually faster in practice
  Start with top-down to get it working, optimize to bottom-up if needed.

1D DP: dp[i] → O(n) time, O(n) or O(1) space
2D DP: dp[i][j] → O(m×n) time, O(m×n) or O(n) space
*/
