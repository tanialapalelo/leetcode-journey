/*
RECURSION & BACKTRACKING — REFERENCE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECURSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A function that calls itself with a smaller version of the same problem,
until it reaches a base case simple enough to answer directly.

Every recursive solution has:
  1. BASE CASE  — when to stop (prevents infinite recursion)
  2. RECURSIVE CASE — break the problem into a smaller version + call self

Mental model: trust that your function works correctly for smaller inputs.
Don't try to trace every recursive call in your head — just define:
  "what does this function return?" and "what's the smallest case?"
*/

// EXAMPLE: Factorial  n! = n × (n-1) × (n-2) × ... × 1
// factorial(5) = 5 × factorial(4) = 5 × 4 × 3 × 2 × 1 = 120
function factorial(n) {
    if (n <= 1) return 1;         // base case
    return n * factorial(n - 1); // recursive case
}

// EXAMPLE: Fibonacci  fib(n) = fib(n-1) + fib(n-2)
// fib(5) = fib(4) + fib(3) = ...
function fib(n) {
    if (n <= 1) return n;            // base cases: fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2); // recursive case
}
// WARNING: this is O(2ⁿ) — every call branches into 2 more calls
// Fix: memoization (see 11.reference-dynamic-programming.js)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE CALL STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Each recursive call is added to the call stack. Too many calls → stack overflow.
factorial(3):
  factorial(3) calls factorial(2)
    factorial(2) calls factorial(1)
      factorial(1) returns 1       ← base case, start unwinding
    factorial(2) returns 2 × 1 = 2
  factorial(3) returns 3 × 2 = 6

Stack depth = O(n) for linear recursion, O(log n) for divide-and-conquer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKTRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backtracking = recursion + "undo when a path doesn't work out".

Think of it like navigating a maze:
  - Walk forward (make a choice)
  - If you hit a dead end (invalid state), step back (undo the choice)
  - Try a different path

Template:
  function backtrack(currentState):
      if currentState is a solution → save it, return
      for each choice:
          make the choice
          backtrack(newState)   ← recurse deeper
          undo the choice       ← this is the "backtrack" step

The undo step is critical — it restores state so the next choice starts clean.
*/

// EXAMPLE: Permutations — all orderings of [1,2,3]
// Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
function permutations(nums) {
    const result = [];

    function backtrack(current, remaining) {
        if (remaining.length === 0) {
            result.push([...current]); // found a complete permutation
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            current.push(remaining[i]);                              // make choice
            backtrack(current, [...remaining.slice(0, i), ...remaining.slice(i + 1)]); // recurse
            current.pop();                                           // undo choice
        }
    }

    backtrack([], nums);
    return result;
}
// Time: O(n × n!)  — n! permutations, each of length n


// EXAMPLE: Subsets — all subsets of [1,2,3]
// Output: [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
function subsets(nums) {
    const result = [];

    function backtrack(start, current) {
        result.push([...current]); // every state is a valid subset

        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);    // include nums[i]
            backtrack(i + 1, current); // recurse — next element must come after i
            current.pop();            // exclude nums[i], try next
        }
    }

    backtrack(0, []);
    return result;
}
// Time: O(n × 2ⁿ)  — 2ⁿ subsets, each costs O(n) to copy


// EXAMPLE: Combination Sum — find all combos that sum to target (can reuse elements)
// Input: candidates=[2,3,6,7], target=7  →  [[2,2,3],[7]]
function combinationSum(candidates, target) {
    const result = [];

    function backtrack(start, current, remaining) {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        if (remaining < 0) return; // overshot — prune this path

        for (let i = start; i < candidates.length; i++) {
            current.push(candidates[i]);
            backtrack(i, current, remaining - candidates[i]); // i not i+1 (can reuse)
            current.pop();
        }
    }

    backtrack(0, [], target);
    return result;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO RECOGNIZE RECURSION / BACKTRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recursion:
  - Problem can be broken into identical smaller subproblems
  - Tree/graph traversal, divide & conquer, Fibonacci-style problems

Backtracking:
  - "Find ALL valid combinations / subsets / permutations"
  - "Find a path through a maze / grid"
  - You build a solution step by step and need to explore multiple options
  - Keywords: "all", "every possible", "generate"

Time complexity of backtracking problems is usually:
  Subsets       O(n × 2ⁿ)
  Permutations  O(n × n!)
  Combinations  O(n × 2ⁿ) or tighter depending on pruning
*/
