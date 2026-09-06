/*
33. Search in Rotated Sorted Array
Medium

There is an integer array nums sorted in ascending order (with distinct values).

Prior to being passed to your function, nums is possibly left rotated at an unknown index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be left rotated by 3 indices and become [4,5,6,7,0,1,2].

Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

You must write an algorithm with O(log n) runtime complexity.



Example 1:

Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
Example 2:

Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
Example 3:

Input: nums = [1], target = 0
Output: -1


Constraints:

1 <= nums.length <= 5000
-104 <= nums[i] <= 104
All values of nums are unique.
nums is an ascending array that is possibly rotated.
-104 <= target <= 104

 */

/*
approaches:
1. brute force -> O(n) the usual loop
2. optimal with binary search -> O(log n), O(1) space
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
// APPROACH 1 — Brute force: scan every index, return the first match
// Time: O(n) | Space: O(1)
var searchBrute = function (nums, target) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) return i;
    }
    return -1;
};

// APPROACH 2 — Optimal: binary search that figures out which half is sorted
// Time: O(log n) | Space: O(1)
var search = function (nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid] === target) return mid;

        if (nums[left] <= nums[mid]) {
            // left half (left..mid) is sorted ascending
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1; // target's value fits inside the sorted left half -> search there
            } else {
                left = mid + 1; // target must be in the other (right) half instead
            }
        } else {
            // right half (mid..right) is sorted ascending instead
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1; // target's value fits inside the sorted right half -> search there
            } else {
                right = mid - 1; // target must be in the other (left) half instead
            }
        }
    }

    return -1;
};

/*
WALKTHROUGH — Approach 2 (quick reference, read this together with the code above)

English:
nums = [4,5,6,7,0,1,2], target = 0    (indices: 0:4 1:5 2:6 3:7 4:0 5:1 6:2)

  step 1: left=0 right=6 -> mid=3, nums[mid]=7
    7 !== 0 (target) -> keep searching
    nums[left]=4 <= nums[mid]=7 -> LEFT half (idx 0..3) is sorted
    is target(0) inside [nums[left]=4 .. nums[mid]=7)? 4<=0 is FALSE -> not in left half
    -> search right half: left = mid+1 = 4

  step 2: left=4 right=6 -> mid=5, nums[mid]=1
    1 !== 0 -> keep searching
    nums[left]=0 <= nums[mid]=1 -> LEFT half (idx 4..5) is sorted
    is target(0) inside [nums[left]=0 .. nums[mid]=1)? 0<=0 TRUE and 0<1 TRUE -> yes!
    -> search left half: right = mid-1 = 4

  step 3: left=4 right=4 -> mid=4, nums[mid]=0
    0 === 0 (target) -> return mid = 4  ✓

nums = [4,5,6,7,0,1,2], target = 3

  step 1: left=0 right=6 -> mid=3, nums[mid]=7
    7 !== 3 -> keep searching
    nums[left]=4 <= nums[mid]=7 -> LEFT half sorted
    is 3 inside [4..7)? 4<=3 is FALSE -> not in left half
    -> search right half: left = 4

  step 2: left=4 right=6 -> mid=5, nums[mid]=1
    1 !== 3 -> keep searching
    nums[left]=0 <= nums[mid]=1 -> LEFT half (idx 4..5) sorted
    is 3 inside [0..1)? 0<=3 TRUE but 3<1 is FALSE -> not in left half
    -> search right half: left = mid+1 = 6

  step 3: left=6 right=6 -> mid=6, nums[mid]=2
    2 !== 3 -> keep searching
    nums[left]=2 <= nums[mid]=2 -> LEFT half (just idx 6 itself) "sorted"
    is 3 inside [2..2)? 2<=3 TRUE but 3<2 is FALSE -> not in left half
    -> search right half: left = mid+1 = 7

  loop ends (left=7 > right=6) -> return -1  ✓ (3 really isn't in the array)

Bahasa Indonesia:
nums = [4,5,6,7,0,1,2], target = 0    (index: 0:4 1:5 2:6 3:7 4:0 5:1 6:2)

  step 1: left=0 right=6 -> mid=3, nums[mid]=7
    7 !== 0 (target) -> lanjut cari
    nums[left]=4 <= nums[mid]=7 -> setengah KIRI (idx 0..3) sorted
    apakah target(0) ada di rentang [nums[left]=4 .. nums[mid]=7)? 4<=0 SALAH -> bukan di kiri
    -> cari di setengah kanan: left = mid+1 = 4

  step 2: left=4 right=6 -> mid=5, nums[mid]=1
    1 !== 0 -> lanjut cari
    nums[left]=0 <= nums[mid]=1 -> setengah KIRI (idx 4..5) sorted
    apakah target(0) ada di rentang [nums[left]=0 .. nums[mid]=1)? 0<=0 BENAR dan 0<1 BENAR -> ya!
    -> cari di setengah kiri: right = mid-1 = 4

  step 3: left=4 right=4 -> mid=4, nums[mid]=0
    0 === 0 (target) -> return mid = 4  ✓

nums = [4,5,6,7,0,1,2], target = 3

  step 1: left=0 right=6 -> mid=3, nums[mid]=7
    7 !== 3 -> lanjut cari
    nums[left]=4 <= nums[mid]=7 -> setengah KIRI sorted
    apakah 3 ada di [4..7)? 4<=3 SALAH -> bukan di kiri
    -> cari di setengah kanan: left = 4

  step 2: left=4 right=6 -> mid=5, nums[mid]=1
    1 !== 3 -> lanjut cari
    nums[left]=0 <= nums[mid]=1 -> setengah KIRI (idx 4..5) sorted
    apakah 3 ada di [0..1)? 0<=3 BENAR tapi 3<1 SALAH -> bukan di kiri
    -> cari di setengah kanan: left = mid+1 = 6

  step 3: left=6 right=6 -> mid=6, nums[mid]=2
    2 !== 3 -> lanjut cari
    nums[left]=2 <= nums[mid]=2 -> setengah KIRI (cuma idx 6 sendiri) "sorted"
    apakah 3 ada di [2..2)? 2<=3 BENAR tapi 3<2 SALAH -> bukan di kiri
    -> cari di setengah kanan: left = mid+1 = 7

  loop selesai (left=7 > right=6) -> return -1  ✓ (3 memang nggak ada di array)

Latihan: coba trace manual nums = [5,1,3], target = 3, dan nums = [3,1], target = 3
di kertas -- perhatikan gimana keputusan "setengah mana yang sorted" berubah-ubah
tergantung posisi rotasinya.
*/

/*
EXPLANATION (English)

Big picture: this problem is "Find Minimum in Rotated Sorted Array" (problem
40 in this repo) but one level harder -- instead of hunting for the minimum
(the pivot), you're hunting for an arbitrary target value. Same rotated
structure applies: the array is two sorted runs glued together, e.g.

  [4,5,6,7,0,1,2]
   \_______/ \___/
    sorted     sorted
   (bigger)   (smaller, wrapped around)

The SAME crucial fact from problem 42 still holds here:
  AT ANY point while narrowing [left..right], AT LEAST ONE of the two
  halves (left..mid or mid..right) is fully sorted (no rotation point
  inside it).

But this time, once you know WHICH half is sorted, you get to ask a much
more useful question than before: "does target's VALUE actually fall
inside that sorted half's range?" Since a sorted half's values are neatly
ordered between its own first and last element, that's a simple range
check -- and range checks are exactly what tell you which half to keep
searching in.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Just scan left to right, return the index the moment you find target.
O(n) time, O(1) space. Ignores the sorted/rotated structure completely --
fine as a warm-up, not the final answer (problem explicitly asks O(log n)).

─── APPROACH 2: Binary search + "which half is sorted, and is target in it" ──
Every iteration does 3 things, in order:

  1. Check mid directly: `if (nums[mid] === target) return mid;`
     Obvious early exit -- if you already found it, stop.

  2. Figure out which half is sorted:
     `if (nums[left] <= nums[mid])` -- if true, left..mid has no rotation
     point inside it (if it did, nums[left] would be BIGGER than nums[mid],
     not smaller/equal), so LEFT half is the clean, sorted one. Otherwise
     (nums[left] > nums[mid]), the rotation point is inside left..mid, which
     means RIGHT half (mid..right) must be the clean, sorted one instead.
     (This is the exact same left/mid comparison from problem 42's video
     approach -- same reasoning, reused here.)

  3. Ask: "is target inside the SORTED half's value range?"
     - If left half is sorted: is `nums[left] <= target < nums[mid]`?
       If yes, target -- IF it exists at all -- must be inside this sorted
       range, so narrow into it: `right = mid - 1`.
       If no, target can't be hiding in this sorted half (a sorted range
       can only contain values between its own endpoints), so it must be
       in the other half instead: `left = mid + 1`.
     - If right half is sorted: is `nums[mid] < target <= nums[right]`?
       Same logic, mirrored: if yes, search right (`left = mid + 1`); if
       no, search left (`right = mid - 1`).

  Why the range check is safe: a sorted run's values are strictly ordered
  from its first to its last element. If target's value doesn't fall
  between those two endpoints, it is mathematically impossible for target
  to be sitting inside that run -- so you can safely rule out that entire
  half in one comparison, exactly like a normal binary search rules out a
  half by comparing to a single midpoint.

  Time:  O(log n) -- the search range still exactly halves every
         iteration (left or right always jumps past mid), same as any
         binary search.
  Space: O(1) -- just a few variables.

  Note on `mid = left + Math.floor((right - left) / 2)`: same overflow-safe
  reordering discussed in problem 41/42's notes -- mathematically identical
  to `Math.floor((left + right) / 2)`, just computed via a small
  intermediate value ((right - left)) instead of a potentially large one
  (left + right).

─── COMPLEXITY COMPARISON ──────────────────────────────────────────────
                    Time        Space
  1. Brute force    O(n)        O(1)
  2. Binary search   O(log n)   O(1)


PENJELASAN (Bahasa Indonesia)

Gambaran besar: soal ini itu "Find Minimum in Rotated Sorted Array" (soal
nomor 40 di repo ini) tapi satu level lebih susah -- bukannya nyari
minimum (si pivot), sekarang kamu nyari SEMBARANG nilai target. Struktur
rotated-nya tetap sama: array-nya adalah 2 bagian sorted yang disambung
jadi satu, contoh:

  [4,5,6,7,0,1,2]
   \_______/ \___/
    sorted     sorted
   (lebih besar) (lebih kecil, hasil wrap)

Fakta PENTING yang sama dari soal 42 tetap berlaku di sini:
  DI TITIK MANAPUN saat mempersempit [left..right], SETIDAKNYA SATU dari
  dua bagian (left..mid atau mid..right) pasti sorted penuh (nggak ada
  titik rotasi di dalamnya).

Tapi kali ini, begitu kamu tahu bagian MANA yang sorted, kamu bisa nanya
pertanyaan yang jauh lebih berguna dari sebelumnya: "apakah NILAI target
memang ada di dalam rentang bagian yang sorted itu?" Karena nilai-nilai
di bagian yang sorted itu tersusun rapi antara elemen pertama dan
terakhirnya sendiri, itu jadi cek rentang yang simpel -- dan cek rentang
itu persis yang ngasih tahu bagian mana yang harus terus dicari.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Scan dari kiri ke kanan, return index-nya begitu ketemu target. O(n) time,
O(1) space. Sama sekali nggak manfaatin struktur sorted/rotated-nya --
oke buat pemanasan, bukan jawaban final (soal minta eksplisit O(log n)).

─── APPROACH 2: Binary search + "bagian mana yang sorted, dan apakah target ada di situ" ──
Tiap iterasi ngelakuin 3 hal, urutannya:

  1. Cek mid langsung: `if (nums[mid] === target) return mid;`
     Exit dini yang jelas -- kalau udah ketemu, langsung berhenti.

  2. Cari tahu bagian mana yang sorted:
     `if (nums[left] <= nums[mid])` -- kalau true, left..mid nggak ada
     titik rotasi di dalamnya (kalau ada, nums[left] pasti LEBIH BESAR
     dari nums[mid], bukan lebih kecil/sama), jadi bagian KIRI yang
     bersih/sorted. Kalau nggak (nums[left] > nums[mid]), titik rotasinya
     ada di dalam left..mid, artinya bagian KANAN (mid..right) yang
     pasti bersih/sorted. (Ini persis perbandingan left/mid yang sama
     dari approach video di soal 42 -- alasan yang sama, dipakai ulang
     di sini.)

  3. Tanya: "apakah target ada di dalam rentang nilai bagian yang SORTED?"
     - Kalau bagian kiri yang sorted: apakah `nums[left] <= target < nums[mid]`?
       Kalau ya, target -- KALAU dia memang ada -- pasti ada di dalam
       rentang sorted ini, jadi persempit ke situ: `right = mid - 1`.
       Kalau nggak, target nggak mungkin sembunyi di bagian sorted ini
       (rentang sorted cuma bisa berisi nilai di antara kedua ujungnya
       sendiri), jadi pasti ada di bagian satunya: `left = mid + 1`.
     - Kalau bagian kanan yang sorted: apakah `nums[mid] < target <= nums[right]`?
       Logika sama, dicerminkan: kalau ya, cari di kanan (`left = mid + 1`);
       kalau nggak, cari di kiri (`right = mid - 1`).

  Kenapa cek rentang ini aman: nilai-nilai di satu bagian yang sorted itu
  tersusun ketat dari elemen pertama sampai terakhirnya. Kalau nilai
  target nggak ada di antara kedua ujung itu, secara matematis MUSTAHIL
  target itu ada di dalam bagian tersebut -- jadi kamu bisa aman
  mencoret seluruh bagian itu cuma dengan satu perbandingan, persis
  kayak binary search biasa mencoret satu bagian dengan bandingin ke
  satu titik tengah.

  Time:  O(log n) -- rentang pencarian tetap kepotong separuh persis
         tiap iterasi (left atau right selalu lompat melewati mid),
         sama kayak binary search manapun.
  Space: O(1) -- cuma beberapa variabel.

  Catatan soal `mid = left + Math.floor((right - left) / 2)`: pola
  overflow-safe yang sama kayak yang dibahas di catatan soal 41/42 --
  secara matematis identik sama `Math.floor((left + right) / 2)`, cuma
  dihitung lewat angka sementara yang kecil ((right - left)) bukannya
  angka sementara yang berpotensi besar (left + right).

─── PERBANDINGAN KOMPLEKSITAS ──────────────────────────────────────────
                    Time        Space
  1. Brute force    O(n)        O(1)
  2. Binary search   O(log n)   O(1)
*/
