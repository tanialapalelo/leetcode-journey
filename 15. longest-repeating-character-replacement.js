/**
 * 424. Longest Repeating Character Replacement
 * Medium
 *
 * You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times.
 *
 * Return the length of the longest substring containing the same letter you can get after performing the above operations.
 *
 *
 *
 * Example 1:
 *
 * Input: s = "ABAB", k = 2
 * Output: 4
 * Explanation: Replace the two 'A's with two 'B's or vice versa.
 * Example 2:
 *
 * Input: s = "AABABBA", k = 1
 * Output: 4
 * Explanation: Replace the one 'A' in the middle with 'B' and form "AABBBBA".
 * The substring "BBBB" has the longest repeating letters, which is 4.
 * There may exists other ways to achieve this answer too.
 *
 *
 * Constraints:
 *
 * 1 <= s.length <= 105
 * s consists of only uppercase English letters.
 * 0 <= k <= s.length
 */

// ANSWER with help of youtube DSA crash course freecodecamp & GPT
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var characterReplacement = function(s, k) {
    let l = 0;
    let best = 0;

    // For this problem s is uppercase A-Z, so 26 counts is enough
    const count = new Array(26).fill(0);

    let maxFreq = 0; // max count of any single letter in the current window

    const A = "A".charCodeAt(0);
    const idx = (ch) => ch.charCodeAt(0) - A;

    console.log("idx('A') =", idx("A")); // 0
    console.log("idx('B') =", idx("B")); // 1

    for (let r = 0; r < s.length; r++) {
        console.log("idx(s[r]) =", idx(s[r]), "char =", s[r]);

        // 1) add s[r]
        count[idx(s[r])]++;

        // 2) update maxFreq
        maxFreq = Math.max(maxFreq, count[idx(s[r])]);

        // 3) shrink while invalid, valid if (len - maxFreq) <= k
        while ((r - l + 1) - maxFreq > k) {
            count[idx(s[l])]--;
            l++; // move l forward
        }


        // 4) update best, at this point in the loop, your window is [l .. r] and it’s valid (because you shrank it until valid). + 1 is there because indices are inclusive, so we can + 1 is there because indices are inclusive,
        best = Math.max(best, r - l + 1)
    }

    return best;
};

/** EXPLANATION
 * The key idea is to maintain a sliding window [l, r] and keep track of the count of each character in that window.
 * We also keep track of the maximum frequency of any single character in the current window (maxFreq).
 * The window is valid if the number of characters we need to replace (which is the total length of the window minus maxFreq) is less than or equal to k.
 * If it’s not valid, we shrink the window from the left until it becomes valid again. During this process, we update our best answer with the size of the valid window.
 *
 * We use an array of size 26 to count the frequency of each uppercase letter in the current window. The idx function converts a character to its corresponding index in the count array (e.g., 'A' -> 0, 'B' -> 1, ..., 'Z' -> 25).
 *
 * The time complexity of this algorithm is O(n) because each character is visited at most twice (once when expanding the window and once when shrinking it).
 * The space complexity is O(1) because the count array has a fixed size of 26, regardless of the input size.
 *
 * We implement concept of sliding window and we keep track of the frequency of characters in the current window. We also keep track of the maximum frequency of any single character in the current window (maxFreq).
 * The window is valid if the number of characters we need to replace (which is the total length of the window minus maxFreq) is less than or equal to k.
 * If it’s not valid, we shrink the window from the left until it becomes valid again.
 * During this process, we update our best answer with the size of the valid window.
 */