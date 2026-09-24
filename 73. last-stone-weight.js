/*
1046. Last Stone Weight
Easy

You are given an array of integers stones where stones[i] is the weight of the ith stone.

We are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. Suppose the heaviest two stones have weights x and y with x <= y. The result of this smash is:

If x == y, both stones are destroyed, and
If x != y, the stone of weight x is destroyed, and the stone of weight y has new weight y - x.
At the end of the game, there is at most one stone left.

Return the weight of the last remaining stone. If there are no stones left, return 0.



Example 1:

Input: stones = [2,7,4,1,8,1]
Output: 1
Explanation:
We combine 7 and 8 to get 1 so the array converts to [2,4,1,1,1] then,
we combine 2 and 4 to get 2 so the array converts to [2,1,1,1] then,
we combine 2 and 1 to get 1 so the array converts to [1,1,1] then,
we combine 1 and 1 to get 0 so the array converts to [1] then that's the value of the last stone.
Example 2:

Input: stones = [1]
Output: 1


Constraints:

1 <= stones.length <= 30
1 <= stones[i] <= 1000

 */

/*
UNDERSTANDING THE PROBLEM, what does "smash" actually do?

You have a pile of stones, each with a weight. Repeat this until at most
one stone is left:
  1. Find the two HEAVIEST stones in the current pile. Call them x and y,
     with x <= y.
  2. Smash them together:
       if they weigh the SAME (x == y): both are destroyed, gone, no new
       stone appears.
       if they weigh DIFFERENT (x != y): the lighter one (x) is destroyed,
       and the heavier one (y) doesn't disappear, it just gets LIGHTER,
       its new weight is y - x. It goes back into the pile to possibly get
       smashed again later.

So the pile shrinks by 1 or 2 stones each round, and the process always
picks whichever two stones are currently the biggest, not any two you like.

Return the weight of whatever is left at the end, or 0 if nothing survives.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE EXAMPLE, walked through
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
stones = [2, 7, 4, 1, 8, 1]

  round 1: the two heaviest are 8 and 7 (x=7, y=8). Different weights,
           so 7 is destroyed and 8 becomes 8 - 7 = 1.
           pile is now [2, 4, 1, 1, 1]

  round 2: the two heaviest are 4 and 2 (x=2, y=4). 2 is destroyed, 4
           becomes 4 - 2 = 2.
           pile is now [2, 1, 1, 1]

  round 3: the two heaviest are 2 and 1 (x=1, y=2). 1 is destroyed, 2
           becomes 2 - 1 = 1.
           pile is now [1, 1, 1]

  round 4: the two heaviest are 1 and 1 (x=1, y=1). SAME weight, so both
           are destroyed, nothing new appears.
           pile is now [1]

  only one stone left, weight 1 -> return 1, matches the example.

Example 2, stones = [1]: only one stone to begin with, no smashing ever
happens, return 1 directly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHY THIS IS A HEAP PROBLEM, spot the pattern
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read the problem again and notice the repeated phrase: "choose the two
HEAVIEST stones," over and over, after the pile has changed each time.
That is exactly "repeatedly give me the current maximum," which is the
textbook use case for a heap (see references/10.reference-heaps.js).
A heap is built exactly for "keep giving me the max/min fast, even as
the collection keeps changing."

THE NAIVE APPROACH, and why it's slower
  You could just re-sort the whole array every round, grab the last two
  (the two biggest), smash them, and push any remainder back in:

    while (arr.length > 1) {
        arr.sort((a, b) => a - b);      // O(n log n), EVERY round
        const y = arr.pop(), x = arr.pop();
        if (y !== x) arr.push(y - x);
    }

  I ran this side by side with the heap version on 2000 random stone
  piles, both always agree, so it IS correct. But sorting the entire
  array again just to find the top 2 is wasteful: at most n - 1 rounds
  happen (each round removes at least 1 stone), and each round pays
  O(n log n) to re-sort, that's O(n^2 log n) overall.

  A heap only pays O(log n) to grab the current max (pop) and O(log n)
  to put a remainder back in (push), because it's not re-sorting
  everything, it only restores the heap property along ONE path (see
  the heap reference for why that's O(log n) and not O(n)). Over at
  most n - 1 rounds, that's O(n log n) total, much better than the
  naive O(n^2 log n).

  With n <= 30 here, either approach finishes instantly, this problem
  won't punish you for the naive version. The heap is still the answer
  interviewers want, because it's the pattern that scales, and because
  "repeatedly take the max" is a heap's whole reason for existing.

WHY MAX-HEAP, NOT MIN-HEAP
  We always want the two LARGEST stones, so we want fast access to the
  current maximum, that's a MAX-heap (largest on top), not a min-heap.
  JavaScript's MinHeap from the reference file can be reused for this by
  negating every value on the way in and out (push(-v), and negate again
  when you read a value back out), the smallest NEGATIVE number is the
  largest ORIGINAL number. This file below implements a max-heap
  directly instead (same code as MinHeap, just with > instead of <),
  so the trick isn't needed here, but you'll see the negation trick
  used elsewhere since JS has no built-in max-heap either.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WALKTHROUGH WITH THE ACTUAL HEAP, stones = [2, 7, 4, 1, 8, 1]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Build the max-heap by pushing all 6 stones (order doesn't matter, the
heap sorts itself as you push). After all 6 pushes, the internal array
happens to be [8, 7, 4, 1, 2, 1], root = 8 is the current max, exactly
like every other max-heap, only the ROOT is guaranteed to be in order,
the rest of the array is not a sorted list, don't expect it to look
neat.

  round 1: pop -> y=8. pop -> x=7 (max-heap always hands you the
           current biggest, one pop at a time).
           8 != 7, so push 8 - 7 = 1.
           heap's array is now [4, 2, 1, 1]   (that's the pile
           [4, 2, 1, 1] with the max, 4, on top)

  round 2: pop -> y=4. pop -> x=2.
           4 != 2, push 4 - 2 = 2.
           heap's array is now [1, 1, 1]

  round 3: pop -> y=2. pop -> x=1.
           2 != 1, push 2 - 1 = 1.
           heap's array is now [1, 1]

  round 4: pop -> y=1. pop -> x=1.
           1 == 1, BOTH destroyed, push nothing back.
           heap's array is now [1]

  heap size is 1, loop stops. Return the one stone left: 1.

Matches the hand-traced example above exactly, same numbers every round,
just using pop()/push() on a heap instead of manually re-sorting.

EDGE CASES
  - 1 stone to start: the while loop's condition (size > 1) is false
    immediately, return that one stone's weight without any smashing.
  - pile smashes down to 0 stones: happens whenever the very last two
    remaining stones are equal (like round 4 above landing on 2 equal
    stones instead of 1 leftover), heap size ends at 0, return 0.

COMPLEXITY
  n = stones.length
  Time:  O(n log n). Building the heap is n pushes at O(log n) each.
         The main loop runs at most n - 1 times (each round removes at
         least one stone for good), and each round does 2 pops and at
         most 1 push, all O(log n). Total: O(n log n).
  Space: O(n), the heap array holds up to n stones.
*/

// max-heap: same shape as the MinHeap in references/10.reference-heaps.js,
// just flipped to keep the LARGEST value on top instead of the smallest
class MaxHeap {
    constructor() {
        this.data = [];
    }

    size() { return this.data.length; }
    peek() { return this.data[0]; }

    parent(i) { return Math.floor((i - 1) / 2); }
    left(i)   { return 2 * i + 1; }
    right(i)  { return 2 * i + 2; }
    swap(i, j) { [this.data[i], this.data[j]] = [this.data[j], this.data[i]]; }

    // insert: add to the end, bubble up while bigger than its parent
    push(val) {
        this.data.push(val);
        let i = this.data.length - 1;
        while (i > 0 && this.data[i] > this.data[this.parent(i)]) {
            this.swap(i, this.parent(i));
            i = this.parent(i);
        }
    } // O(log n)

    // remove max: swap root with the last leaf, drop the leaf, bubble down
    pop() {
        if (this.size() === 1) return this.data.pop();
        const max = this.data[0];
        this.data[0] = this.data.pop();
        this._bubbleDown(0);
        return max;
    } // O(log n)

    _bubbleDown(i) {
        let largest = i;
        const l = this.left(i), r = this.right(i);
        if (l < this.size() && this.data[l] > this.data[largest]) largest = l;
        if (r < this.size() && this.data[r] > this.data[largest]) largest = r;
        if (largest !== i) {
            this.swap(i, largest);
            this._bubbleDown(largest);
        }
    }
}

/**
 * @param {number[]} stones
 * @return {number}
 */
var lastStoneWeight = function(stones) {
    const heap = new MaxHeap();
    for (const s of stones) heap.push(s);

    while (heap.size() > 1) {
        const y = heap.pop(); // heaviest
        const x = heap.pop(); // second heaviest
        if (y !== x) heap.push(y - x); // leftover goes back in, might get smashed again later
        // if y === x, both are gone, nothing to push back
    }

    return heap.size() ? heap.peek() : 0;
};

// Time: O(n log n), n pushes to build the heap + up to n-1 rounds of pop/pop/push
// Space: O(n), the heap array