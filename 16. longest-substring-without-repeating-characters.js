/**
 * 3. Longest Substring Without Repeating Characters
 * Medium
 * 
 * Given a string s, find the length of the longest substring without duplicate characters.
 *
 *
 *
 * Example 1:
 *
 * Input: s = "abcabcbb"
 * Output: 3
 * Explanation: The answer is "abc", with the length of 3. Note that "bca" and "cab" are also correct answers.
 * Example 2:
 *
 * Input: s = "bbbbb"
 * Output: 1
 * Explanation: The answer is "b", with the length of 1.
 * Example 3:
 *
 * Input: s = "pwwkew"
 * Output: 3
 * Explanation: The answer is "wke", with the length of 3.
 * Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
 *
 *
 * Constraints:
 *
 * 0 <= s.length <= 5 * 104
 * s consists of English letters, digits, symbols and spaces.
 */

// ANSWER
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let uniqueLetter = new Set();
    let left = 0;
    let best = 0;

    if (s == null || s.length == 0) return 0;

    if (s.length == 1) return 1;

    for (let right = 0; right < s.length; right++) {
        //console.log("letter", s[right]);
        //console.log("uniqueLetter", uniqueLetter)
        while(uniqueLetter.has(s[right])) {
            uniqueLetter.delete(s[left]);
            left++;
        }
        uniqueLetter.add(s[right]);
        best = Math.max(best, uniqueLetter.size);   
    }
    //console.log("lastly uniqueLetter", uniqueLetter)
    return best;
};

// EXPLANATION
// we use slide window and two pointers, we keep adding letters to the set until we find a duplicate, then we remove the leftmost letter and move the left pointer until we can add the rightmost letter again, we keep track of the size of the set which is the length of the longest substring without repeating characters.
// Time complexity: O(n) where n is the length of the string, we traverse the string once and each letter is added and removed from the set at most once.
// Space complexity: O(min(m, n)) where m is the size of the character set and n is the length of the string, in the worst case we can have all unique characters in the string.
// slide window: we use two pointers to create a window that can expand and contract, we move the right pointer to expand the window and the left pointer to contract the window when we find a duplicate.
