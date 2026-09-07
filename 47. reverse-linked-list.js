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

/*
WHAT A LINKED LIST ACTUALLY IS (read this if linked lists still feel fuzzy)

English:
Think of a treasure hunt with clue cards scattered around a room, not
sitting neatly in a row. Each card has two parts:
  - the CONTENT of that card (its `.val`)
  - a tiny note in the corner saying "the next card is over there" (its
    `.next` — literally the memory address of the next node)

You're handed exactly ONE card to start with (that's `head`). To find the
2nd card, you must read the 1st card's corner note and walk over there.
To find the 3rd, you read the 2nd's note. There's no way to jump straight
to "the 5th card" the way you can with `arr[4]` on an array — arrays sit
in one neat contiguous row in memory, so index 4 IS a direct address you
can compute instantly. A linked list's nodes can be scattered anywhere in
memory; the only way to reach node 5 is to walk the chain from node 1.

Now, what is a "pointer variable" like `head`, `curr`, `prev`, or `next`
in your code? It is NOT a card. It's a small sticky note you're holding
in your hand that says "I am currently looking at THIS card over there."
That sticky note is always the same tiny size (just one memory address)
no matter how big the card's own content is, and no matter whether that
card is the 1st or the 1,000,000th card in the chain.

This distinction (a node vs. a pointer to a node) is the single most
important idea for understanding why space complexity works the way it
does below.

Bahasa Indonesia:
Bayangin permainan berburu harta karun, kartu-kartu petunjuknya tersebar
di seluruh ruangan, bukan berjejer rapi. Tiap kartu punya dua bagian:
  - ISI kartu itu sendiri (`.val`-nya)
  - tulisan kecil di pojok yang bilang "kartu berikutnya ada di sana"
    (`.next`-nya — secara harfiah alamat memori node berikutnya)

Kamu dikasih PERSIS SATU kartu buat mulai (itu `head`). Buat nemuin kartu
ke-2, kamu harus baca tulisan pojok kartu ke-1 dan jalan ke sana. Buat
nemuin kartu ke-3, kamu baca tulisan pojok kartu ke-2. Nggak ada cara buat
langsung loncat ke "kartu ke-5" kayak yang bisa kamu lakuin dengan
`arr[4]` di array — array itu duduk berjejer rapi dan bersebelahan di
memori, jadi index 4 ITU alamat langsung yang bisa langsung dihitung.
Node-node linked list bisa tersebar di mana aja di memori; satu-satunya
cara nyampe ke node 5 adalah jalan dari node 1, ngikutin rantainya.

Nah, apa itu "variabel pointer" kayak `head`, `curr`, `prev`, atau `next`
di kode kamu? Itu BUKAN kartunya. Itu secarik kertas kecil yang kamu
pegang di tangan, isinya "saya lagi liat kartu YANG INI di sana." Kertas
kecil itu ukurannya SELALU SAMA (cuma satu alamat memori), nggak peduli
seberapa besar isi kartunya sendiri, dan nggak peduli kartu itu kartu
ke-1 atau ke-1-juta dalam rantai.

Perbedaan ini (node vs pointer yang nunjuk ke node) adalah ide PALING
penting buat ngerti kenapa space complexity di bawah ini kerja kayak
gitu.
*/

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
// APPROACH 1 — Iterative (three pointers)
// Time: O(n) | Space: O(1)
var reverseList = function (head) {
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

/*
WALKTHROUGH — Approach 1 (Iterative)

English:
Input: 1 → 2 → 3 → null
Initial: prev=null, curr=1

  Step 1: next=2,    flip 1→null,  prev=1, curr=2
          null ← 1    2 → 3 → null

  Step 2: next=3,    flip 2→1,     prev=2, curr=3
          null ← 1 ← 2    3 → null

  Step 3: next=null, flip 3→2,     prev=3, curr=null
          null ← 1 ← 2 ← 3

  curr is null → loop ends. Return prev=3.
  Result: 3 → 2 → 1 → null   ✓

Bahasa Indonesia:
Input: 1 → 2 → 3 → null
Awal: prev=null, curr=1

  Langkah 1: next=2,    balik 1→null,  prev=1, curr=2
             null ← 1    2 → 3 → null

  Langkah 2: next=3,    balik 2→1,     prev=2, curr=3
             null ← 1 ← 2    3 → null

  Langkah 3: next=null, balik 3→2,     prev=3, curr=null
             null ← 1 ← 2 ← 3

  curr sudah null → loop berhenti. Return prev=3.
  Hasil: 3 → 2 → 1 → null   ✓

Latihan: coba trace manual list [1,2,3,4,5] di kertas -- gambar tiap node
sebagai kotak, dan gambar ulang panah `.next`-nya di tiap langkah biar
kelihatan jelas arah panahnya kebalik satu-satu.
*/

// APPROACH 2 — Recursive
// Time: O(n) | Space: O(n) ← call stack grows with each node
var reverseListRecursive = function (head) {
    if (head === null || head.next === null) return head; // base case

    const newHead = reverseListRecursive(head.next); // recurse to the end
    head.next.next = head; // make the next node point back at current
    head.next = null;      // cut current node's forward pointer
    return newHead;        // bubble the tail (new head) all the way up
};

/*
WALKTHROUGH — Approach 2 (Recursive)

English:
Input: 1 → 2 → 3 → null

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

  Result: 3 → 2 → 1 → null   ✓

Bahasa Indonesia:
Input: 1 → 2 → 3 → null

Call stack-nya kebuka gulung baliknya kayak gini:

  reverse(1) manggil reverse(2)
    reverse(2) manggil reverse(3)
      reverse(3): head.next null → BASE CASE, return node 3 (newHead)
    balik di reverse(2): newHead=3
      head=2, head.next=3
      head.next.next = head  →  3.next = 2   (3 sekarang nunjuk balik ke 2)
      head.next = null       →  2.next = null (putus panah maju 2)
      return newHead=3
  balik di reverse(1): newHead=3
    head=1, head.next=2
    head.next.next = head  →  2.next = 1   (2 sekarang nunjuk balik ke 1)
    head.next = null       →  1.next = null (putus panah maju 1)
    return newHead=3

  Hasil: 3 → 2 → 1 → null   ✓

Latihan: coba trace manual list [1,2] (cuma 2 node) di kertas -- ini
kasus paling kecil yang masih ngelewatin base case DAN satu langkah
"flip", jadi paling gampang buat ngeliat urutan kejadiannya persis.
*/

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

─── WHY IS APPROACH 1 "O(1) SPACE" IF THERE ARE MULTIPLE VARIABLES? ───

English:
This is a very common point of confusion, so let's be precise about it.
"Space complexity" measures EXTRA memory the algorithm uses BEYOND the
input itself, and specifically: does that extra memory GROW as the input
(n nodes) grows, or does it stay FLAT?

First: the chain of n nodes itself is the INPUT. It already exists in
memory before your function even runs. Approach 1 doesn't copy any node
or create new ones — it only rewires the `.next` arrows of nodes that
already exist. So the input is never counted as "extra" space; extra
space only means new memory YOUR algorithm allocates on top of it.

Now, `head` (the parameter), `prev`, `curr`, and `next` are each just ONE
pointer variable — one small sticky note holding one memory address (see
the analogy above). Having three or four of these instead of one doesn't
change the complexity class, because the COUNT of these variables is
FIXED — it never grows no matter how long the list is. Whether the list
has 3 nodes or 3 million nodes, approach 1 uses EXACTLY the same 3
pointer variables (`prev`, `curr`, `next`) the entire time. That fixed,
non-growing count is exactly what "O(1)" means: constant, regardless of
input size.

Compare directly with approach 2 (recursive), where the space really
DOES grow with input size:

  n (nodes in list)   iterative: # of pointer vars   recursive: # of stack frames
  3                    3 (prev, curr, next)            3
  1,000                3 (still just 3!)                1,000
  1,000,000            3 (still just 3!)                1,000,000

Every recursive call (`reverseListRecursive(head.next)`) adds ONE more
frame onto the call stack — a frame that has to stay alive (waiting to
run its `head.next.next = head` line) until the deepest call returns.
With n nodes, you get n stack frames waiting simultaneously. That count
scales directly with n -- that's what makes it O(n) space, in contrast
to approach 1's flat, always-3 count.

So "O(1)" never meant "exactly 1 variable" -- it means "however many
variables you use, that number stays constant and doesn't scale with the
size of the input." 3 fixed variables is just as much O(1) as 1 fixed
variable would be.

Bahasa Indonesia:
Ini titik kebingungan yang sangat umum, jadi mari kita perjelas.
"Space complexity" itu ngukur memori EKSTRA yang dipakai algoritma-nya
DI LUAR input itu sendiri, dan spesifiknya: apakah memori ekstra itu IKUT
MEMBESAR seiring input (n node) membesar, atau tetap FLAT?

Pertama: rantai n node itu sendiri adalah INPUT-nya. Dia udah ada di
memori sebelum fungsi kamu bahkan dijalankan. Approach 1 nggak nyalin
node manapun atau bikin node baru — dia cuma nyambung ulang panah
`.next` dari node-node yang udah ada. Jadi input itu nggak pernah
dihitung sebagai memori "ekstra"; memori ekstra itu cuma berarti memori
BARU yang dialokasikan algoritma kamu DI ATAS input yang udah ada.

Nah, `head` (parameter-nya), `prev`, `curr`, dan `next` itu masing-masing
cuma SATU variabel pointer -- satu kertas kecil yang nyimpen satu alamat
memori (lihat analogi di atas). Punya tiga atau empat variabel kayak gini
daripada cuma satu itu NGGAK ngubah kelas kompleksitasnya, karena JUMLAH
variabel-variabel ini itu TETAP -- nggak pernah bertambah berapapun
panjang list-nya. Mau list-nya isi 3 node atau 3 juta node, approach 1
tetap makai PERSIS 3 variabel pointer yang sama (`prev`, `curr`, `next`)
dari awal sampai akhir. Jumlah yang tetap dan nggak membesar itu PERSIS
arti "O(1)": konstan, berapapun besar inputnya.

Bandingin langsung sama approach 2 (rekursif), di mana space-nya BENERAN
membesar seiring ukuran input:

  n (node di list)    iteratif: jumlah var pointer   rekursif: jumlah stack frame
  3                    3 (prev, curr, next)            3
  1.000                3 (tetap cuma 3!)                1.000
  1.000.000            3 (tetap cuma 3!)                1.000.000

Tiap panggilan rekursif (`reverseListRecursive(head.next)`) nambahin
SATU frame lagi ke call stack -- frame yang harus tetap "hidup"
(nunggu buat ngejalanin baris `head.next.next = head`-nya) sampai
panggilan paling dalam selesai. Dengan n node, kamu punya n stack frame
yang nunggu bersamaan. Jumlah itu membesar sebanding langsung sama n --
itu yang bikin ini O(n) space, kontras sama approach 1 yang jumlahnya
flat, selalu 3.

Jadi "O(1)" itu nggak pernah berarti "persis 1 variabel" -- artinya
"berapapun banyak variabel yang kamu pakai, jumlah itu tetap konstan dan
nggak ikut membesar sama ukuran input." 3 variabel tetap itu sama-sama
O(1) kayak 1 variabel tetap.
*/
