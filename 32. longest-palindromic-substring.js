/*
https://leetcode.com/problems/longest-palindromic-substring/description/

5. Longest Palindromic Substring
Medium

Given a string s, return the longest palindromic substring in s.

 

Example 1:

Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
Example 2:

Input: s = "cbbd"
Output: "bb"
 

Constraints:

1 <= s.length <= 1000
s consist of only digits and English letters.

*/

// EXPLANATION

/*

Brute Force: O(n^3) time, O(1) space
Check every substring (O(n^2) of them) and verify if it's a palindrome (O(n)), keeping track of the longest one found.

Better: Expand Around Center - O(n^2) time, O(1) space
A palindrome mirrors around its center. There are 2*n - 1 possible centers:
- n centers on a single character (odd length palindromes, e.g. "aba" centers on "b")
- n-1 centers between two characters (even length palindromes, e.g. "abba" centers between "bb")

For each possible center, expand outwards with a left and right pointer as long as the characters match.
Every time the expansion succeeds, the substring between left and right is a palindrome, so we compare
its length against the best one seen so far and update if it's longer.

Example: s = "babad"
Centers: b | a | b | a | d
         0   1   2   3   4

center=0 (b): left=0,right=0 -> "b" (len 1)
center=1 (a): left=1,right=1 -> "a" (len 1); expand left=0,right=2 -> "bab" (len 3, matches, keep expanding); expand left=-1 -> stop
center=2 (b): left=2,right=2 -> "b" (len 1); expand left=1,right=3 -> "aba" (len 3); expand left=0,right=4 -> "b" vs "d" mismatch, stop
center=3 (a): left=3,right=3 -> "a" (len 1)
center=4 (d): left=4,right=4 -> "d" (len 1)

Longest palindrome found: "bab" (or "aba", both length 3, either is a valid answer).

Even length example: s = "cbbd"
center between index 1 and 2 (b,b): left=1,right=2 -> "bb" (len 2, matches); expand left=0,right=3 -> "c" vs "d" mismatch, stop.
Longest palindrome found: "bb".

Time complexity: O(n^2) - n centers, each expansion can take up to O(n) in the worst case.
Space complexity: O(1) - only pointers and indices are used, no extra data structures.

*/

// BRUTE FORCE (O(n^3) time, O(1) space)
// For every possible (start, end) pair, check if s[start..end] is a palindrome
// by comparing characters from both ends moving inward. Keep the longest one found.

/*

WALKTHROUGH - trace for s = "cbbd" (indices: c=0, b=1, b=2, d=3)
Initial: start=0, maxLen=1 (the default 1-char answer)

i=0 (outer loop fixes the substring's start index at 'c')
  j=0 -> substring s[0..0]="c",  len=1, isPalindrome -> true,  1>1? no  -> no update
  j=1 -> substring s[0..1]="cb", len=2, isPalindrome: s[0]'c' vs s[1]'b' mismatch -> false -> skip
  j=2 -> substring s[0..2]="cbb",len=3, isPalindrome: s[0]'c' vs s[2]'b' mismatch -> false -> skip
  j=3 -> substring s[0..3]="cbbd",len=4, isPalindrome: s[0]'c' vs s[3]'d' mismatch -> false -> skip

i=1 (start index moves to 'b')
  j=1 -> substring "b",  len=1, isPalindrome -> true, 1>1? no -> no update
  j=2 -> substring "bb", len=2, isPalindrome: left=1,right=2, s[1]'b'==s[2]'b' -> left++,right-- -> left(2) < right(1)? no, loop ends -> true
         2 > 1? yes -> start=1, maxLen=2
  j=3 -> substring "bbd",len=3, isPalindrome: s[1]'b' vs s[3]'d' mismatch -> false -> skip

i=2 (start index moves to 'b')
  j=2 -> substring "b", len=1, true, 1>2? no
  j=3 -> substring "bd",len=2, isPalindrome: s[2]'b' vs s[3]'d' mismatch -> false

i=3 (start index moves to 'd')
  j=3 -> substring "d", len=1, true, 1>2? no

Loops end -> start=1, maxLen=2 -> return s.substring(1, 3) = "bb"

Key idea: i and j are literally the two ends of the substring being tested (no expansion,
no center - just brute force every window and check it directly). isPalindrome does the
same left/right pointer check you already know from valid-palindrome problems.

*/

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindromeBruteForce = function(s) {
    const isPalindrome = (str, left, right) => {
        while (left < right) {
            if (str[left] !== str[right]) return false;
            left++;
            right--;
        }
        return true;
    };

    let start = 0, maxLen = 1;

    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) {
            const len = j - i + 1;
            if (len > maxLen && isPalindrome(s, i, j)) {
                start = i;
                maxLen = len;
            }
        }
    }

    return s.substring(start, start + maxLen);
};

// ANSWER

/*

WALKTHROUGH - trace for s = "babad" (indices: b=0, a=1, b=2, a=3, d=4)
Initial: start=0, maxLen=0

center=0:
  expand(0,0) [odd]:  s[0]'b'==s[0]'b' -> left=-1,right=1 -> stop (left<0)
                       len = right-left-1 = 1-(-1)-1 = 1;  1>0? yes -> maxLen=1, start=left+1=0
  expand(0,1) [even]: s[0]'b' vs s[1]'a' mismatch immediately -> loop never runs
                       len = 1-0-1 = 0;  0>1? no

center=1:
  expand(1,1) [odd]:  s[1]'a'==s[1]'a' -> left=0,right=2 -> s[0]'b'==s[2]'b' -> left=-1,right=3 -> stop
                       len = 3-(-1)-1 = 3;  3>1? yes -> maxLen=3, start=left+1=0   ("bab" found)
  expand(1,2) [even]: s[1]'a' vs s[2]'b' mismatch -> loop never runs -> len=0, no update

center=2:
  expand(2,2) [odd]:  s[2]'b'==s[2]'b' -> left=1,right=3 -> s[1]'a'==s[3]'a' -> left=0,right=4 ->
                       s[0]'b' vs s[4]'d' mismatch -> stop
                       len = 4-0-1 = 3;  3>3? no -> NOT updated (this is why "bab" wins over "aba",
                       both length 3 but "bab" was found first)
  expand(2,3) [even]: s[2]'b' vs s[3]'a' mismatch -> len=0, no update

center=3:
  expand(3,3) [odd]:  s[3]'a'==s[3]'a' -> left=2,right=4 -> s[2]'b' vs s[4]'d' mismatch -> stop
                       len = 4-2-1 = 1;  1>3? no
  expand(3,4) [even]: s[3]'a' vs s[4]'d' mismatch -> len=0, no update

center=4:
  expand(4,4) [odd]:  s[4]'d'==s[4]'d' -> left=3,right=5 -> right(5) not < s.length(5) -> stop
                       len = 5-3-1 = 1;  1>3? no
  expand(4,5) [even]: right(5) not < s.length(5) -> loop never runs -> len=0, no update

Loops end -> start=0, maxLen=3 -> return s.substring(0, 3) = "bab"

Key idea: "center" is not always a real character - expand(center, center) checks the
odd-length palindrome centered ON index `center`, while expand(center, center+1) checks
the even-length palindrome centered BETWEEN index `center` and `center+1` (no character
sits exactly in the middle, e.g. "bb" in "cbbd"). Both are tried for every index so no
center position is missed. `len = right - left - 1` works because after the while loop
exits, `left` and `right` have gone one step PAST the actual palindrome boundaries.

*/

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    let start = 0, maxLen = 0;

    // returns the length of the palindrome centered at (left, right) and updates the best window
    const expand = (left, right) => {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        // only the widest palindrome from this center matters, so length is checked after the loop ends
        const len = right - left - 1;
        if (len > maxLen) {
            maxLen = len;
            start = left + 1;
        }
    };

    for (let center = 0; center < s.length; center++) {
        expand(center, center);     // odd length palindromes
        expand(center, center + 1); // even length palindromes
    }

    return s.substring(start, start + maxLen);
};

