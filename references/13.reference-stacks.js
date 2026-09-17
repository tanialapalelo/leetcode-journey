/*
STACKS - REFERENCE

A stack is Last In, First Out (LIFO). Think of a stack of plates: you
can only add or remove from the top. You never reach into the middle.

  push(4) ->  [1, 2, 3, 4]
                       ^ top (add/remove here only)
  pop()   ->  [1, 2, 3]     returns 4

JS arrays work fine as stacks. push() adds to the top, pop() removes
from the top. Both are O(1) because they only touch the end of the
array, no shifting involved.

  push (add to top)     O(1)
  pop (remove top)      O(1)
  peek (read top)       O(1), arr[arr.length - 1]
  isEmpty                O(1), arr.length === 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO RECOGNIZE A STACK PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problems rarely say "use a stack" outright. Look for:

  - Words like "matching pairs", "nested", "correct order", "undo".
    Something wraps around or depends on something opened earlier.
  - You keep asking "which one has to be resolved or closed first?"
    Example: "([)]" is invalid, but a counter alone can't tell you
    that (1 of each bracket, counts balance perfectly). Tracking "the
    most recently opened, still unclosed bracket" catches it right away.
  - Ask yourself: do I need to remember the most recent unresolved
    item and resolve it before older ones? If yes, use a stack. If you
    only need counts, not order, a counter or hashmap is enough.

Common shapes:
  - Matching or validating brackets, tags, parentheses
  - Removing adjacent duplicates, undo style processing
  - Evaluating expressions (calculator, Reverse Polish Notation)
  - DFS. The call stack itself is a stack, see
    8.reference-recursion-and-backtracking.js
  - "Next greater/smaller element" -> monotonic stack (own section below)
  - Designing a structure with O(1) push/pop/getMin, like Min or Max Stack

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. BASIC STACK OPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
const stack = [];
stack.push(1);              // [1]
stack.push(2);              // [1, 2]
stack.push(3);              // [1, 2, 3]
stack.pop();                 // returns 3, stack is now [1, 2]
stack[stack.length - 1];     // peek: 2, no removal
stack.length === 0;          // isEmpty check

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. VALID PARENTHESES, the canonical stack problem
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input: "([)]"  -> false (crosses over)
Input: "([])"  -> true

Every closing bracket has to match the most recently opened bracket
that hasn't been closed yet. That "most recent" requirement is exactly
what a stack gives you for free.

  - See an open bracket  -> push it
  - See a close bracket  -> pop the stack, check it matches
  - End of string        -> stack must be empty (nothing left unclosed)
*/
function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', ']': '[', '}': '{' };

    for (const ch of s) {
        if (ch === '(' || ch === '[' || ch === '{') {
            stack.push(ch);
        } else {
            // closing bracket: top of stack must be its matching opener
            if (stack.pop() !== pairs[ch]) return false;
        }
    }
    return stack.length === 0; // nothing left unclosed
}
// Time: O(n)  Space: O(n)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. MIN STACK / MAX STACK, design problems
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Goal: push, pop, top, AND getMin, all in O(1).

Naive idea: scan the whole stack for the min every time getMin() is
called. That's O(n), too slow.

Better idea: keep a second stack that tracks the min "as of" each
push. Every push, also push the min so far onto the min stack (either
the same value again, or the new element if it's smaller). Every pop,
pop both stacks together so they stay in lockstep. minStack's top is
then always the correct min for whatever's currently in the main stack.
*/
class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = []; // minStack[i] = min of stack[0..i]
    }

    push(val) {
        this.stack.push(val);
        const currentMin = this.minStack.length === 0
            ? val
            : Math.min(val, this.minStack[this.minStack.length - 1]);
        this.minStack.push(currentMin);
    }

    pop() {
        this.stack.pop();
        this.minStack.pop(); // keep both stacks in lockstep
    }

    top() {
        return this.stack[this.stack.length - 1];
    }

    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
}
// All ops: Time O(1)  Space: O(n), the extra minStack doubles memory

/*
Max Stack works the same way but also needs popMax() (remove the max,
not just read it). With a plain array that means scanning to find the
max's index, so popMax is O(n) unless you reach for a fancier structure
(doubly linked list plus a sorted map). Design problems like this are
where you trade time for space, or accept one slower operation to keep
the others O(1).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. MONOTONIC STACK, "next greater/smaller element"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A monotonic stack only ever holds values in strictly increasing (or
decreasing) order, top to bottom. Whenever a new value would break
that order, pop everything smaller (or larger) before pushing, and
each pop is a chance to answer "what's the next greater/smaller
element for that popped value?"

Problem: Daily Temperatures. For each day, how many days until a
warmer temperature?

Keep a decreasing stack of indices (not values). While the current
temperature is warmer than the temperature at the index on top of the
stack, that's the answer for that index, pop it and record the distance.
*/
function dailyTemperatures(temperatures) {
    const answer = new Array(temperatures.length).fill(0);
    const stack = []; // stack of indices, temperatures[stack] stays decreasing

    for (let i = 0; i < temperatures.length; i++) {
        // current day is warmer than the day on top of the stack?
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            answer[prevIndex] = i - prevIndex; // distance to the warmer day
        }
        stack.push(i);
    }
    return answer; // indices left on stack never found a warmer day, stay 0
}
// Time: O(n), each index is pushed once and popped at most once
// Space: O(n)

/*
Why is this O(n) and not O(n^2) even though there's a nested while
loop? Because every index gets pushed exactly once and popped at most
once, across the entire run of the function, not once per outer
iteration. Total work across all pops is bounded by n, not n times n.
This "amortized" argument is the signature of monotonic stack solutions.

Other monotonic stack problems: Car Fleet (decreasing stack of arrival
times to find which cars merge into a fleet), Largest Rectangle in
Histogram, Next Greater Element.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. EVALUATE REVERSE POLISH NOTATION, expression evaluation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RPN puts operators after their operands: "2 1 + 3 *" means (2+1)*3. No
parentheses needed, the order alone tells you what to compute.

  See a number    -> push it
  See an operator -> pop the top two numbers, apply the operator,
                     push the result back. Order matters for - and /:
                     the second value popped is the left operand, the
                     first popped is the right operand
*/
function evalRPN(tokens) {
    const stack = [];
    const ops = new Set(['+', '-', '*', '/']);

    for (const token of tokens) {
        if (ops.has(token)) {
            const b = stack.pop(); // right operand (pushed most recently)
            const a = stack.pop(); // left operand
            if (token === '+') stack.push(a + b);
            else if (token === '-') stack.push(a - b);
            else if (token === '*') stack.push(a * b);
            else stack.push(Math.trunc(a / b)); // truncate toward zero
        } else {
            stack.push(Number(token));
        }
    }
    return stack.pop(); // one value left, the final result
}
// Time: O(n)  Space: O(n)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. MINIMUM REMOVE TO MAKE VALID PARENTHESES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Variant of Valid Parentheses where instead of just returning true or
false, you have to delete the minimum characters to make the string
valid.

  Pass 1 (left to right): push the index of every '(' onto a stack.
    On ')', if the stack has an unmatched '(' waiting, pop it (this
    ')' is matched). Otherwise this ')' has no partner, mark it for
    removal right away.
  After pass 1: whatever indices are still on the stack are '(' that
    never got matched. Mark those for removal too.
  Pass 2: rebuild the string skipping every marked index.

This shows the general stack pattern for "validate and repair", not
just "validate": the stack holds indices so you know exactly what to
delete, not just whether the string is valid.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATTERNS & TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Stack of values: use when you need the values themselves back (RPN,
  Min Stack)
- Stack of indices: use when you need positions/distances, or need to
  come back and edit the original array/string (Daily Temperatures,
  Minimum Remove to Make Valid Parentheses)
- Always ask what happens when the stack is empty and you try to pop.
  Usually it means "no match found" (invalid string, or no next
  greater element) rather than a crash. Guard with
  `stack.length > 0` first
- Monotonic stack is O(n) even with a nested while loop, because total
  pushes/pops across the whole run is bounded by n (amortized O(1)
  per element)
- The call stack during recursion is a stack too, see
  8.reference-recursion-and-backtracking.js for that angle

Complexities (array-backed stack):
  push / pop / peek   O(1)
  search (is X in it) O(n), no shortcuts, must scan
  Space               O(n)
*/
