/*
875. Koko Eating Bananas
Medium

Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours.

Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour.

Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return.

Return the minimum integer k such that she can eat all the bananas within h hours.



Example 1:

Input: piles = [3,6,7,11], h = 8
Output: 4
Example 2:

Input: piles = [30,11,23,4,20], h = 5
Output: 30
Example 3:

Input: piles = [30,11,23,4,20], h = 6
Output: 23


Constraints:

1 <= piles.length <= 104
piles.length <= h <= 109
1 <= piles[i] <= 109

 */

/* APPROACHES
1. Brute force -> try every speed k = 1, 2, 3, ... and stop at the first one
   that finishes within h hours. Time: O(max(piles) * n), Space: O(1)
2. Optimal -> binary search ON THE ANSWER (the speed k itself), using
   "how many hours does speed k take" as the feasibility check.
   Time: O(n log(max(piles))), Space: O(1)
 */

/*
Note before diving in: this problem doesn't ask you to search THROUGH an
array like the other binary search problems in this repo (39, 41, 42, 43).
Instead, you binary search over the space of POSSIBLE ANSWERS (every
integer speed k could be) -- this pattern is usually called "binary
search on the answer". See the WALKTHROUGH and EXPLANATION below for why
this still works.
*/

/**
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 */
// Shared helper for both approaches: how many hours does eating speed k take?
function hoursNeeded(piles, k) {
    let hours = 0;
    for (const pile of piles) {
        hours += Math.ceil(pile / k); // a pile of p bananas at speed k takes ceil(p/k) hours
    }
    return hours;
}

// APPROACH 1 — Brute force: try every speed starting from 1
// Time: O(max(piles) * n) | Space: O(1)
var minEatingSpeedBrute = function (piles, h) {
    const maxPile = Math.max(...piles);

    for (let k = 1; k <= maxPile; k++) {
        if (hoursNeeded(piles, k) <= h) return k; // first speed that's fast enough wins
    }

    return maxPile; // unreachable given the constraints (k = maxPile always finishes in time)
};

// APPROACH 2 — Optimal: binary search on the answer (the speed k)
// Time: O(n log(max(piles))) | Space: O(1)
var minEatingSpeed = function (piles, h) {
    let left = 1; // slowest possible speed that still makes progress
    let right = Math.max(...piles); // eating a whole pile per hour is always fast enough

    while (left < right) {
        const mid = left + Math.floor((right - left) / 2); // candidate speed

        if (hoursNeeded(piles, mid) <= h) {
            right = mid; // mid works -> maybe an even slower speed also works, keep mid in range
        } else {
            left = mid + 1; // mid too slow (takes too many hours) -> need to eat faster
        }
    }

    return left; // left === right here -> the minimum speed that finishes in time
};

/*
WALKTHROUGH (quick reference, read this together with the code above)

English:
piles = [3,6,7,11], h = 8

First, understand `hoursNeeded` with a fixed speed, say k = 4:
  pile 3  -> ceil(3/4)  = 1 hour
  pile 6  -> ceil(6/4)  = 2 hours
  pile 7  -> ceil(7/4)  = 2 hours
  pile 11 -> ceil(11/4) = 3 hours
  total = 1+2+2+3 = 8 hours -> exactly matches h=8, so k=4 IS fast enough

Now the actual binary search: left=1, right=max(piles)=11

  step 1: left=1 right=11 -> mid=6
    hoursNeeded(piles,6) = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)
                          = 1 + 1 + 2 + 2 = 6
    6 <= 8 (h) -> speed 6 IS fast enough -> maybe slower also works -> right = mid = 6

  step 2: left=1 right=6 -> mid=3
    hoursNeeded(piles,3) = ceil(3/3)+ceil(6/3)+ceil(7/3)+ceil(11/3)
                          = 1 + 2 + 3 + 4 = 10
    10 > 8 (h) -> speed 3 too slow -> need faster -> left = mid+1 = 4

  step 3: left=4 right=6 -> mid=5
    hoursNeeded(piles,5) = ceil(3/5)+ceil(6/5)+ceil(7/5)+ceil(11/5)
                          = 1 + 2 + 2 + 3 = 8
    8 <= 8 (h) -> speed 5 IS fast enough -> right = mid = 5

  step 4: left=4 right=5 -> mid=4
    hoursNeeded(piles,4) = 1+2+2+3 = 8 (computed above)
    8 <= 8 (h) -> speed 4 IS fast enough -> right = mid = 4

  loop ends (left=4 === right=4) -> return 4   ✓ matches expected output

Notice the search space here isn't the ARRAY -- it's every possible speed
from 1 to 11. We're not looking for a value that EQUALS something; we're
looking for the smallest k where a yes/no check ("does this finish in
time?") flips from "no" to "yes".

Bahasa Indonesia:
piles = [3,6,7,11], h = 8

Pertama, pahami `hoursNeeded` dengan kecepatan tetap, misal k = 4:
  pile 3  -> ceil(3/4)  = 1 jam
  pile 6  -> ceil(6/4)  = 2 jam
  pile 7  -> ceil(7/4)  = 2 jam
  pile 11 -> ceil(11/4) = 3 jam
  total = 1+2+2+3 = 8 jam -> persis sama dengan h=8, jadi k=4 SUDAH cukup cepat

Sekarang binary search yang sebenarnya: left=1, right=max(piles)=11

  step 1: left=1 right=11 -> mid=6
    hoursNeeded(piles,6) = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)
                          = 1 + 1 + 2 + 2 = 6
    6 <= 8 (h) -> kecepatan 6 SUDAH cukup cepat -> mungkin yang lebih lambat juga cukup -> right = mid = 6

  step 2: left=1 right=6 -> mid=3
    hoursNeeded(piles,3) = ceil(3/3)+ceil(6/3)+ceil(7/3)+ceil(11/3)
                          = 1 + 2 + 3 + 4 = 10
    10 > 8 (h) -> kecepatan 3 kelambatan -> butuh lebih cepat -> left = mid+1 = 4

  step 3: left=4 right=6 -> mid=5
    hoursNeeded(piles,5) = ceil(3/5)+ceil(6/5)+ceil(7/5)+ceil(11/5)
                          = 1 + 2 + 2 + 3 = 8
    8 <= 8 (h) -> kecepatan 5 SUDAH cukup cepat -> right = mid = 5

  step 4: left=4 right=5 -> mid=4
    hoursNeeded(piles,4) = 1+2+2+3 = 8 (dihitung di atas)
    8 <= 8 (h) -> kecepatan 4 SUDAH cukup cepat -> right = mid = 4

  loop selesai (left=4 === right=4) -> return 4   ✓ cocok sama expected output

Perhatikan ruang pencarian di sini BUKAN array-nya -- tapi setiap
kemungkinan kecepatan dari 1 sampai 11. Kita nggak nyari nilai yang SAMA
DENGAN sesuatu; kita nyari k terkecil di mana jawaban ya/tidak ("apakah
ini selesai tepat waktu?") berubah dari "tidak" jadi "ya".

Latihan: coba trace manual piles = [30,11,23,4,20], h = 6 (jawaban harusnya
23) di kertas -- perhatikan gimana `left` dan `right` bergerak pas
hoursNeeded-nya lebih besar dari h vs lebih kecil-sama-dengan h.
*/

/*
EXPLANATION (English)

Why this is a binary search problem even though there's no sorted array
in sight: the thing we binary search over doesn't have to be an array's
indices. It can be ANY range of numbers, as long as there's a yes/no
question about each number in that range whose answer flips exactly
once as the number increases. That's called "binary search on the
answer", and it applies here.

The yes/no question: "at speed k, does Koko finish within h hours?"
  `hoursNeeded(piles, k) <= h`

Why the answer to that question flips exactly once as k increases (this
is the property that makes binary search valid here): the SLOWER Koko
eats (smaller k), the MORE hours she needs for every pile (ceil(p/k) only
gets bigger as k gets smaller). So total hours needed is a strictly
non-increasing function of k -- as k goes up, hours needed can only stay
the same or go down, never go back up. That means if some speed k works
(finishes in time), every FASTER speed also works; if some speed k fails
(too slow, takes too long), every SLOWER speed also fails. There's one
clean cutoff point between "too slow" and "fast enough", and binary
search finds that cutoff in O(log(range)) steps instead of checking every
speed one by one.

Why `hoursNeeded` uses `Math.ceil(pile / k)` and not just `pile / k`:
re-read the rules carefully -- each hour, Koko eats up to k bananas from
ONE pile, and if the pile has fewer than k left, she finishes that pile
early but does NOT start on another pile that same hour (the leftover
hour is "wasted"). So a pile of 7 bananas at speed k=4 takes 2 full hours
(eat 4 in hour 1, eat the remaining 3 -- and only 3 -- in hour 2), not
7/4 = 1.75 hours. `Math.ceil(7/4) = 2` captures exactly this "any leftover
still costs a whole extra hour" rule.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Just try k = 1, then k = 2, then k = 3, ... and stop at the first speed
where `hoursNeeded(piles, k) <= h`. Correct, because we just established
hours-needed only decreases as k grows, so the first k that works really
is the smallest one that works.

  Time:  O(max(piles) * n) -- in the worst case you try almost every
         speed from 1 up to the biggest pile, and each check costs O(n)
         (one pass over all piles). With piles up to 10^9, this can be
         far too slow to finish in time on the real constraints.
  Space: O(1).

─── APPROACH 2: Optimal — binary search on the answer ─────────────────
Binary search directly over the range of possible speeds instead of
checking every one:

  `left = 1` -- the slowest speed that still eats a positive number of
  bananas per hour.
  `right = Math.max(...piles)` -- eating an entire pile in one hour is
  always fast enough for that pile (it can never need more than 1 hour
  per pile at this speed), so this is a safe upper bound.

  `while (left < right)`: keep narrowing until only one candidate speed
  remains.
    `mid = left + Math.floor((right - left) / 2)` -- candidate speed
    (see problem 41's notes for why this exact form avoids overflow;
    same reasoning applies here).

    If `hoursNeeded(piles, mid) <= h`: speed `mid` finishes in time. Since
    we want the SMALLEST such speed, don't rule mid out yet -- maybe an
    even slower speed also finishes in time. Keep mid in range:
    `right = mid`.

    Otherwise: speed `mid` is too slow (takes more than h hours). Every
    speed at or below mid is therefore also too slow (hours needed only
    goes up as speed goes down), so rule out mid and everything below it:
    `left = mid + 1`.

  When the loop ends, `left === right`, and that single remaining value
  is proven to be the minimum speed that finishes within h hours.

  Time:  O(log(max(piles))) iterations of narrowing, each doing an
         O(n) `hoursNeeded` check -- so O(n log(max(piles))) total.
  Space: O(1).

─── COMPLEXITY COMPARISON ──────────────────────────────────────────────
                              Time                        Space
  1. Brute force               O(max(piles) * n)           O(1)
  2. Binary search on answer    O(n log(max(piles)))       O(1)


PENJELASAN (Bahasa Indonesia)

Kenapa ini soal binary search walau nggak ada array sorted yang keliatan:
hal yang di-binary-search itu nggak harus berupa index array. Bisa APAPUN
rentang angka, asalkan ada pertanyaan ya/tidak buat tiap angka di rentang
itu yang jawabannya berubah PERSIS SEKALI seiring angkanya membesar. Ini
disebut "binary search on the answer" (binary search di atas jawabannya
sendiri), dan itu berlaku di soal ini.

Pertanyaan ya/tidak-nya: "di kecepatan k, apakah Koko selesai dalam h
jam?"
  `hoursNeeded(piles, k) <= h`

Kenapa jawaban pertanyaan itu berubah PERSIS SEKALI seiring k membesar
(ini properti yang bikin binary search valid di sini): makin LAMBAT Koko
makan (k makin kecil), makin BANYAK jam yang dia butuhin buat tiap pile
(ceil(p/k) cuma makin besar kalau k makin kecil). Jadi total jam yang
dibutuhin itu fungsi yang non-increasing ketat terhadap k -- makin besar
k, jam yang dibutuhin cuma bisa tetap atau turun, nggak pernah naik lagi.
Artinya kalau satu kecepatan k udah cukup (selesai tepat waktu), semua
kecepatan yang LEBIH CEPAT juga cukup; kalau satu kecepatan k gagal
(kelambatan, kelamaan), semua kecepatan yang LEBIH LAMBAT juga gagal. Ada
satu titik potong yang bersih antara "kelambatan" dan "udah cukup cepat",
dan binary search nemuin titik potong itu dalam O(log(rentang)) langkah,
bukannya ngecek satu-satu tiap kecepatan.

Kenapa `hoursNeeded` pakai `Math.ceil(pile / k)` bukan cuma `pile / k`:
baca lagi aturannya pelan-pelan -- tiap jam, Koko makan sampai k pisang
dari SATU pile, dan kalau pile-nya sisa kurang dari k, dia selesain pile
itu lebih cepat tapi TIDAK mulai ke pile lain di jam yang sama (sisa
jamnya "kebuang"). Jadi pile isi 7 pisang di kecepatan k=4 makan 2 jam
PENUH (makan 4 di jam ke-1, makan sisanya yang 3 -- cuma 3 -- di jam
ke-2), bukan 7/4 = 1,75 jam. `Math.ceil(7/4) = 2` persis nangkep aturan
"sisa berapapun tetap makan 1 jam ekstra penuh" ini.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Tinggal coba k = 1, terus k = 2, terus k = 3, ... dan berhenti di
kecepatan pertama di mana `hoursNeeded(piles, k) <= h`. Benar, karena kita
udah pastiin jam yang dibutuhin cuma turun seiring k membesar, jadi k
pertama yang cukup itu memang yang paling kecil yang cukup.

  Time:  O(max(piles) * n) -- kasus terburuk, kamu coba hampir semua
         kecepatan dari 1 sampai pile paling besar, dan tiap cek makan
         O(n) (satu putaran lewat semua pile). Dengan pile sampai 10^9,
         ini bisa kelewat lambat buat selesai tepat waktu di constraint
         soal sebenarnya.
  Space: O(1).

─── APPROACH 2: Optimal — binary search di atas jawabannya ────────────
Binary search langsung di rentang kemungkinan kecepatan, bukannya ngecek
satu-satu:

  `left = 1` -- kecepatan paling lambat yang masih makan pisang lebih
  dari 0 tiap jam.
  `right = Math.max(...piles)` -- makan satu pile utuh dalam 1 jam selalu
  cukup cepat buat pile itu (nggak akan pernah butuh lebih dari 1 jam per
  pile di kecepatan ini), jadi ini batas atas yang aman.

  `while (left < right)`: terus persempit sampai cuma tersisa 1 kandidat
  kecepatan.
    `mid = left + Math.floor((right - left) / 2)` -- kecepatan kandidat
    (lihat catatan soal 41 buat kenapa bentuk persis ini menghindari
    overflow; alasan yang sama berlaku di sini).

    Kalau `hoursNeeded(piles, mid) <= h`: kecepatan `mid` selesai tepat
    waktu. Karena kita mau kecepatan PALING KECIL yang begitu, jangan
    coret mid dulu -- mungkin kecepatan yang lebih lambat juga selesai
    tepat waktu. Tetap pertahankan mid di rentang: `right = mid`.

    Kalau nggak: kecepatan `mid` kelambatan (makan lebih dari h jam).
    Semua kecepatan di mid atau di bawahnya otomatis juga kelambatan
    (jam yang dibutuhin cuma naik seiring kecepatan turun), jadi coret
    mid dan semua di bawahnya: `left = mid + 1`.

  Begitu loop selesai, `left === right`, dan satu nilai yang tersisa itu
  terbukti adalah kecepatan minimum yang selesai dalam h jam.

  Time:  O(log(max(piles))) iterasi mempersempit, tiap iterasi ngelakuin
         cek `hoursNeeded` yang O(n) -- jadi total O(n log(max(piles))).
  Space: O(1).

─── PERBANDINGAN KOMPLEKSITAS ──────────────────────────────────────────
                              Time                        Space
  1. Brute force               O(max(piles) * n)           O(1)
  2. Binary search di jawaban    O(n log(max(piles)))       O(1)
*/
