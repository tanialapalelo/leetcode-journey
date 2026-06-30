# LeetCode Journey

My personal LeetCode solutions in **JavaScript**, organized by problem number.

Currently following a structured course and building understanding step-by-step.

## Problems Solved

| #    | Problem                                         | Difficulty | Pattern                                          |
|------|-------------------------------------------------|------------|--------------------------------------------------|
| 1    | Two Sum                                         | Easy       | Hash Map                                         |
| 2    | GCD of Odd & Even                               | Easy       | Math                                             |
| 3    | Contains Duplicate                              | Easy       | Hash Map                                         |
| 4    | Contains Duplicate II                           | Easy       | Hash Map / Sliding Window                        |
| 5    | Valid Anagram                                   | Easy       | Hash Map                                         |
| 6    | Group Anagrams                                  | Medium     | Hash Map + Sorting                               |
| 7    | Product of Array Except Self                    | Medium     | Prefix                                           |
| 8    | Top K Frequent Elements                         | Medium     | Hash Map / Heap                                  |
| 9    | Roman to Integer                                | Easy       | String                                           |
| 10   | Verifying an Alien Dictionary                   | Easy       | String                                           |
| 11   | Longest Consecutive Sequence                    | Medium     | Hash Set                                         |
| 12   | First Missing Positive                          | Hard       | Array                                            |
| 13   | Best Time to Buy and Sell Stock                 | Easy       | Sliding Window                                   |
| 14   | Permutation in String                           | Medium     | Sliding Window                                   |
| 14.1 | Find Winner on a Tic-Tac-Toe Game               | Easy       | Matrix                                           |
| 15   | Longest Repeating Character Replacement         | Medium     | Sliding Window                                   |
| 16   | Longest Substring Without Repeating Characters  | Medium     | Sliding Window                                   |
| 17   | Minimum Distance to the Target Element          | Easy       | Array                                            |
| 18   | Sliding Window Maximum                          | Hard       | Monotonic Deque                                  |
| 19   | Minimum Window Substring                        | Hard       | Sliding Window                                   |
| 20   | Two Furthest Houses With Different Colors       | Easy       | Array                                            |
| 21   | Valid Palindrome                                | Easy       | String, Two Pointers                             |
| 22   | Two Sum II - Input Array Is Sorted              | Medium     | Array, Two Pointers, Binary Search               |
| 23   | 3Sum                                            | Medium     | Array, Two Pointers, Sorting                     |
| 24   | Container With Most Water                       | Medium     | Array, Two Pointers, Greedy                      |
| 25   | Trapping Rain Water                             | Hard       | Array, Two Pointers, Dynamic Programming, Stack  |
| 26   | Remove Duplicates from Sorted Array             | Easy       | Array, Two Pointers                              |
| 27   | Next Permutation                                | Medium     | Array, Two Pointers                              |
| 28   | Fizz Buzz                                       | Easy       | Math, String                                     |
| 29   | Longest Common Prefix                           | Easy       | String                                           |
| 30   | Encode and Decode Strings                       | Medium     | String, Design                                   |
| 31   | Palindromic Substrings                          | Medium     | String, Two Pointers, Dynamic Programming        |
| 32   | Binary Search                                   | Easy       | Binary Search                                    |
| 33   | Find First and Last Position of Element in Sorted Array | Medium | Binary Search                              |
| 34   | Merge Sorted Array                                      | Easy   | Array, Two Pointers                        |
| 35   | Sort Colors                                             | Medium | Array, Two Pointers, Dutch National Flag   |
| 36   | Majority Element                                        | Easy   | Array, Boyer-Moore Voting                  |
| 37   | Reverse Linked List                                     | Easy   | Linked List, Two Pointers, Recursion       |

## Patterns Covered

- **Hash Map / Set** — frequency counting, grouping, lookups
- **Sliding Window** — fixed & variable window, shrink/expand
- **Two Pointers** — opposite ends, same direction, three pointers
- **Monotonic Deque** — maintaining max/min in window
- **Prefix** — prefix sum/product
- **Math / String** — basic manipulation
- **Binary Search** — classic, find bounds, sorted array variants
- **Dutch National Flag** — three-pointer single-pass partitioning into three regions
- **Boyer-Moore Voting** — O(1) space majority element via vote cancellation

## Reference Files

Standalone concept files to review when you need to understand the foundations.
Read them in this order — each one builds on the previous.

| Order | File                                      | What it covers                                          |
|-------|-------------------------------------------|---------------------------------------------------------|
| 1     | `reference-big-o.js`                      | Complexity notation, rules, drop constants, cheat sheet |
| 2     | `reference-data-structures.js`            | Array, HashMap, Set, Stack, Queue — when to use each    |
| 3     | `reference-sorting-algorithms.js`         | Bubble, Selection, Insertion, Merge, Quick, JS .sort()  |
| 4     | `reference-two-pointers.js`               | Opposite ends, same direction, three pointers           |
| 5     | `reference-sliding-window.js`             | Fixed window, dynamic expand/shrink                     |
| 6     | `reference-binary-search.js`              | Classic, find first/last, search-on-answer pattern      |
| 7     | `reference-linked-lists.js`               | Traversal, reversal, fast/slow pointers, dummy head     |
| 8     | `reference-recursion-and-backtracking.js` | Call stack, base case, permutations, subsets            |
| 9     | `reference-trees-and-graphs.js`           | DFS/BFS, tree traversals, grid problems                 |
| 10    | `reference-heaps.js`                      | Min-heap, top K pattern, heap vs sort                   |
| 11    | `reference-dynamic-programming.js`        | Memoization vs tabulation, 1D and 2D DP                 |

> Start with Big-O (#1) — everything else references it.
> Read #4 and #5 after solving a few Two Pointer / Sliding Window problems so the patterns feel familiar.
> Save DP (#11) for last — it's the hardest and needs everything before it.

## Study Method

1. **Day 1** — Learn from course + understand solution
2. **Day 2** — Re-read problem, write pseudocode, code with minimal hints
3. **Day 3** — Solve from scratch without any reference

## Tech Stack

- Language: **JavaScript**
- Platform: [LeetCode](https://leetcode.com)
