/*
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
APPROACH 1: BRUTE FORCE

Just use a plain array as the stack. push/pop/top are O(1),
but getMin() has to scan the whole stack every time to find the minimum.

Time:  push O(1), pop O(1), top O(1), getMin O(n)
Space: O(n) for the stack itself
*/

var BruteForceMinStack = function() {
    this.stack = [];
};

BruteForceMinStack.prototype.push = function(value) {
    this.stack.push(value);
};

BruteForceMinStack.prototype.pop = function() {
    this.stack.pop();
};

BruteForceMinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

BruteForceMinStack.prototype.getMin = function() {
    let min = this.stack[0];
    for (const val of this.stack) {
        if (val < min) min = val;
    }
    return min;
};

/*
APPROACH 2: OPTIMAL (singly linked list, matches the video)

The stack IS a singly linked list. "this.head" always points to the TOP of
the stack (the most recently pushed node). There is no array at all.

Each Node holds three fields:
  - val:  the value being pushed
  - min:  the minimum of the ENTIRE stack as it exists right after this node
          was pushed (i.e. Math.min(val, the min stored in the node below it))
  - next: pointer to the node that was on top BEFORE this one (the node
          directly "below" it in the stack)

Why push is correct:
  Before pushing, this.head.min already equals "the minimum of everything
  currently in the stack" (that's the invariant we maintain). So the new
  node just needs Math.min(newVal, this.head.min) and it inherits a correct
  min for the new, bigger stack. First node ever pushed has no min to
  compare against, so its min is just itself.

Why pop is correct (no recomputation needed):
  this.head = this.head.next simply throws away the top node entirely,
  including its min. The node that becomes the new head is the one that was
  pushed right before it, and ITS min field was already computed to be
  correct for "everything below/including it" back when IT was pushed.
  So the old minimum reappears "for free".

WALKTHROUGH — push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()

1. push(-2): head is null -> head = Node(val=-2, min=-2, next=null)
     head -> [-2, min:-2] -> null

2. push(0): current head.min is -2 -> new min = Math.min(0, -2) = -2
     head -> [0, min:-2] -> [-2, min:-2] -> null

3. push(-3): current head.min is -2 -> new min = Math.min(-3, -2) = -3
     head -> [-3, min:-3] -> [0, min:-2] -> [-2, min:-2] -> null

4. getMin(): return head.min -> -3   (matches expected output)

5. pop(): head = head.next -> the [-3, min:-3] node is discarded completely
     head -> [0, min:-2] -> [-2, min:-2] -> null

6. top(): return head.val -> 0   (matches expected output)

7. getMin(): return head.min -> -2   (matches expected output)
   Nothing was recalculated in step 7 — the -2 was sitting there in the
   [0, min:-2] node since step 2, waiting to become head again after pop().

Time:  push O(1), pop O(1), top O(1), getMin O(1)
Space: O(n) — one Node per element; each Node has 1 extra field (min)
       compared to a plain linked-list stack, so still O(n) overall
*/

function Node(val, min, next) {
    this.val = val;
    this.min = min;
    this.next = next;
}

var MinStack = function() {
    this.head = null; // top of stack
};

/** 
 * @param {number} value
 * @return {void}
 */
MinStack.prototype.push = function(value) {
    if (this.head === null) {
        this.head = new Node(value, value, null);
    } else {
        this.head = new Node(value, Math.min(value, this.head.min), this.head);
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    this.head = this.head.next;
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    return this.head.val;
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.head.min;
};

/** 
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(value)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
