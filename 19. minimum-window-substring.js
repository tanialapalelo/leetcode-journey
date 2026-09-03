/*76. Minimum Window Substring
Hard

Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".

The testcases will be generated such that the answer is unique.

 

Example 1:

Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.
Example 2:

Input: s = "a", t = "a"
Output: "a"
Explanation: The entire string s is the minimum window.
Example 3:

Input: s = "a", t = "aa"
Output: ""
Explanation: Both 'a's from t must be included in the window.
Since the largest window of s only has one 'a', return empty string.
 

Constraints:

m == s.length
n == t.length
1 <= m, n <= 105
s and t consist of uppercase and lowercase English letters.
 

Follow up: Could you find an algorithm that runs in O(m + n) time?
*/

// ANSWER
var minWindow = function(s, t) {
    // 1) calculate frequency of t
    const tFreq = {};
    for (const c of t) {
        tFreq[c] = (tFreq[c] || 0) + 1; // if not exists, consider 0, then +1
    }

    const required = Object.keys(tFreq).length; // unique characters in t, number of unique keys in the object
    let formed = 0;
    const windowFreq = {};

    let left = 0;
    let ansStart = 0;
    let ansLen = Infinity;

    // 2) loop right
    for (let right = 0; right < s.length; right++) {
        // 3) add s[right] to the window
        const rc = s[right];
        windowFreq[rc] = (windowFreq[rc] || 0) + 1;

        // 4) check if this character just met the requirement
        // tFreq[rc] && ... : check if this character is in t, then continue
        if (tFreq[rc] && windowFreq[rc] === tFreq[rc]) {
            formed++;
        }

        // 5) shrink from left while still valid
        while (formed === required) {
            // update answer if shorter
            if (right - left + 1 < ansLen) {
                ansLen = right - left + 1;
                ansStart = left;
            }

            // remove s[left] from window
            const lc = s[left];
            windowFreq[lc]--;

            // if now less than required, formed--
            if (tFreq[lc] && windowFreq[lc] < tFreq[lc]) {
                formed--;
            }

            left++;
        }
    }

    return ansLen === Infinity ? "" : s.substring(ansStart, ansStart + ansLen); // cut string from start to end (exclusive)
};

/* EXPLANATION
1) We first calculate the frequency of characters in t and store it in an object tFreq. We also count the number of unique characters in t, which we call required.

2) We then use a sliding window approach with two pointers (left and right) to traverse the string s. We also maintain a windowFreq object to count the frequency of characters in the current window.
3) As we move the right pointer, we add characters to the window and update their frequency in windowFreq. If a character's frequency in the window matches its required frequency in tFreq, we increment the formed count.

4) Once we have a valid window (formed === required), we try to shrink the window from the left to find the minimum length. We update our answer if the current window is shorter than the previously recorded answer.
5) As we shrink the window, we also update the frequencies in windowFreq and check if we still have a valid window. If not, we decrement the formed count and continue moving the left pointer.
6) Finally, we return the minimum window substring if we found one, or an empty string if no valid window exists.

Time complexity: O(m + n) - building tFreq is O(m); the right pointer scans s once (O(n));
the inner while loop (shrinking) looks nested but left only ever moves forward, so its total
work across the whole run is also bounded by O(n) (amortized), not O(n^2).
Space complexity: O(1) - tFreq/windowFreq are bounded by the alphabet size (English letters),
not by the length of s or t.
*/