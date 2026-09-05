/*
153. Find Minimum in Rotated Sorted Array
Medium

Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:

[4,5,6,7,0,1,2] if it was rotated 4 times.
[0,1,2,4,5,6,7] if it was rotated 7 times.
Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].

Given the sorted rotated array nums of unique elements, return the minimum element of this array.

You must write an algorithm that runs in O(log n) time.



Example 1:

Input: nums = [3,4,5,1,2]
Output: 1
Explanation: The original array was [1,2,3,4,5] rotated 3 times.
Example 2:

Input: nums = [4,5,6,7,0,1,2]
Output: 0
Explanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.
Example 3:

Input: nums = [11,13,15,17]
Output: 11
Explanation: The original array was [11,13,15,17] and it was rotated 4 times.


Constraints:

n == nums.length
1 <= n <= 5000
-5000 <= nums[i] <= 5000
All the integers of nums are unique.
nums is sorted and rotated between 1 and n times.
 */

/* APPROACHES
1. Brute force -> just scan and track the min, ignores that it's sorted/rotated. Time: O(n), Space: O(1)
2. Video approach -> modified binary search that keeps a running "ans" and checks both the
   whole window and mid on every iteration. Time: O(log n), Space: O(1)
3. Classic/cleaner binary search -> same idea, but compares nums[mid] to nums[right] and needs
   no separate "ans" variable. Time: O(log n), Space: O(1)
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
// APPROACH 1 — Brute force: scan everything, track the smallest value seen
// Time: O(n) | Space: O(1)
var findMinBrute = function (nums) {
    let ans = nums[0];
    for (let i = 1; i < nums.length; i++) {
        ans = Math.min(ans, nums[i]);
    }
    return ans;
};

// APPROACH 2 — The approach from the video: binary search + running "ans"
// Time: O(log n) | Space: O(1)
var findMinVideo = function (nums) {
    let left = 0;
    let right = nums.length - 1;
    let ans = Infinity;

    while (left <= right) {
        // If THIS WHOLE window is already sorted left-to-right (no rotation point
        // inside it), its own smallest value is simply its first element.
        if (nums[left] < nums[right]) {
            ans = Math.min(ans, nums[left]);
        }

        const mid = Math.floor((left + right) / 2);

        // Always consider mid as a candidate too -- the rotation point (where the
        // small values start) tends to land near/at mid as the search narrows down.
        ans = Math.min(ans, nums[mid]);

        if (nums[left] <= nums[mid]) {
            // left..mid is sorted ascending -> the rotation point (and the true
            // minimum) must be somewhere in mid+1..right instead -> discard left half
            left = mid + 1;
        } else {
            // nums[left] > nums[mid] means the array "wrapped around" somewhere
            // inside left..mid -> the rotation point is in there -> keep searching there
            right = mid - 1;
        }
    }

    return ans;
};

// APPROACH 3 — Classic/cleaner binary search (no separate "ans" tracker needed)
// Time: O(log n) | Space: O(1)
var findMin = function (nums) {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] > nums[right]) {
            // pivot (rotation point) is to the right of mid -> minimum is there too
            left = mid + 1;
        } else {
            // nums[mid] <= nums[right] means right half (mid..right) is sorted,
            // so the minimum is at mid or somewhere to its left -> keep mid in range
            right = mid;
        }
    }

    // left === right here -> that single index IS the minimum
    return nums[left];
};

/*
WALKTHROUGH — Approach 2, the video's code (quick reference, read this together with the code above)

English:
nums = [3,4,5,1,2]   (indices: 0:3  1:4  2:5  3:1  4:2)

  step 1: left=0(3) right=4(2)
    nums[left]<nums[right]? 3<2 false -> skip
    mid=2 -> nums[mid]=5 -> ans=min(Inf,5)=5
    nums[left]<=nums[mid]? 3<=5 true -> left half sorted -> left=3

  step 2: left=3(1) right=4(2)
    nums[left]<nums[right]? 1<2 true -> ans=min(5,1)=1
    mid=3 -> nums[mid]=1 -> ans=min(1,1)=1
    nums[left]<=nums[mid]? 1<=1 true -> left=4

  step 3: left=4(2) right=4(2)
    nums[left]<nums[right]? 2<2 false -> skip
    mid=4 -> nums[mid]=2 -> ans=min(1,2)=1
    nums[left]<=nums[mid]? 2<=2 true -> left=5

  loop ends (left=5 > right=4) -> return ans = 1  ✓

nums = [4,5,6,7,0,1,2]  (indices: 0:4 1:5 2:6 3:7 4:0 5:1 6:2)

  step 1: left=0(4) right=6(2)
    nums[left]<nums[right]? 4<2 false -> skip
    mid=3 -> nums[mid]=7 -> ans=min(Inf,7)=7
    nums[left]<=nums[mid]? 4<=7 true -> left=4

  step 2: left=4(0) right=6(2)
    nums[left]<nums[right]? 0<2 true -> ans=min(7,0)=0   <-- caught here!
    mid=5 -> nums[mid]=1 -> ans=min(0,1)=0
    nums[left]<=nums[mid]? 0<=1 true -> left=6

  step 3: left=6(2) right=6(2)
    nums[left]<nums[right]? 2<2 false -> skip
    mid=6 -> nums[mid]=2 -> ans=min(0,2)=0
    nums[left]<=nums[mid]? 2<=2 true -> left=7

  loop ends (left=7 > right=6) -> return ans = 0  ✓

Notice in step 2 of the second example: the moment the window [0,1,2]
(indices 4..6, already fully sorted) is detected via `nums[left] < nums[right]`,
`ans` locks onto 0 immediately. Everything after that just keeps confirming
0 is still the best.

Bahasa Indonesia:
nums = [3,4,5,1,2]   (index: 0:3  1:4  2:5  3:1  4:2)

  step 1: left=0(3) right=4(2)
    nums[left]<nums[right]? 3<2 false -> skip
    mid=2 -> nums[mid]=5 -> ans=min(Inf,5)=5
    nums[left]<=nums[mid]? 3<=5 true -> left half sorted -> left=3

  step 2: left=3(1) right=4(2)
    nums[left]<nums[right]? 1<2 true -> ans=min(5,1)=1
    mid=3 -> nums[mid]=1 -> ans=min(1,1)=1
    nums[left]<=nums[mid]? 1<=1 true -> left=4

  step 3: left=4(2) right=4(2)
    nums[left]<nums[right]? 2<2 false -> skip
    mid=4 -> nums[mid]=2 -> ans=min(1,2)=1
    nums[left]<=nums[mid]? 2<=2 true -> left=5

  loop selesai (left=5 > right=4) -> return ans = 1  ✓

nums = [4,5,6,7,0,1,2]  (index: 0:4 1:5 2:6 3:7 4:0 5:1 6:2)

  step 1: left=0(4) right=6(2)
    nums[left]<nums[right]? 4<2 false -> skip
    mid=3 -> nums[mid]=7 -> ans=min(Inf,7)=7
    nums[left]<=nums[mid]? 4<=7 true -> left=4

  step 2: left=4(0) right=6(2)
    nums[left]<nums[right]? 0<2 true -> ans=min(7,0)=0   <-- ketangkep di sini!
    mid=5 -> nums[mid]=1 -> ans=min(0,1)=0
    nums[left]<=nums[mid]? 0<=1 true -> left=6

  step 3: left=6(2) right=6(2)
    nums[left]<nums[right]? 2<2 false -> skip
    mid=6 -> nums[mid]=2 -> ans=min(0,2)=0
    nums[left]<=nums[mid]? 2<=2 true -> left=7

  loop selesai (left=7 > right=6) -> return ans = 0  ✓

Perhatikan di step 2 contoh kedua: begitu window [0,1,2] (index 4..6,
sudah sorted penuh) ketangkep lewat `nums[left] < nums[right]`, `ans`
langsung terkunci ke 0. Semua langkah setelahnya cuma mengonfirmasi 0
tetap yang terbaik.

Latihan: coba trace manual approach 3 (versi klasik) pakai array yang sama,
terus bandingkan jumlah langkahnya sama approach 2 -- rasain sendiri kenapa
approach 3 dianggap lebih "bersih" walau hasil akhirnya sama.
*/

/*
EXPLANATION (English)

Big picture: a "rotated sorted array" is just a sorted array cut at some pivot
point and the front piece moved to the back. Example:

  original:  [0,1,2,4,5,6,7]
  rotated:   [4,5,6,7 | 0,1,2,...]
                        ^ pivot -- this is where the minimum lives

So the array is actually made of TWO sorted runs stuck together:
  [4,5,6,7]  and  [0,1,2]
Both pieces are individually sorted ascending; the whole thing "wraps around"
exactly once, at the pivot. The minimum of the whole array is always the
FIRST element of the second run (right after the wrap).

Binary search still works here because of one crucial fact:
  AT ANY point while narrowing [left..right], AT LEAST ONE of the two halves
  (left..mid or mid..right) is fully sorted (no pivot inside it).
  -> if a half is sorted, its minimum is just its own first element, and the
     REAL global minimum (if not in that half) must be in the OTHER half.
  -> so every step, you can safely throw away the half you know is "clean"
     and keep looking in the half that might still contain the pivot.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Just walk the array and keep the smallest value. Correct but ignores the
sorted/rotated structure entirely. O(n) time, O(1) space -- fine as a
warm-up answer, not the final one (problem explicitly asks for O(log n)).

─── APPROACH 2: The video's approach ──────────────────────────────────
This version tracks a running `ans` (best answer found so far) instead of
returning the moment it narrows down to one element. Two things happen on
EVERY loop iteration, in this order:

  1. "Is the current window already fully sorted?"
     `if (nums[left] < nums[right])` -- if true, there's no pivot left in
     this window at all, so its own minimum is just nums[left]. Record it.

  2. "Check mid as a candidate too."
     `ans = Math.min(ans, nums[mid])` runs UNCONDITIONALLY every iteration.
     This matters because the pivot (where the true minimum sits) tends to
     end up sitting exactly at an index the search visits as mid at some
     point -- so checking mid each time makes sure that value never gets
     lost even if its half later gets discarded.

  Then the actual binary search decision:
  `if (nums[left] <= nums[mid])` -- this means left..mid is sorted
  ascending (if it had wrapped around inside itself, nums[left] would be
  BIGGER than nums[mid], not smaller/equal). Since that half is clean, the
  pivot must be hiding in mid+1..right, so move `left = mid + 1`.
  Otherwise, the wrap happened somewhere inside left..mid, so keep
  searching there: `right = mid - 1`.

  Why it's still correct even though left..mid gets thrown away and it
  *might* contain nums[left], which could theoretically be small: if
  left..mid is genuinely sorted AND happens to be the side with the true
  minimum, that only happens when the ENTIRE remaining window has no pivot
  in it at all -- which step 1 (`nums[left] < nums[right]`) already caught
  and recorded in `ans` that same iteration, before the half was discarded.
  That's why steps 1 and 2 exist alongside the narrowing logic: they catch
  the answer at the moment right before it would otherwise be thrown away.

  Time:  O(log n) -- range still halves every iteration (left/right move
         past mid each time), exactly like standard binary search.
  Space: O(1) -- only a few variables, no extra structures.

─── APPROACH 3: Classic/cleaner binary search ─────────────────────────
Same underlying idea, but phrased so you don't need a separate `ans` at
all -- you shrink the window until only 1 element is left, and THAT
element is guaranteed to be the minimum.

  `while (left < right)` -- note: strictly less than, not <=. We stop the
  moment the window is down to exactly one index.

  `if (nums[mid] > nums[right])`:
    mid's value is bigger than the last element -> the wrap must happen
    somewhere between mid and right -> the minimum is in mid+1..right ->
    `left = mid + 1` (mid itself is safely excluded, it can't be the min
    since it's bigger than something to its right).

  `else` (nums[mid] <= nums[right]):
    no wrap between mid and right -> that side is clean/sorted -> the
    minimum is at mid or somewhere to its LEFT -> `right = mid` (mid is
    kept in range here, since it could itself be the answer).

  When the loop ends, `left === right` and that index is proven to be the
  pivot -- `return nums[left]`.

  Time:  O(log n), Space: O(1) -- same complexity as approach 2, just a
  tighter, more standard way to write the binary search (this is the
  version worth memorizing / reproducing from scratch).

PENJELASAN (Bahasa Indonesia)

Gambaran besar: "rotated sorted array" itu cuma array sorted biasa yang
dipotong di satu titik (pivot), terus potongan depannya dipindah ke
belakang. Contoh:

  aslinya:   [0,1,2,4,5,6,7]
  di-rotate: [4,5,6,7 | 0,1,2,...]
                        ^ pivot -- di sinilah nilai minimum berada

Jadi array-nya sebenarnya terdiri dari DUA bagian yang masing-masing
sorted, disambung jadi satu:
  [4,5,6,7]  dan  [0,1,2]
Dua-duanya sorted ascending sendiri-sendiri; keseluruhannya "muter balik"
(wrap around) cuma sekali, tepat di pivot. Minimum dari seluruh array
selalu ada di elemen PERTAMA dari bagian kedua (persis setelah wrap).

Binary search tetap bisa dipakai di sini karena ada 1 fakta penting:
  DI TITIK MANAPUN saat kita mempersempit [left..right], SETIDAKNYA SATU
  dari dua bagian (left..mid atau mid..right) pasti sorted penuh (nggak
  ada pivot di dalamnya).
  -> kalau satu bagian sorted, minimumnya ya tinggal elemen pertamanya
     sendiri, dan minimum GLOBAL (kalau bukan di bagian itu) pasti ada di
     bagian SATUNYA.
  -> jadi tiap langkah, kita bisa aman buang bagian yang udah "bersih"
     (sorted), dan lanjut cari di bagian yang masih mungkin nyimpen pivot.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Scan semua elemen, simpan yang paling kecil. Benar, tapi nggak
manfaatin struktur sorted/rotated-nya sama sekali. O(n) time, O(1) space
-- oke buat pemanasan, bukan jawaban final (soal minta eksplisit O(log n)).

─── APPROACH 2: Approach dari video ────────────────────────────────────
Versi ini nyimpen `ans` (jawaban terbaik sejauh ini) berjalan terus,
bukan langsung return begitu search-nya udah nyempit ke 1 elemen. ADA
DUA hal yang jalan di SETIAP iterasi loop, urutannya:

  1. "Apakah window saat ini sudah sorted penuh?"
     `if (nums[left] < nums[right])` -- kalau true, artinya nggak ada
     pivot tersisa di window ini sama sekali, jadi minimumnya ya tinggal
     nums[left]. Catat ke ans.

  2. "Cek juga mid sebagai kandidat."
     `ans = Math.min(ans, nums[mid])` jalan TANPA SYARAT di tiap
     iterasi. Ini penting karena pivot (tempat minimum sebenarnya)
     cenderung akhirnya persis jatuh di salah satu index yang pernah
     jadi mid selama proses narrowing -- jadi ngecek mid tiap kali
     mastiin nilai itu nggak pernah "hilang" walau bagiannya nanti dibuang.

  Baru keputusan binary search yang sebenarnya:
  `if (nums[left] <= nums[mid])` -- artinya left..mid sorted ascending
  (kalau ada wrap di dalam bagian ini, nums[left] pasti LEBIH BESAR dari
  nums[mid], bukan lebih kecil/sama). Karena bagian ini "bersih", pivot-nya
  pasti sembunyi di mid+1..right, jadi pindah `left = mid + 1`.
  Kalau nggak (nums[left] > nums[mid]), berarti wrap-nya terjadi di dalam
  left..mid, jadi lanjut cari di situ: `right = mid - 1`.

  Kenapa tetap benar walau left..mid dibuang dan *mungkin* isinya
  nums[left] yang secara teori bisa aja kecil: kalau left..mid itu memang
  sorted DAN kebetulan itu bagian yang nyimpen minimum sebenarnya, itu
  cuma bisa kejadian kalau SELURUH window yang tersisa emang udah nggak
  ada pivot-nya sama sekali -- dan itu sudah ketangkep di langkah 1
  (`nums[left] < nums[right]`) dan sudah tercatat ke `ans` di iterasi yang
  SAMA, sebelum bagian itu dibuang. Makanya langkah 1 dan 2 ada
  berdampingan sama logika narrowing: mereka nangkep jawabannya tepat
  sebelum informasinya keburu dibuang.

  Time:  O(log n) -- rentang tetap kepotong separuh tiap iterasi (left/right
         selalu lompat melewati mid), persis kayak binary search standar.
  Space: O(1) -- cuma beberapa variabel, nggak ada struktur data tambahan.

─── APPROACH 3: Binary search versi klasik/lebih ringkas ──────────────
Ide dasarnya sama, tapi ditulis supaya nggak butuh variabel `ans`
terpisah sama sekali -- kita persempit window sampai tinggal 1 elemen,
dan elemen ITU dijamin adalah minimumnya.

  `while (left < right)` -- perhatikan: strictly less than, bukan <=.
  Kita berhenti begitu window-nya tinggal tepat 1 index.

  `if (nums[mid] > nums[right])`:
    nilai di mid lebih besar dari elemen terakhir -> wrap-nya pasti ada
    di antara mid dan right -> minimumnya ada di mid+1..right ->
    `left = mid + 1` (mid sendiri aman dibuang, dia nggak mungkin jadi
    minimum karena dia lebih besar dari sesuatu di sebelah kanannya).

  `else` (nums[mid] <= nums[right]):
    nggak ada wrap antara mid dan right -> sisi itu bersih/sorted ->
    minimumnya ada di mid atau di sebelah KIRI-nya -> `right = mid` (mid
    tetap dipertahankan di dalam rentang, karena dia sendiri bisa jadi
    jawabannya).

  Begitu loop selesai, `left === right`, dan index itu terbukti adalah
  pivot-nya -- `return nums[left]`.

  Time:  O(log n), Space: O(1) -- kompleksitas sama kayak approach 2,
  cuma cara nulisnya lebih rapi dan lebih standar (ini versi yang paling
  worth buat dihafal / dibikin ulang dari nol).

─── PERBANDINGAN / COMPARISON ─────────────────────────────────────────
                              Time         Space
  1. Brute force              O(n)         O(1)
  2. Video approach           O(log n)     O(1)
  3. Classic binary search    O(log n)     O(1)
*/
