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

  (See "47. reverse-linked-list.js" in this repo for a deeper breakdown
  of what a linked list actually is and why pointer variables like
  `slow`/`fast` don't count as space that grows with the list's length —
  the same idea applies here.)
*/

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
// APPROACH 1 — Two Pass (count then walk)
// Time: O(n) | Space: O(1)
var middleNode1 = function (head) {
    let count = 0;
    let curr = head;
    while (curr !== null) { count++; curr = curr.next; }

    let mid = Math.floor(count / 2);
    curr = head;
    while (mid > 0) { curr = curr.next; mid--; }

    return curr;
};

/*
WALKTHROUGH — Approach 1 (Two Pass)

English:
Input: 1 → 2 → 3 → 4 → 5 → null

  Pass 1 (count nodes): walk curr from head to null, counting each step
    curr=1 (count=1) -> curr=2 (count=2) -> curr=3 (count=3)
    -> curr=4 (count=4) -> curr=5 (count=5) -> curr=null, stop
    count = 5

  mid = Math.floor(5 / 2) = 2

  Pass 2 (walk to the middle): start curr back at head, take `mid` steps
    curr=1 (mid=2, not 0 yet -> step) -> curr=2 (mid=1, not 0 yet -> step)
    -> curr=3 (mid=0, stop)

  Return curr = node(3) -> [3,4,5]   ✓

Bahasa Indonesia:
Input: 1 → 2 → 3 → 4 → 5 → null

  Pass 1 (hitung node): jalanin curr dari head sampai null, hitung tiap langkah
    curr=1 (count=1) -> curr=2 (count=2) -> curr=3 (count=3)
    -> curr=4 (count=4) -> curr=5 (count=5) -> curr=null, berhenti
    count = 5

  mid = Math.floor(5 / 2) = 2

  Pass 2 (jalan ke tengah): mulai curr lagi dari head, jalan sebanyak `mid` langkah
    curr=1 (mid=2, belum 0 -> jalan) -> curr=2 (mid=1, belum 0 -> jalan)
    -> curr=3 (mid=0, berhenti)

  Return curr = node(3) -> [3,4,5]   ✓

Latihan: coba trace manual pakai list genap [1,2,3,4,5,6] (count=6,
mid=Math.floor(6/2)=3) -- perhatikan curr berhenti di node MANA setelah
3 langkah dari head, dan cocokkan sama expected output [4,5,6].
*/

// APPROACH 2 — Fast & Slow Pointers (one pass)
// Time: O(n) | Space: O(1)
var middleNode = function (head) {
    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
};

/*
WALKTHROUGH — Approach 2 (Fast & Slow Pointers)

English:
─── Odd length: [1, 2, 3, 4, 5] ───────────────────────────────────────
Initial: slow=1, fast=1

  Tick 1: slow=2, fast=3   (slow +1, fast +2)
  Tick 2: slow=3, fast=5   (slow +1, fast +2)
  Tick 3: fast.next is null → loop stops

  Return slow = node(3) → [3,4,5]   ✓

─── Even length: [1, 2, 3, 4, 5, 6] ───────────────────────────────────
Initial: slow=1, fast=1

  Tick 1: slow=2, fast=3
  Tick 2: slow=3, fast=5
  Tick 3: slow=4, fast=null (fast moved past the end) → loop stops

  Return slow = node(4) → [4,5,6]   ✓
  (returns the second middle, as the problem requires)

Bahasa Indonesia:
─── Panjang ganjil: [1, 2, 3, 4, 5] ────────────────────────────────────
Awal: slow=1, fast=1

  Tick 1: slow=2, fast=3   (slow +1, fast +2)
  Tick 2: slow=3, fast=5   (slow +1, fast +2)
  Tick 3: fast.next null → loop berhenti

  Return slow = node(3) → [3,4,5]   ✓

─── Panjang genap: [1, 2, 3, 4, 5, 6] ──────────────────────────────────
Awal: slow=1, fast=1

  Tick 1: slow=2, fast=3
  Tick 2: slow=3, fast=5
  Tick 3: slow=4, fast=null (fast udah lewat ujung) → loop berhenti

  Return slow = node(4) → [4,5,6]   ✓
  (return yang tengah KEDUA, sesuai yang diminta soal)

Latihan: coba trace manual list [1,2,3,4] (4 node, genap) di kertas --
perhatikan di tick keberapa `fast.next` jadi null, dan node mana yang
`slow` tempatin waktu loop berhenti.
*/

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

─── WHY IS SPACE O(1) HERE TOO? ────────────────────────────────────────

English:
Same reasoning as "47. reverse-linked-list.js" in this repo: `slow` and
`fast` (or `curr` and `count` in approach 1) are each just ONE pointer
variable — a small, fixed-size reference to a single node, not a copy of
the node or the list. Whether the list has 5 nodes or 5 million nodes,
approach 2 uses EXACTLY the same 2 variables (`slow`, `fast`) the entire
time. The count of variables never grows with the list's length — that
flat, unchanging count is what "O(1) space" means. (Approach 1 uses 2
variables too — `count` and `curr` — reused across both passes, still
flat regardless of n.)

If instead you built a NEW array of every node's value while walking the
list (`const values = []; ... values.push(curr.val)`), THAT would be
O(n) space -- because that array's size grows in direct proportion to
the number of nodes. The difference isn't "how many variables" but
"does the amount of extra memory grow as input grows, or stay constant."

Bahasa Indonesia:
Alasan yang sama kayak di "47. reverse-linked-list.js" di repo ini:
`slow` dan `fast` (atau `curr` dan `count` di approach 1) itu
masing-masing cuma SATU variabel pointer -- referensi kecil berukuran
tetap ke satu node, bukan salinan node atau list-nya. Mau list-nya isi 5
node atau 5 juta node, approach 2 tetap makai PERSIS 2 variabel yang
sama (`slow`, `fast`) dari awal sampai akhir. Jumlah variabelnya nggak
pernah bertambah seiring panjang list -- jumlah yang flat dan nggak
berubah itulah arti "O(1) space". (Approach 1 juga makai 2 variabel --
`count` dan `curr` -- dipakai ulang di kedua pass, tetap flat berapapun
n-nya.)

Kalau sebaliknya kamu bikin array BARU berisi semua nilai node sambil
jalan di list-nya (`const values = []; ... values.push(curr.val)`), ITU
baru O(n) space -- karena ukuran array itu membesar sebanding langsung
sama jumlah node. Bedanya bukan "berapa banyak variabel", tapi "apakah
jumlah memori ekstra itu ikut membesar seiring input membesar, atau
tetap konstan."

─── "TAPI `slow = head` KAN NAMPUNG SELURUH LIST?" — dibuktiin pakai console.log ──

English:
A common follow-up confusion: "doesn't `let slow = head` mean `slow` now
holds the whole list, since `head` IS the list?" No -- `head` itself was
never "the whole list" to begin with. `head` is one small reference (an
address) pointing at exactly ONE node -- the first one. The "rest of the
list" isn't stored inside that reference; it's reachable by following
`.next` from that single node, one hop at a time.

Proof, run for real in Node.js:

  function ListNode(val, next) {
      this.val = val;
      this.next = (next === undefined ? null : next);
  }
  const head = buildListFrom([1, 2, 3]); // (however you construct it)

  const allNodes = [];
  let curr = head;
  while (curr) { allNodes.push(curr); curr = curr.next; }

  console.log(allNodes);
  // [
  //   ListNode { val: 1, next: ListNode { val: 2, next: [ListNode] } },
  //   ListNode { val: 2, next: ListNode { val: 3, next: null } },
  //   ListNode { val: 3, next: null }
  // ]

  console.log(allNodes.length);        // 3  <- grows with n, this array IS O(n)
  console.log(allNodes[0] === head);   // true  <- same object, not a copy
  console.log(allNodes[1] === head.next); // true  <- same object, reached two ways

`allNodes[0] === head` printing `true` is the proof: pushing `curr` into
the array stored a REFERENCE to the exact same node object `head` points
to -- not a duplicate. `===` in JS checks "do these two variables point
at the exact same object in memory", and it says yes.

Now compare `slow`'s behavior to `allNodes`'s behavior across the loop:

  after step   allNodes (grows, keeps every reference)   slow (overwrites, keeps only the latest)
  0            [node1]                                    node1
  1            [node1, node2]                              node2   <- node1's reference is GONE from slow
  2            [node1, node2, node3]                        node3   <- node2's reference is GONE from slow

`allNodes.push(curr)` ADDS a reference on top of the ones already there
-- the array keeps growing, one slot per node, forever holding all of
them at once. `slow = slow.next` OVERWRITES the single reference `slow`
was holding -- the old one isn't kept anywhere, it's simply replaced.
That's the entire difference between O(n) (array keeps everything) and
O(1) (a plain variable keeps only whatever it was most recently assigned).

Bahasa Indonesia:
Kebingungan lanjutan yang umum: "kan `let slow = head` berarti `slow`
sekarang nampung seluruh list, soalnya `head` ITU list-nya?" Enggak --
`head` itu sendiri dari awal juga BUKAN "seluruh list". `head` itu satu
referensi kecil (sebuah alamat) yang nunjuk ke PERSIS SATU node -- node
pertama. "Sisa list"-nya nggak tersimpan DI DALAM referensi itu; itu cuma
bisa dijangkau dengan ngikutin `.next` dari node tunggal itu, satu
langkah demi satu langkah.

Buktinya, dijalanin beneran di Node.js:

  function ListNode(val, next) {
      this.val = val;
      this.next = (next === undefined ? null : next);
  }
  const head = buildListFrom([1, 2, 3]); // (gimana pun cara bikinnya)

  const allNodes = [];
  let curr = head;
  while (curr) { allNodes.push(curr); curr = curr.next; }

  console.log(allNodes);
  // [
  //   ListNode { val: 1, next: ListNode { val: 2, next: [ListNode] } },
  //   ListNode { val: 2, next: ListNode { val: 3, next: null } },
  //   ListNode { val: 3, next: null }
  // ]

  console.log(allNodes.length);        // 3  <- ikut membesar sama n, array ini yang beneran O(n)
  console.log(allNodes[0] === head);   // true  <- objek yang SAMA, bukan salinan
  console.log(allNodes[1] === head.next); // true  <- objek yang sama, dijangkau lewat 2 cara

`allNodes[0] === head` ngeprint `true` itu buktinya: nge-push `curr` ke
array itu nyimpen REFERENSI ke objek node yang PERSIS SAMA dengan yang
ditunjuk `head` -- bukan duplikatnya. `===` di JS ngecek "apakah dua
variabel ini nunjuk ke objek yang PERSIS SAMA di memori", dan jawabannya
ya.

Sekarang bandingin perilaku `slow` sama `allNodes` sepanjang loop:

  setelah langkah   allNodes (nambah, nyimpen semua referensi)   slow (ditimpa, cuma nyimpen yang terbaru)
  0                 [node1]                                       node1
  1                 [node1, node2]                                 node2   <- referensi node1 udah HILANG dari slow
  2                 [node1, node2, node3]                           node3   <- referensi node2 udah HILANG dari slow

`allNodes.push(curr)` NAMBAHIN referensi di atas yang udah ada -- array-nya
terus membesar, satu slot per node, nyimpen semuanya sekaligus selamanya.
`slow = slow.next` NIMPA satu-satunya referensi yang dipegang `slow` --
yang lama nggak disimpan di manapun, cuma diganti begitu aja. Itu seluruh
perbedaannya antara O(n) (array nyimpen semuanya) dan O(1) (variabel
biasa cuma nyimpen apapun yang paling terakhir di-assign ke dia).
*/
