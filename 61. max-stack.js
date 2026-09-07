/*
Leetcode premium

716. Max Stack
Design a max stack that supports push, pop, top, peekMax and popMax.

1. push(x) -- push element x onto stack
2. pop() -- remove the element on top of the stack and return it
3. top() -- get the element on the tSop
4. peekMax() -- retrieve the max element in the stack
5. popMax() -- retrieve the max element in the stack, and remove it. if you find more than one max elements, only remove the top-most one.

*/

/*
APPROACH 1: BRUTE FORCE (plain array)

push/pop/top work like a normal stack. For peekMax/popMax, just scan the
whole array to find the largest value. For popMax specifically, since
there might be duplicates of the max, scan from the END (top) backwards
so you find and remove the TOPMOST occurrence, per the spec.

Time:  push O(1), pop O(1), top O(1), peekMax O(n), popMax O(n)
Space: O(n) for the stack
*/

var BruteForceMaxStack = function() {
    this.stack = [];
};

BruteForceMaxStack.prototype.push = function(x) {
    this.stack.push(x);
};

BruteForceMaxStack.prototype.pop = function() {
    return this.stack.pop();
};

BruteForceMaxStack.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

BruteForceMaxStack.prototype.peekMax = function() {
    return Math.max(...this.stack);
};

BruteForceMaxStack.prototype.popMax = function() {
    const max = this.peekMax();
    // scan from the top down so we remove the TOPMOST max, not the first one
    for (let i = this.stack.length - 1; i >= 0; i--) {
        if (this.stack[i] === max) {
            this.stack.splice(i, 1); // splice shifts everything after i -> O(n)
            return max;
        }
    }
};

/*
APPROACH 2: TWO STACKS (from the video)

Why a single stack + Math.max() scan isn't enough for O(1) peekMax:
same reasoning as Min Stack - a plain stack has no memory of what the max
WAS at every point in its history, so you'd have to rescan every time.

The fix (same trick as Min Stack, but with a second parallel stack instead
of extra fields per node): keep TWO stacks that always have the same
height, growing and shrinking together.
  - stack:    the real values, in push order (what the user actually pushed)
  - maxStack: at each position, the max of EVERYTHING in `stack` from the
              bottom up to that same position

Because they always move together (push both / pop both), maxStack.top()
is always "the max of everything currently in the stack" - exactly like
Min Stack's node.min, just stored as a parallel array entry instead of a
field on a linked node.

WALKTHROUGH - push(5), push(1), push(5), push(3), then popMax()

push(5): maxStack empty -> max = 5
    stack:    [5]
    maxStack: [5]

push(1): max = Math.max(1, top of maxStack = 5) = 5
    stack:    [5, 1]
    maxStack: [5, 5]

push(5): max = Math.max(5, top of maxStack = 5) = 5
    stack:    [5, 1, 5]
    maxStack: [5, 5, 5]

push(3): max = Math.max(3, top of maxStack = 5) = 5
    stack:    [5, 1, 5, 3]
    maxStack: [5, 5, 5, 5]

peekMax() -> maxStack top -> 5   (O(1), no scanning)

popMax():
  1. max = peekMax() = 5
  2. pop from the TOP, one at a time, into a buffer, UNTIL top() === max
     - top() is 3, not 5 -> pop it, buffer = [3]
       stack: [5, 1, 5]  maxStack: [5, 5, 5]
     - top() is 5, matches max -> stop
  3. pop() once more to actually remove that max element
       stack: [5, 1]  maxStack: [5, 5]
  4. push everything from the buffer back on, in reverse (LIFO undoes LIFO)
     - push(3) -> stack: [5, 1, 3]  maxStack: [5, 5, 5]
  5. return max (5)

Notice which "5" got removed: the SECOND one (closer to the top), not the
first - matching the spec's "remove the top-most one if duplicates exist".
That falls out naturally because we always pop from the top first.

Why popMax is O(n) and not O(1):
maxStack tells you WHAT the max value is, but not WHERE it sits in the
stack. To physically remove it you must first pop (and later restore)
every element above it - that "detour" is the O(n) cost. Contrast with
Min Stack, which never needs to remove anything from the middle - it only
ever pops from the true top, so it stays O(1) for every operation.

Time:
  push    O(1) - one push to each array, no loop, no scanning
  pop     O(1) - one pop from each array, no loop, no scanning
  top     O(1) - direct index read (stack[length - 1])
  peekMax O(1) - direct index read (maxStack[length - 1]) - this is the
                 whole point of maintaining maxStack in the first place
  popMax  O(n) worst case - the buffer while-loop above can walk all the
                 way down to the bottom of the stack (e.g. the max is the
                 very first element ever pushed and everything else is
                 smaller), so it's proportional to how many elements sit
                 above the max, up to n

Space: O(n)
  `stack` and `maxStack` grow together 1-for-1 on every push, so at n
  elements pushed you're holding 2n numbers total. This IS a real "2n"
  situation (unlike the `pairs` object in Valid Parentheses, which stayed
  a fixed 3 entries no matter how big the input got - that one was O(1),
  not O(n)). Here, BOTH arrays scale linearly with the input, so:
      O(n) [stack] + O(n) [maxStack] = O(2n) = O(n)
  dropping the constant multiplier (2) is valid because Big-O only cares
  about the growth trend as n gets large, not the exact multiplier.
*/

var MaxStack = function() {
    this.stack = [];
    this.maxStack = [];
};

/**
 * @param {number} x
 * @return {void}
 */
MaxStack.prototype.push = function(x) {
    const max = this.maxStack.length === 0
        ? x
        : Math.max(x, this.maxStack[this.maxStack.length - 1]);

    this.stack.push(x);
    this.maxStack.push(max);
};

/**
 * @return {number}
 */
MaxStack.prototype.pop = function() {
    this.maxStack.pop(); // must pop in lockstep or maxStack goes stale (see comment above)
    return this.stack.pop();
};

/**
 * @return {number}
 */
MaxStack.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MaxStack.prototype.peekMax = function() {
    return this.maxStack[this.maxStack.length - 1];
};

/**
 * @return {number}
 */
MaxStack.prototype.popMax = function() {
    const max = this.peekMax();
    const buffer = [];

    // set aside everything above the max, preserving their order to restore later
    while (this.top() !== max) {
        buffer.push(this.pop());
    }

    this.pop(); // actually remove the max element itself

    // put everything back, undoing the buffer in reverse (last set aside, first restored)
    while (buffer.length > 0) {
        this.push(buffer.pop());
    }

    return max;
}; 
