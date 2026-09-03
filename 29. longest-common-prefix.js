/*
14. Longest Common Prefix
Easy
Topics
premium lock icon
Companies
Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".



Example 1:

Input: strs = ["flower","flow","flight"]
Output: "fl"
Example 2:

Input: strs = ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.


Constraints:

1 <= strs.length <= 200
0 <= strs[i].length <= 200
strs[i] consists of only lowercase English letters if it is non-empty.

*/

/*
MENTAL MODEL

A prefix is the beginning of a string — "fl" is a prefix of "flower".
We want the longest prefix that ALL strings in the array share.

Key insight: instead of comparing every string to every other string,
just compare character by character column by column. The moment
any string differs (or runs out), you've found your boundary.

["flower","flow","flight"]
 col 0: f f f ← all match
 col 1: l l l ← all match
 col 2: o o i ← MISMATCH → prefix is strs[0].slice(0, 2) = "fl"
*/

// APPROACH 1 — Vertical scan (column by column)
// Walk through each character position. If any string differs → stop.
// Time: O(S) where S = total chars across all strings
// Space: O(1)
var longestCommonPrefix = function(strs) {
    for (let col = 0; col < strs[0].length; col++) {
        const char = strs[0][col];
        for (let row = 1; row < strs.length; row++) {
            // stop if this string is shorter OR its character differs
            if (col >= strs[row].length || strs[row][col] !== char) {
                return strs[0].slice(0, col);
            }
        }
    }
    return strs[0]; // strs[0] is entirely a prefix of all others
};


// APPROACH 2 — Horizontal scan (trim the prefix string down)
// Start with the whole first string as the prefix.
// Trim one char at a time from the right until every string starts with it.
// Time: O(S)  Space: O(1)
var longestCommonPrefix = function(strs) {
    let prefix = strs[0]; // the initial prexif and therefore for loop starts at index 1

    for (let i = 1; i < strs.length; i++) {
        while (!strs[i].startsWith(prefix)) {
            prefix = prefix.slice(0, -1); // chop last character
            if (prefix === '') return '';
        }
    }
    return prefix;
};


// APPROACH 3 — Sort + compare first and last (clever)
// After sorting lexicographically, only the FIRST and LAST strings
// can possibly differ the most. If first and last share a prefix,
// every string in between must also share it.
// Time: O(n log n) for sort  Space: O(1)
var longestCommonPrefix = function(strs) {
    strs.sort();
    const first = strs[0], last = strs[strs.length - 1];
    let i = 0;
    while (i < first.length && first[i] === last[i]) i++;
    return first.slice(0, i);
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WALKTHROUGH — Approach 1 (Vertical Scan)
Input: ["flower", "flow", "flight"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We use strs[0] = "flower" as our column guide.
col loop goes through each character position of "flower".
row loop checks every OTHER string at that same position.

col=0, char='f'
  row=1: strs[1][0] = 'f' → matches ✓
  row=2: strs[2][0] = 'f' → matches ✓
  → no mismatch, continue

col=1, char='l'
  row=1: strs[1][1] = 'l' → matches ✓
  row=2: strs[2][1] = 'l' → matches ✓
  → no mismatch, continue

col=2, char='o'
  row=1: strs[1][2] = 'o' → matches ✓
  row=2: strs[2][2] = 'i' → MISMATCH ✗
  → return strs[0].slice(0, 2) = "fl"

Result: "fl" ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WALKTHROUGH — Approach 1 (Vertical Scan)
Input: ["dog", "racecar", "car"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

col=0, char='d'
  row=1: strs[1][0] = 'r' → MISMATCH ✗
  → return strs[0].slice(0, 0) = ""

Result: "" ✓  (no common prefix at all)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WALKTHROUGH — Approach 2 (Horizontal Scan)
Input: ["flower", "flow", "flight"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start: prefix = "flower"

i=1, compare with "flow":
  "flow".startsWith("flower")? No → trim → prefix = "flowe"
  "flow".startsWith("flowe")?  No → trim → prefix = "flow"
  "flow".startsWith("flow")?   Yes ✓ → move on

i=2, compare with "flight":
  "flight".startsWith("flow")? No → trim → prefix = "flo"
  "flight".startsWith("flo")?  No → trim → prefix = "fl"
  "flight".startsWith("fl")?   Yes ✓ → move on

No more strings. Return "fl" ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WALKTHROUGH — Approach 3 (Sort + Compare First & Last)
Input: ["flower", "flow", "flight"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After sort (lexicographic / alphabetical order):
  ["flight", "flow", "flower"]

first = "flight"
last  = "flower"

Compare char by char:
  i=0: 'f' === 'f' ✓
  i=1: 'l' === 'l' ✓
  i=2: 'i' === 'o' ✗ → stop

Return first.slice(0, 2) = "fl" ✓

Why does this work? Lexicographic sort puts the most "distant" strings
at the two ends. If first and last share a prefix, every string between
them (alphabetically) must also share it — they can't be more different
than the two extremes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHICH TO USE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Approach 1 (vertical)   — most intuitive, easiest to explain step by step
  Approach 2 (horizontal) — natural if you think "trim until it fits"
  Approach 3 (sort)       — clever, but sorting costs O(n log n) vs O(S)

Start with Approach 1 in an interview.
*/
