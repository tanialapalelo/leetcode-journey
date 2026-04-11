/**
 * 567. Permutation in String
 * Medium
 *
 * Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.
 *
 * In other words, return true if one of s1's permutations is the substring of s2.
 *
 *
 *
 * Example 1:
 *
 * Input: s1 = "ab", s2 = "eidbaooo"
 * Output: true
 * Explanation: s2 contains one permutation of s1 ("ba").
 * Example 2:
 *
 * Input: s1 = "ab", s2 = "eidboaoo"
 * Output: false
 *
 *
 * Constraints:
 *
 * 1 <= s1.length, s2.length <= 104
 * s1 and s2 consist of lowercase English letters.
 */

// ANSWER with help of youtube DSA crash course freecodecamp & GPT
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
function checkInclusion(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    if (m > n) return false;

    const base = "a".charCodeAt(0);
    const need = new Array(26).fill(0);
    const win = new Array(26).fill(0);

    const idx = (ch) => ch.charCodeAt(0) - base;

    // counts for s1
    for (let i = 0; i < m; i++) need[idx(s1[i])]++;

    // first window in s2
    for (let i = 0; i < m; i++) win[idx(s2[i])]++;

    if (same(need, win)) return true;

    // slide window: add s2[r], remove s2[r-m]
    for (let r = m; r < n; r++) {
        win[idx(s2[r])]++;       // add right char
        win[idx(s2[r - m])]--;   // remove left char

        if (same(need, win)) return true;
    }

    return false;

    function same(a, b) {
        for (let i = 0; i < 26; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
}