/*
QUEUES - REFERENCE

A queue is First In, First Out (FIFO). Think of a line at a shop:
whoever got in line first gets served first. You add at the back and
remove from the front, never from the middle.

  enqueue(4) ->  [1, 2, 3, 4]
                  ^front         ^back (add here)
  dequeue()  ->  [2, 3, 4]   returns 1 (removed from front)

FLAVORS OF QUEUE covered in this file:
  1-2. Plain queue, array-backed and linked-list-backed, used for BFS
  3.   Multi-source BFS, seeding a plain queue with several starts
  4.   Implement Queue using Stacks, a plain FIFO queue built a
       different way
  5.   Circular queue, a fixed-size array that wraps instead of shifts
  6.   Deque, add/remove from BOTH ends, used for sliding window max

Not a FIFO structure, but often confused with one:
  Priority queue (heap), the item that comes out is whichever has the
  highest priority, not whichever arrived first. See
  10.reference-heaps.js for that one.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. BASIC QUEUE OPS (array-backed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JS arrays can act as a queue with push()/shift(), but read the
complexity carefully below. shift() is not free like pop() is.

  enqueue (add to back)     O(1)  -> arr.push(x)
  dequeue (remove front)    O(n)  -> arr.shift()  (slow, see why below)
  peek (read front)         O(1)  -> arr[0]
  isEmpty                    O(1)  -> arr.length === 0
*/
const queue = [];
queue.push(1);    // enqueue: [1]
queue.push(2);    // enqueue: [1, 2]
queue.push(3);    // enqueue: [1, 2, 3]
queue.shift();    // dequeue: returns 1, queue is [2, 3]
queue[0];         // peek front: 2

/*
WHY IS shift() O(n)?
Arrays in memory are contiguous, so removing index 0 means every other
element has to physically shift one slot to the left to close the gap.
push()/pop() only touch the end, so nothing else has to move. That's
why they're O(1) but shift()/unshift() are O(n).

In interviews, using shift() on a plain array is usually accepted (the
array is small, or the interviewer cares about the pattern more than
the constant factor). For real production code, or when n is large and
you need a genuinely O(1) dequeue, use a proper structure:
  - A doubly linked list (head = front, tail = back, see
    7.reference-linked-lists.js). Both enqueue and dequeue become O(1)
    because you're only touching head/tail pointers, no shifting.
  - A circular buffer / ring buffer with head and tail indices.
  - In JS specifically, some people simulate this with two pointers
    into an array (an index for "front" instead of physically removing
    elements), trading a bit of unused memory for O(1) dequeue.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO RECOGNIZE A QUEUE PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  - "level order", "level by level", "shortest path", "minimum steps".
    These all mean "explore everything at distance 1 before anything
    at distance 2". That layer-by-layer spreading is what a queue
    naturally gives you (FIFO processes things in the order you
    discovered them).
  - Ask yourself: do I need to process items in the exact order I
    found them, spreading outward evenly? If yes, use a queue, usually
    for BFS. If you need the most recently found item first instead,
    that's a stack, usually for DFS, see 13.reference-stacks.js.
  - Designing a structure with a "first come first served" contract,
    or building one structure out of another (queue from stacks,
    stack from queues, sliding window maximum with a deque).

Common shapes:
  - BFS on a tree (level-order traversal) or graph (shortest path in
    an unweighted graph), see 9.reference-trees-and-graphs.js
  - Multi-source BFS (Rotting Oranges: start with all rotten oranges
    already in the queue, not just one)
  - Sliding window maximum using a deque (double-ended queue) to keep
    candidates in decreasing order, see 5.reference-sliding-window.js
  - Task scheduling / rate limiting simulations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. BFS, the main reason queues matter in DSA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BFS explores level by level: everything 1 step away, then everything
2 steps away, and so on. A queue is what makes that order happen
naturally. You enqueue neighbors as you discover them, and because of
FIFO, you always finish the current level before starting the next one.

  Level 0: [A]
  Level 1: [B, C]        (A's neighbors)
  Level 2: [D, E, F]     (B and C's neighbors)

  queue starts as [A]
  pop A, enqueue B,C -> queue = [B, C]
  pop B, enqueue D,E -> queue = [C, D, E]
  pop C, enqueue F   -> queue = [D, E, F]
  level 1 (B,C) fully drains before level 2 (D,E,F) starts
*/
function bfs(startNode, getNeighbors) {
    const visited = new Set([startNode]);
    const queue = [startNode];
    const order = [];

    while (queue.length > 0) {
        const node = queue.shift(); // dequeue: front of the line
        order.push(node);

        for (const neighbor of getNeighbors(node)) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor); // mark visited at ENQUEUE time,
                queue.push(neighbor);  // not at dequeue time, avoids
            }                          // enqueueing the same node twice
        }
    }
    return order;
}
// Time: O(V + E)  Space: O(V) for the queue + visited set

/*
Why mark visited when you enqueue, not when you dequeue? If you wait
until dequeue to mark it, the same node can be pushed onto the queue
multiple times by different neighbors before any of those copies get
processed. That's wasted work, and in a graph with cycles it can even
loop forever. Marking at enqueue time guarantees each node enters the
queue exactly once.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. MULTI-SOURCE BFS, Rotting Oranges pattern
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Instead of starting from one node, seed the queue with all starting
points at once (all rotten oranges), then run BFS normally. Because
every starting point begins at "distance 0" together, the level-by-
level spread still correctly computes the shortest distance from the
nearest source to every other cell. You get "minimum time until
everything is reached" without running BFS separately per source.

  queue = [all rotten orange positions]   (seed with multiple starts)
  track level/minute count as you drain each full layer
  each pop that finds a fresh orange rots it and enqueues it

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. IMPLEMENT QUEUE USING STACKS, two reversals cancel out
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A single stack always reverses order (LIFO). Reverse that reversal a
second time and you're back to the original FIFO order. That's the
whole idea: use two stacks so the second one undoes the first's
reversal.

  inStack:  push() always goes here, O(1), nothing to rearrange.
  outStack: pop()/peek() always read from here.

  Only move elements from inStack to outStack when outStack is empty.
  Moving reverses the order, so after the move, the oldest element
  (the true front of the queue) ends up on top of outStack.
*/
class MyQueue {
    constructor() {
        this.inStack = [];
        this.outStack = [];
    }

    push(x) {
        this.inStack.push(x); // always O(1)
    }

    _transfer() {
        if (this.outStack.length === 0) {
            while (this.inStack.length > 0) {
                this.outStack.push(this.inStack.pop());
            }
        }
    }

    pop() {
        this._transfer();
        return this.outStack.pop();
    }

    peek() {
        this._transfer();
        return this.outStack[this.outStack.length - 1];
    }

    empty() {
        return this.inStack.length === 0 && this.outStack.length === 0;
    }
}
/*
Time: O(1) amortized per operation. push is always O(1); pop/peek are
O(1) amortized because each element gets transferred from inStack to
outStack exactly once in its whole lifetime (push, sit in inStack,
transfer once, sit in outStack, get popped). Spread that one-time O(n)
transfer cost across all the operations and it averages out to O(1)
per operation, even though any single pop() right after a big batch of
pushes can look like O(n).
Space: O(n) total across both stacks.

The reverse problem, Implement Stack using Queues, flips this idea:
now you need the most recently added element accessible first, using
only FIFO structures. One approach: after enqueueing a new element,
rotate the queue (dequeue and re-enqueue) size-1 times so the new
element ends up at the front. That makes push O(n) but pop/top O(1).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. CIRCULAR QUEUE (RING BUFFER), fixing shift()'s O(n) without a linked list
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stays array-backed, but instead of physically removing index 0 on
every dequeue, track a `front` index and move it forward instead.
When `front` or `rear` walks off the end of the fixed-size array, it
wraps back to index 0 with modulo, so freed slots get reused. That
wraparound is the "circular" part: no shifting, no unbounded growth.

Walkthrough, capacity 5, array [_,_,_,_,_], front=0, rear=-1, count=0:

  enqueue(1): rear=0             -> [1,_,_,_,_]  count=1
  enqueue(2): rear=1             -> [1,2,_,_,_]  count=2
  enqueue(3): rear=2             -> [1,2,3,_,_]  count=3
  dequeue():  returns 1, front=1 -> [_,2,3,_,_]  count=2
  dequeue():  returns 2, front=2 -> [_,_,3,_,_]  count=1
  enqueue(4): rear=3             -> [_,_,3,4,_]  count=2
  enqueue(5): rear=4             -> [_,_,3,4,5]  count=3
  enqueue(6): rear=(4+1)%5=0     -> [6,_,3,4,5]  count=4
              wraps to index 0 because dequeue already freed it

front === rear is ambiguous by itself (could mean empty OR full), so
track `count` separately to tell the two apart.
*/
class CircularQueue {
    constructor(capacity) {
        this.data = new Array(capacity);
        this.capacity = capacity;
        this.front = 0;
        this.rear = -1;
        this.count = 0;
    }

    enqueue(val) {
        if (this.count === this.capacity) return false; // full
        this.rear = (this.rear + 1) % this.capacity;
        this.data[this.rear] = val;
        this.count++;
        return true;
    }

    dequeue() {
        if (this.count === 0) return undefined; // empty
        const val = this.data[this.front];
        this.front = (this.front + 1) % this.capacity;
        this.count--;
        return val;
    }

    peekFront() {
        return this.count === 0 ? undefined : this.data[this.front];
    }

    isFull() {
        return this.count === this.capacity;
    }

    isEmpty() {
        return this.count === 0;
    }
}
// enqueue / dequeue / peek: O(1)  Space: O(capacity), fixed and reused

/*
This is LeetCode 622, Design Circular Queue. Used anywhere a fixed-
size rolling buffer fits: streaming data windows, producer/consumer
buffers, round-robin CPU scheduling.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. DEQUE (DOUBLE-ENDED QUEUE), add/remove from either end
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A deque relaxes the "front and back only" split even further: you can
add or remove from EITHER end. It is not strictly FIFO or LIFO, it can
act as both at once (a stack from one end, a queue from the other).

  addFront / removeFront   (like a stack's push/pop)
  addBack / removeBack     (like a queue's enqueue)

JS arrays give you all four with push/pop (back) and unshift/shift
(front), but only push/pop are truly O(1). unshift/shift are O(n) for
the same contiguous-memory reason plain shift() is O(n) in section 1.
A genuinely O(1)-at-both-ends deque needs a doubly linked list (head
and tail pointers, each node has both next and prev) or a circular
buffer with two moving ends.

In practice, most interview solutions still use a plain array as a
"deque" and lean on push/pop for the back plus shift for the front,
because the deque stays capped at a small bounded size (like the
window size k below), so the cost of each shift stays small.

MONOTONIC DEQUE, Sliding Window Maximum
Same core idea as the monotonic stack in 13.reference-stacks.js, but
now the window can also lose its OLDEST element as it slides, so you
need to remove from the front too, not just the back.

Keep a deque of indices where nums[deque] stays decreasing, front to
back. The front of the deque is always the max of the current window.

  For each new index `right`:
    1. Pop from the back while the new value is >= the back's value.
       Anything smaller sitting in front of a bigger, later value can
       never be the max again, so throw it away.
    2. Push `right` onto the back.
    3. If the front index has fallen out of the window (too old),
       shift it off the front.
    4. Once the window has reached size k, the front holds this
       window's max.
*/
function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // stores indices, nums[deque] stays decreasing

    for (let right = 0; right < nums.length; right++) {
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[right]) {
            deque.pop(); // remove weaker candidates from the back
        }
        deque.push(right);

        const windowStart = right - k + 1;
        if (deque[0] < windowStart) {
            deque.shift(); // front index fell out of the window
        }

        if (right >= k - 1) {
            result.push(nums[deque[0]]); // front is always the current max
        }
    }
    return result;
}
// Time: O(n), each index is pushed and popped from the deque at most
// once across the whole run (same amortized argument as monotonic stack)
// Space: O(k)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATTERNS & TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Queue = FIFO = spread outward evenly, layer by layer: BFS, shortest
  path in unweighted graphs, level order traversal
- Stack = LIFO = go deep first: DFS, see 13.reference-stacks.js. Same
  graph, same neighbors, the only thing that changes is which end you
  remove from, and that alone flips the entire traversal order
- shift() on a plain array is O(n). Fine for interviews/small inputs,
  but know a linked list or index-pointer trick gets you real O(1)
  dequeue if asked about it
- Multi-source BFS: seed the queue with all starting points before the
  loop starts, not just one
- Mark visited at enqueue time, not dequeue time. Prevents duplicate
  enqueues and infinite loops in graphs with cycles
- "Amortized O(1)" does not mean every single call is O(1). It means
  the cost averages out to O(1) across many operations, even if
  occasional calls (like a transfer) are more expensive
- Circular queue: fixed capacity, everything O(1), wraps via modulo
  instead of shifting. Reach for it when the max size is known ahead
  of time
- Deque: add/remove both ends. Reach for it when a sliding window
  needs to drop values from the FRONT as well as compare new ones at
  the back (monotonic deque), not just push at one end
- Priority queue (heap) is a different beast entirely: it is not
  FIFO or LIFO at all, the highest-priority item always comes out
  first regardless of insertion order. See 10.reference-heaps.js

Complexities:
  Array-backed queue:      enqueue O(1), dequeue O(n) (shift)
  Linked-list-backed queue (head=front, tail=back): enqueue O(1), dequeue O(1)
  Circular queue (array, fixed capacity): enqueue/dequeue O(1)
  Deque (doubly linked list): add/remove either end O(1)
  Deque (plain array, capped size k): add/remove either end O(1) amortized
  Space: O(n), or O(capacity) for a circular queue
*/
