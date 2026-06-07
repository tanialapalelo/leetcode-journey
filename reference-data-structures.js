/*
DATA STRUCTURES — REFERENCE

A data structure is a way of organizing data so you can use it efficiently.
Choosing the right one often determines whether your solution is O(n) or O(n²).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ARRAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ordered collection. Access any element instantly by index.

  Access by index   O(1)
  Search            O(n)
  Push/pop (end)    O(1)
  Insert/delete     O(n)  ← shifts everything after it
*/
const arr = [10, 20, 30, 40];
arr[2];          // 30 — O(1)
arr.push(50);    // [10,20,30,40,50] — O(1)
arr.pop();       // removes 50 — O(1)
arr.unshift(0);  // [0,10,20,30,40] — O(n) ← shifts everything right
arr.shift();     // removes 0 — O(n) ← shifts everything left

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. HASH MAP (Map)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Key → Value store. Lookup, insert, delete are all O(1) average.
The most useful structure in DSA — trades memory for speed.

Use when: you need to count, group, or look things up fast.
Problems: Two Sum, Group Anagrams, Top K Frequent, Longest Consecutive.

  get / set / delete / has   O(1) average
*/
const map = new Map();
map.set('a', 1);
map.set('b', 2);
map.get('a');        // 1
map.has('c');        // false
map.delete('b');
map.size;            // 1

// iteration
for (const [key, val] of map) {
    console.log(key, val);
}
map.keys();    // iterator of keys
map.values();  // iterator of values

// object as a map (simpler syntax, only string keys)
const obj = {};
obj['a'] = 1;
obj['a'];       // 1
'a' in obj;     // true

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. HASH SET (Set)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Like a Map but only keys — no values. Use when you only care about
whether something EXISTS, not what it maps to.

Use when: deduplication, "have I seen this before?", lookups.
Problems: Contains Duplicate, Longest Consecutive Sequence.

  add / has / delete   O(1)
*/
const set = new Set([1, 2, 3, 2, 1]); // duplicates removed → {1, 2, 3}
set.add(4);
set.has(2);    // true
set.has(9);    // false
set.delete(1);
set.size;      // 3

// convert array to set (dedup) and back
const unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Last In, First Out (LIFO). Like a stack of plates — you always
add and remove from the top.

Use when: "undo" operations, matching brackets, DFS, tracking history.
Problems: Valid Parentheses, Daily Temperatures, Largest Rectangle.

  push (add to top)   O(1)
  pop (remove top)    O(1)
  peek (read top)     O(1)

JS arrays work perfectly as stacks using push/pop.
*/
const stack = [];
stack.push(1);  // [1]
stack.push(2);  // [1, 2]
stack.push(3);  // [1, 2, 3]
stack.pop();    // returns 3, stack is [1, 2]
stack[stack.length - 1]; // peek — 2, no removal

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. QUEUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
First In, First Out (FIFO). Like a line at a shop — first person
in is the first person served.

Use when: BFS (level-order traversal), processing things in order.
Problems: Binary Tree Level Order, Rotting Oranges, Number of Islands (BFS).

  enqueue (add to back)    O(1)
  dequeue (remove front)   O(n) with array  ← shift() is slow!
                           O(1) with a proper deque/linked list

In interviews, using shift() is accepted. For production, use a library.
*/
const queue = [];
queue.push(1);    // enqueue — [1]
queue.push(2);    // enqueue — [1, 2]
queue.push(3);    // enqueue — [1, 2, 3]
queue.shift();    // dequeue — returns 1, queue is [2, 3]
queue[0];         // peek front — 2

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. LINKED LIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A chain of nodes. Each node holds a value and a pointer to the next node.
No index access — you must walk from the head.

Use when: frequent insert/delete in the middle, implementing queues.
See: reference-linked-lists.js for full detail.

  Access by index   O(n)
  Insert/delete     O(1) if you have the node, O(n) to find it
  Search            O(n)
*/
class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
// 1 → 2 → 3 → null
const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUICK PICK GUIDE — which structure to use?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Do I need fast lookup by key?"         → Hash Map
"Do I need to check if something exists?" → Hash Set
"Do I need order + fast index access?"  → Array
"Last in first out / undo / DFS?"       → Stack
"First in first out / BFS / order?"     → Queue
"Frequent insert/delete in middle?"     → Linked List
"Smallest/largest item always on top?"  → Heap (see reference-heaps.js)
*/
