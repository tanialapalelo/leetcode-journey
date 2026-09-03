/*
125. Valid Palindrome
Easy

A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.



Example 1:

Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
Example 2:

Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.
Example 3:

Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.


Constraints:

1 <= s.length <= 2 * 105
s consists only of printable ASCII characters.

 */

// ANSWER
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    // s = "A man, a plan, a canal: Panama"
    let l = 0;
    let r = s.length - 1;

    while (l < r){
        while (l < r && !isAlnum(s[l]))
        {
            console.log("s[l] not alphanum, ", s[l])
            l++;
        }
        while (l < r && !isAlnum(s[r])) r--;
        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
        console.log("s[l], ", s[l])
        l++;
        r--;
    }
    return true;
};

function isAlnum(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

/*
s[l],  A
s[l] not alphanum,
s[l],  m
s[l],  a
s[l],  n
s[l] not alphanum,  ,
s[l] not alphanum,
s[l],  a
s[l] not alphanum,
s[l],  p
s[l],  l
s[l],  a
s[l],  n
s[l] not alphanum,  ,
s[l] not alphanum,
s[l],  a
s[l] not alphanum,
s[l],  c
*/

// EXPLANATION
/*
we use two pointers, l and r, starting at the beginning and end of the string, respectively.
We move the pointers towards each other while skipping non-alphanumeric characters.
If the characters at the pointers are not equal (ignoring case), we return false.
If we successfully compare all characters without finding a mismatch, we return true.

for scenario s = " "
- l = 0, r = 0
- while (l < r) is false, so we skip the loop and return true, which is correct because an empty string is a palindrome.

Time complexity: O(n) - l and r move toward each other, so their combined movement is
bounded by n regardless of how many non-alphanumeric characters are skipped.
Space complexity: O(1) - only the two pointers are used.
 */