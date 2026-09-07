/*
20. Valid Parentheses
Easy

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.
Every close bracket has a corresponding open bracket of the same type.
 

Example 1:

Input: s = "()"

Output: true

Example 2:

Input: s = "()[]{}"

Output: true

Example 3:

Input: s = "(]"

Output: false

Example 4:

Input: s = "([])"

Output: true

Example 5:

Input: s = "([)]"

Output: false

 

Constraints:

1 <= s.length <= 104
s consists of parentheses only '()[]{}'.

*/

// This question matters because there's real example of compiler to check if parentheses is valid or not

/*
APPROACH 1: BRUTE FORCE (repeatedly remove matching pairs)

Idea: a valid string can always be fully "collapsed" to empty by repeatedly
deleting any adjacent pair "()", "[]" or "{}" - because a matching pair
that's already next to each other can never be needed to match anything
else, it's safe to remove it and keep collapsing what's left.

Keep scanning the string and removing one occurrence of "()"/"[]"/"{}" at a
time. If nothing more can be removed and the string isn't empty, it's
invalid (leftover unmatched / wrongly ordered brackets).

This is brute force because every removal forces a re-scan of the (shrinking)
string from the start - we're redoing work instead of remembering state as
we go (which is what the stack does).

Time:  O(n^2) - up to n/2 removal passes, each pass scans up to O(n) chars
Space: O(n) - each .replace() call creates a new string
*/

/**
 * @param {string} s
 * @return {boolean}
 */
var isValidBruteForce = function(s) {
    while (s.includes('()') || s.includes('[]') || s.includes('{}')) {
        s = s.replace('()', '').replace('[]', '').replace('{}', '');
    }
    return s.length === 0;
};

/*
APPROACH 2: OPTIMAL

Why NOT a simple counter:
A counter (or 3 counters, one per bracket type) can only tell you the
COUNT of opens vs closes matches, it has no memory of ORDER. E.g. "([)]"
has one of each bracket (counts balance perfectly), but it's invalid
because the ")" closes "(" before "[" was closed - the counter can't see
that the closing order is wrong. We need to know "what is the MOST RECENT
unclosed open bracket", so we need a LIFO structure -> a stack.

Use a stack. Walk the string left to right:
  - if char is an OPEN bracket, push it onto the stack.
  - if char is a CLOSE bracket, it must match the bracket on top of the
    stack (pop and compare). If the stack is empty or the popped bracket
    doesn't match, the string is invalid.
At the end, the string is valid only if the stack is empty (every open
bracket found its close, in the right order).

A map of close -> matching open makes the lookup O(1).

Time:  O(n) - one pass over the string
Space: O(n) - worst case (all opens) the stack holds every character
*/

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // store open brackets, O(1) constant because does not grow with n
    const pairs = {
        ')': '(',
        ']': '[',
        '}': '{'
    }

    // stack (can be implemented with array / linked list) since order matters, 
    // this stack is O(n) since worst case can store all open brackets only as much as n
    const stack = [];

    for(const char of s){
        // open brackets validation
        if(!(char in pairs)){
            stack.push(char);
            continue;
        }
        
        // close brackets validation where char is a closing bracket: top of stack must be its matching open
        if (stack.pop() !== pairs[char]) return false;
    }
    // all stack needs to be checked, true if all checked and passed previous validations
    return stack.length === 0;

};