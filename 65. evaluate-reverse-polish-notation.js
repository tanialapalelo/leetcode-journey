/**
 * 150. Evaluate Reverse Polish Notation
Medium

You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation.

Evaluate the expression. Return an integer that represents the value of the expression.

Note that:

The valid operators are '+', '-', '*', and '/'.
Each operand may be an integer or another expression.
The division between two integers always truncates toward zero.
There will not be any division by zero.
The input represents a valid arithmetic expression in a reverse polish notation.
The answer and all the intermediate calculations can be represented in a 32-bit integer.
 

Example 1:

Input: tokens = ["2","1","+","3","*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9
Example 2:

Input: tokens = ["4","13","5","/","+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6
Example 3:

Input: tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
Output: 22
Explanation: ((10 * (6 / ((9 + 3) * -11))) + 17) + 5
= ((10 * (6 / (12 * -11))) + 17) + 5
= ((10 * (6 / -132)) + 17) + 5
= ((10 * 0) + 17) + 5
= (0 + 17) + 5
= 17 + 5
= 22
 

Constraints:

1 <= tokens.length <= 104
tokens[i] is either an operator: "+", "-", "*", or "/", or an integer in the range [-200, 200].
 */

/**
 * APPROACHES:
 * 1. brute force
 * 2. stack to keep track of the integers and the operators
 */

/*
UNDERSTANDING RPN (Reverse Polish Notation)

Normal ("infix") notation writes the operator BETWEEN the two operands:
  2 + 1  ->  operator is between 2 and 1

RPN ("postfix") writes the operator AFTER its two operands:
  2 1 +  ->  same meaning: 2 + 1

Why this matters: in RPN, by the time you reach an operator token, the two
values it needs to combine are ALWAYS the two values immediately preceding
it (no parentheses, no operator precedence rules needed at all - the order
tokens appear in already encodes the order of operations). That's exactly
what makes RPN nice for a computer (and a stack) to evaluate directly.

Example 1: ["2","1","+","3","*"]  =  ((2 + 1) * 3)  =  9
  - "+" combines the two numbers right before it: 2 and 1 -> 3
  - now we effectively have ["3","3","*"] -> "*" combines 3 and 3 -> 9

Division truncates toward zero (not Math.floor!): 13 / 5 = 2 (fine, same
either way), but e.g. -7 / 2 must give -3, not -4 - Math.trunc() does this,
Math.floor() would not.
*/

/*
APPROACH 1: BRUTE FORCE (repeatedly collapse the first operator found)

Keep scanning the token array from the start looking for the first
operator. Because of how RPN works, that operator's two operands are
always the two tokens immediately before it. Compute the result, replace
those 3 tokens with the single result, and repeat until only one token
(the final answer) is left.

This is brute force because every collapse forces a full re-scan from the
start of the (shrinking) array - the same "redo work instead of remembering
state" idea as the brute-force Valid Parentheses solution.

Time:  O(n^2) - up to ~n/2 collapses, each doing an O(n) scan + O(n) splice
Space: O(n) for the working copy of the tokens array
*/

function isOperator(token) {
    return token === '+' || token === '-' || token === '*' || token === '/';
}

function applyOperator(a, b, op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return Math.trunc(a / b); // truncate toward zero, not Math.floor
    }
}

/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPNBruteForce = function(tokens) {
    const arr = tokens.slice(); // don't mutate the caller's array

    while (arr.length > 1) {
        const opIndex = arr.findIndex(isOperator);
        const a = Number(arr[opIndex - 2]);
        const b = Number(arr[opIndex - 1]);
        arr.splice(opIndex - 2, 3, String(applyOperator(a, b, arr[opIndex])));
    }

    return Number(arr[0]);
};

/*
APPROACH 2: OPTIMAL (single pass with a stack)

Walk the tokens left to right:
  - a number -> push it, it's an operand waiting to be used.
  - an operator -> pop the top TWO numbers off the stack. The one popped
    LAST-IN (top of stack) is the SECOND operand (b), the one popped right
    after is the FIRST operand (a) - order matters for - and /. Compute
    `a OP b`, push the result back as a new operand for future operators.

By the end, exactly one value remains on the stack: the final answer. This
works in one linear pass because RPN guarantees every operator's operands
are already fully resolved (pushed) by the time we reach it - no need to
look ahead or backtrack.

Time:  O(n) - one pass over the tokens, push/pop are O(1)
Space: O(n) worst case - if all tokens were numbers, the stack would hold
       every one of them before any operator ever appears
*/

/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
    const stack = [];

    for (const token of tokens) {
        if (!isOperator(token)) {
            stack.push(Number(token));
            continue;
        }
        const b = stack.pop(); // most recently pushed -> second operand
        const a = stack.pop(); // first operand
        stack.push(applyOperator(a, b, token));
    }

    return stack.pop();
};

