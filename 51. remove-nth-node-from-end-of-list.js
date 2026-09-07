/*
19. Remove Nth Node From End of List
Medium

Given the head of a linked list, remove the nth node from the end of the list and return its head.



Example 1:


Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
Example 2:

Input: head = [1], n = 1
Output: []
Example 3:

Input: head = [1,2], n = 1
Output: [1]


Constraints:

The number of nodes in the list is sz.
1 <= sz <= 30
0 <= Node.val <= 100
1 <= n <= sz


Follow up: Could you do this in one pass?

 */

/*
WHY THIS IS TRICKIER THAN IT SOUNDS
  "nth from the END" is the problem: a singly linked list only lets you
  count from the FRONT (you have no length, no index, no way to walk
  backward). If you knew the list had length L, "nth from the end" is
  just "node number (L - n) counting from the front, 0-indexed" -- but
  finding L in the first place means walking the whole list once already.

  Also: removing the HEAD itself needs special handling (there's no node
  "before" it to redirect) -- unless you use a dummy node, same trick as
  "50. merge-two-sorted-lists.js" in this repo, which sidesteps that
  special case entirely.
 */

/* APPROACHES
1. Two pass -> count the length first, then walk to the node just before
   the one to remove. Time: O(L), Space: O(1)
2. One pass -> two pointers kept exactly n+1 apart; when the front one
   hits the end, the back one is sitting right before the node to
   remove. Time: O(L), Space: O(1)
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
// APPROACH 1 — Two pass: count length, then walk to the node before the target
// Time: O(L) | Space: O(1)
var removeNthFromEndTwoPass = function (head, n) {
    let length = 0;
    let curr = head;
    while (curr !== null) {
        length++;
        curr = curr.next;
    }

    const dummy = new ListNode(0, head); // handles removing the head itself with no special case
    let prev = dummy;
    for (let i = 0; i < length - n; i++) {
        prev = prev.next; // walk to the node right before the one we're removing
    }

    prev.next = prev.next.next; // skip over the target node -- unlink it
    return dummy.next;
};

/*
WALKTHROUGH — Approach 1 (Two pass)

English:
head = [1,2,3,4,5], n = 2

  Pass 1 (count length): walk head to null, counting each node
    1 -> 2 -> 3 -> 4 -> 5 -> null
    length = 5

  length - n = 5 - 2 = 3
  dummy -> 1 -> 2 -> 3 -> 4 -> 5, prev = dummy

  Pass 2 (walk 3 steps from dummy):
    step 1: prev = node(1)
    step 2: prev = node(2)
    step 3: prev = node(3)

  prev is now at node(3) -- the node right BEFORE the one to remove (node(4))
  prev.next = prev.next.next -> node(3).next = node(4).next = node(5)
  -> node(4) is unlinked (skipped over entirely)

  return dummy.next -> 1,2,3,5   ✓ matches expected output

Bahasa Indonesia:
head = [1,2,3,4,5], n = 2

  Pass 1 (hitung panjang): jalan dari head sampai null, hitung tiap node
    1 -> 2 -> 3 -> 4 -> 5 -> null
    length = 5

  length - n = 5 - 2 = 3
  dummy -> 1 -> 2 -> 3 -> 4 -> 5, prev = dummy

  Pass 2 (jalan 3 langkah dari dummy):
    langkah 1: prev = node(1)
    langkah 2: prev = node(2)
    langkah 3: prev = node(3)

  prev sekarang ada di node(3) -- node persis SEBELUM yang mau dihapus (node(4))
  prev.next = prev.next.next -> node(3).next = node(4).next = node(5)
  -> node(4) ke-unlink (dilewatin sepenuhnya)

  return dummy.next -> 1,2,3,5   ✓ cocok sama expected output

Latihan: coba trace manual head = [1], n = 1 -- perhatikan length=1,
length-n=0, jadi `prev` nggak jalan sama sekali (masih di dummy), dan
prev.next = prev.next.next langsung ngehapus satu-satunya node.
*/

// APPROACH 2 — One pass: two pointers kept n+1 apart
// Time: O(L) | Space: O(1)
var removeNthFromEnd = function (head, n) {
    const dummy = new ListNode(0, head);
    let fast = dummy;
    let slow = dummy;

    // open up a gap of exactly n+1 nodes between fast and slow
    //
    // example: head = [1,2,3,4,5], n = 2
    //   dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
    //   fast = dummy, slow = dummy   (both start on the SAME node)
    //
    //   i=0: fast = fast.next  ->  fast now on node(1)   slow still on dummy
    //   i=1: fast = fast.next  ->  fast now on node(2)   slow still on dummy
    //   i=2: fast = fast.next  ->  fast now on node(3)   slow still on dummy
    //   loop ends (i < n+1 -> i < 3 -> ran for i=0,1,2 -> 3 steps total)
    //
    //   after this loop: fast is on node(3), slow is still on dummy.
    //   count the nodes between them: dummy -> 1 -> 2 -> 3(fast)
    //   that's 3 nodes strictly between slow(dummy) and fast inclusive of fast = n+1 = 3 apart.
    for (let i = 0; i < n + 1; i++) {
        fast = fast.next;
    }

    // move both together -- the gap stays n+1 the whole time
    //
    // continuing the same example: fast is on node(3), slow is on dummy.
    //   tick 1: fast = fast.next -> node(4)   slow = slow.next -> node(1)
    //   tick 2: fast = fast.next -> node(5)   slow = slow.next -> node(2)
    //   tick 3: fast = fast.next -> null      slow = slow.next -> node(3)
    //   fast is now null -> while condition fails -> loop stops
    //
    //   slow ended up on node(3) -- exactly ONE node before node(4), which is
    //   the node to remove (the 2nd node counting from the end: 5,4 -> 4 is n=2).
    //   The gap between fast and slow (n+1) never changed during this loop --
    //   both moved one step each tick, so the distance between them stayed
    //   constant the whole time, right up until fast ran out of list to walk.
    while (fast !== null) {
        fast = fast.next;
        slow = slow.next;
    }

    // by the time fast falls off the end, slow is sitting right before the target
    // slow is node(3): slow.next is node(4) (the target), slow.next.next is node(5)
    // so this rewires node(3) -> node(5), skipping node(4) entirely
    slow.next = slow.next.next;
    return dummy.next; // 1 -> 2 -> 3 -> 5
};

/*
WALKTHROUGH — Approach 2 (One pass, two pointers)

English:
head = [1,2,3,4,5], n = 2
dummy -> 1 -> 2 -> 3 -> 4 -> 5, fast = slow = dummy

  Open the gap (n+1 = 3 steps for fast, slow stays put):
    fast step 1: fast = node(1)
    fast step 2: fast = node(2)
    fast step 3: fast = node(3)
    (gap between fast and slow is now exactly 3 nodes)

  Now move both together until fast falls off the end:
    tick 1: fast = node(4), slow = node(1)
    tick 2: fast = node(5), slow = node(2)
    tick 3: fast = null,    slow = node(3)
    fast is null -> stop

  slow is at node(3) -- right before the target (node(4))
  slow.next = slow.next.next -> node(3).next = node(5)

  return dummy.next -> 1,2,3,5   ✓ matches expected output (same result as approach 1)

Bahasa Indonesia:
head = [1,2,3,4,5], n = 2
dummy -> 1 -> 2 -> 3 -> 4 -> 5, fast = slow = dummy

  Buka gap-nya (n+1 = 3 langkah buat fast, slow diem dulu):
    fast langkah 1: fast = node(1)
    fast langkah 2: fast = node(2)
    fast langkah 3: fast = node(3)
    (gap antara fast dan slow sekarang persis 3 node)

  Sekarang gerakin dua-duanya bareng sampai fast jatuh ke ujung:
    tick 1: fast = node(4), slow = node(1)
    tick 2: fast = node(5), slow = node(2)
    tick 3: fast = null,    slow = node(3)
    fast null -> berhenti

  slow ada di node(3) -- persis sebelum target (node(4))
  slow.next = slow.next.next -> node(3).next = node(5)

  return dummy.next -> 1,2,3,5   ✓ cocok sama expected output (hasil sama kayak approach 1)

Latihan: coba trace manual head = [1,2], n = 2 (harus menghapus HEAD-nya
sendiri) -- perhatikan gap n+1=3 langkah bikin fast langsung "jatuh" ke
null sebelum slow sempat bergerak sama sekali dari dummy, dan
`dummy.next = dummy.next.next` yang efektif terjadi.
*/

/*
EXPLANATION

─── WHY DUMMY NODE HERE TOO? ────────────────────────────────────────────
If the node to remove happens to be the HEAD itself (e.g. head=[1,2], n=2
removes node 1), there's no node "before" it in the original list to
redirect -- you'd need a special `if (targetIsHead) return head.next;`
branch. A dummy node placed one step before the real head sidesteps this:
now EVERY node, including the original head, has some node "before" it
(worst case, that's the dummy). No special case needed -- the exact same
`prev.next = prev.next.next` line handles removing any node, head
included. (Same reasoning as the dummy head trick in
"50. merge-two-sorted-lists.js".)

─── APPROACH 1: Two pass ────────────────────────────────────────────────
"nth from the end" only makes sense once you know the total length L --
then it converts into "the node at position (L - n), counting positions
from the front starting at 0" for the node to remove, which means you
need to stop at position (L - n - 1) to be sitting right before it.
Walking `length - n` steps from a dummy node placed before the head lands
you exactly there.

  Time:  O(L) -- one pass to count, another (partial) pass to walk to
         the removal point. Still linear overall, just two separate
         walks.
  Space: O(1) -- `length`, `dummy`, `prev` are fixed-size variables
         regardless of list length.

─── APPROACH 2: One pass (two pointers, n+1 apart) ─────────────────────
Instead of first measuring the whole list then walking again, keep TWO
pointers moving together with a fixed gap of `n + 1` nodes between them.
Once the front pointer (`fast`) falls off the end (`null`), the back one
(`slow`) has necessarily traveled exactly as far as `fast` did -- and
because the gap was always `n + 1`, `slow` lands exactly one node before
the target, in a single walk through the list.

Why `n + 1` and not just `n`: you don't want `slow` to land ON the node
to remove -- you want it on the node right BEFORE it, so you can rewire
`.next` to skip over the target. Opening the gap by one extra node
achieves exactly that offset.

  Time:  O(L) -- fast and slow together still only touch each node a
         constant number of times, one single walk through the list.
  Space: O(1) -- `dummy`, `fast`, `slow` are fixed-size pointer
         variables, same reasoning as every other linked list problem in
         this repo.

This directly answers the problem's follow-up ("could you do this in one
pass?") -- approach 2 is that one-pass answer.

─── COMPLEXITY COMPARISON ──────────────────────────────────────────────
                    Time    Space
  1. Two pass        O(L)    O(1)
  2. One pass (gap)  O(L)    O(1)


PENJELASAN (Bahasa Indonesia)

─── KENAPA PAKAI DUMMY NODE DI SINI JUGA? ───────────────────────────────
Kalau node yang mau dihapus kebetulan itu HEAD-nya sendiri (misal
head=[1,2], n=2 menghapus node 1), nggak ada node "sebelum"-nya di list
asli buat disambung ulang -- kamu butuh cabang khusus
`if (targetIsHead) return head.next;`. Dummy node yang ditaruh 1 langkah
sebelum head asli ngilangin masalah ini: sekarang SEMUA node, termasuk
head asli, punya node "sebelumnya" (paling parah, itu si dummy). Nggak
perlu cabang khusus -- baris `prev.next = prev.next.next` yang PERSIS
SAMA nangenin penghapusan node manapun, termasuk head. (Alasan yang sama
kayak trik dummy head di "50. merge-two-sorted-lists.js".)

─── APPROACH 1: Two pass ────────────────────────────────────────────────
"nth dari belakang" cuma masuk akal begitu kamu tahu panjang total L --
terus itu berubah jadi "node di posisi (L - n), dihitung dari depan mulai
dari 0" buat node yang mau dihapus, yang berarti kamu harus berhenti di
posisi (L - n - 1) biar pas ada persis sebelum node itu. Jalan sebanyak
`length - n` langkah dari dummy node yang ditaruh sebelum head bakal
ngedaratin kamu persis di situ.

  Time:  O(L) -- satu pass buat ngitung, satu pass (sebagian) lagi buat
         jalan ke titik penghapusan. Tetap linear secara keseluruhan,
         cuma dua jalan terpisah.
  Space: O(1) -- `length`, `dummy`, `prev` itu variabel berukuran tetap
         berapapun panjang list-nya.

─── APPROACH 2: One pass (dua pointer, jaraknya n+1) ────────────────────
Daripada ngukur seluruh list dulu baru jalan lagi, jaga DUA pointer jalan
bareng dengan jarak tetap `n + 1` node di antara mereka. Begitu pointer
depan (`fast`) jatuh ke ujung (`null`), pointer belakang (`slow`) pasti
udah jalan sejauh yang persis sama kayak `fast` -- dan karena jaraknya
selalu `n + 1`, `slow` mendarat persis 1 node sebelum target, cuma dalam
1 kali jalan lewat list-nya.

Kenapa `n + 1` bukan cuma `n`: kamu nggak mau `slow` mendarat DI node yang
mau dihapus -- kamu mau dia ada di node persis SEBELUM-nya, biar bisa
nyambung ulang `.next` buat ngelewatin target. Buka gap-nya 1 node lebih
banyak itu persis ngasih offset yang dibutuhin.

  Time:  O(L) -- fast dan slow bareng-bareng tetap cuma nyentuh tiap node
         sejumlah tetap kali, 1 kali jalan lewat list-nya.
  Space: O(1) -- `dummy`, `fast`, `slow` itu variabel pointer berukuran
         tetap, alasan yang sama kayak soal linked list lainnya di repo
         ini.

Ini langsung jawab follow-up soalnya ("bisa dikerjain 1 pass?") --
approach 2 itu jawaban 1-pass-nya.

─── PERBANDINGAN KOMPLEKSITAS ──────────────────────────────────────────
                    Time    Space
  1. Two pass        O(L)    O(1)
  2. One pass (gap)  O(L)    O(1)
*/
