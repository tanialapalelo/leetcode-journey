/**
 * 567. Permutation in String
 * Medium
 *
 * Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.
 *
 * In other words, return true if one of s1's permutations is the substring of s2.
 *
 *
 *
 * Example 1:
 *
 * Input: s1 = "ab", s2 = "eidbaooo"
 * Output: true
 * Explanation: s2 contains one permutation of s1 ("ba").
 * Example 2:
 *
 * Input: s1 = "ab", s2 = "eidboaoo"
 * Output: false
 *
 *
 * Constraints:
 *
 * 1 <= s1.length, s2.length <= 104
 * s1 and s2 consist of lowercase English letters.
 */

// ANSWER with help of youtube DSA crash course freecodecamp & GPT

/*
MENTAL MODEL

"s2 contains a permutation of s1" = somewhere inside s2 there's a substring of
length s1.length that has EXACTLY the same letter counts as s1 (order doesn't
matter, permutation = same letters rearranged).

So the problem reduces to: "does any substring of s2 with length m = s1.length
have the same character-count signature as s1?" That's the SAME signature
trick used in group-anagrams (count array of size 26 = a word's fingerprint).

Since the substring must be EXACTLY length m, this is a FIXED-SIZE sliding
window: a window of length m slides across s2 one step at a time, and at
each position we check if the window's letter counts match s1's letter counts.

Why not recompute counts from scratch for every window (brute force)?
That would be O(m) work per window, O(n) windows → O(n*m) total, too slow.
Instead we maintain a running count array `win` and update it in O(1) per
slide: ADD the character entering on the right, REMOVE the character leaving
on the left. This is the classic "sliding window + frequency count" pattern.

VARIABLES EXPLAINED
  m, n      - lengths of s1, s2 (window size = m, we slide across all of s2)
  base      - ascii code of 'a' (97), used to convert any lowercase letter to
              a 0-25 index: 'a'-97=0, 'b'-97=1, ... 'z'-97=25
  idx(ch)   - helper that does that char → index conversion (char.charCodeAt(0) - base)
  need      - the TARGET signature: letter counts of s1 (fixed, computed once)
  win       - the CURRENT WINDOW's signature: letter counts of the m-length
              slice of s2 we're currently looking at (updates every slide)
  same(a,b) - compares two count arrays element by element; arrays can't be
              compared with === (that checks reference, not contents), so we
              loop through all 26 slots manually (same idea as .join('#') in
              group-anagrams, just done via comparison instead of stringifying)

WALKTHROUGH — s1 = "ab" (need: a=1,b=1), s2 = "eidbaooo" (m=2, n=8)

  indices:  e0 i1 d2 b3 a4 o5 o6 o7

  step         | add s2[r] | remove s2[r-m] | window (idx) | substring | win counts   | match need?
  init (r<m)   | -         | -              | [0,1]        | "ei"      | e:1,i:1      | no
  r=2          | d         | e (s2[0])      | [1,2]        | "id"      | i:1,d:1      | no
  r=3          | b         | i (s2[1])      | [2,3]        | "db"      | d:1,b:1      | no
  r=4          | a         | d (s2[2])      | [3,4]        | "ba"      | b:1,a:1      | YES → return true

  At r=4 the window "ba" has the exact same letter counts as "ab" (a:1, b:1),
  even though the order is different — that's exactly what "permutation"
  means, and why we compare COUNTS instead of comparing strings directly.

  Notice the "remove" character is always s2[r-m]: when the window was
  [r-m, r-1] and we add index r, the window becomes [r-m, r], which is one
  too long — so we must drop its leftmost index r-m to keep length m.
*/

/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
function checkInclusion(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    if (m > n) return false;

    const base = "a".charCodeAt(0);
    const need = new Array(26).fill(0);
    const win = new Array(26).fill(0);

    const idx = (ch) => ch.charCodeAt(0) - base; // function to get index

    // counts for s1
    for (let i = 0; i < m; i++) need[idx(s1[i])]++;

    // first window in s2
    for (let i = 0; i < m; i++) win[idx(s2[i])]++;

    if (same(need, win)) return true;

    // slide window: add s2[r], remove s2[r-m]  (penjelasan lengkap di bagian bawah file)
    for (let r = m; r < n; r++) {
        win[idx(s2[r])]++;       // add right char entering the window
        win[idx(s2[r - m])]--;   // remove left char leaving the window

        if (same(need, win)) return true;
    }

    return false;

    // arrays compare by REFERENCE with === ([1,0] === [1,0] is false), so we
    // must compare contents manually, slot by slot, across all 26 letters
    function same(a, b) {
        for (let i = 0; i < 26; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
}

// Time complexity: O(26 * (n - m)) = O(n) - the window slides one character at a time across
// s2, and each slide compares two 26-length arrays (constant factor 26).
// Space complexity: O(1) - fixed-size 26-element arrays regardless of input size.

/*
=====================================================================
PENJELASAN DETAIL (Bahasa Indonesia) - cara loop geser & complexity
=====================================================================

CONTOH: s1 = "ab" (need: a=1, b=1), s2 = "eidbaooo" (m=2, n=8)

index s2:   0   1   2   3   4   5   6   7
karakter:   e   i   d   b   a   o   o   o

VISUALISASI WINDOW BERGESER (tanda [ ] = window yang lagi dicek):

  window awal (sebelum loop, sudah dihitung di atas):
    [e i] d b a o o o         win: e=1, i=1        -> beda dari need, lanjut

  r=2 -> tambah s2[2]='d', buang s2[0]='e' (r-m = 2-2 = 0):
     e [i d] b a o o o        win: i=1, d=1        -> beda dari need, lanjut

  r=3 -> tambah s2[3]='b', buang s2[1]='i' (r-m = 3-2 = 1):
     e i [d b] a o o o        win: d=1, b=1        -> beda dari need, lanjut

  r=4 -> tambah s2[4]='a', buang s2[2]='d' (r-m = 4-2 = 2):
     e i d [b a] o o o        win: b=1, a=1        -> SAMA dengan need! return true

POLA YANG SELALU BERULANG TIAP ITERASI (r):
  - window SEBELUMNYA ada di posisi [r-m, r-1]
  - kita mau geser window itu 1 langkah ke kanan jadi [r-m+1, r]
  - caranya: + karakter baru yang masuk di kanan (index r)
             - karakter lama yang keluar di kiri (index r-m, yaitu ujung kiri
               window sebelumnya, karena window cuma boleh sepanjang m)
  - kenapa index yang dibuang itu r-m? karena kalau cuma nambah s2[r] tanpa
    buang apa-apa, window jadi sepanjang m+1 (kelebihan 1 karakter di kiri),
    makanya karakter paling kiri (index r-m) harus dibuang biar balik ke
    panjang m lagi.

Setiap geser CUMA 2 operasi (++ dan --), gak perlu hitung ulang semua isi
window dari nol. Itu sebabnya ini disebut "sliding window" -- window-nya
"meluncur" satu langkah, bukan dibangun ulang tiap kali.

---------------------------------------------------------------------
KENAPA TIME COMPLEXITY-NYA O(n)?

  N = s2.length (panjang string yang dicari), M = s1.length (ukuran window)

  - loop geser jalan sebanyak (N - M) kali -> tiap kali geser cuma O(1) kerja
    (1 operasi tambah + 1 operasi kurang, BUKAN hitung ulang seluruh window)
  - tiap geser juga manggil same(need, win) yang loop 26 slot (jumlah huruf
    alfabet a-z) -> ini SELALU 26 kali, gak peduli seberapa panjang s1/s2,
    jadi dianggap KONSTAN (gak ikut membesar seiring input), makanya ditulis
    sebagai angka tetap "26", bukan variabel N atau M
  - total kerja = (N - M) geseran x (2 + 26) operasi konstan per geseran
    = O(N) -- angka 26 dan 2 itu konstanta, cuma N yang menentukan skala

  Bandingkan dengan cara BRUTE FORCE (hitung ulang isi window dari nol tiap
  posisi): itu butuh O(M) kerja PER posisi (bukan O(1) kayak sliding window),
  dikali (N - M) posisi -> O(N * M). Itu jauh lebih lambat kalau M besar.
  Sliding window ini optimal karena tiap geser gak pernah mengulang kerja
  yang sama, cuma update bagian yang berubah (1 masuk, 1 keluar).

---------------------------------------------------------------------
KENAPA SPACE COMPLEXITY-NYA O(1)?

  - array `need` dan `win` ukurannya SELALU 26 (jumlah huruf a-z), gak
    peduli s1 atau s2 panjangnya berapa (mau 10 karakter atau 10.000
    karakter, array-nya tetap 26 slot)
  - karena ukuran memory yang dipakai gak ikut membesar seiring ukuran
    input (N atau M), ini disebut ruang KONSTAN -> O(1)
  - beda dengan misal simpan semua substring hasil slicing (kalau kita
    pakai cara .substring() tiap window), itu baru O(M) per window karena
    ukurannya ikut skala dengan panjang s1
*/