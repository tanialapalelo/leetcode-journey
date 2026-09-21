/*
622. Design Circular Queue
Medium

Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle, and the last position is connected back to the first position to make a circle. It is also called "Ring Buffer".

One of the benefits of the circular queue is that we can make use of the spaces in front of the queue. In a normal queue, once the queue becomes full, we cannot insert the next element even if there is a space in front of the queue. But using the circular queue, we can use the space to store new values.

Implement the MyCircularQueue class:

MyCircularQueue(k) Initializes the object with the size of the queue to be k.
int Front() Gets the front item from the queue. If the queue is empty, return -1.
int Rear() Gets the last item from the queue. If the queue is empty, return -1.
boolean enQueue(int value) Inserts an element into the circular queue. Return true if the operation is successful.
boolean deQueue() Deletes an element from the circular queue. Return true if the operation is successful.
boolean isEmpty() Checks whether the circular queue is empty or not.
boolean isFull() Checks whether the circular queue is full or not.
You must solve the problem without using the built-in queue data structure in your programming language.



Example 1:

Input
["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]
[[3], [1], [2], [3], [4], [], [], [], [4], []]
Output
[null, true, true, true, false, 3, true, true, true, 4]

Explanation
MyCircularQueue myCircularQueue = new MyCircularQueue(3);
myCircularQueue.enQueue(1); // return True
myCircularQueue.enQueue(2); // return True
myCircularQueue.enQueue(3); // return True
myCircularQueue.enQueue(4); // return False
myCircularQueue.Rear();     // return 3
myCircularQueue.isFull();   // return True
myCircularQueue.deQueue();  // return True
myCircularQueue.enQueue(4); // return True
myCircularQueue.Rear();     // return 4


Constraints:

1 <= k <= 1000
0 <= value <= 1000
At most 3000 calls will be made to enQueue, deQueue, Front, Rear, isEmpty, and isFull.
 */

/*
UNDERSTANDING THE PROBLEM, why front AND rear, and why "circular"?

A normal array queue only removes from the front (index 0) and adds at
the back (the last used index). Removing from the front of a plain
array means shifting every remaining element one slot left, O(n).
A circular queue avoids that shift completely by never physically
moving any element. Instead, two pointers, `front` and `rear`, are
just INDICES that slide around the array to mark where the queue
currently starts and ends.

  enQueue: move `rear` forward one step, write the new value there.
  deQueue: read `data[front]`, then move `front` forward one step.

Nothing else in the array ever moves. That's the whole trick.

THE PART THAT'S HARD TO PICTURE: WRAPAROUND
`front` and `rear` don't increase forever. Once one of them reaches
the LAST index of the array, its next move wraps back to index 0
instead of running off the end:

  nextIndex = (currentIndex + 1) % capacity

Picture the array's indices bent into a ring instead of a straight
line, so index (capacity - 1) sits right next to index 0:

  capacity = 3, indices arranged clockwise as a ring:

              ( 0 )
             /      \
           (2)------(1)

  front and rear each walk CLOCKWISE around this ring, one step at a
  time. When either one steps off position 2, the next stop is
  position 0 again. That wraparound is why a slot freed near the
  "start" of the array can still be reused even after rear has
  already passed the "end" once, see step 8 in the walkthrough below.

WHY A `count` VARIABLE IS ALSO NEEDED
Tracking only front and rear is not enough: `front === rear` happens
both when the queue is completely EMPTY and when it is completely
FULL (after enough wraparounds), and the array alone cannot tell those
two states apart. A separate `count` resolves the ambiguity.
  isEmpty() -> count === 0
  isFull()  -> count === capacity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHY THE FORMULA IS (index + 1) % capacity, AND HOW TO COME UP WITH IT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Start from what you WANT: "move one slot forward, but after the last
slot, go back to slot 0."

Try the obvious thing first. capacity = 3, so valid indices are 0, 1, 2:

  index + 1:   0 -> 1    1 -> 2    2 -> 3   <- BREAKS, index 3 doesn't exist

You could patch that by hand:

  if (index + 1 === capacity) index = 0;
  else index = index + 1;

`%` is that exact same if/else squeezed into one expression. `a % b`
is the REMAINDER of a divided by b. A remainder after dividing by 3
can only ever be 0, 1 or 2, so the result is ALWAYS a valid index, no
matter what you feed it:

  (0 + 1) % 3 = 1 % 3 = 1     (1 / 3 = 0 remainder 1, unchanged)
  (1 + 1) % 3 = 2 % 3 = 2     (2 / 3 = 0 remainder 2, unchanged)
  (2 + 1) % 3 = 3 % 3 = 0     (3 / 3 = 1 remainder 0)  <- the WRAP

Only the last line does anything special. Every other time `%` is a
no-op, because the number is already smaller than capacity. That's why
you can use the same one-liner for every step and never write an `if`.

Think of a clock: 11 o'clock + 1 hour = 12, and 12 o'clock is "0" on
the dial. A clock does `(hour + 1) % 12`. Here the dial has 3 numbers
(0, 1, 2) instead of 12.

THE IDEA BEHIND EVERYTHING: LOGICAL POSITION vs PHYSICAL INDEX
The queue thinks in LOGICAL positions: 0th item (the front), 1st item,
2nd item... The array only knows PHYSICAL indices 0..capacity-1. The
bridge between the two is:

  physical index = (front + logicalPosition) % capacity

  front item      (position 0)          -> (front + 0) % cap = front
  last item       (position count - 1)  -> (front + count - 1) % cap = rear
  next free slot  (position count)      -> (front + count) % cap
                                           = where enQueue writes next

Check it on the state after step 9 below (front=1, count=3, cap=3,
data = [4, 2, 3]):

  position 0 -> (1 + 0) % 3 = 1 -> data[1] = 2   <- front
  position 1 -> (1 + 1) % 3 = 2 -> data[2] = 3
  position 2 -> (1 + 2) % 3 = 0 -> data[0] = 4   <- rear

So the queue, read front to rear, is 2, 3, 4. That is correct FIFO
order even though the array physically looks like [4, 2, 3]. This is
also why `rear = (rear + 1) % capacity` works: the next free slot is
always exactly one step past the current rear.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WALKTHROUGH, matches the example above, one call at a time
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
new MyCircularQueue(3)
  capacity = 3, data = [_, _, _], front = 0, rear = -1, count = 0

  Why does rear start at -1, not 0? Because the queue starts empty,
  there is no "last inserted item" yet. The first enQueue moves rear
  to (-1 + 1) % 3 = 0, landing on the very first real slot.

1. enQueue(1)
     count (0) !== capacity (3) -> allowed
     rear = (-1 + 1) % 3 = 0
     data[0] = 1
     count = 1
   state:  data = [1, _, _]   front=0  rear=0  count=1
                   ^front,rear (only one item, both point at it)
   returns true

2. enQueue(2)
     rear = (0 + 1) % 3 = 1
     data[1] = 2
     count = 2
   state:  data = [1, 2, _]   front=0  rear=1  count=2
                   ^front  ^rear
   returns true

3. enQueue(3)
     rear = (1 + 1) % 3 = 2
     data[2] = 3
     count = 3
   state:  data = [1, 2, 3]   front=0  rear=2  count=3
                   ^front     ^rear
   returns true   (queue is now full, count === capacity)

4. enQueue(4)
     count (3) === capacity (3) -> rejected, nothing changes
   state unchanged:  data = [1, 2, 3]   front=0  rear=2  count=3
   returns false   <- matches expected output

5. Rear()
     count !== 0 -> return data[rear] = data[2] = 3
   returns 3   <- matches expected output

6. isFull()
     count (3) === capacity (3) -> true
   returns true   <- matches expected output

7. deQueue()
     count !== 0 -> val = data[front] = data[0] = 1
     front = (0 + 1) % 3 = 1
     count = 2
   state:  data = [1, 2, 3]   front=1  rear=2  count=2
              (the old 1 is still physically sitting in data[0], but
               front has moved past it, that slot is "dead data" now,
               nobody reads index 0 until something enqueues over it)
                      ^front  ^rear
   returns true

8. enQueue(4)
     count (2) !== capacity (3) -> allowed
     rear = (2 + 1) % 3 = 0        <- WRAPAROUND: rear jumps from the
                                      last index (2) back to index 0,
                                      landing exactly on the slot that
                                      deQueue() freed in step 7
     data[0] = 4                    (overwrites the old, already
                                      dequeued 1, perfectly safe)
     count = 3
   state:  data = [4, 2, 3]   front=1  rear=0  count=3
                   ^rear  ^front
   returns true

9. Rear()
     return data[rear] = data[0] = 4
   returns 4   <- matches expected output

Notice rear (0) is now numerically BEHIND front (1) in the array's
index order. That "rear sitting before front" could never happen in a
plain, non-circular array queue, front is always <= rear there. Here
it is completely normal, it just means the ring has wrapped around.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTINUING: what if we now deQueue 3 times, then keep going?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Starting point is the state after step 9:
  data = [4, 2, 3]   front=1  rear=0  count=3
  the queue, front to rear, is 2, 3, 4

10. deQueue()          (removes the 2)
     val = data[front] = data[1] = 2
     front = (1 + 1) % 3 = 2
     count = 2
   state:  data = [4, 2, 3]   front=2  rear=0  count=2
                   ^rear  ^front
   queue is now 3, 4  (data[2], then data[0])
   returns true

11. deQueue()          (removes the 3)
     front = (2 + 1) % 3 = 0        <- WRAPAROUND, this time it's `front`
                                       that steps off the last index
     count = 1
   state:  data = [4, 2, 3]   front=0  rear=0  count=1
                   ^front,rear (one item left, both point at the 4)
   queue is now just 4
   returns true

12. deQueue()          (removes the 4)
     front = (0 + 1) % 3 = 1
     count = 0
   state:  data = [4, 2, 3]   front=1  rear=0  count=0
                   ^rear  ^front
   The queue is now EMPTY. Notice `rear` never moved during any of
   these deQueues, only `front` did. And the array still physically
   holds 4, 2, 3 as dead data. The ONLY thing saying "nothing here" is
   count === 0.

   Empty does NOT look like front === rear. It looks like `rear` sitting
   exactly one step BEHIND `front` on the ring (front=1, rear=0). Same
   as a brand new queue: front=0, rear=-1, and -1 is "one step behind
   0", which is the same seat as index 2 on the ring. Every emptied
   queue ends up in this shape, no matter how many laps it took.
   returns true

13. deQueue()          (one more, on an empty queue)
     isEmpty(): count === 0 -> return false immediately
     nothing changes:  front=1  rear=0  count=0
   returns false

14. Front() and Rear()
     isEmpty() -> return -1, without touching the array
     (data[1] = 2 and data[0] = 4 are physically there, but they are
      dead data, so the isEmpty() check is what keeps them from being
      returned as if they were real)
   returns -1 and -1

15. enQueue(9)         (enQueue works fine again)
     count (0) !== capacity (3) -> allowed
     rear = (0 + 1) % 3 = 1         <- lands on exactly front's slot
     data[1] = 9                    (overwrites the dead 2)
     count = 1
   state:  data = [4, 9, 3]   front=1  rear=1  count=1
                      ^front,rear
   Front() = 9, Rear() = 9, one item, both pointers on it again.
   returns true

16. enQueue(8), then enQueue(7)
     8: rear = (1 + 1) % 3 = 2, data[2] = 8, count = 2
     7: rear = (2 + 1) % 3 = 0  <- WRAPAROUND again, data[0] = 7, count = 3
   state:  data = [7, 9, 8]   front=1  rear=0  count=3
   Front() = 9, Rear() = 7. Queue front to rear is 9, 8, 7, which is
   exactly the order they went in.

17. enQueue(6)
     count (3) === capacity (3) -> return false, nothing changes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

/**
 * @param {number} k
 */
var MyCircularQueue = function(k) {
    this.data = new Array(k);

    this.capacity = k;
    this.front = 0; // front index pointer
    this.rear = -1; // rear index pointer
    this.count = 0; // size of the queue
};

/**
 * @param {number} value
 * @return {boolean}
 * inserts at rear
 */
MyCircularQueue.prototype.enQueue = function(value) {
    if (this.isFull()) return false;
    this.rear = (this.rear + 1) % this.capacity; // step forward, wrap if needed
    this.data[this.rear] = value;
    this.count++;
    return true;
};

/**
 * @return {boolean}
 * removes from front
 */
MyCircularQueue.prototype.deQueue = function() {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.capacity; // step forward, wrap if needed
    this.count--;
    return true;
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Front = function() {
    return this.isEmpty() ? -1 : this.data[this.front];
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Rear = function() {
    return this.isEmpty() ? -1 : this.data[this.rear];
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isEmpty = function() {
    return this.count === 0;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isFull = function() {
    return this.count === this.capacity;
};

// Time: O(1) for every operation (enQueue, deQueue, Front, Rear, isEmpty, isFull)
// Space: O(k), the fixed-size backing array, allocated once up front

/*
NOTE: deQueue() here does not bother clearing data[front] to null/undefined
before advancing front, it just leaves the old value sitting there
"dead" until enQueue() eventually overwrites it (see step 7 in the
walkthrough). That's safe because Front()/Rear()/enQueue()/deQueue()
all check isEmpty()/isFull() via `count` first, so dead data is never
read as if it were live. Clearing it would just be extra work with no
observable benefit.

ALTERNATIVE without a `count` field: size the backing array to k + 1
instead of k, and define "full" as `(rear + 1) % (k + 1) === front`
(one slot is always deliberately left empty as a buffer, which is what
tells full and empty apart). This repo's version uses `count` instead
because it maps directly onto isFull()/isEmpty() without that extra
+1 indexing to keep track of.
*/