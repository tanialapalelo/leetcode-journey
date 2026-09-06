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
| 31   | Palindromic Substrings                                  | Medium | String, Two Pointers, Dynamic Programming  |
| 32   | Longest Palindromic Substring                           | Medium | String, Two Pointers, Dynamic Programming  |
| 33   | Text Justification                                      | Hard   | String, Greedy, Simulation                 |
| 34   | Binary Search                                           | Easy   | Binary Search                              |
| 35   | Find First and Last Position of Element in Sorted Array | Medium | Binary Search                              |
| 36   | Merge Sorted Array                                      | Easy   | Array, Two Pointers                        |
| 37   | Sort Colors                                             | Medium | Array, Two Pointers, Dutch National Flag   |
| 38   | Majority Element                                        | Easy   | Array, Boyer-Moore Voting                  |
| 41   | Search a 2D Matrix                                      | Medium | Binary Search                              |
| 42   | Find Minimum in Rotated Sorted Array                    | Medium | Binary Search                              |
| 43   | Search in Rotated Sorted Array                          | Medium | Binary Search                              |
| 44   | Sort List                                               | Medium | Linked List, Merge Sort                    |
| 45   | Largest Number                                          | Medium | Greedy, Custom Comparator Sort             |
| 46   | Koko Eating Bananas                                     | Medium | Binary Search on Answer                    |
| 47   | Reverse Linked List                                     | Easy   | Linked List, Two Pointers, Recursion       |
| 48   | Middle of the Linked List                               | Easy   | Linked List, Fast & Slow Pointers          |

> Numbers 39 and 40 are intentionally left open — reserved for two more course/video
> problems not yet solved. Reverse Linked List and Middle of the Linked List were
> renumbered to 47-48 to make room for them, since they'd originally collided with
> Search a 2D Matrix and Find Minimum in Rotated Sorted Array (added from a
> different playlist using the same next-available numbers by mistake).

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
- **Linked List** — traversal, reversal, fast & slow pointers, merge sort (top-down and bottom-up)
- **Binary Search on Answer** — search over the space of possible answers using a monotonic feasibility check, not over array indices
- **Greedy / Custom Comparator Sort** — exchange-argument sorting for optimal arrangement problems

## Practice Order (By Category)

The table above is ordered by **when I solved it** (matches the course/video order). Numbering is flat and append-only going forward — file names shouldn't get renamed once added. (One collision from an earlier renumbering did get fixed by moving two files to 47-48; see the note above.)

When practicing from a different list (grouped by topic instead of by video), use this table instead. It's just a second view over the same files, grouped by pattern.

> New problem from another playlist that isn't solved yet? Check `ls *.js | sort -V` for the actual highest number in use first, then keep appending to the repo with the next sequential number in the existing flat naming scheme (e.g. `49. maximum-subarray.js`), then add one row here and one row to the table above.

### Arrays & Hashing

| Problem | Difficulty | File |
|---|---|---|
| Two Sum | Easy | [1.two-sum.js](./1.two-sum.js) |
| Contains Duplicate | Easy | [3.contains-duplicate.js](./3.contains-duplicate.js) |
| Contains Duplicate II | Easy | [4.contains-duplicate-ii.js](./4.contains-duplicate-ii.js) |
| Valid Anagram | Easy | [5.valid-anagram.js](./5.valid-anagram.js) |
| Group Anagrams | Medium | [6. group-anagrams.js](./6.%20group-anagrams.js) |
| Product of Array Except Self | Medium | [7. product-of-array-except-self.js](./7.%20product-of-array-except-self.js) |
| Top K Frequent Elements | Medium | [8. top-k-frequent-elements.js](./8.%20top-k-frequent-elements.js) |
| Longest Consecutive Sequence | Medium | [11. longest-consecutive-sequence.js](./11.%20longest-consecutive-sequence.js) |
| First Missing Positive | Hard | [12. first-missing-positive.js](./12.%20first-missing-positive.js) |
| Minimum Distance to the Target Element | Easy | [17. minimum-distance-to-the-target-element.js](./17.%20minimum-distance-to-the-target-element.js) |
| Two Furthest Houses With Different Colors | Easy | [20. two-furthest-houses-with-different-colors.js](./20.%20two-furthest-houses-with-different-colors.js) |
| Majority Element | Easy | [38. majority-element.js](./38.%20majority-element.js) |

### Two Pointers

| Problem | Difficulty | File |
|---|---|---|
| Valid Palindrome | Easy | [21. valid-polindrome.js](./21.%20valid-polindrome.js) |
| Two Sum II - Input Array Is Sorted | Medium | [22. two-sum-ii-input-array-is-sorted.js](./22.%20two-sum-ii-input-array-is-sorted.js) |
| 3Sum | Medium | [23. 3sum.js](./23.%203sum.js) |
| Container With Most Water | Medium | [24. container-with-most-water.js](./24.%20container-with-most-water.js) |
| Trapping Rain Water | Hard | [25. trapping-rain-water.js](./25.%20trapping-rain-water.js) |
| Remove Duplicates from Sorted Array | Easy | [26. remove-duplicatess-from-sorted-array.js](./26.%20remove-duplicatess-from-sorted-array.js) |
| Next Permutation | Medium | [27. next-permutation.js](./27.%20next-permutation.js) |
| Palindromic Substrings | Medium | [31. palindromic-substring.js](./31.%20palindromic-substring.js) |
| Longest Palindromic Substring | Medium | [32. longest-palindromic-substring.js](./32.%20longest-palindromic-substring.js) |
| Merge Sorted Array | Easy | [36. merge-sorted-array.js](./36.%20merge-sorted-array.js) |
| Sort Colors | Medium | [37. sort-colors.js](./37.%20sort-colors.js) |

### Sliding Window

| Problem | Difficulty | File |
|---|---|---|
| Best Time to Buy and Sell Stock | Easy | [13. best-time-to-buy-and-sell-stock.js](./13.%20best-time-to-buy-and-sell-stock.js) |
| Permutation in String | Medium | [14. permutation-in-string.js](./14.%20permutation-in-string.js) |
| Longest Repeating Character Replacement | Medium | [15. longest-repeating-character-replacement.js](./15.%20longest-repeating-character-replacement.js) |
| Longest Substring Without Repeating Characters | Medium | [16. longest-substring-without-repeating-characters.js](./16.%20longest-substring-without-repeating-characters.js) |
| Sliding Window Maximum | Hard | [18. sliding-window-maximum.js](./18.%20sliding-window-maximum.js) |
| Minimum Window Substring | Hard | [19. minimum-window-substring.js](./19.%20minimum-window-substring.js) |

### Binary Search

| Problem | Difficulty | File |
|---|---|---|
| Binary Search | Easy | [34. binary-search.js](./34.%20binary-search.js) |
| Find First and Last Position of Element in Sorted Array | Medium | [35. find-first-and-last-position-of-element-in-sorted-array.js](./35.%20find-first-and-last-position-of-element-in-sorted-array.js) |
| Search a 2D Matrix | Medium | [41. search-a-2d-matrix.js](./41.%20search-a-2d-matrix.js) |
| Find Minimum in Rotated Sorted Array | Medium | [42. find-minimum-in-rotated-sorted-array.js](./42.%20find-minimum-in-rotated-sorted-array.js) |
| Search in Rotated Sorted Array | Medium | [43. search-in-rotated-sorted-array.js](./43.%20search-in-rotated-sorted-array.js) |
| Koko Eating Bananas | Medium | [46. koko-eating-bananas.js](./46.%20koko-eating-bananas.js) |

### Linked List

| Problem | Difficulty | File |
|---|---|---|
| Middle of the Linked List | Easy | [48. middle-linked-list.js](./48.%20middle-linked-list.js) |
| Reverse Linked List | Easy | [47. reverse-linked-list.js](./47.%20reverse-linked-list.js) |
| Sort List | Medium | [44. sort-list.js](./44.%20sort-list.js) |

### Greedy / Sorting

| Problem | Difficulty | File |
|---|---|---|
| Largest Number | Medium | [45. largest-number.js](./45.%20largest-number.js) |

### Math & String

| Problem | Difficulty | File |
|---|---|---|
| GCD of Odd & Even | Easy | [2.gcd-of-odd-even.js](./2.gcd-of-odd-even.js) |
| Roman to Integer | Easy | [9. roman-to-integer.js](./9.%20roman-to-integer.js) |
| Verifying an Alien Dictionary | Easy | [10. verifying-an-alien-dictionary.js](./10.%20verifying-an-alien-dictionary.js) |
| Fizz Buzz | Easy | [28. fizz-buzz.js](./28.%20fizz-buzz.js) |
| Longest Common Prefix | Easy | [29. longest-common-prefix.js](./29.%20longest-common-prefix.js) |
| Encode and Decode Strings | Medium | [30. encode-and-decode-string.js](./30.%20encode-and-decode-string.js) |
| Text Justification | Hard | [33. text-justification.js](./33.%20text-justification.js) |

### Matrix / Misc

| Problem | Difficulty | File |
|---|---|---|
| Find Winner on a Tic-Tac-Toe Game | Easy | [14.1 find-winner-on-a-tic-tac-toe-game.js](./14.1%20find-winner-on-a-tic-tac-toe-game.js) |

## Reference Files

Standalone concept files to review when you need to understand the foundations.
Read them in this order — each one builds on the previous.

| Order | File                                      | What it covers                                          |
|-------|-------------------------------------------|---------------------------------------------------------|
| 1     | `1.reference-big-o.js`                   | Complexity notation, rules, drop constants, cheat sheet |
| 2     | `2.reference-data-structures.js`         | Array, HashMap, Set, Stack, Queue — when to use each    |
| 3     | `3.reference-sorting-algorithms.js`      | Bubble, Selection, Insertion, Merge, Quick, JS .sort()  |
| 4     | `4.reference-two-pointers.js`            | Opposite ends, same direction, three pointers           |
| 5     | `5.reference-sliding-window.js`          | Fixed window, dynamic expand/shrink                     |
| 6     | `6.reference-binary-search.js`           | Classic, find first/last, search-on-answer pattern      |
| 7     | `7.reference-linked-lists.js`               | Traversal, reversal, fast/slow pointers, dummy head     |
| 8     | `8.reference-recursion-and-backtracking.js` | Call stack, base case, permutations, subsets            |
| 9     | `9.reference-trees-and-graphs.js`           | DFS/BFS, tree traversals, grid problems                 |
| 10    | `10.reference-heaps.js`                   | Min-heap, top K pattern, heap vs sort                   |
| 11    | `11.reference-dynamic-programming.js`    | Memoization vs tabulation, 1D and 2D DP                 |

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
