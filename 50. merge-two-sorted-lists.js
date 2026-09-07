/*
21. Merge Two Sorted Lists
Easy

You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.



Example 1:


Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
Example 2:

Input: list1 = [], list2 = []
Output: []
Example 3:

Input: list1 = [], list2 = [0]
Output: [0]


Constraints:

The number of nodes in both lists is in the range [0, 50].
-100 <= Node.val <= 100
Both list1 and list2 are sorted in non-decreasing order.

 */

/*
Note: this is the exact same "merge two sorted runs" step already used
inside "44. sort-list.js" in this repo (the `merge()` helper there). It's
worth understanding on its own here, since it's the building block that
merge sort for linked lists depends on.
 */

/* APPROACHES
1. Iterative with a dummy (sentinel) head node -> Time: O(n+m), Space: O(1)
2. Recursive -> Time: O(n+m), Space: O(n+m) (call stack depth)
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
// APPROACH 1 — Iterative with a dummy head node
// Time: O(n + m) | Space: O(1)
var mergeTwoLists = function(list1, list2) {
    const dummy = new ListNode(0);
    // does not matter 0 / 1 / whatever value since we only need .next to store the merged nodes from the start
    let merged = dummy; // reference to dummy listnode

    while(list1 !== null && list2 !== null){
        if(list1.val < list2.val){
            merged.next = list1;
            list1 = list1.next;
        }
        else{
            merged.next = list2;
            list2 = list2.next;
        }
        merged = merged.next;
    }

    // one list ran out -- the other one is already fully sorted on its own,
    // so just splice the rest of it on in one shot, no more comparisons needed
    merged.next = list1 !== null ? list1 : list2;

    // we can't return merged.next or merged.next.next because now merge is at the last node and
    // since it's singly linked list, there's no way to track to .prev.prev so we use dummy that
    // starts at the whatever node and access the next node which stores all the merged nodes
    return dummy.next;
};


/*
WALKTHROUGH — Approach 1 (Iterative with dummy node)

English:
list1 = [1,2,4], list2 = [1,3,4]
dummy -> (nothing yet), merged = dummy

Note the condition is `list1.val < list2.val` (strict less-than, NOT
<=) -- so on a TIE, the else branch fires and list2's node gets taken
first instead of list1's. This doesn't change the final sorted VALUES at
all (merging only needs the numbers in non-decreasing order, it doesn't
matter which original list a tied value came from) -- it only changes
which physical node ends up first among equal values. Watch step 1 below
for exactly this case.

  step 1: list1.val=1 < list2.val=1 -> FALSE (tie!) -> attach list2's node(1)
          merged=node(1 from list2), list2 -> node(3)
          merged so far: 1
  step 2: list1.val=1 < list2.val=3 -> TRUE -> attach list1's node(1)
          merged=node(1 from list1), list1 -> node(2)
          merged so far: 1,1
  step 3: list1.val=2 < list2.val=3 -> TRUE -> attach list1's node(2)
          merged=node(2), list1 -> node(4)
          merged so far: 1,1,2
  step 4: list1.val=4 < list2.val=3 -> FALSE -> attach list2's node(3)
          merged=node(3), list2 -> node(4)
          merged so far: 1,1,2,3
  step 5: list1.val=4 < list2.val=4 -> FALSE (tie again!) -> attach list2's node(4)
          merged=node(4 from list2), list2 -> null
          merged so far: 1,1,2,3,4

  loop ends (list2 is null)
  merged.next = list1 !== null ? list1 : list2 -> list1 is NOT null (still node(4)) -> attach it
          merged so far: 1,1,2,3,4,4

  return dummy.next -> 1,1,2,3,4,4   ✓ matches expected output
  (same VALUES as if `<=` had been used -- only which node was picked
  first on the two ties differs, not the final sorted sequence)

Bahasa Indonesia:
list1 = [1,2,4], list2 = [1,3,4]
dummy -> (belum ada apa-apa), merged = dummy

Perhatikan kondisinya `list1.val < list2.val` (strict less-than, BUKAN
<=) -- jadi kalau SERI, cabang else yang jalan dan node dari list2 yang
diambil duluan, bukan dari list1. Ini sama sekali nggak mengubah nilai
akhir yang sorted (merge cuma butuh angkanya non-decreasing, nggak
peduli nilai yang seri itu asalnya dari list mana) -- yang berubah cuma
node fisik mana yang duluan di antara nilai yang sama. Perhatikan langkah
1 di bawah, persis kasus ini.

  langkah 1: list1.val=1 < list2.val=1 -> SALAH (seri!) -> sambung node(1) dari list2
             merged=node(1 dari list2), list2 -> node(3)
             hasil sejauh ini: 1
  langkah 2: list1.val=1 < list2.val=3 -> BENAR -> sambung node(1) dari list1
             merged=node(1 dari list1), list1 -> node(2)
             hasil sejauh ini: 1,1
  langkah 3: list1.val=2 < list2.val=3 -> BENAR -> sambung node(2) dari list1
             merged=node(2), list1 -> node(4)
             hasil sejauh ini: 1,1,2
  langkah 4: list1.val=4 < list2.val=3 -> SALAH -> sambung node(3) dari list2
             merged=node(3), list2 -> node(4)
             hasil sejauh ini: 1,1,2,3
  langkah 5: list1.val=4 < list2.val=4 -> SALAH (seri lagi!) -> sambung node(4) dari list2
             merged=node(4 dari list2), list2 -> null
             hasil sejauh ini: 1,1,2,3,4

  loop selesai (list2 sudah null)
  merged.next = list1 !== null ? list1 : list2 -> list1 BUKAN null (masih node(4)) -> sambungin
             hasil sejauh ini: 1,1,2,3,4,4

  return dummy.next -> 1,1,2,3,4,4   ✓ cocok sama expected output
  (NILAI-nya sama persis kayak kalau pakai `<=` -- yang beda cuma node
  mana yang diambil duluan pas dua kali seri, bukan urutan akhirnya)

Latihan: coba trace manual list1 = [], list2 = [0] -- perhatikan loop
`while` nggak jalan sama sekali (karena list1 langsung null), dan
`merged.next = list1 !== null ? list1 : list2` langsung nyambungin
seluruh list2 dalam 1 langkah.
*/

// APPROACH 2 — Recursive
// Time: O(n + m) | Space: O(n + m) ← call stack grows with each node visited
var mergeTwoListsRecursive = function (list1, list2) {
    if (list1 === null) return list2; // one side ran out -> the rest of the other side is already sorted
    if (list2 === null) return list1;

    if (list1.val <= list2.val) {
        list1.next = mergeTwoListsRecursive(list1.next, list2); // merge the REST, then hang it off list1
        return list1;
    } else {
        list2.next = mergeTwoListsRecursive(list1, list2.next);
        return list2;
    }
};

/*
WALKTHROUGH — Approach 2 (Recursive)

English:
list1 = [a1=1, a2=2, a3=4], list2 = [b1=1, b2=3, b3=4]
(using a1/a2/a3 and b1/b2/b3 as labels so two different nodes that both
happen to hold the value 4 don't get confused with each other)

Call stack goes DOWN like this (each line decides which node comes next,
then recurses on "everything after that"):

  merge(a1=1, b1=1)
  1 <= 1 -> keep a1, recurse merge(a2, b1)
    merge(a2=2, b1=1)
    2 > 1  -> keep b1, recurse merge(a2, b2)
      merge(a2=2, b2=3)
      2 <= 3 -> keep a2, recurse merge(a3, b2)
        merge(a3=4, b2=3)
        4 > 3  -> keep b2, recurse merge(a3, b3)
          merge(a3=4, b3=4)
          4 <= 4 -> keep a3, recurse merge(null, b3)
            merge(null, b3=4)
            -> base case, a3.next is null -> return b3

Then the call stack unwinds back UP, and each level attaches its own
chosen node in front of whatever chain came back from below:

            returns b3                                  chain: [4]
        -> a3.next = b3  -> returns a3                   chain: [4, 4]
      -> b2.next = a3    -> returns b2                   chain: [3, 4, 4]
    -> a2.next = b2      -> returns a2                   chain: [2, 3, 4, 4]
  -> b1.next = a2        -> returns b1                   chain: [1, 2, 3, 4, 4]
-> a1.next = b1          -> returns a1                   chain: [1, 1, 2, 3, 4, 4]

  Final result, read from the top-level return value (a1): 1,1,2,3,4,4   ✓

Bahasa Indonesia:
list1 = [a1=1, a2=2, a3=4], list2 = [b1=1, b2=3, b3=4]
(pakai label a1/a2/a3 dan b1/b2/b3 biar dua node beda yang kebetulan
sama-sama nyimpen nilai 4 nggak ketuker satu sama lain)

Call stack-nya turun ke bawah kayak gini (tiap baris mutusin node mana
yang duluan, terus rekursi buat "semua yang setelah itu"):

  merge(a1=1, b1=1)
  1 <= 1 -> ambil a1, rekursi merge(a2, b1)
    merge(a2=2, b1=1)
    2 > 1  -> ambil b1, rekursi merge(a2, b2)
      merge(a2=2, b2=3)
      2 <= 3 -> ambil a2, rekursi merge(a3, b2)
        merge(a3=4, b2=3)
        4 > 3  -> ambil b2, rekursi merge(a3, b3)
          merge(a3=4, b3=4)
          4 <= 4 -> ambil a3, rekursi merge(null, b3)
            merge(null, b3=4)
            -> base case, a3.next null -> return b3

Terus call stack-nya kebuka gulung balik ke ATAS, dan tiap level
nyambungin node pilihannya sendiri di depan rantai yang balik dari bawah:

            return b3                                    rantai: [4]
        -> a3.next = b3  -> return a3                     rantai: [4, 4]
      -> b2.next = a3    -> return b2                      rantai: [3, 4, 4]
    -> a2.next = b2      -> return a2                       rantai: [2, 3, 4, 4]
  -> b1.next = a2        -> return b1                        rantai: [1, 2, 3, 4, 4]
-> a1.next = b1          -> return a1                         rantai: [1, 1, 2, 3, 4, 4]

  Hasil akhir, dibaca dari nilai return paling atas (a1): 1,1,2,3,4,4   ✓

Latihan: coba trace manual list1 = [5], list2 = [1,2,3] di kertas --
perhatikan base case mana yang kena duluan (list1 abis lebih cepat di
sini), dan gimana urutan "nempel"-nya beda dari contoh utama.
*/

/*
EXPLANATION

─── WHY A DUMMY (SENTINEL) NODE IN APPROACH 1? ─────────────────────────
Without it, you'd need extra logic just to figure out what the very
first node of the merged list should be -- it could come from either
list1 or list2, whichever has the smaller starting value, and you'd need
a separate variable to remember that first node while a second "merged"
pointer moves ahead to keep building the rest.

The dummy node sidesteps this entirely: start with one throwaway node
that isn't part of the answer, and let `merged` begin there. No matter
which list's node ends up attached first, it lands at `dummy.next`. At
the very end, you just return `dummy.next` -- the dummy itself is
discarded, having done its only job of giving `merged` somewhere safe to
start.

─── `const dummy = new ListNode(0); let merged = dummy;` -- what ACTUALLY happens ──

English:
`new ListNode(0)` creates one real node object. Its value `0` is never
read or returned -- it exists purely as a throwaway placeholder whose
only job is to have a `.next` slot for real nodes to attach to.

`let merged = dummy` copies dummy's ADDRESS into `merged` (same reference
mechanics as every linked list problem in this repo). Right after this
line, `dummy` and `merged` are two separate variables that happen to point
at the exact same node -- proven for real:

  const dummy = new ListNode(0);
  let merged = dummy;
  console.log(merged === dummy);   // true

Now trace what happens on the FIRST iteration, merging list1=[1,2] and
list2=[3]:

  merged.next = list1;   // merged IS dummy right now, so this writes into
                        // dummy's own .next slot -> dummy.next becomes node(1)
  merged = merged.next;     // merged is REASSIGNED to point at node(1) instead.
                        // dummy is untouched -- it's a separate variable,
                        // it doesn't move just because merged moved.

  console.log(merged === dummy);   // false -- they've now split apart

This is the one moment that matters: because `merged` was still equal to
`dummy` during that very first `merged.next = ...` write, the write landed
on `dummy.next`. Every write AFTER that happens on whatever node `merged`
has since moved to -- never on `dummy` again. So `dummy.next` gets set
EXACTLY ONCE, on the first real node attached, and is never touched
again for the rest of the function. That's why `return dummy.next` at
the end reliably gives you the true head, no matter how many more times
`merged` moved forward afterward.

Real verified trace (list1=[1,2], list2=[3], merging into [1,2,3]):

  before loop:  merged === dummy -> true
  after step 1: merged now at node(1) | merged === dummy -> false | dummy.next.val = 1
  after step 2: merged now at node(2) | merged === dummy -> false | dummy.next.val = 1  (unchanged!)

Picture it like this: `dummy` is a signpost planted once at the very
start and never moved again. `merged` is the hand that keeps walking
forward, doing all the actual work of extending the chain. At the end,
you don't need to remember where you've been -- you just walk back to
the signpost you planted at the beginning and read what it's pointing at.

Why you CAN'T do `merged.next.next` instead: a singly linked list only has
FORWARD arrows (`.next`), never backward ones. Once `merged` has walked
forward past the first node, there is no arrow leading back to it --
that address is simply lost unless something else still remembers it.
`dummy` is that "something else": a variable deliberately left behind,
untouched, specifically so you can still ask "what was first?" after
`merged` has wandered far away.

─── WHAT IF YOU DON'T USE A DUMMY? (it's possible, just clunkier) ──────
You CAN avoid the dummy node -- it's not a strict requirement, just the
cleanest way to write this. Here's a version without one, using explicit
`head`/`tail` variables instead:

  var mergeNoDummy = function(list1, list2) {
      let head = null; // a separate variable, deliberately left untouched
      let tail = null; // once it's set, exactly like dummy.next above

      while (list1 !== null && list2 !== null) {
          let chosen;
          if (list1.val <= list2.val) { chosen = list1; list1 = list1.next; }
          else { chosen = list2; list2 = list2.next; }

          if (head === null) {      // <- extra branch: "is this the very first pick?"
              head = chosen;
              tail = chosen;
          } else {
              tail.next = chosen;
              tail = chosen;
          }
      }

      if (head === null) return list1 !== null ? list1 : list2; // extra edge case
      tail.next = list1 !== null ? list1 : list2;
      return head;
  };

This works and produces identical output. But notice the cost: you now
need an `if (head === null)` check on EVERY single iteration, even
though it's only ever true once (the very first pick) -- every
subsequent iteration pays for a check that will always be false. You
also need a separate `if (head === null) return ...` at the end to
handle the edge case where both lists were empty from the start (with
the dummy version, `dummy.next` is already `null` in that case
automatically, no extra check needed).

The dummy trick removes that branch entirely: because `tail` genuinely
starts out AS `dummy`, the very first `tail.next = chosen` write and
every later one use the exact same line of code -- no special-casing
required. It's less code doing exactly the same job by leaning on how
references work rather than an explicit flag.

Bahasa Indonesia:
`new ListNode(0)` bikin satu objek node beneran. Value `0`-nya nggak
pernah dibaca atau dikembalikan -- dia ada murni sebagai placeholder
buangan yang tugasnya cuma nyediain slot `.next` buat node beneran nempel.

`let merged = dummy` nyalin ALAMAT dummy ke `merged` (mekanisme reference
yang sama kayak semua soal linked list di repo ini). Persis setelah baris
ini, `dummy` dan `merged` itu dua variabel terpisah yang kebetulan nunjuk
ke node yang persis sama -- dibuktikan beneran:

  const dummy = new ListNode(0);
  let merged = dummy;
  console.log(merged === dummy);   // true

Sekarang trace apa yang terjadi di iterasi PERTAMA, gabungin list1=[1,2]
dan list2=[3]:

  merged.next = list1;   // merged LAGI = dummy saat ini, jadi ini nulis ke
                        // slot .next milik dummy sendiri -> dummy.next jadi node(1)
  merged = merged.next;     // merged DITIMPA jadi nunjuk ke node(1) sebagai gantinya.
                        // dummy nggak kesentuh -- dia variabel terpisah,
                        // dia nggak ikut pindah cuma karena merged pindah.

  console.log(merged === dummy);   // false -- sekarang mereka udah "pisah jalan"

Ini momen yang paling penting: karena `merged` MASIH sama dengan `dummy`
tepat pas penulisan `merged.next = ...` yang PERTAMA itu, penulisannya
mendarat di `dummy.next`. Setiap penulisan SETELAH itu terjadi di node
manapun yang `merged` udah pindah ke situ -- nggak pernah lagi ke `dummy`.
Jadi `dummy.next` cuma di-set PERSIS SEKALI, di node pertama yang beneran
disambung, dan nggak pernah disentuh lagi seumur hidup fungsi ini. Itu
kenapa `return dummy.next` di akhir bisa diandalkan ngasih head yang
benar, nggak peduli udah berapa kali `merged` pindah maju sesudahnya.

Trace nyata yang udah diverifikasi (list1=[1,2], list2=[3], hasil [1,2,3]):

  sebelum loop:   merged === dummy -> true
  setelah step 1: merged sekarang di node(1) | merged === dummy -> false | dummy.next.val = 1
  setelah step 2: merged sekarang di node(2) | merged === dummy -> false | dummy.next.val = 1  (nggak berubah!)

Bayangin gini: `dummy` itu papan penunjuk yang ditancep sekali di awal
dan nggak pernah dipindah lagi. `merged` itu tangan yang terus jalan maju,
ngerjain semua kerjaan nyambung-nyambung rantainya. Di akhir, kamu nggak
perlu inget udah lewat mana aja -- kamu tinggal jalan balik ke papan
penunjuk yang kamu tancep di awal, dan baca dia lagi nunjuk ke mana.

Kenapa nggak bisa pakai `merged.next.next`: linked list singular cuma
punya panah MAJU (`.next`), nggak pernah ada panah balik. Begitu `merged`
udah jalan maju ngelewatin node pertama, nggak ada panah yang nuntun
balik ke situ -- alamatnya ilang begitu aja kecuali ada sesuatu yang lain
yang masih inget. `dummy` itu "sesuatu yang lain" itu: variabel yang
sengaja ditinggal, nggak disentuh, khusus biar kamu masih bisa nanya
"tadi yang pertama itu apa?" setelah `merged` udah jalan jauh.

─── GIMANA KALAU NGGAK PAKAI DUMMY? (bisa, cuma lebih ribet) ──────────
Kamu BISA menghindari dummy node -- itu bukan keharusan mutlak, cuma
cara paling bersih buat nulisnya. Ini versi tanpa dummy, pakai variabel
`head`/`tail` eksplisit:

  var mergeNoDummy = function(list1, list2) {
      let head = null; // variabel terpisah, sengaja dibiarin nggak disentuh
      let tail = null; // begitu di-set, persis kayak dummy.next di atas

      while (list1 !== null && list2 !== null) {
          let chosen;
          if (list1.val <= list2.val) { chosen = list1; list1 = list1.next; }
          else { chosen = list2; list2 = list2.next; }

          if (head === null) {      // <- cabang ekstra: "apakah ini pilihan pertama?"
              head = chosen;
              tail = chosen;
          } else {
              tail.next = chosen;
              tail = chosen;
          }
      }

      if (head === null) return list1 !== null ? list1 : list2; // edge case ekstra
      tail.next = list1 !== null ? list1 : list2;
      return head;
  };

Ini jalan dan hasilnya identik. Tapi perhatiin harganya: sekarang kamu
butuh cek `if (head === null)` di SETIAP iterasi, padahal itu cuma
pernah bener SEKALI (pilihan yang paling pertama) -- setiap iterasi
sesudahnya tetap bayar buat cek yang hasilnya selalu false. Kamu juga
butuh `if (head === null) return ...` terpisah di akhir buat nangkep
edge case kedua list kosong dari awal (dengan versi dummy, `dummy.next`
udah otomatis `null` di kasus itu, nggak perlu cek tambahan).

Trik dummy ngilangin cabang itu sepenuhnya: karena `tail` beneran mulai
SEBAGAI `dummy`, penulisan `tail.next = chosen` yang pertama dan yang
sesudah-sesudahnya makai baris kode yang PERSIS SAMA -- nggak perlu
penanganan khusus. Ini kode yang lebih sedikit buat ngerjain tugas yang
persis sama, dengan manfaatin cara kerja reference alih-alih pakai flag
eksplisit.

─── WHY IS THE FINAL `merged.next = list1 !== null ? list1 : list2` SAFE? ──
Once the while loop ends, EXACTLY one of `list1`/`list2` is null (the one
that ran out first) and the other one still has some nodes left. Those
remaining nodes are guaranteed to ALREADY be sorted among themselves
(that was given in the problem: both input lists are sorted). So there's
no need to keep comparing node by node anymore -- you can just splice the
entire remaining chain onto the end in one assignment, and the whole
result stays sorted.

─── APPROACH 1: Iterative ──────────────────────────────────────────────
  Time:  O(n + m) -- every node from both lists is visited exactly once.
  Space: O(1) -- `dummy` and `merged` are just two pointer variables that
         get reused/overwritten throughout, never growing with input size
         (same reasoning as the linked list problems earlier in this repo).

─── APPROACH 2: Recursive ──────────────────────────────────────────────
Same core comparison (`list1.val <= list2.val`), but instead of a loop
building the chain forward with a `merged` pointer, each call picks the
smaller of the two current front nodes, then asks recursion to handle
"merge everything after this" and hangs that result off the chosen
node's `.next`.

  Time:  O(n + m) -- one recursive call per node from both lists combined.
  Space: O(n + m) -- one stack frame is kept alive per call until the
         base case is hit and the whole chain of calls starts returning,
         so the deepest point of recursion is proportional to the total
         number of nodes across both lists.

─── WHICH TO USE? ──────────────────────────────────────────────────────
  Iterative → preferred in practice (O(1) space, no stack overflow risk
              on very long lists)
  Recursive → shorter to write and easy to reason about, good to show
              you know both -- and it's worth recognizing because
              "44. sort-list.js" in this repo builds directly on this
              exact merge logic to merge sort an entire list.

─── COMPLEXITY COMPARISON ──────────────────────────────────────────────
                Time         Space
  1. Iterative   O(n+m)       O(1)
  2. Recursive   O(n+m)       O(n+m)


PENJELASAN (Bahasa Indonesia)

─── KENAPA PAKAI DUMMY (SENTINEL) NODE DI APPROACH 1? ──────────────────
Tanpa itu, kamu butuh logika tambahan cuma buat mikirin node PERTAMA
dari list hasil merge itu harusnya yang mana -- bisa dari list1 atau
list2, tergantung mana yang nilai awalnya lebih kecil, dan kamu butuh
variabel terpisah buat inget node pertama itu sementara pointer "merged"
kedua jalan terus buat ngebangun sisanya.

Dummy node ngilangin masalah ini sepenuhnya: mulai dengan satu node
"buangan" yang bukan bagian dari jawaban, dan biarin `merged` mulai di
situ. Nggak peduli node dari list mana yang ke-sambung duluan, dia bakal
mendarat di `dummy.next`. Di akhir, kamu tinggal return `dummy.next` --
dummy-nya sendiri dibuang, tugasnya cuma ngasih `merged` tempat aman buat
mulai.

─── KENAPA `merged.next = list1 !== null ? list1 : list2` DI AKHIR ITU AMAN? ──
Begitu while loop-nya selesai, PERSIS SATU dari `list1`/`list2` udah null
(yang duluan abis) dan yang satunya masih ada sisa node. Sisa node itu
DIJAMIN udah sorted di antara mereka sendiri (itu dikasih tau di soal:
kedua list input udah sorted). Jadi nggak perlu lagi bandingin node satu-
satu -- kamu tinggal nyambungin SELURUH sisa rantai itu dalam satu kali
assignment, dan hasil akhirnya tetap sorted.

─── APPROACH 1: Iteratif ────────────────────────────────────────────────
  Time:  O(n + m) -- tiap node dari kedua list dikunjungi persis sekali.
  Space: O(1) -- `dummy` dan `merged` itu cuma dua variabel pointer yang
         dipakai ulang/ditimpa terus sepanjang proses, nggak pernah
         bertambah seiring ukuran input (alasan yang sama kayak soal-soal
         linked list sebelumnya di repo ini).

─── APPROACH 2: Rekursif ────────────────────────────────────────────────
Perbandingan intinya sama (`list1.val <= list2.val`), tapi daripada loop
yang ngebangun rantai maju pakai pointer `merged`, tiap panggilan milih
yang lebih kecil dari dua node depan saat ini, terus minta rekursi buat
nanganin "merge semua yang setelah ini" dan nyambungin hasilnya ke
`.next` dari node yang dipilih.

  Time:  O(n + m) -- satu panggilan rekursif per node dari total kedua list.
  Space: O(n + m) -- satu stack frame tetap "hidup" per panggilan sampai
         base case ketemu dan seluruh rantai panggilan mulai return, jadi
         titik rekursi paling dalam sebanding sama total jumlah node di
         kedua list.

─── MANA YANG DIPAKAI? ──────────────────────────────────────────────────
  Iteratif  → lebih disukai di praktiknya (O(1) space, nggak ada risiko
              stack overflow di list yang sangat panjang)
  Rekursif  → lebih singkat ditulis dan gampang dipikir, bagus buat
              nunjukin kamu paham dua-duanya -- dan ini penting dikenalin
              karena "44. sort-list.js" di repo ini langsung makai logika
              merge yang PERSIS SAMA ini buat merge sort seluruh list.

─── PERBANDINGAN KOMPLEKSITAS ──────────────────────────────────────────
                Time         Space
  1. Iteratif    O(n+m)       O(1)
  2. Rekursif    O(n+m)       O(n+m)
*/
