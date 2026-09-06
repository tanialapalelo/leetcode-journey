/*
148. Sort List
Medium

Given the head of a linked list, return the list after sorting it in ascending order.



Example 1:


Input: head = [4,2,1,3]
Output: [1,2,3,4]
Example 2:


Input: head = [-1,5,3,4,0]
Output: [-1,0,3,4,5]
Example 3:

Input: head = []
Output: []


Constraints:

The number of nodes in the list is in the range [0, 5 * 104].
-105 <= Node.val <= 105


Follow up: Can you sort the linked list in O(n logn) time and O(1) memory (i.e. constant space)?
 */

/*
Note: like the other linked-list problems in this repo, `head` here is NOT
an array -- it's a chain of node objects with `.val` and `.next`. LeetCode
just displays it as [4,2,1,3] for readability; the real structure is
4 -> 2 -> 1 -> 3 -> null. This file assumes the standard LeetCode-provided
ListNode class already exists (val, next).

APPROACHES
1. Brute force -> dump all values into an array, sort the array, write the
   sorted values back into the existing nodes. Time: O(n log n), Space: O(n)
2. Top-down merge sort (recursive) -> split the list in half with slow/fast
   pointers, recursively sort each half, merge. Time: O(n log n),
   Space: O(log n) (recursion call stack)
3. Bottom-up merge sort (iterative) -> the true answer to the follow-up:
   same merge sort idea, but driven by a loop instead of recursion, so no
   call stack at all. Time: O(n log n), Space: O(1)
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
// APPROACH 1 — Brute force: extract values, sort the array, write back
// Time: O(n log n) | Space: O(n)
var sortListBrute = function (head) {
    if (!head) return head;

    const values = [];
    let curr = head;
    while (curr) {
        values.push(curr.val);
        curr = curr.next;
    }

    values.sort((a, b) => a - b);

    curr = head;
    let i = 0;
    while (curr) {
        curr.val = values[i++]; // reuse the existing nodes, just overwrite their values
        curr = curr.next;
    }

    return head;
};

// Shared helper for approaches 2 and 3: merge two ALREADY-SORTED lists into one
// (this is the exact same merge step as "21. Merge Two Sorted Lists")
function merge(l1, l2) {
    const dummy = new ListNode(0);
    let tail = dummy;

    while (l1 && l2) {
        if (l1.val <= l2.val) {
            tail.next = l1;
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }
    tail.next = l1 || l2; // attach whichever list still has leftover nodes

    return dummy.next;
}

// APPROACH 2 — Top-down merge sort (recursive)
// Time: O(n log n) | Space: O(log n) (recursion depth)
var sortListRecursive = function (head) {
    if (!head || !head.next) return head; // 0 or 1 node -> already sorted

    // STEP 1: find the middle using slow/fast pointers, then CUT the list in two
    let slow = head;
    let fast = head.next;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    const secondHalf = slow.next;
    slow.next = null; // sever the link -> now two independent lists

    // STEP 2: recursively sort each half on its own
    const left = sortListRecursive(head);
    const right = sortListRecursive(secondHalf);

    // STEP 3: merge the two now-sorted halves back into one sorted list
    return merge(left, right);
};

// APPROACH 3 — Bottom-up merge sort (iterative, true O(1) space)
// Time: O(n log n) | Space: O(1)
function split(head, n) {
    // cuts off the first n nodes starting at head, returns whatever remains after them
    let i = 1;
    let curr = head;
    while (curr && i < n) {
        curr = curr.next;
        i++;
    }
    if (!curr) return null; // fewer than n nodes were available at all
    const rest = curr.next;
    curr.next = null; // sever right after the n-th node
    return rest;
}

var sortListBottomUp = function (head) {
    if (!head || !head.next) return head;

    let n = 0;
    let curr = head;
    while (curr) {
        n++;
        curr = curr.next;
    }

    const dummy = new ListNode(0);
    dummy.next = head;

    // size = 1, then 2, 4, 8, ... -- merge runs of this size across the WHOLE list
    for (let size = 1; size < n; size *= 2) {
        let prev = dummy;
        curr = dummy.next;

        while (curr) {
            const left = curr;
            const right = split(left, size); // cut off a run of `size` nodes -> left
            curr = split(right, size); // cut off the NEXT run of `size` nodes -> right, curr = whatever's left after that

            const merged = merge(left, right);

            prev.next = merged; // stitch the merged run onto the sorted portion so far
            while (prev.next) prev = prev.next; // walk prev to the end of what we just attached
        }
    }

    return dummy.next;
};

/*
WALKTHROUGH (quick reference, read this together with the code above)

English:
head = [4,2,1,3] -> as nodes: 4 -> 2 -> 1 -> 3 -> null

Approach 2 (top-down, recursive):

  sortListRecursive(4->2->1->3)
    split in half (slow/fast): left = 4->2, right = 1->3
    sortListRecursive(4->2)
      split in half: left = 4, right = 2
      sortListRecursive(4) -> just "4" (base case, 1 node)
      sortListRecursive(2) -> just "2" (base case, 1 node)
      merge(4, 2) -> 2->4
    sortListRecursive(1->3)
      split in half: left = 1, right = 3
      sortListRecursive(1) -> just "1"
      sortListRecursive(3) -> just "3"
      merge(1, 3) -> 1->3
    merge(2->4, 1->3) -> compare 2 vs 1 (1 smaller) -> 1
                      -> compare 2 vs 3 (2 smaller) -> 1->2
                      -> compare 4 vs 3 (3 smaller) -> 1->2->3
                      -> only 4 left -> 1->2->3->4
  result: 1 -> 2 -> 3 -> 4 -> null   ✓

Approach 3 (bottom-up, iterative), same input [4,2,1,3], n = 4:

  size = 1 (merge runs of 1 node with the next run of 1 node)
    run A = [4], run B = [2] -> merge -> [2,4]
    run A = [1], run B = [3] -> merge -> [1,3]
    list is now: 2 -> 4 -> 1 -> 3

  size = 2 (merge runs of 2 nodes with the next run of 2 nodes)
    run A = [2,4], run B = [1,3] -> merge -> [1,2,3,4]
    list is now: 1 -> 2 -> 3 -> 4

  size = 4: size is no longer < n (4 < 4 is false) -> loop stops
  result: 1 -> 2 -> 3 -> 4 -> null   ✓

Notice both approaches do the EXACT same merges (pair up [4]+[2], [1]+[3],
then merge the two sorted pairs) -- approach 3 just reaches those merges
by looping over increasing run sizes instead of recursing top-down first.

Bahasa Indonesia:
head = [4,2,1,3] -> sebagai node: 4 -> 2 -> 1 -> 3 -> null

Approach 2 (top-down, rekursif):

  sortListRecursive(4->2->1->3)
    dibagi dua (slow/fast): kiri = 4->2, kanan = 1->3
    sortListRecursive(4->2)
      dibagi dua: kiri = 4, kanan = 2
      sortListRecursive(4) -> cuma "4" (base case, 1 node)
      sortListRecursive(2) -> cuma "2" (base case, 1 node)
      merge(4, 2) -> 2->4
    sortListRecursive(1->3)
      dibagi dua: kiri = 1, kanan = 3
      sortListRecursive(1) -> cuma "1"
      sortListRecursive(3) -> cuma "3"
      merge(1, 3) -> 1->3
    merge(2->4, 1->3) -> banding 2 vs 1 (1 lebih kecil) -> 1
                      -> banding 2 vs 3 (2 lebih kecil) -> 1->2
                      -> banding 4 vs 3 (3 lebih kecil) -> 1->2->3
                      -> sisa cuma 4 -> 1->2->3->4
  hasil: 1 -> 2 -> 3 -> 4 -> null   ✓

Approach 3 (bottom-up, iteratif), input sama [4,2,1,3], n = 4:

  size = 1 (gabungin sepasang run isi 1 node dengan run isi 1 node berikutnya)
    run A = [4], run B = [2] -> merge -> [2,4]
    run A = [1], run B = [3] -> merge -> [1,3]
    list sekarang: 2 -> 4 -> 1 -> 3

  size = 2 (gabungin sepasang run isi 2 node dengan run isi 2 node berikutnya)
    run A = [2,4], run B = [1,3] -> merge -> [1,2,3,4]
    list sekarang: 1 -> 2 -> 3 -> 4

  size = 4: size udah nggak < n lagi (4 < 4 salah) -> loop berhenti
  hasil: 1 -> 2 -> 3 -> 4 -> null   ✓

Perhatikan dua approach ini ngelakuin merge yang PERSIS SAMA ([4]+[2],
[1]+[3], terus gabungin dua pasangan yang udah sorted itu) -- approach 3
cuma nyampe ke merge yang sama itu lewat loop di ukuran run yang makin
membesar, bukan lewat rekursi top-down dulu.

Latihan: coba trace approach 3 pakai [-1,5,3,4,0] (n=5, jadi size akan
jalan 1, 2, 4) di kertas -- perhatikan gimana `split` motong list jadi
potongan-potongan kecil, dan gimana potongan sisa yang lebih pendek
(kurang dari `size`) tetap ditangani dengan benar di akhir.
*/

/*
EXPLANATION (English)

Why this is harder than sorting an array: with an array you get O(1)
random access (`arr[i]`), so classic approaches like quicksort's in-place
partitioning are natural. A linked list has NO random access -- you can
only walk forward node by node. That rules out most in-place array sort
algorithms. Merge sort, on the other hand, only ever needs SEQUENTIAL
access (walk forward, compare, relink) -- which a linked list is perfectly
suited for. That's why merge sort is the standard answer for this problem.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Copy every value out into a plain array, sort the array with JS's builtin
`sort` (which is O(n log n) under the hood), then walk the list ONE more
time and overwrite each node's `.val` with the sorted values in order.

This works, but it defeats the point of the problem: you're not really
"sorting a linked list", you're sorting an array and using the linked
list as a container to write the answer back into. It also uses O(n)
extra space for that array, which the follow-up explicitly asks you to
avoid. Fine as a first answer to show you understand the problem, not the
one to lead with when the follow-up is mentioned.

─── APPROACH 2: Top-down merge sort (recursive) ───────────────────────
The classic merge sort idea, adapted to nodes-and-pointers instead of
array slices:

  1. SPLIT: find the middle node with slow/fast pointers (same trick as
     "48. Middle of the Linked List" in this repo), then physically cut
     the list into two independent lists by setting `slow.next = null`.

  2. RECURSE: sort each half completely on its own by calling
     `sortListRecursive` again. The base case is 0 or 1 node -- a list
     that short is already sorted by definition.

  3. MERGE: the two halves are now each individually sorted. Zip them
     back together in order using the same merge routine as "Merge Two
     Sorted Lists" -- walk both lists side by side, always taking
     whichever front node is smaller, until one list runs out, then
     attach whatever's left of the other.

Why the recursion terminates and is correct: every recursive call works
on a list roughly half the size of its input (because the split point is
always the middle), so after O(log n) levels of splitting you're down to
individual 1-node lists, which are trivially sorted. Merging pairs of
already-sorted lists back up preserves sortedness at every level, all the
way back to the full list.

  Time:  O(log n) levels of splitting × O(n) total work merging at each
         level (every node gets touched exactly once per level during
         merging) = O(n log n).
  Space: O(log n) -- not from any array, but from the RECURSION CALL
         STACK: each recursive call waits for its two children to finish
         before it can merge, and the deepest chain of waiting calls is
         proportional to log n (how many times you can halve n before
         reaching 1).

This is usually accepted as the "optimal" interview answer, even though
it's technically O(log n) space rather than the O(1) the follow-up asks
for -- the O(1) version is approach 3, and is considerably fiddlier to
write correctly, so many interviewers are satisfied once you mention it
exists and explain the idea.

─── APPROACH 3: Bottom-up merge sort (iterative, true O(1) space) ─────
This is what actually answers the follow-up literally: O(n log n) time
AND O(1) space, with no recursion at all (so no call stack cost either).

The core idea: instead of splitting the list all the way down to single
nodes FIRST (top-down) and merging back up, do the exact same merges but
build them from the bottom up, driven by a plain loop:

  - First pass: pretend the list is already made of sorted "runs" of size
    1 (every single node is trivially a sorted run of length 1). Merge
    every ADJACENT pair of size-1 runs into sorted runs of size 2.
  - Second pass: merge every adjacent pair of size-2 runs into sorted
    runs of size 4.
  - Keep doubling the run size each pass, until the run size is >= the
    whole list's length -- at that point there's only one run left, and
    it's the fully sorted list.

To make this work without recursion, you need two helper ideas:

  `split(head, n)`: given a node and a count n, walk forward n-1 steps,
  then CUT the list right after that n-th node (setting its `.next` to
  null), and return whatever node comes right after the cut (the start of
  the "rest" of the list). This is how you carve out one run of a given
  size from the front of whatever's left.

  The main loop, for each `size` (1, 2, 4, 8, ...):
    - walk through the list taking two consecutive runs at a time:
      `left = split(current, size)`'s ORIGINAL start node, and
      `right = split(left, size)` (cut off `size` nodes to get `right`'s
      start), then `curr = split(right, size)` (cut off another `size`
      nodes to find where the NEXT pair of runs starts).
    - merge `left` and `right` (using the same merge() helper as
      approach 2) into one sorted run of size up to `2*size`.
    - stitch that merged run onto the end of the sorted portion built so
      far (using `prev`, which always points at the tail of everything
      merged in this pass so far).
  - once a full pass finishes, double `size` and do it all again, until
    `size` covers the entire list.

Why no recursion is needed: because you're never waiting on a smaller
sub-problem to finish before you can act (like top-down recursion does) --
you're building sorted runs progressively LARGER, pass by pass, entirely
with loops and re-pointing `.next`. Nothing needs to be remembered on a
call stack.

Why the runs don't need to divide evenly: `split` simply returns `null`
if fewer than `n` nodes remain, and `merge` already handles one list
being shorter (or empty) by just attaching whatever's left of the longer
one. So a leftover partial run at the end of a pass merges correctly
with nothing extra needed, it's just one input to merge() being shorter
than requested.

  Time:  O(log n) passes (each pass doubles the run size) × O(n) total
         work merging/splitting per pass (every node is touched a
         constant number of times per pass) = O(n log n).
  Space: O(1) -- only a fixed handful of pointer variables (`prev`,
         `curr`, `left`, `right`, `size`, `n`) regardless of list length.
         No recursion, no extra array -- this is the true answer to the
         follow-up.

─── COMPLEXITY COMPARISON ──────────────────────────────────────────────
                              Time         Space
  1. Brute force               O(n log n)   O(n)
  2. Top-down merge sort       O(n log n)   O(log n)  (recursion stack)
  3. Bottom-up merge sort      O(n log n)   O(1)      (true constant space)


PENJELASAN (Bahasa Indonesia)

Kenapa ini lebih susah dari sorting array biasa: di array kamu punya
akses acak O(1) (`arr[i]`), jadi pendekatan klasik kayak partition
in-place ala quicksort itu natural. Linked list TIDAK PUNYA akses acak --
kamu cuma bisa jalan maju node demi node. Itu bikin kebanyakan algoritma
sort in-place buat array jadi nggak bisa dipakai. Merge sort, di sisi
lain, cuma butuh akses SEQUENTIAL (jalan maju, banding, sambung ulang) --
yang persis cocok buat linked list. Makanya merge sort jadi jawaban
standar buat soal ini.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Salin semua value ke array biasa, sort array-nya pakai `sort` bawaan JS
(yang di baliknya itu O(n log n)), terus jalan lagi SEKALI lagi di list-nya
dan timpa `.val` tiap node pakai value yang udah sorted, berurutan.

Ini jalan, tapi menghilangkan poin soalnya: kamu sebenarnya nggak "nyortir
linked list", kamu nyortir array dan makai linked list-nya cuma sebagai
wadah buat nulis balik jawabannya. Ini juga makai O(n) memori tambahan
buat array itu, yang justru diminta dihindari sama follow-up soalnya.
Oke buat jawaban pertama nunjukin kamu paham soalnya, tapi bukan yang
dipakai kalau follow-up-nya disebut.

─── APPROACH 2: Top-down merge sort (rekursif) ─────────────────────────
Ide merge sort klasik, disesuaikan buat node-dan-pointer, bukan potongan
array:

  1. SPLIT: cari node tengah pakai slow/fast pointer (trik yang sama
     kayak "48. Middle of the Linked List" di repo ini), terus benar-benar
     potong list-nya jadi dua list independen dengan `slow.next = null`.

  2. REKURSI: sortir masing-masing setengah bagian itu sendiri-sendiri
     dengan manggil `sortListRecursive` lagi. Base case-nya 0 atau 1
     node -- list sependek itu udah pasti sorted by definition.

  3. MERGE: dua bagian itu sekarang masing-masing udah sorted sendiri.
     Gabungin balik secara berurutan pakai rutin merge yang sama kayak
     "Merge Two Sorted Lists" -- jalanin dua list bareng-bareng, selalu
     ambil node depan yang lebih kecil, sampai salah satu list habis,
     terus sambungin sisa list yang satunya.

Kenapa rekursinya berhenti dan benar: tiap panggilan rekursif ngerjain
list yang kira-kira separuh ukuran inputnya (karena titik split-nya
selalu di tengah), jadi setelah O(log n) level pembelahan, kamu udah
sampai di list 1-node sendiri-sendiri, yang otomatis sorted. Nge-merge
pasangan list yang udah sorted itu balik ke atas tetap menjaga
ke-sorted-annya di tiap level, sampai balik lagi jadi 1 list utuh.

  Time:  O(log n) level pembelahan × O(n) total kerjaan merge di tiap
         level (tiap node kesentuh persis sekali per level pas merge)
         = O(n log n).
  Space: O(log n) -- bukan dari array, tapi dari CALL STACK REKURSI:
         tiap panggilan rekursif nunggu dua "anak"-nya selesai dulu
         sebelum bisa merge, dan rantai panggilan yang nunggu paling
         dalam itu sebanding sama log n (berapa kali n bisa dibagi 2
         sebelum sampai ke 1).

Ini biasanya diterima sebagai jawaban "optimal" di interview, walau
secara teknis space-nya O(log n), bukan O(1) yang diminta follow-up --
versi O(1)-nya itu approach 3, dan jauh lebih ribet buat ditulis dengan
benar, jadi banyak interviewer udah puas begitu kamu sebutin itu ada dan
jelasin idenya.

─── APPROACH 3: Bottom-up merge sort (iteratif, beneran O(1) space) ───
Ini yang beneran jawab follow-up-nya secara harfiah: O(n log n) time DAN
O(1) space, tanpa rekursi sama sekali (jadi nggak ada biaya call stack
juga).

Ide intinya: daripada motong list-nya sampai ke node satu-satu DULU
(top-down) baru gabungin balik ke atas, lakuin merge yang PERSIS SAMA
tapi dibangun dari bawah ke atas, digerakkan pakai loop biasa:

  - Pass pertama: anggap list-nya udah berupa "run" sorted ukuran 1
    (tiap node sendiri otomatis jadi run sorted panjang 1). Gabungin
    tiap SEPASANG run ukuran 1 yang bersebelahan jadi run sorted ukuran 2.
  - Pass kedua: gabungin tiap sepasang run ukuran 2 yang bersebelahan
    jadi run sorted ukuran 4.
  - Terus gandain ukuran run tiap pass, sampai ukuran run-nya >= panjang
    seluruh list -- di titik itu cuma tersisa 1 run, dan itu list yang
    udah sorted penuh.

Biar ini bisa jalan tanpa rekursi, butuh dua ide bantu:

  `split(head, n)`: dikasih satu node dan hitungan n, jalan maju n-1
  langkah, terus POTONG list-nya persis setelah node ke-n itu (set
  `.next`-nya jadi null), dan return node yang ada persis setelah
  potongan itu (awal dari "sisa" list-nya). Ini caranya buat ngiris satu
  run dengan ukuran tertentu dari depan sisa list yang ada.

  Loop utamanya, buat tiap `size` (1, 2, 4, 8, ...):
    - jalan di list-nya, ambil dua run berurutan sekaligus:
      `left` = node awal yang asli, `right = split(left, size)` (potong
      `size` node buat dapetin awal `right`), terus
      `curr = split(right, size)` (potong `size` node lagi buat nemuin
      awal pasangan run BERIKUTNYA).
    - merge `left` dan `right` (pakai helper merge() yang sama kayak
      approach 2) jadi satu run sorted berukuran sampai `2*size`.
    - sambungin run yang udah di-merge itu ke ujung bagian yang udah
      sorted sejauh ini (pakai `prev`, yang selalu nunjuk ke ekor dari
      semua yang udah di-merge di pass ini).
  - begitu satu pass selesai, gandain `size` dan ulangi lagi, sampai
    `size` udah nyakup seluruh list.

Kenapa nggak butuh rekursi: karena kamu nggak pernah nunggu sub-masalah
yang lebih kecil selesai dulu sebelum bisa bertindak (kayak rekursi
top-down) -- kamu membangun run yang sorted, makin lama makin BESAR,
pass demi pass, sepenuhnya pakai loop dan nyambung ulang `.next`. Nggak
ada yang perlu diingat di call stack.

Kenapa run-nya nggak harus kebagi rata: `split` tinggal return `null`
kalau node yang tersisa kurang dari `n`, dan `merge` udah otomatis
nangani kalau salah satu list lebih pendek (atau kosong) dengan tinggal
nyambungin sisa list yang lebih panjang. Jadi sisa run yang nggak penuh
di akhir satu pass tetap ke-merge dengan benar tanpa perlu penanganan
khusus tambahan -- itu cuma salah satu input merge() yang lebih pendek
dari yang diminta.

  Time:  O(log n) pass (tiap pass gandain ukuran run) × O(n) total
         kerjaan merge/split per pass (tiap node kesentuh jumlah tetap
         kali per pass) = O(n log n).
  Space: O(1) -- cuma segenggam variabel pointer tetap (`prev`, `curr`,
         `left`, `right`, `size`, `n`) berapapun panjang list-nya. Nggak
         ada rekursi, nggak ada array tambahan -- ini jawaban sebenarnya
         buat follow-up-nya.

─── PERBANDINGAN KOMPLEKSITAS ──────────────────────────────────────────
                              Time         Space
  1. Brute force               O(n log n)   O(n)
  2. Top-down merge sort       O(n log n)   O(log n)  (call stack rekursi)
  3. Bottom-up merge sort      O(n log n)   O(1)      (beneran constant space)
*/
