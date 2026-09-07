/**
 * # [**20. Valid Parentheses**](https://leetcode.com/problems/valid-parentheses/)
 *
 * Easy
 *
 * Given a string `s` containing just the characters `'(', ')', '{', '}', '[' and ']'`,
 * determine if the input string is valid.
 *
 * An input string is valid if:
 * - Open brackets must be closed by the same type of brackets.
 * - Open brackets must be closed in the correct order.
 * - Every close bracket has a corresponding open bracket of the same type.
 *
 * **Example 1:** Input: s = "()" -> Output: true
 * **Example 2:** Input: s = "()[]{}" -> Output: true
 * **Example 3:** Input: s = "(]" -> Output: false
 * **Example 4:** Input: s = "([])" -> Output: true
 * **Example 5:** Input: s = "([)]" -> Output: false
 *
 * **Constraints:**
 * - `1 <= s.length <= 10^4`
 * - `s` consists of parentheses only `'()[]{}'`.
 *
 * **Key insight**: the required property is "last opened, first closed" (LIFO) -> stack.
 * A naive open/close *counter* is not enough: "([)]" has balanced counts (2 opens, 2 closes)
 * but wrong order, so it must be rejected. A stack rejects it because when ')' arrives,
 * the top of the stack is '[' , not '(', so it's a mismatch.
 */

// ANSWER
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    if (s.length % 2 !== 0) return false; // odd length can never fully pair up

    const pairs = { ')': '(', ']': '[', '}': '{' };
    const stack = [];

    for (const char of s) {
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else {
            // closing bracket: top of stack must be its matching opener
            if (stack.length === 0 || stack.pop() !== pairs[char]) return false;
        }
    }

    return stack.length === 0; // no unmatched openers left dangling
};

// Time complexity: O(n) - single pass through the string, each char pushed/popped once.
// Space complexity: O(n) worst case - e.g. "((((((" pushes every char onto the stack.

/** Trace on "([)]" (should be false)
 * '(' -> push '('              stack: ['(']
 * '[' -> push '['              stack: ['(', '[']
 * ')' -> pop '[' , pairs[')'] is '(' -> mismatch -> return false
 *
 * Trace on "([])" (should be true)
 * '(' -> push '('              stack: ['(']
 * '[' -> push '['              stack: ['(', '[']
 * ']' -> pop '[' , pairs[']'] is '[' -> match, continue
 * ')' -> pop '(' , pairs[')'] is '(' -> match, continue
 * end of string, stack is empty -> return true
 */
