/*
141. Linked List Cycle
Easy

Given head, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.

Return true if there is a cycle in the linked list. Otherwise, return false.



Example 1:


Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
Example 2:


Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
Example 3:


Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.


Constraints:

The number of the nodes in the list is in the range [0, 104].
-105 <= Node.val <= 105
pos is -1 or a valid index in the linked-list.


Follow up: Can you solve it using O(1) (i.e. constant) memory?

 */

/*
WHAT "CYCLE" MEANS HERE, AND WHY IT'S TRICKY
  Normally you walk a linked list until `curr === null`. A cycle means
  the tail's `.next` doesn't point to null -- it points BACK to some
  earlier node, so the "list" is actually a loop with maybe a straight
  tail leading into it. `pos` in the problem (LeetCode's test-case format,
  not something your function receives) just says WHICH node the tail
  loops back to; pos = -1 means no cycle at all.

  Why this breaks the obvious approach: if you just do
    while (curr !== null) curr = curr.next;
  and there's a cycle, `curr` NEVER becomes null -- you loop forever.
  You need a way to detect "I've been here before" without walking
  infinitely.
 */

/* APPROACHES
1. Store every visited node in a Set -> if you ever see a node you've
   already visited, there's a cycle. Time: O(n), Space: O(n)
2. Floyd's Cycle Detection (fast & slow pointers, "tortoise and hare") ->
   if a faster pointer ever laps around and lands exactly on a slower
   pointer, there's a cycle. Time: O(n), Space: O(1)
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
// APPROACH 1 — Track visited nodes in a Set
// Time: O(n) | Space: O(n)
var hasCycleSet = function (head) {
    const visited = new Set();
    let curr = head;

    while (curr !== null) {
        if (visited.has(curr)) return true; // we've been at this exact node before -> cycle
        visited.add(curr);
        curr = curr.next;
    }

    return false; // reached null cleanly -> no cycle
};

/*
WALKTHROUGH — Approach 1 (Set)

English:
head = [3,2,0,-4], pos = 1
  (the tail, -4, loops back to node "2" instead of pointing to null)

  curr = node(3) -> not in Set -> add it -> Set = {node(3)}
  curr = node(2) -> not in Set -> add it -> Set = {node(3), node(2)}
  curr = node(0) -> not in Set -> add it -> Set = {node(3), node(2), node(0)}
  curr = node(-4) -> not in Set -> add it -> Set = {node(3), node(2), node(0), node(-4)}
  curr = node(-4).next -> this IS node(2) (the cycle!)
  curr = node(2) -> ALREADY in the Set! -> return true   ✓

Notice the Set stores NODE OBJECTS (references), not values -- this
matters because two completely different nodes could coincidentally hold
the same `.val` (e.g. two separate nodes both storing 5). Checking value
equality would give false positives; checking object identity (which is
what Set.has() does here) only flags a real revisit of the same node.

Bahasa Indonesia:
head = [3,2,0,-4], pos = 1
  (tail-nya, -4, muter balik ke node "2" alih-alih nunjuk ke null)

  curr = node(3) -> belum ada di Set -> tambahin -> Set = {node(3)}
  curr = node(2) -> belum ada di Set -> tambahin -> Set = {node(3), node(2)}
  curr = node(0) -> belum ada di Set -> tambahin -> Set = {node(3), node(2), node(0)}
  curr = node(-4) -> belum ada di Set -> tambahin -> Set = {node(3), node(2), node(0), node(-4)}
  curr = node(-4).next -> ini node(2) (ini cycle-nya!)
  curr = node(2) -> SUDAH ADA di Set! -> return true   ✓

Perhatikan Set-nya nyimpen OBJEK NODE (referensi), bukan value -- ini
penting karena dua node yang beda bisa aja kebetulan nyimpen `.val` yang
sama (misal dua node terpisah sama-sama nyimpen nilai 5). Kalau ngecek
kesamaan value, itu bisa salah kedeteksi cycle padahal nggak ada. Ngecek
identitas objek (yang persis dilakuin `Set.has()` di sini) cuma nangkep
kunjungan ULANG ke node yang BENERAN sama.

Latihan: coba trace manual head = [1,2], pos = 0 -- perhatikan cycle-nya
ketemu lebih cepat (cuma butuh 2 langkah) karena listnya lebih pendek.
*/

// APPROACH 2 — Floyd's Cycle Detection (fast & slow pointers)
// Time: O(n) | Space: O(1)
var hasCycle = function (head) {
    if (head == null) return false;

    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
        if (fast === slow) return true; // fast lapped around and landed on slow -> cycle
    }

    return false; // fast reached the end cleanly -> no cycle
};

/*
WALKTHROUGH — Approach 2 (Floyd's / fast & slow pointers)

English:
head = [3,2,0,-4], pos = 1
  (same cyclic list as approach 1's walkthrough: -4's next loops back to node "2")

Initial: slow=3, fast=3

  Tick 1: slow = slow.next = 2         fast = fast.next.next = 0
          slow(2) === fast(0)? no
  Tick 2: slow = slow.next = 0         fast = fast.next.next = 2   (fast just used the cycle link!)
          slow(0) === fast(2)? no
  Tick 3: slow = slow.next = -4        fast = fast.next.next = -4
          slow(-4) === fast(-4)? YES -> return true   ✓

Bahasa Indonesia:
head = [3,2,0,-4], pos = 1
  (list cyclic yang sama kayak walkthrough approach 1: next-nya -4 muter balik ke node "2")

Awal: slow=3, fast=3

  Tick 1: slow = slow.next = 2         fast = fast.next.next = 0
          slow(2) === fast(0)? tidak
  Tick 2: slow = slow.next = 0         fast = fast.next.next = 2   (fast baru aja lewat link cycle-nya!)
          slow(0) === fast(2)? tidak
  Tick 3: slow = slow.next = -4        fast = fast.next.next = -4
          slow(-4) === fast(-4)? YA -> return true   ✓

Latihan: coba trace manual head = [1,2], pos = 0 -- perhatikan `fast`
langsung lompat masuk cycle di tick pertama karena listnya cuma 2 node.
*/

/*
EXPLANATION

─── APPROACH 1: Set of visited nodes ───────────────────────────────────
Walk the list normally, but remember every node you've already stepped
on. If `curr` is ever a node you've seen before, you must be looping --
a normal (non-cyclic) list can never revisit a node, because each node's
`.next` only ever points forward to a node you haven't reached yet (or to
null). The moment you see a repeat, that's proof of a cycle.

  Time:  O(n) -- in the worst case (no cycle) you visit every node once,
         each visit doing an O(1) Set lookup/insert.
  Space: O(n) -- the Set can end up holding a reference to every node in
         the list before it either finds a cycle or reaches null.

─── APPROACH 2: Floyd's Cycle Detection ────────────────────────────────
Two pointers walk the SAME list at different speeds: `slow` moves 1 step
per tick, `fast` moves 2 steps per tick.

Case A -- no cycle: `fast` reaches `null` (or a node whose `.next` is
null) before `slow` does, simply because it's covering ground twice as
fast. The loop condition `fast !== null && fast.next !== null` catches
this and the function returns false. No cycle means the race has a
finish line, and fast crosses it first.

Case B -- there IS a cycle: once `fast` enters the loop, it can never
exit through the "end" (there is no end -- it's a loop), so it just keeps
circling. Eventually `slow` enters the loop too. The key question: once
BOTH pointers are inside the cycle, are they GUARANTEED to land on the
exact same node at some point, or could `fast` "jump over" `slow` and
they just keep chasing each other forever?

They are guaranteed to meet -- here's the proof. Once both pointers are
inside a cycle of length C nodes, think about the GAP between them: how
many steps ahead `fast` is compared to `slow`, measured going forward
around the cycle (this gap is always a number from 0 to C-1, wrapping
around). Every tick, `slow` advances 1 step and `fast` advances 2 steps,
so the gap increases by EXACTLY 1 each tick (never 0, never 2 -- always
precisely 1, because that's the difference in their speeds). A quantity
that increases by exactly 1 every tick, wrapping around modulo C, is
guaranteed to pass through EVERY value from 0 to C-1 exactly once before
repeating -- including 0. When the gap is exactly 0, `fast` and `slow`
are standing on the very same node. So within at most C ticks after both
are inside the cycle, they MUST collide -- there's no way for the gap to
"skip over" 0, because it only ever changes by 1 at a time.

  Time:  O(n) -- `slow` and `fast` together still only visit each node a
         constant number of times before either reaching null (no cycle)
         or meeting (cycle found).
  Space: O(1) -- only two pointer variables, `slow` and `fast`, no matter
         how long the list or how big the cycle is (same reasoning as
         "48. middle-linked-list.js" in this repo -- each is a single
         reference that gets overwritten every tick, never accumulated).

─── COMPLEXITY COMPARISON ──────────────────────────────────────────────
                      Time     Space
  1. Set of nodes      O(n)     O(n)
  2. Floyd's (fast/slow) O(n)   O(1)


PENJELASAN (Bahasa Indonesia)

─── APPROACH 1: Set node yang udah dikunjungi ──────────────────────────
Jalan di list-nya seperti biasa, tapi inget tiap node yang udah pernah
kamu injak. Kalau `curr` ketemu node yang udah pernah dilihat sebelumnya,
berarti kamu pasti muter-muter -- list yang normal (nggak ada cycle) itu
nggak mungkin ngunjungin node yang sama dua kali, karena `.next` tiap
node selalu nunjuk MAJU ke node yang belum pernah kamu capai (atau ke
null). Begitu ketemu pengulangan, itu buktinya ada cycle.

  Time:  O(n) -- kasus terburuk (nggak ada cycle) kamu ngunjungin semua
         node sekali, tiap kunjungan ngelakuin lookup/insert Set yang O(1).
  Space: O(n) -- Set-nya bisa berakhir nyimpen referensi ke SEMUA node di
         list sebelum dia nemuin cycle atau sampai ke null.

─── APPROACH 2: Floyd's Cycle Detection ────────────────────────────────
Dua pointer jalan di list yang SAMA dengan kecepatan beda: `slow` jalan 1
langkah tiap tick, `fast` jalan 2 langkah tiap tick.

Kasus A -- nggak ada cycle: `fast` sampai ke `null` (atau ke node yang
`.next`-nya null) lebih dulu daripada `slow`, karena dia nempuh jarak 2x
lebih cepat. Kondisi loop `fast !== null && fast.next !== null` nangkep
ini dan fungsinya return false. Nggak ada cycle berarti balapannya punya
garis finish, dan fast nyampe duluan.

Kasus B -- ADA cycle: begitu `fast` masuk ke loop-nya, dia nggak akan
pernah bisa "keluar lewat ujung" (nggak ada ujungnya -- itu loop), jadi
dia cuma muter-muter terus. Akhirnya `slow` juga masuk ke loop itu.
Pertanyaan kuncinya: begitu KEDUA pointer ada di dalam cycle, apakah
mereka DIJAMIN bakal mendarat di node yang PERSIS SAMA di suatu titik,
atau bisa aja `fast` "lompatin" `slow` dan mereka cuma kejar-kejaran
selamanya?

Mereka DIJAMIN ketemu -- ini buktinya. Begitu kedua pointer ada di dalam
cycle sepanjang C node, bayangin GAP di antara mereka: berapa langkah
`fast` ada di depan `slow`, diukur maju mengelilingi cycle (gap ini
selalu angka dari 0 sampai C-1, muter balik/wrap-around). Tiap tick,
`slow` maju 1 langkah dan `fast` maju 2 langkah, jadi gap-nya bertambah
PERSIS 1 tiap tick (nggak pernah 0, nggak pernah 2 -- selalu persis 1,
karena itu selisih kecepatan mereka). Sesuatu yang bertambah PERSIS 1
tiap tick, muter balik modulo C, DIJAMIN bakal ngelewatin SEMUA nilai
dari 0 sampai C-1 persis sekali sebelum berulang -- termasuk 0. Pas
gap-nya persis 0, `fast` dan `slow` lagi berdiri di node yang PERSIS
SAMA. Jadi dalam maksimal C tick setelah keduanya ada di dalam cycle,
mereka PASTI ketabrak -- nggak ada cara buat gap-nya "lompatin" 0, karena
dia cuma pernah berubah 1 per satu waktu.

  Time:  O(n) -- `slow` dan `fast` bareng-bareng tetap cuma ngunjungin
         tiap node sejumlah tetap kali sebelum salah satu sampai ke null
         (nggak ada cycle) atau ketemu (cycle ketemu).
  Space: O(1) -- cuma dua variabel pointer, `slow` dan `fast`, berapapun
         panjang list-nya atau besar cycle-nya (alasan yang sama kayak
         "48. middle-linked-list.js" di repo ini -- masing-masing cuma
         satu referensi yang ditimpa tiap tick, nggak pernah menumpuk).

─── PERBANDINGAN KOMPLEKSITAS ──────────────────────────────────────────
                         Time     Space
  1. Set node              O(n)     O(n)
  2. Floyd's (fast/slow)   O(n)     O(1)
*/
