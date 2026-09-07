/**
155. Min Stack
Medium

Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the MinStack class:

MinStack() initializes the stack object.
void push(int value) pushes the element value onto the stack.
void pop() removes the element on the top of the stack.
int top() gets the top element of the stack.
int getMin() retrieves the minimum element in the stack.
You must implement a solution with O(1) time complexity for each function.

 

Example 1:

Input
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

Output
[null,null,null,null,-3,null,0,-2]

Explanation
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); // return -3
minStack.pop();
minStack.top();    // return 0
minStack.getMin(); // return -2
 

Constraints:

-231 <= val <= 231 - 1
Methods pop, top and getMin operations will always be called on non-empty stacks.
At most 3 * 104 calls will be made to push, pop, top, and getMin.

 */

/*
WHY IS THIS HARD?

Tracking a single `min` variable alongside the stack breaks on pop():
if the popped value WAS the min, you don't know the new min without
rescanning the rest of the stack -> O(n) per pop, violating the O(1) requirement.

Values can repeat (e.g. push 1, push 1, pop -> min must still be 1),
so whatever you track has to survive duplicates without rescanning.
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROACH 1 — Two Stacks in Lockstep  ← the standard interview answer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Keep a second stack, minStack, where minStack[i] = min(stack[0..i]).
Every push/pop touches BOTH stacks together, so they're always the
same length, and minStack's top is always "the min of everything
currently on the main stack" — no scanning required.

  push(val): stack.push(val); minStack.push(min(val, minStack top, or val if empty))
  pop():     pop both
  top():     stack's top
  getMin():  minStack's top

This solves duplicates for free: popping a repeated min just pops the
matching minStack entry, whatever it was — you never re-derive anything.

Time: O(1) per operation
Space: O(n) — minStack can grow 1:1 with stack (e.g. strictly decreasing pushes)
*/
class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
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
        this.minStack.pop();
    }

    top() {
        return this.stack[this.stack.length - 1];
    }

    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
}

/*
WALKTHROUGH — matches the example above
  push(-2): stack=[-2]      minStack=[-2]
  push(0):  stack=[-2,0]    minStack=[-2,-2]   min(0,-2)=-2
  push(-3): stack=[-2,0,-3] minStack=[-2,-2,-3]
  getMin()  -> -3
  pop():    stack=[-2,0]    minStack=[-2,-2]
  top()     -> 0
  getMin()  -> -2   ✓ matches expected output
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROACH 2 — Single Stack of [value, minSoFar] Pairs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same idea as Approach 1, just stored as one array of pairs instead of
two parallel arrays. Identical time/space complexity — purely a style choice.

Time: O(1) per operation
Space: O(n) — one extra number stored per element
*/
class MinStack2 {
    constructor() {
        this.stack = []; // each entry: [value, minSoFarIncludingThisValue]
    }

    push(val) {
        const currentMin = this.stack.length === 0
            ? val
            : Math.min(val, this.stack[this.stack.length - 1][1]);
        this.stack.push([val, currentMin]);
    }

    pop() {
        this.stack.pop();
    }

    top() {
        return this.stack[this.stack.length - 1][0];
    }

    getMin() {
        return this.stack[this.stack.length - 1][1];
    }
}


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROACH 3 (BONUS) — O(1) EXTRA SPACE via stored differences
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Follow-up interviewers sometimes ask: "Can you avoid the second stack?"

Instead of pushing `val`, push `val - min` (the diff from the running min),
and track `min` as a single number:

  push(val):
    if stack is empty: min = val; push(0)
    else:
      diff = val - min
      push(diff)
      if diff < 0: min = val        // val became the new min

  pop():
    diff = stack.pop()
    if diff < 0: min = min - diff   // undo: recover the PREVIOUS min
    // (if diff >= 0, popped value wasn't the min, so `min` is unchanged)

  top():
    diff = stack top
    return diff < 0 ? min : min + diff

  getMin(): return min

Trade-off: saves the second array (O(1) extra space beyond the stack itself),
but is easy to get wrong and risks integer overflow on `val - min` for
extreme values. Mention this approach verbally; only implement it if the
interviewer explicitly pushes for O(1) extra space.

Time: O(1) per operation
Space: O(1) extra (just the `min` variable; no second stack)
*/
class MinStack3 {
    constructor() {
        this.stack = [];
        this.min = null;
    }

    push(val) {
        if (this.stack.length === 0) {
            this.min = val;
            this.stack.push(0);
        } else {
            const diff = val - this.min;
            this.stack.push(diff);
            if (diff < 0) this.min = val;
        }
    }

    pop() {
        const diff = this.stack.pop();
        if (diff < 0) this.min = this.min - diff; // recover previous min
    }

    top() {
        const diff = this.stack[this.stack.length - 1];
        return diff < 0 ? this.min : this.min + diff;
    }

    getMin() {
        return this.min;
    }
}
