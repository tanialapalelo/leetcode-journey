/*
206. Reverse Linked List
Easy

Given the head of a singly linked list, reverse the list, and return the reversed list.



Example 1:

Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]


Example 2:

Input: head = [1,2]
Output: [2,1]
Example 3:

Input: head = []
Output: []


Constraints:

The number of nodes in the list is the range [0, 5000].
-5000 <= Node.val <= 5000


Follow up: A linked list can be reversed either iteratively or recursively. Could you implement both?

 */

/*
WHY LEETCODE SHOWS LINKED LISTS AS ARRAYS
  In LeetCode, when you see Input: head = [1,2,3,4,5], that's just how
  LeetCode serializes a linked list for display. Internally, it converts
  that array into real ListNode objects before calling your function:

    head = ListNode(1)
    head.next = ListNode(2)
    head.next.next = ListNode(3)  ... and so on

  So inside your function, `head` is NOT an array — it's a node object
  with .val and .next. LeetCode just prints the result as [5,4,3,2,1]
  for readability, but the actual structure is:
    5 → 4 → 3 → 2 → 1 → null
*/

// APPROACH 1 — Iterative (three pointers)
// Time: O(n) | Space: O(1)
var reverseList = function(head) {
    let prev = null;
    let curr = head;

    while (curr !== null) {
        const next = curr.next; // 1. save next before losing it
        curr.next = prev;       // 2. flip pointer backwards
        prev = curr;            // 3. advance prev
        curr = next;            // 4. advance curr
    }

    return prev; // prev is the new head
};

// APPROACH 2 — Recursive
// Time: O(n) | Space: O(n) ← call stack grows with each node
var reverseListRecursive = function(head) {
    if (head === null || head.next === null) return head; // base case

    const newHead = reverseListRecursive(head.next); // recurse to the end
    head.next.next = head; // make the next node point back at current
    head.next = null;      // cut current node's forward pointer
    return newHead;        // bubble the tail (new head) all the way up
};

/*
EXPLANATION

─── APPROACH 1: Iterative ─────────────────────────────────────────────
The problem: if you do curr.next = prev right away, you lose the rest
of the list. So always save next BEFORE flipping.

Three pointers move together like a sliding window across the list:
  prev  ← already reversed
  curr  ← node being processed right now
  next  ← saved so we can still advance after flipping

When curr reaches null, prev is sitting on the last real node — which
is the new head of the reversed list.

  Time:  O(n) — visits every node once
  Space: O(1) — just three pointer variables

─── APPROACH 2: Recursive ─────────────────────────────────────────────
Recurse all the way to the last node first, then flip pointers on the
way back up (the "return journey").

  Base case: if head is null or the last node, return it as the new head.

  On the way back up (after recursion returns):
    head.next.next = head  → the node ahead of us now points back at us
    head.next = null       → cut our forward pointer (we're now the tail)

  The newHead (the original last node) is passed all the way back up
  unchanged — it becomes the return value at every level.

  Time:  O(n) — visits every node once
  Space: O(n) — one stack frame per node (risk of stack overflow on very long lists)

─── WHICH TO USE? ─────────────────────────────────────────────────────
  Iterative → preferred in practice (O(1) space, no stack overflow risk)
  Recursive → elegant, great for interviews to show you know both


WALKTHROUGH
Input: 1 → 2 → 3 → null

─── Iterative ───────────────────────────────────────────────
Initial: prev=null, curr=1

  Step 1: next=2,    flip 1→null,  prev=1, curr=2
          null ← 1    2 → 3 → null

  Step 2: next=3,    flip 2→1,     prev=2, curr=3
          null ← 1 ← 2    3 → null

  Step 3: next=null, flip 3→2,     prev=3, curr=null
          null ← 1 ← 2 ← 3

  curr is null → loop ends. Return prev=3.
  Result: 3 → 2 → 1 → null ✓

─── Recursive ───────────────────────────────────────────────
Call stack unwinds like this:

  reverse(1) calls reverse(2)
    reverse(2) calls reverse(3)
      reverse(3): head.next is null → BASE CASE, return node 3 (newHead)
    back in reverse(2): newHead=3
      head=2, head.next=3
      head.next.next = head  →  3.next = 2   (3 now points back to 2)
      head.next = null       →  2.next = null (cut 2's forward pointer)
      return newHead=3
  back in reverse(1): newHead=3
    head=1, head.next=2
    head.next.next = head  →  2.next = 1   (2 now points back to 1)
    head.next = null       →  1.next = null (cut 1's forward pointer)
    return newHead=3

  Result: 3 → 2 → 1 → null ✓
*/
