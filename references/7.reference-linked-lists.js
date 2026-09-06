/*
LINKED LISTS — REFERENCE

A linked list is a chain of nodes. Each node holds a value and a pointer
to the next node. The last node points to null. Linked list is a dynamic data tructure so it has no problem growing and shrinking.

  head
   ↓
  [1] → [2] → [3] → [4] → null

Unlike arrays, there's no index — you must walk from head to find a node.

Why use it over an array?
  Insert/delete in the middle: O(1) if you have the node (vs O(n) for array)
  No shifting elements around
  Downside: no random access — searching is always O(n)

There are 2 types:
  - Singly: contains next pointer to the next node
  - Doubly: contains next pointer to the next and previous pointer to the previous node
  - Circular: similar to singly but instead of the tail / last node point to null, rather it points back to 1st node
  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NODE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// Build: 1 → 2 → 3 → null
const head = new ListNode(1, new ListNode(2, new ListNode(3)));

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRAVERSAL — walking the list
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
function printList(head) {
    let curr = head;
    while (curr !== null) {
        console.log(curr.val);
        curr = curr.next; // move to next node
    }
}
// Time: O(n)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVERSAL — the most common linked list operation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input:  1 → 2 → 3 → null
Output: 3 → 2 → 1 → null

Use three pointers: prev, curr, next
  At each step, flip curr.next to point backwards, then advance all three.
*/
function reverseList(head) {
    let prev = null, curr = head;

    while (curr !== null) {
        const next = curr.next; // save next before overwriting
        curr.next = prev;       // flip pointer to point backwards
        prev = curr;            // advance prev
        curr = next;            // advance curr
    }
    return prev; // prev is now the new head
}
// Time: O(n)  Space: O(1)

/*
Walkthrough: 1 → 2 → 3 → null
  Step 1: prev=null, curr=1 → next=2, flip 1→null, prev=1, curr=2
  Step 2: prev=1,    curr=2 → next=3, flip 2→1,    prev=2, curr=3
  Step 3: prev=2,    curr=3 → next=null, flip 3→2, prev=3, curr=null
  Return prev=3  →  3 → 2 → 1 → null  ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FAST & SLOW POINTERS (Floyd's Cycle Detection)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
slow moves 1 step, fast moves 2 steps.
If there's a cycle, they'll eventually meet.
If there's no cycle, fast reaches null first.

Also used to find the MIDDLE of a list:
  When fast reaches the end, slow is at the middle.
*/

// Detect cycle
function hasCycle(head) {
    let slow = head, fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true; // they met — cycle exists
    }
    return false;
}

// Find middle node
function findMiddle(head) {
    let slow = head, fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow; // slow is at the middle when fast reaches end
}
// Time: O(n)  Space: O(1)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MERGE TWO SORTED LISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input: 1→2→4 and 1→3→4  →  1→1→2→3→4→4

Use a dummy head node to simplify edge cases — no special handling
for the first node.
*/
function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0); // placeholder head
    let curr = dummy;

    while (l1 !== null && l2 !== null) {
        if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
        else                  { curr.next = l2; l2 = l2.next; }
        curr = curr.next;
    }
    curr.next = l1 ?? l2; // attach whatever's left
    return dummy.next;    // skip the dummy placeholder
}
// Time: O(n + m)  Space: O(1)

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REMOVE NTH NODE FROM END
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
One-pass trick: lead fast pointer n steps ahead first.
When fast reaches null, slow is at the node just before the one to remove.
*/
function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0);
    dummy.next = head;
    let slow = dummy, fast = dummy;

    for (let i = 0; i <= n; i++) fast = fast.next; // advance fast n+1 steps

    while (fast !== null) { slow = slow.next; fast = fast.next; }
    slow.next = slow.next.next; // skip the target node
    return dummy.next;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATTERNS & TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Always use a DUMMY HEAD when building or modifying a list — avoids
  special-casing the first node
- FAST & SLOW pointers: middle, cycle detection, nth from end
- Draw the pointers on paper before coding — linked list bugs are
  almost always pointer order mistakes
- Don't lose your reference: save curr.next BEFORE redirecting curr.next

Complexities:
  Access/Search  O(n)
  Insert/Delete  O(1) if at the node, O(n) to find it
  Space          O(1) for in-place operations
*/
