/*
74. Search a 2D Matrix
Medium

You are given an m x n integer matrix matrix with the following two properties:

Each row is sorted in non-decreasing order.
The first integer of each row is greater than the last integer of the previous row.
Given an integer target, return true if target is in matrix or false otherwise.

You must write a solution in O(log(m * n)) time complexity.



Example 1:


Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true
Example 2:


Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false


Constraints:

m == matrix.length
n == matrix[i].length
1 <= m, n <= 100
-104 <= matrix[i][j], target <= 104

*/

/* APPROACHES
1. Brute force -> time complexity: O(m * n) because 2 loops
2. Better with binary search -> since it's all sorted, so check which row that might has the target and then loop there, time complexity: O(log m + log n)
3. Optimal -> since it's all sorted, we can see as 1D array rather than 2D, so we still implement binary search, time complexity: O(log m*n) and space complexity: O(1)
 */

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
// APPROACH 1 — Brute force: check every cell
// Time: O(m * n) | Space: O(1)
var searchMatrixBrute = function (matrix, target) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === target) return true;
        }
    }
    return false;
};

// APPROACH 2 — Two-step binary search: find the row, then binary search inside it
// Time: O(log m + log n) | Space: O(1)
var searchMatrixTwoStep = function (matrix, target) {
    const m = matrix.length;
    const n = matrix[0].length;

    // STEP 1: binary search over rows to find the one row that COULD contain target
    let top = 0;
    let bottom = m - 1;

    while (top <= bottom) {
        const midRow = top + Math.floor((bottom - top) / 2);

        if (target < matrix[midRow][0]) {
            bottom = midRow - 1; // target is smaller than this row's smallest value -> look in rows above
        } else if (target > matrix[midRow][n - 1]) {
            top = midRow + 1; // target is bigger than this row's biggest value -> look in rows below
        } else {
            // target's value RANGE matches this row -> binary search inside it
            let left = 0;
            let right = n - 1;
            while (left <= right) {
                const mid = left + Math.floor((right - left) / 2);
                if (matrix[midRow][mid] === target) return true;
                else if (matrix[midRow][mid] < target) left = mid + 1;
                else right = mid - 1;
            }
            return false; // right row, but target isn't actually in it
        }
    }

    return false; // no row's range matched target at all
};

// APPROACH 3 — Optimal: treat the whole matrix as one flattened sorted array
// Time: O(log(m * n)) | Space: O(1)
var searchMatrix = function (matrix, target) {
    const m = matrix.length;
    const n = matrix[0].length;

    let left = 0;
    let right = m * n - 1; // pretend indices 0 ... m*n-1 form one flat array

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const midValue = matrix[Math.floor(mid / n)][mid % n]; // translate flat index -> [row][col]

        if (midValue === target) {
            return true;
        } else if (midValue < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return false;
};

/*
WALKTHROUGH — Approach 3 (quick reference, read this together with the code above)

English:
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
m = 3, n = 4, left = 0, right = m*n - 1 = 11

  left=0  right=11  mid=5  -> row=5/4=1, col=5%4=1 -> matrix[1][1]=11
    11 > 3  -> target is smaller -> right = mid - 1 = 4

  left=0  right=4   mid=2  -> row=2/4=0, col=2%4=2 -> matrix[0][2]=5
    5 > 3   -> target is smaller -> right = mid - 1 = 1

  left=0  right=1   mid=0  -> row=0/4=0, col=0%4=0 -> matrix[0][0]=1
    1 < 3   -> target is bigger -> left = mid + 1 = 1

  left=1  right=1   mid=1  -> row=1/4=0, col=1%4=1 -> matrix[0][1]=3
    3 === 3 -> MATCH -> return true

Bahasa Indonesia:
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
m = 3, n = 4, left = 0, right = m*n - 1 = 11

  left=0  right=11  mid=5  -> row=5/4=1, col=5%4=1 -> matrix[1][1]=11
    11 > 3  -> target lebih kecil -> right = mid - 1 = 4

  left=0  right=4   mid=2  -> row=2/4=0, col=2%4=2 -> matrix[0][2]=5
    5 > 3   -> target lebih kecil -> right = mid - 1 = 1

  left=0  right=1   mid=0  -> row=0/4=0, col=0%4=0 -> matrix[0][0]=1
    1 < 3   -> target lebih besar -> left = mid + 1 = 1

  left=1  right=1   mid=1  -> row=1/4=0, col=1%4=1 -> matrix[0][1]=3
    3 === 3 -> COCOK -> return true

Latihan: coba trace ulang pakai target = 13 (jawaban harusnya false), dan
bandingkan juga jalannya approach 2 buat target yang sama -- itu cara paling
ampuh buat ngerti bedanya dua approach ini sebelum ketemu variasi soal ini
lagi di interview.
*/

/*
MID FORMULA DEEP DIVE — explained from zero, step by step

═══ PART 1: why "mid = left + Math.floor((right - left) / 2)"
     instead of the simpler "Math.floor((left + right) / 2)" ═══

English:
First, a mix-up to clear up: "overflow" has NOTHING to do with JavaScript's
`undefined` or `NaN`. Nothing goes missing, nothing throws an error, nothing
becomes "not a number". The computer still hands back a perfectly normal-
looking, valid number -- it's just the WRONG number, because it silently
wrapped around past the biggest value it has room to store. No crash, no
empty value -- just a quiet, wrong answer that looks totally legitimate.

Concrete proof with tiny made-up numbers, so you can check every step
with a calculator:

Imagine a toy computer that can only store 2-digit numbers: 00 through 99.
That is its ENTIRE universe. The number 100 literally cannot exist for it.
If a calculation would produce 100 or more, this toy computer simply drops
the extra leading digit and keeps only the last two -- e.g. it would treat
193 as if it were 93 (193 - 100 = 93), because the leading "1" has nowhere
to go.

Say left = 95 and right = 98 (both close to this toy computer's max of 99):

  BAD formula:  mid = (left + right) / 2
    left + right = 95 + 98 = 193
    -> 193 needs 3 digits, this computer only has 2 -> it drops the "1"
       and is left holding 93 (WRONG! but looks like a normal number)
    mid = 93 / 2 = 46
    The REAL mid should have been (95+98)/2 = 96.5 -> 96. Instead this
    broken computer silently computed 46 -- a totally different, garbage
    position, way outside the actual [95, 98] range you were searching.
    If `mid` were used as an array index, you'd read the wrong cell
    entirely (or crash, if 46 is out of the array's actual bounds).

  SAFE formula: mid = left + (right - left) / 2
    right - left = 98 - 95 = 3            (small, nowhere near 99 -- fits easily)
    3 / 2 = 1                              (integer division, rounded down)
    mid = left + 1 = 95 + 1 = 96           (fits easily in 2 digits, no wraparound)
    This gives the CORRECT mid, 96 -- because at no point did we ever
    create a number bigger than what the computer can hold.

Now, directly answering "kalau ditambah, bisa lewat batas juga kan?" --
won't adding still risk going over? No, and here's exactly why:
`right` is ALREADY a valid, safely-stored number -- it's a real array
index that existed comfortably inside the computer's storage before this
calculation even started (nobody just invented it out of thin air).
Do the algebra on `left + (right - left)`:

  left + (right - left)  =  left + right - left  =  right

It equals `right` EXACTLY. So the biggest `mid` could ever become is
`right` itself -- a number we already KNOW fits, because it was already
sitting there safely before we touched it. We are never manufacturing
some brand-new giant number by adding two big things together (like the
BAD formula does with `left + right`); we're only ever landing somewhere
between two numbers (`left` and `right`) that were both already proven
safe. That reordering is the entire trick.

Does this matter here, in JavaScript, for THIS problem? Not really.
JavaScript numbers are IEEE-754 doubles, safely exact up to about 9
quadrillion (`Number.MAX_SAFE_INTEGER`) -- nowhere close to overflowing
with this problem's tiny constraint (m, n <= 100, so at most 10,000 cells).
This pattern is simply a habit carried over from Java/C++ (languages that
DO have a small fixed-size `int`, ~2.1 billion max), where the original
video's code came from. Keeping it in JS doesn't hurt anything -- it's
just extra-safe, not strictly necessary for this specific problem.

Bahasa Indonesia:
Pertama, biar nggak ketuker: "overflow" itu SAMA SEKALI BUKAN soal
`undefined` atau `NaN` di JavaScript. Nggak ada yang hilang, nggak ada
error, nggak ada "bukan angka". Komputernya tetap ngasih balik angka yang
kelihatan normal dan valid -- cuma angkanya SALAH, karena diam-diam
"muter balik" (wrap around) melewati nilai terbesar yang muat disimpan.
Nggak crash, nggak jadi kosong -- cuma jawaban salah yang keliatannya
sah-sah aja.

Bukti konkret pakai angka kecil karangan, biar bisa kamu cek sendiri
langkah-langkahnya pakai kalkulator:

Bayangin komputer mainan yang cuma bisa nyimpen angka 2 digit: 00 sampai
99. Itu SELURUH dunia angka yang dia kenal. Angka 100 secara harfiah
nggak bisa eksis buat dia. Kalau ada perhitungan yang hasilnya 100 atau
lebih, komputer mainan ini bakal buang digit paling depan dan cuma
nyimpen 2 digit terakhir -- misalnya dia bakal nganggep 193 seolah-olah
93 (193 - 100 = 93), karena digit "1" di depan nggak ada tempatnya.

Misal left = 95 dan right = 98 (dua-duanya deket sama batas maksimum
komputer mainan ini, yaitu 99):

  RUMUS SALAH:  mid = (left + right) / 2
    left + right = 95 + 98 = 193
    -> 193 butuh 3 digit, komputer ini cuma punya 2 -> "1"-nya dibuang,
       yang tersisa 93 (SALAH! tapi keliatan kayak angka normal)
    mid = 93 / 2 = 46
    Mid yang SEBENARNYA harusnya (95+98)/2 = 96.5 -> 96. Tapi komputer
    yang rusak ini diam-diam menghitung 46 -- posisi yang sama sekali
    beda, ngaco, jauh di luar rentang [95, 98] yang lagi kamu cari.
    Kalau `mid` ini dipakai jadi index array, kamu bakal baca sel yang
    salah total (atau malah crash, kalau 46 di luar batas array-nya).

  RUMUS AMAN: mid = left + (right - left) / 2
    right - left = 98 - 95 = 3             (kecil, jauh dari 99 -- muat gampang)
    3 / 2 = 1                               (pembagian bulat, dibulat bawah)
    mid = left + 1 = 95 + 1 = 96            (muat gampang di 2 digit, nggak ada wrap)
    Ini ngasih mid yang BENAR, 96 -- karena di sepanjang proses ini kita
    nggak pernah bikin angka yang lebih besar dari yang komputernya sanggup
    simpan.

Sekarang, langsung jawab pertanyaan kamu: "kalau ditambah, bisa lewat
batas juga kan?" Enggak, dan ini alasan persisnya:
`right` itu SUDAH JADI angka yang valid dan aman tersimpan -- dia index
array yang sungguhan, yang sudah ada dengan nyaman di dalam penyimpanan
komputer SEBELUM perhitungan ini bahkan dimulai (bukan angka baru yang
tiba-tiba muncul dari udara). Coba hitung aljabar dari
`left + (right - left)`:

  left + (right - left)  =  left + right - left  =  right

Hasilnya PERSIS sama dengan `right`. Jadi `mid` paling besar yang mungkin
terjadi ya `right` itu sendiri -- angka yang SUDAH kita tahu muat, karena
dia sudah ada di situ dengan aman sebelum kita sentuh. Kita nggak pernah
"membuat" angka baru yang jauh lebih besar dengan cara menjumlahkan dua
angka besar (seperti yang dilakukan RUMUS SALAH lewat `left + right`);
kita cuma pernah mendarat di suatu titik DI ANTARA dua angka (`left` dan
`right`) yang dua-duanya sudah terbukti aman. Nah, mengubah urutan
perhitungan kayak gini itulah seluruh triknya.

Apakah ini penting di sini, di JavaScript, buat soal INI? Sebenarnya
enggak. Angka di JavaScript itu IEEE-754 double, aman dan presisi sampai
sekitar 9 kuadriliun (`Number.MAX_SAFE_INTEGER`) -- jauh banget dari
kemungkinan overflow dengan constraint soal ini yang kecil (m, n <= 100,
jadi maksimal cuma 10.000 sel). Pattern ini cuma kebiasaan yang kebawa dari
Java/C++ (bahasa yang MEMANG punya `int` berukuran tetap, maksimal ~2,1
miliar), asal kode video yang kamu tonton. Tetap makai pattern ini di JS
nggak merugikan sama sekali -- cuma "ekstra hati-hati", bukan sesuatu yang
wajib buat soal spesifik ini.

═══ PART 2: kenapa "row = mid / n" dan "col = mid % n" bisa dipakai
     -- dibedah pelan-pelan pakai tabel ═══

English:
Take the exact example matrix: m=3 rows, n=4 columns.

  matrix = [[1,3,5,7], [10,11,16,20], [23,30,34,60]]

If you lay every cell out in one long line (row 0's cells, then row 1's,
then row 2's), each cell gets one "flat index" from 0 to 11:

  flat idx:  0   1   2   3   4   5    6    7    8   9   10  11
  value:     1   3   5   7   10  11   16   20   23  30  34  60
  row,col: 0,0 0,1 0,2 0,3 1,0 1,1  1,2  1,3  2,0 2,1 2,2 2,3

Now compute floor(idx / 4) and idx % 4 for every single index, and check
they match the row,col columns above:

  idx | idx/4 (rounded down) | idx%4 (remainder) | matches row,col?
   0  |     0                |    0               |  0,0  yes
   1  |     0                |    1               |  0,1  yes
   2  |     0                |    2               |  0,2  yes
   3  |     0                |    3               |  0,3  yes
   4  |     1                |    0               |  1,0  yes
   5  |     1                |    1               |  1,1  yes
   6  |     1                |    2               |  1,2  yes
   7  |     1                |    3               |  1,3  yes
   8  |     2                |    0               |  2,0  yes
   9  |     2                |    1               |  2,1  yes
  10  |     2                |    2               |  2,2  yes
  11  |     2                |    3               |  2,3  yes

Every single one lines up. Here's WHY, in plain words:

  - `idx / n` (rounded down) answers: "how many COMPLETE rows of n
    elements have I already passed, before reaching this index?"
    Each full row eats up exactly n flat indices. So if you've passed
    1 full row of 4 (indices 0,1,2,3), you must now be sitting in row
    number 1 (0-indexed) -- and that's exactly floor(idx/4).

  - `idx % n` answers: "after removing all those complete rows, how far
    INTO the current (not-yet-complete) row am I?" That leftover amount
    is exactly your column position.

Egg carton analogy: say each carton holds n=4 eggs, and every egg you've
ever bought is numbered globally in the order you'd lay them out: egg #0,
#1, #2, ... Egg #5 -- which carton is it in, and which slot? You've
already filled 1 whole carton (eggs 0-3, that's 4 eggs), so egg #5 must
be in carton #1 (the second carton) -- that's `5 / 4 = 1` (rounded down).
Within that carton, it's the (5 - 4) = 1st position after the first full
carton -- that's exactly `5 % 4 = 1`. Same arithmetic, same reasoning,
just eggs instead of matrix cells.

Bahasa Indonesia:
Ambil contoh matrix yang sama: m=3 baris, n=4 kolom.

  matrix = [[1,3,5,7], [10,11,16,20], [23,30,34,60]]

Kalau semua sel dijejerin jadi satu garis panjang (sel-sel baris 0, lanjut
baris 1, lanjut baris 2), tiap sel dapat satu "index flat" dari 0 sampai 11:

  index flat: 0   1   2   3   4   5    6    7    8   9   10  11
  nilai:      1   3   5   7   10  11   16   20   23  30  34  60
  baris,kol:0,0 0,1 0,2 0,3 1,0 1,1  1,2  1,3  2,0 2,1 2,2 2,3

Sekarang hitung floor(idx / 4) dan idx % 4 buat SETIAP index, dan cek
apakah cocok sama kolom baris,kol di atas:

  idx | idx/4 (dibulat bawah) | idx%4 (sisa bagi) | cocok sama baris,kol?
   0  |     0                 |    0              |  0,0  cocok
   1  |     0                 |    1              |  0,1  cocok
   2  |     0                 |    2              |  0,2  cocok
   3  |     0                 |    3              |  0,3  cocok
   4  |     1                 |    0              |  1,0  cocok
   5  |     1                 |    1              |  1,1  cocok
   6  |     1                 |    2              |  1,2  cocok
   7  |     1                 |    3              |  1,3  cocok
   8  |     2                 |    0              |  2,0  cocok
   9  |     2                 |    1              |  2,1  cocok
  10  |     2                 |    2              |  2,2  cocok
  11  |     2                 |    3              |  2,3  cocok

Semuanya cocok. Ini KENAPA-nya, dijelasin pakai kata-kata biasa:

  - `idx / n` (dibulatin ke bawah) menjawab: "sudah berapa baris PENUH
    (isi n elemen) yang kelewat, sebelum sampai ke index ini?"
    Tiap baris penuh itu "menghabiskan" tepat n index flat. Jadi kalau
    kamu sudah lewatin 1 baris penuh isi 4 (index 0,1,2,3), berarti kamu
    sekarang pasti ada di baris nomor 1 (dihitung dari 0) -- dan itu
    persis floor(idx/4).

  - `idx % n` menjawab: "setelah semua baris penuh itu dibuang/dihitung,
    seberapa jauh kamu MASUK ke baris yang sekarang (yang belum penuh)?"
    Sisa itu persis posisi kolom kamu.

Analogi kardus telur: misal tiap kardus isi n=4 telur, dan semua telur
yang pernah kamu beli dinomorin global sesuai urutan naruhnya: telur #0,
#1, #2, dst. Telur #5 -- ada di kardus ke berapa, dan slot ke berapa?
Kamu udah ngisi 1 kardus penuh (telur 0-3, itu 4 butir), jadi telur #5
pasti ada di kardus #1 (kardus kedua) -- itu `5 / 4 = 1` (dibulat bawah).
Di dalam kardus itu, posisinya (5 - 4) = posisi ke-1 setelah kardus penuh
pertama -- itu persis `5 % 4 = 1`. Perhitungan yang sama, alasan yang
sama, cuma ganti telur jadi sel matrix.
*/

/*
EXPLANATION (English)

The key observation for this whole problem:
  - Every row is sorted left to right.
  - The first value of row i+1 is bigger than the last value of row i.
  This means if you read the matrix row by row, left to right, top to bottom,
  the numbers come out in one single sorted sequence:

    [1,3,5,7] [10,11,16,20] [23,30,34,60]
    -> flattened: 1,3,5,7,10,11,16,20,23,30,34,60   (already fully sorted!)

  Because the WHOLE thing is sorted, binary search applies -- the only question
  is HOW you binary search it. That's the difference between approach 2 and 3.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Just scan every cell with a nested loop. Correct, but ignores the fact that
the matrix is sorted. O(m*n) time, O(1) space. Good as a warm-up answer,
never the final answer in an interview for this problem.

─── APPROACH 2: Binary search in two steps (find row, then find column) ──
Analogy: looking up a word in a thick dictionary.
  1. First you flip to roughly the right PAGE (which row).
  2. Then you scan that page for the exact WORD (which column).

Step 1 works because each row's own value range is itself sorted relative
to the other rows: row 0 covers [1..7], row 1 covers [10..20], row 2 covers
[23..60] -- ranges never overlap and always increase. So you can binary
search on rows using each row's first and last element to decide whether
target is too small (go up), too big (go down), or inside this row's range.
l
Step 2 is a completely ordinary binary search on the n elements of that
one row.

  Time:  O(log m) to find the row + O(log n) to search inside it
         = O(log m + log n)
  Space: O(1)

─── APPROACH 3: Flatten into one 1D array (the optimal one) ──────────────
Instead of searching in two separate stages, skip the "find the row" step
entirely and binary search directly over ALL m*n elements as if they were
laid out in a single line.

WHY "n = matrix[0].length" specifically:
  - m = matrix.length       -> number of ROWS
  - n = matrix[0].length    -> number of COLUMNS (how many elements are in
    ONE row). It's called matrix[0] just because row 0 is guaranteed to
    exist (constraints say m >= 1) and this is a rectangular matrix, so
    EVERY row has exactly the same length n. You could just as well write
    matrix[1].length or matrix[matrix.length - 1].length -- they're all
    equal. matrix[0] is simply the safest, always-available choice.

WHY "row = mid / n" and "col = mid % n":
  Think of the matrix as rows of fixed width n, laid end to end:

    flat index:   0  1  2  3 | 4  5  6  7 | 8  9  10 11
    row:          --- row 0 --|--- row 1 --|--- row 2 ---
    (n = 4 per row)

  - Indices 0..3   belong to row 0
  - Indices 4..7   belong to row 1
  - Indices 8..11  belong to row 2

  To find which row a flat index belongs to, divide by the row width and
  drop the remainder: index 5 -> 5 / 4 = 1 (integer division) -> row 1.
  That's exactly `Math.floor(mid / n)`.

  To find WHERE in that row, take the remainder after removing all the
  full rows already accounted for: index 5 -> 5 % 4 = 1 -> column 1
  (the 2nd element of row 1, which is matrix[1][1] = 11). That's `mid % n`.

  Cinema seat analogy: if each row of seats holds n=4 seats, and you're
  handed global ticket number 5, you compute 5/4 = 1 (row 1) and 5%4 = 1
  (seat 1 in that row) -- same math, same reason.

  Time:  O(log(m*n)) for one binary search over m*n elements
  Space: O(1)

  Note: log(m*n) = log(m) + log(n) mathematically, so approach 2 and 3
  have the SAME complexity -- approach 3 is just simpler to write (one
  while-loop instead of a binary search nested inside another).

PENJELASAN (Bahasa Indonesia)

Pengamatan kunci soal ini:
  - Tiap baris sudah sorted dari kiri ke kanan.
  - Elemen pertama baris ke-(i+1) selalu lebih besar dari elemen terakhir baris ke-i.
  Artinya kalau matrix ini dibaca baris-per-baris (kiri ke kanan, atas ke bawah),
  hasilnya jadi SATU deret angka yang sorted penuh:

    [1,3,5,7] [10,11,16,20] [23,30,34,60]
    -> kalau digabung: 1,3,5,7,10,11,16,20,23,30,34,60  (sudah sorted semua!)

  Karena SEMUANYA sorted, binary search bisa dipakai -- bedanya approach 2
  dan 3 cuma di CARA binary search-nya.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Cek satu-satu semua sel pakai nested loop. Benar, tapi nggak manfaatin
fakta bahwa matrix-nya sorted. O(m*n) time, O(1) space. Jawaban pemanasan,
bukan jawaban final di interview untuk soal ini.

─── APPROACH 2: Binary search 2 tahap (cari baris dulu, baru cari kolom) ──
Analoginya: nyari kata di kamus tebal.
  1. Pertama tebak-tebak ada di HALAMAN berapa (baris mana).
  2. Begitu ketemu halamannya, baru cari KATA-nya di halaman itu (kolom mana).

Tahap 1 bisa jalan karena rentang nilai tiap baris itu sendiri sorted
dibanding baris lain: baris 0 rentangnya [1..7], baris 1 [10..20], baris 2
[23..60] -- rentangnya nggak pernah tumpang tindih dan selalu naik. Jadi
kita bisa binary search di baris pakai elemen pertama & terakhir tiap baris
buat mutusin: target kekecilan (naik ke baris atas), kegedean (turun ke
baris bawah), atau memang ada di rentang baris ini.

Tahap 2 cuma binary search biasa di dalam n elemen baris itu.

  Time:  O(log m) buat nemu baris + O(log n) buat cari di dalam baris
         = O(log m + log n)
  Space: O(1)

─── APPROACH 3: Anggap jadi 1 array (yang optimal) ────────────────────
Daripada 2 tahap terpisah, langsung skip proses "cari baris dulu" dan
binary search langsung ke SEMUA m*n elemen seolah-olah semuanya berjejer
dalam satu garis panjang.

KENAPA "n = matrix[0].length":
  - m = matrix.length       -> jumlah BARIS
  - n = matrix[0].length    -> jumlah KOLOM (berapa elemen dalam SATU
    baris). Dipakai matrix[0] karena baris ke-0 pasti selalu ada
    (constraints bilang m >= 1), dan karena ini matrix persegi panjang
    (rectangular), SEMUA baris punya panjang yang sama persis, yaitu n.
    Kamu bisa aja nulis matrix[1].length atau
    matrix[matrix.length - 1].length -- hasilnya sama semua. matrix[0]
    dipilih karena itu yang paling pasti/aman selalu tersedia.

KENAPA "row = mid / n" dan "col = mid % n":
  Bayangin matrix-nya sebagai baris-baris dengan lebar tetap n, disambung
  jadi satu garis:

    index flat:   0  1  2  3 | 4  5  6  7 | 8  9  10 11
    baris:        --- baris 0 -|- baris 1 -|-- baris 2 --
    (n = 4 per baris)

  - Index 0..3   milik baris 0
  - Index 4..7   milik baris 1
  - Index 8..11  milik baris 2

  Buat tahu index flat itu milik baris mana, bagi dengan lebar baris dan
  buang sisanya (integer division): index 5 -> 5 / 4 = 1 (bulat ke bawah)
  -> baris 1. Itu persis `Math.floor(mid / n)`.

  Buat tahu POSISI di dalam baris itu, ambil sisa bagi setelah semua baris
  penuh sebelumnya dihitung: index 5 -> 5 % 4 = 1 -> kolom 1 (elemen ke-2
  di baris 1, yaitu matrix[1][1] = 11). Itu `mid % n`.

  Analogi tiket bioskop: kalau tiap baris kursi isinya n=4 kursi, dan kamu
  dikasih nomor tiket global 5, kamu hitung 5/4 = 1 (baris 1) dan 5%4 = 1
  (kursi ke-1 di baris itu) -- rumus yang persis sama, alasan yang sama.

  Time:  O(log(m*n)) untuk satu binary search atas m*n elemen
  Space: O(1)

  Catatan: log(m*n) = log(m) + log(n) secara matematis, jadi approach 2
  dan 3 punya kompleksitas yang SAMA -- approach 3 cuma lebih ringkas
  ditulis (1 while-loop, bukan binary search di dalam binary search).

─── PERBANDINGAN / COMPARISON ─────────────────────────────────────────
                          Time                Space
  1. Brute force          O(m*n)              O(1)
  2. Binary search 2x     O(log m + log n)    O(1)
  3. Flattened binary     O(log(m*n))         O(1)
*/
