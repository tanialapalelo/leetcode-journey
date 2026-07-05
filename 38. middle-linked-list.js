/*
876. Middle of the Linked List
Easy

Given the head of a singly linked list, return the middle node of the linked list.

If there are two middle nodes, return the second middle node.



Example 1:


Input: head = [1,2,3,4,5]
Output: [3,4,5]
Explanation: The middle node of the list is node 3.
Example 2:


Input: head = [1,2,3,4,5,6]
Output: [4,5,6]
Explanation: Since the list has two middle nodes with values 3 and 4, we return the second one.


Constraints:

The number of nodes in the list is in the range [1, 100].
1 <= Node.val <= 100
 */

/*
WHY YOU CAN'T JUST DIVIDE BY 2
  In an array you'd do arr[Math.floor(arr.length / 2)] — done.
  But a linked list has no length and no index. You must walk it to
  know anything about it. So the naive approach is two passes:
    Pass 1 — count the nodes (get n)
    Pass 2 — walk to node n/2

  Fast & slow pointers do it in ONE pass instead.
*/

// APPROACH 1 — Two Pass (count then walk)
// Time: O(n) | Space: O(1)
var middleNode1 = function(head) {
    let count = 0;
    let curr = head;
    while (curr !== null) { count++; curr = curr.next; }

    let mid = Math.floor(count / 2);
    curr = head;
    while (mid > 0) { curr = curr.next; mid--; }

    return curr;
};

// APPROACH 2 — Fast & Slow Pointers (one pass)
// Time: O(n) | Space: O(1)
var middleNode = function(head) {
    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
};

/*
EXPLANATION

─── APPROACH 1: Two Pass ──────────────────────────────────────────────
Simple but walks the list twice:
  Pass 1 → count all nodes
  Pass 2 → walk exactly count/2 steps to land on the middle

─── APPROACH 2: Fast & Slow Pointers ──────────────────────────────────
The key insight: if fast moves at 2x the speed of slow, by the time
fast reaches the END, slow is exactly at the MIDDLE.

Think of it like two runners on a track:
  - slow runs 1 step per tick
  - fast runs 2 steps per tick
  When fast finishes the full track, slow has only covered half — the middle.

Why `fast !== null && fast.next !== null`?
  fast !== null        → handles the edge case of an empty list
  fast.next !== null   → fast needs TWO steps each tick, so its next must exist too

What happens with even vs odd length?
  Odd  [1,2,3,4,5]:   fast lands on 5 (last node),   slow lands on 3 ✓
  Even [1,2,3,4,5,6]: fast lands on null (past end),  slow lands on 4 ✓
                       → the SECOND middle, exactly what the problem asks for


WALKTHROUGH

─── Odd length: [1, 2, 3, 4, 5] ───────────────────────────────────────
Initial: slow=1, fast=1

  Tick 1: slow=2, fast=3   (slow +1, fast +2)
  Tick 2: slow=3, fast=5   (slow +1, fast +2)
  Tick 3: fast.next is null → loop stops

  Return slow = node(3) → [3,4,5] ✓

─── Even length: [1, 2, 3, 4, 5, 6] ───────────────────────────────────
Initial: slow=1, fast=1

  Tick 1: slow=2, fast=3
  Tick 2: slow=3, fast=5
  Tick 3: slow=4, fast=null (fast moved past the end) → loop stops

  Return slow = node(4) → [4,5,6] ✓
  (returns the second middle, as the problem requires)
*/
