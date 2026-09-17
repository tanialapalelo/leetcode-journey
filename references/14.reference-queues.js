/*
QUEUES - REFERENCE

A queue is First In, First Out (FIFO). Think of a line at a shop:
whoever got in line first gets served first. You add at the back and
remove from the front, never from the middle.

  enqueue(4) ->  [1, 2, 3, 4]
                  ^front         ^back (add here)
  dequeue()  ->  [2, 3, 4]   returns 1 (removed from front)

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

Complexities:
  Array-backed:  enqueue O(1), dequeue O(n) (shift)
  Linked-list-backed (head=front, tail=back): enqueue O(1), dequeue O(1)
  Space: O(n)
*/
