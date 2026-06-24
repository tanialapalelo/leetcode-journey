/*
https://leetcode.com/problems/palindromic-substrings/

647. Palindromic Substrings
Medium

Given a string s, return the number of palindromic substrings in it.

A string is a palindrome when it reads the same backward as forward.

A substring is a contiguous sequence of characters within the string.

 

Example 1:

Input: s = "abc"
Output: 3
Explanation: Three palindromic strings: "a", "b", "c".
Example 2:

Input: s = "aaa"
Output: 6
Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".
 
Input: s = "caba"
Output: 5
Explanation: Five palindromic strings: "c", "a", "b", "a", "aba".

Constraints:

1 <= s.length <= 1000
s consists of lowercase English letters.

*/

// EXPLANATION

/*

Brute Force: O(n^3) time, O(1) space
It takes O(n^2) time to generate all substrings, and O(n) time to check if each substring is a palindrome.

Better: O(n^2) time, O(1) space
We can expand around the center of a palindrome. A palindrome can be centered around a single character (odd length) or between two characters (even length). 
For each center, we expand outwards and count palindromic substrings until the characters at the left and right pointers are not equal.

Example: s = "caba"
Centers: c | a | b | a
         ^   ^   ^   ^
         0   1   2   3
For center at index 0 (c):
- Expand: left=0, right=0 → "c" is a palindrome → count = 1
- Expand: left=-1, right=1 → out of bounds → stop

For center at index 1 (a):
- Expand: left=1, right=1 → "a" is a palindrome → count = 2
- Expand: left=0, right=2 → "cab" is not a palindrome → stop

For center at index 2 (b):
- Expand: left=2, right=2 → "b" is a palindrome → count = 3
- Expand: left=1, right=3 → "aba" is a palindrome → count = 4
- Expand: left=0, right=4 → out of bounds → stop

For center at index 3 (a):
- Expand: left=3, right=3 → "a" is a palindrome → count = 5
- Expand: left=2, right=4 → out of bounds → stop


Another example: s = "cabba"
Centers: c | a | b | b | a
         ^   ^   ^   ^   ^
         0   1   2   3   4

For center at index 0 (c):
- Expand: left=0, right=0 → "c" is a palindrome → count = 1
- Expand: left=-1, right=1 → out of bounds → stop

For center at index 1 (a):
- Expand: left=1, right=1 → "a" is a palindrome → count = 2
- Expand: left=0, right=2 → "cab" is not a palindrome → stop

For center at index 2 (b):
- Expand: left=2, right=2 → "b" is a palindrome → count = 3
- Expand: left=1, right=3 → "abb" is not a palindrome → stop

For center at index 3 (b):
- Expand: left=3, right=3 → "b" is a palindrome → count = 4
- Expand: left=2, right=4 → "bba" is not a palindrome → stop

For center at index 4 (a):
- Expand: left=4, right=4 → "a" is a palindrome → count = 5
- Expand: left=3, right=5 → out of bounds → stop

The output is 6, which is the number of palindromic substrings in "cabba": "c", "a", "b", "b", "bb", "abba".

Time complexity: O(n^2) because we have two nested loops: one for the center and one for expanding around the center.

Space complexity: O(1) because we are using a constant amount of space.

*/

// ANSWER

/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function(s) {
    let count = 0;

    for (let center = 0; center < s.length; center++) {
        // Odd length palindromes
        let left = center, right = center;
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            count++;
            left--;
            right++;
        }
        // Even length palindromes
        left = center, right = center + 1;
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            count++;
            left--;
            right++;
        }
    }

    return count; 
};

// OR TO SIMPLIFY THE CODE
/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function(s) {
    let count = 0;
    const expand = (left, right) => {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            count++;
            left--;
            right++;
        }
    };

    for (let center = 0; center < s.length; center++) {
        expand(center, center); // Odd length palindromes
        expand(center, center + 1); // Even length palindromes
    }

    return count;
};

// WALKTHROUGH OF CODE
/*
For s = "caba":
center=0: expand(0,0) → "c" is a palindrome → count=1
center=1: expand(1,1) → "a" is a palindrome → count=2
center=2: expand(2,2) → "b" is a palindrome → count=3
          expand(1,3) → "aba" is a palindrome → count=4
center=3: expand(3,3) → "a" is a palindrome → count=5
            expand(2,4) → out of bounds → stop
The output is 5, which is the number of palindromic substrings in "caba": "c", "a", "b", "a", "aba".

For s = "cabba":
center=0: expand(0,0) → "c" is a palindrome → count=1
center=1: expand(1,1) → "a" is a palindrome → count=2
center=2: expand(2,2) → "b" is a palindrome → count=3
center=3: expand(3,3) → "b" is a palindrome → count=4
center=4: expand(4,4) → "a" is a palindrome → count=5
            expand(3,5) → "bba" is not a palindrome → stop
The output is 6, which is the number of palindromic substrings in "cabba": "c", "a", "b", "b", "bb", "abba".
*/