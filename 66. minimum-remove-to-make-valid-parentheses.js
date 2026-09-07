/**
 * 1249. Minimum Remove to Make Valid Parentheses
Medium

Given a string s of '(' , ')' and lowercase English characters.

Your task is to remove the minimum number of parentheses ( '(' or ')', in any positions ) so that the resulting parentheses string is valid and return any valid string.

Formally, a parentheses string is valid if and only if:

It is the empty string, contains only lowercase characters, or
It can be written as AB (A concatenated with B), where A and B are valid strings, or
It can be written as (A), where A is a valid string.
 

Example 1:

Input: s = "lee(t(c)o)de)"
Output: "lee(t(c)o)de"
Explanation: "lee(t(co)de)" , "lee(t(c)ode)" would also be accepted.
Example 2:

Input: s = "a)b(c)d"
Output: "ab(c)d"
Example 3:

Input: s = "))(("
Output: ""
Explanation: An empty string is also valid.
 

Constraints:

1 <= s.length <= 105
s[i] is either '(' , ')', or lowercase English letter.
 */

/**
 * UNDERSTANDING THE PROBLEM
  *
 * The string mixes lowercase letters (always valid, never touched) with
 * '(' and ')' (which must end up balanced). "Balanced" means: read left to
 * right, every ')' must have an earlier unmatched '(' to pair with, and at
 * the end every '(' must have found a ')' to its right. We may only DELETE
 * parens (never add or reorder), and we want to delete as FEW as possible.
 *
 * Walking through Example 1: s = "lee(t(c)o)de)"
 *   index:  0123456789...
 *   chars:  l e e ( t ( c ) o ) d e )
 *              ^3    ^5    ^7   ^9    ^12
 * - '(' at 3 opens, '(' at 5 opens (nested inside 3), ')' at 7 closes the
 *   one at 5, ')' at 9 closes the one at 3. So far everything is matched.
 * - ')' at 12 shows up with NO open '(' left waiting -> it's the extra one,
 *   must be removed. Result: "lee(t(c)o)de" (index 12 dropped). Matches
 *   the expected output.
 *
 * The pattern to spot: a ')' is invalid the moment it appears with nothing
 * open to match; a '(' is invalid if it NEVER gets matched by the end of
 * the string. Every invalid paren must be removed - that's forced, not a
 * choice - so "minimum removals" is just "remove exactly the invalid ones".
 */

/**
 * APPROACH 1: BRUTE FORCE
 *
 * Repeatedly scan the string looking for one invalid paren at a time,
 * remove it, and rescan from scratch. Two passes:
 *   PASS 1 (left to right): a ')' is invalid if, counting only the parens
 *     before it, there are more ')' than '(' (i.e. it has nothing open to
 *     match). Remove it and restart the balance count from the beginning.
 *   PASS 2 (right to left): after pass 1, any leftover '(' that never got
 *     matched must be removed too. Same idea, mirrored.
 *
 * This works but is wasteful: for every candidate character we re-count the
 * balance of everything before/after it from scratch, and every removal
 * shifts the array (splice is O(n)). Worst case (e.g. a string of all ')')
 * removes one character per full rescan -> O(n) removals * O(n) rescan
 * cost = O(n^2) time. Space is O(n) for the character array copy.
 *
 * Time: O(n^2) - nested scanning (rescan balance for every character,
 *       and restart the outer scan after every splice).
 * Space: O(n) - the mutable copy of the string as an array.
 */

/**
 * APPROACH 2: OPTIMAL (stack of indices)
 *
 * Same core idea as Valid Parentheses (#59): '(' and ')' need a LIFO
 * matcher, because the most recently opened '(' must be the one that
 * closes first. The twist here is we don't just want yes/no validity, we
 * need to know exactly WHICH indices are invalid so we can delete them.
 *
 * Single left-to-right pass:
 * - '(' at index i: push i onto the stack ("waiting for a matching ')'").
 * - ')' at index i:
 *     - if the stack is non-empty, pop it - this ')' matched the most
 *       recently opened '(', both are now valid, do nothing further.
 *     - if the stack is empty, there's no '(' left to match -> this ')' is
 *       invalid, mark index i for removal.
 * - After the pass, any indices STILL on the stack are '(' that never
 *   found a match -> mark all of them for removal too.
 * Finally, rebuild the string skipping every marked index.
 *
 * Why a Set for the removal marks and not another array/splice: we need
 * O(1) "is this index marked?" lookups while doing a single final pass to
 * rebuild the string - no repeated rescans, no shifting.
 *
 * WALKTHROUGH: s = "lee(t(c)o)de)"
 *   i=0..2  'l','e','e'          -> not parens, skip
 *   i=3     '('                  -> push 3            stack=[3]
 *   i=4     't'                  -> skip
 *   i=5     '('                  -> push 5            stack=[3,5]
 *   i=6     'c'                  -> skip
 *   i=7     ')'                  -> stack not empty, pop 5   stack=[3]
 *   i=8     'o'                  -> skip
 *   i=9     ')'                  -> stack not empty, pop 3   stack=[]
 *   i=10,11 'd','e'              -> skip
 *   i=12    ')'                  -> stack EMPTY -> toRemove = {12}
 *   end of string: stack is empty, nothing left to mark
 *   rebuild skipping index 12 -> "lee(t(c)o)de"  matches expected output
 *
 * Time: O(n) - one pass to mark, one pass to rebuild.
 * Space: O(n) - stack + removal set + result string, all bounded by string
 *        length (same reasoning as Max Stack's two arrays: these genuinely
 *        scale with n, unlike a fixed-size lookup object). No array copy
 *        of s is needed here since we only ever READ s[i] by index -
 *        strings already support that, so unlike the brute force (which
 *        mutates via splice and therefore needs a real array) this stays
 *        with the original string.
 */

/**
 * @param {string} s
 * @return {string}
 */
var minRemoveToMakeValidBruteForce = function (s) {
  let arr = s.split('');

  // PASS 1 (left to right): remove any ')' that has nothing open to match.
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === ')') {
      let balance = 0;
      for (let j = 0; j < i; j++) {
        if (arr[j] === '(') balance++;
        else if (arr[j] === ')') balance--;
      }
      if (balance <= 0) {
        arr.splice(i, 1); // invalid ')' - drop it, don't advance i
        continue;
      }
    }
    i++;
  }

  // PASS 2 (right to left): remove any leftover '(' that never got matched.
  i = arr.length - 1;
  while (i >= 0) {
    if (arr[i] === '(') {
      let balance = 0;
      for (let j = arr.length - 1; j > i; j--) {
        if (arr[j] === ')') balance++;
        else if (arr[j] === '(') balance--;
      }
      if (balance <= 0) {
        arr.splice(i, 1); // unmatched '(' - drop it
      }
    }
    i--;
  }

  return arr.join('');
};

/**
 * @param {string} s
 * @return {string}
 */
var minRemoveToMakeValidParentheses = function (s) {
  const stack = []; // indices of '(' still waiting for a matching ')'
  const toRemove = new Set();

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else if (s[i] === ')') {
      if (stack.length > 0) {
        stack.pop(); // matched with the most recently opened '('
      } else {
        toRemove.add(i); // nothing open to match this ')'
      }
    }
  }

  // any '(' left on the stack never found a match, add remaingin unmatched opening parentheses indices to the set
  while (stack.length > 0) {
    toRemove.add(stack.pop());
  }

  // build the result string
  let result = '';
  for (let i = 0; i < s.length; i++) {
    if (!toRemove.has(i)) result += s[i];
  }
  return result;
};