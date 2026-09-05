/*
179. Largest Number
Medium

Given a list of non-negative integers nums, arrange them such that they form the largest number and return it.

Since the result may be very large, so you need to return a string instead of an integer.



Example 1:

Input: nums = [10,2]
Output: "210"
Example 2:

Input: nums = [3,30,34,5,9]
Output: "9534330"


Constraints:

1 <= nums.length <= 100
0 <= nums[i] <= 109

 */

/* APPROACHES
1. Brute force -> try every permutation, keep the biggest concatenation.
   Correct, but O(n!) -- only usable for tiny arrays (way below the actual
   constraint of n <= 100). Included to show the naive idea before the
   trick that makes it fast.
2. Optimal -> convert numbers to strings, sort them with a CUSTOM
   comparator ("does a+b or b+a make the bigger number?"), then join.
   Time: O(n log n) comparisons (each comparison is O(k) on ~10-digit
   strings), Space: O(n) for the string array.
 */

/**
 * @param {number[]} nums
 * @return {string}
 */
// APPROACH 1 — Brute force: try every permutation, keep the largest result
// Time: O(n! * n) | Space: O(n! * n) (call stack + all the candidate strings)
var largestNumberBrute = function (nums) {
    const strs = nums.map(String);
    let best = null;

    function permute(remaining, curr) {
        if (remaining.length === 0) {
            const candidate = curr.join('');
            // every permutation of the same digits concatenates to the SAME
            // total length, so plain string comparison already behaves like
            // numeric comparison here -- no need to parse to a number
            if (best === null || candidate > best) best = candidate;
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            const rest = remaining.slice(0, i).concat(remaining.slice(i + 1));
            permute(rest, curr.concat(remaining[i]));
        }
    }

    permute(strs, []);

    if (best[0] === '0') return '0'; // e.g. nums = [0,0] -> "00" should be "0"
    return best;
};

// APPROACH 2 — Optimal: sort strings with a custom "which order makes a bigger number" comparator
// Time: O(n log n) | Space: O(n)
var largestNumber = function (nums) {
    const strs = nums.map(String);

    strs.sort((a, b) => {
        const ab = a + b; // try a before b
        const ba = b + a; // try b before a
        if (ab > ba) return -1; // a+b wins -> a should come first
        if (ab < ba) return 1;  // b+a wins -> b should come first
        return 0;                // tie, order doesn't matter
    });

    if (strs[0] === '0') return '0'; // all zeros -> "000..." should just be "0"
    return strs.join('');
};

/*
WALKTHROUGH (quick reference, read this together with the code above)

English:
nums = [3, 30, 34, 5, 9]

First, the KEY intuition with a smaller pair: nums = [3, 30]
  If you sorted by plain numeric value descending, 30 > 3, so you'd try
  "30" then "3" -> "303".
  But trying the OTHER order: "3" then "30" -> "330".
  330 > 303 -- so numeric order is flat-out WRONG here. The comparator
  instead asks directly: does "3"+"30" ("330") beat "30"+"3" ("303")?
  Yes -> put "3" first. That's the whole idea.

Now the full example, comparing every pair using the "a+b vs b+a" rule
(strs start as ["3","30","34","5","9"]):
  "9" vs "5"  -> "95" vs "59"  -> "95" wins -> 9 before 5
  "9" vs "34" -> "934" vs "349" -> "934" wins -> 9 before 34
  "5" vs "34" -> "534" vs "345" -> "534" wins -> 5 before 34
  "34" vs "3" -> "343" vs "334" -> "343" wins -> 34 before 3
  "3" vs "30" -> "330" vs "303" -> "330" wins -> 3 before 30
  "34" vs "30" -> "3430" vs "3034" -> "3430" wins -> 34 before 30

  Putting it all together, the sorted order is: 9, 5, 34, 3, 30
  Join them: "9" + "5" + "34" + "3" + "30" = "9534330"  ✓ matches expected output

Bahasa Indonesia:
nums = [3, 30, 34, 5, 9]

Intuisi KUNCI-nya dulu, pakai pasangan yang lebih kecil: nums = [3, 30]
  Kalau disortir berdasarkan nilai numerik descending, 30 > 3, jadi kamu
  bakal coba "30" duluan baru "3" -> "303".
  Tapi coba urutan LAIN: "3" duluan baru "30" -> "330".
  330 > 303 -- jadi urutan numerik itu SALAH TOTAL di sini. Comparator-nya
  malah nanya langsung: apakah "3"+"30" ("330") ngalahin "30"+"3" ("303")?
  Ya -> taruh "3" duluan. Itu ide utamanya.

Sekarang contoh lengkapnya, bandingin tiap pasangan pakai aturan
"a+b vs b+a" (strs mulai dari ["3","30","34","5","9"]):
  "9" vs "5"  -> "95" vs "59"  -> "95" menang -> 9 duluan sebelum 5
  "9" vs "34" -> "934" vs "349" -> "934" menang -> 9 duluan sebelum 34
  "5" vs "34" -> "534" vs "345" -> "534" menang -> 5 duluan sebelum 34
  "34" vs "3" -> "343" vs "334" -> "343" menang -> 34 duluan sebelum 3
  "3" vs "30" -> "330" vs "303" -> "330" menang -> 3 duluan sebelum 30
  "34" vs "30" -> "3430" vs "3034" -> "3430" menang -> 34 duluan sebelum 30

  Digabungin, urutan hasil sortnya: 9, 5, 34, 3, 30
  Disambung: "9" + "5" + "34" + "3" + "30" = "9534330"  ✓ cocok sama expected output

Latihan: coba trace manual nums = [0, 0] dan nums = [121, 12] -- perhatikan
kenapa [0,0] butuh penanganan khusus (`if (strs[0] === '0') return '0'`),
dan gimana comparator-nya mutusin urutan buat [121,12] (bandingin "12112"
vs "12121").
*/

/*
EXPLANATION (English)

The trap this problem sets: your first instinct is probably "just sort
the numbers descending" (biggest number first). That feels reasonable,
but it's provably wrong. Counter-example: nums = [3, 30].
  Sort descending by value: 30, then 3 -> concatenate -> "303"
  But putting 3 first instead: "3", then "30" -> concatenate -> "330"
  330 > 303. Descending numeric order gives the WRONG answer.

Why does this happen? Comparing 3 and 30 as raw numbers throws away
information that matters here: what actually determines the biggest
result isn't "which number is bigger", but "which ORDER of digits, when
the two are glued together, produces a bigger combined string". Those
are two different questions, and this problem needs the second one.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Try every possible ORDER (permutation) of the numbers, concatenate each
full permutation into one string, and keep whichever is largest.

Since every permutation uses the exact same multiset of digits (just
reordered), every candidate string ends up the SAME total length -- which
means plain string comparison (`candidate > best`) already behaves
exactly like numeric comparison here (no need to convert to BigInt or
compare digit counts separately).

This is correct, but there are n! possible orderings. For the actual
constraint (n up to 100), n! is so astronomically large it's not just
slow, it's physically impossible to ever finish. Only useful to run on
tiny arrays (5-8 elements) as a way to sanity-check the optimal approach,
never as a real submission.

  Time:  O(n! * n) -- n! permutations, each one costs O(n) to build/join.
  Space: O(n! * n) in the worst case across the whole recursion tree
         (not literally all held at once, but the total work done scales
         this way) -- plus O(n) recursion depth.

─── APPROACH 2: Optimal — custom comparator sort ──────────────────────
Convert every number to a string, then sort the strings with a comparator
that answers exactly the right question for each PAIR: "does putting a
before b (a+b) make a bigger number than putting b before a (b+a)?"

  if (a+b > b+a)  -> a belongs BEFORE b
  if (a+b < b+a)  -> b belongs BEFORE a
  (equal -> order between them doesn't matter)

Why comparing a+b vs b+a is enough to decide their RELATIVE order (an
"exchange argument"): imagine any final arrangement where b happens to
sit somewhere before a. Swapping just those two adjacent-in-effect
numbers only changes the digits contributed by a and b themselves (call
that piece "a+b" vs "b+a") -- every other number's contribution to the
final string is completely unaffected by this swap. So if a+b is bigger
than b+a as a string, you can always improve (or at least not worsen) the
whole arrangement by making sure a comes first. Doing this pairwise
comparison consistently across ALL pairs and letting a stable sort
apply it is what guarantees the fully assembled result is the largest
possible for the whole array (this pairwise rule is a valid total order --
it's provably transitive, which is exactly what a sort comparator needs).

Since a+b and b+a are always the exact same total length for any pair (a
and b together contribute |a|+|b| characters either way), directly
comparing the two strings lexicographically (`>`, `<`) behaves identically
to comparing them as numbers -- no parsing to numbers needed at all.

After sorting, the strings are already in the correct final order --
just join them. One remaining edge case: if the array is all zeros (e.g.
[0,0]), joining gives "00", but the expected answer is "0". Checking if
the very FIRST sorted string is "0" (which can only happen if EVERY
number was 0 -- otherwise something bigger would have sorted first) is
enough to catch this and return "0" directly.

  Time:  O(n log n) comparisons from the sort, each comparison doing
         O(k) work (string concatenation/comparison on numbers up to
         10 digits per the constraints) -- so roughly O(n log n * k),
         and k is a small constant here, so this is effectively O(n log n).
  Space: O(n) for the array of stringified numbers.

─── COMPLEXITY COMPARISON ──────────────────────────────────────────────
                          Time              Space
  1. Brute force          O(n! * n)         O(n! * n)
  2. Custom comparator    O(n log n)        O(n)


PENJELASAN (Bahasa Indonesia)

Jebakan yang dipasang soal ini: insting pertama kamu mungkin "tinggal
sortir angka-angkanya descending" (angka paling besar duluan). Kedengeran
masuk akal, tapi itu SALAH, bisa dibuktikan. Contoh penyangkalnya:
nums = [3, 30].
  Sortir descending berdasarkan nilai: 30, terus 3 -> disambung -> "303"
  Tapi kalau 3 ditaruh duluan: "3", terus "30" -> disambung -> "330"
  330 > 303. Urutan numerik descending ngasih jawaban yang SALAH.

Kenapa ini bisa kejadian? Bandingin 3 dan 30 sebagai angka mentah itu
buang informasi yang justru penting di sini: yang benar-benar nentuin
hasil paling besar itu BUKAN "angka mana yang lebih besar", tapi "URUTAN
digit yang mana, kalau keduanya disambung, ngasih string gabungan yang
lebih besar". Itu dua pertanyaan yang beda, dan soal ini butuh pertanyaan
yang kedua.

─── APPROACH 1: Brute force ────────────────────────────────────────────
Coba semua kemungkinan URUTAN (permutasi) angka-angkanya, sambung tiap
permutasi lengkap jadi satu string, simpan yang paling besar.

Karena tiap permutasi makai kumpulan digit yang persis sama (cuma
diurutin ulang), tiap kandidat string ujung-ujungnya punya panjang total
yang SAMA -- artinya perbandingan string biasa (`candidate > best`) udah
otomatis berperilaku persis kayak perbandingan numerik di sini (nggak
perlu convert ke BigInt atau bandingin jumlah digit terpisah).

Ini benar, tapi ada n! kemungkinan urutan. Buat constraint sebenarnya
(n sampai 100), n! itu segede-gedenya nggak cuma lambat, tapi secara fisik
mustahil pernah selesai. Cuma berguna dijalanin di array kecil (5-8
elemen) buat ngecek kebenaran approach optimal, jangan pernah dipakai
buat submit beneran.

  Time:  O(n! * n) -- n! kemungkinan urutan, tiap urutan makan O(n) buat
         nyusun/nyambung.
  Space: O(n! * n) di kasus terburuk kalau dihitung total pohon rekursinya
         (bukan literally semua kesimpan bersamaan, tapi total kerjaannya
         segitu skalanya) -- plus O(n) kedalaman rekursi.

─── APPROACH 2: Optimal — sort pakai comparator custom ────────────────
Ubah tiap angka jadi string, terus sortir string-string itu pakai
comparator yang nanya pertanyaan yang PAS buat tiap PASANGAN: "kalau a
ditaruh sebelum b (a+b), apakah itu ngasih angka lebih besar daripada b
ditaruh sebelum a (b+a)?"

  kalau (a+b > b+a)  -> a harusnya SEBELUM b
  kalau (a+b < b+a)  -> b harusnya SEBELUM a
  (sama -> urutan di antara keduanya nggak penting)

Kenapa bandingin a+b vs b+a itu cukup buat nentuin urutan RELATIF mereka
(ini disebut "exchange argument" / argumen tukar-posisi): bayangin ada
susunan akhir mana pun di mana b kebetulan ada di posisi sebelum a.
Nukar posisi cuma dua angka itu (yang bersebelahan secara efek) cuma
ngubah digit yang disumbang oleh a dan b sendiri (sebut aja potongan itu
"a+b" vs "b+a") -- kontribusi angka lain ke string akhir sama sekali
nggak kepengaruh sama pertukaran ini. Jadi kalau a+b lebih besar dari
b+a sebagai string, kamu selalu bisa memperbaiki (atau minimal nggak
memperburuk) susunan keseluruhan dengan mastiin a duluan. Ngelakuin
perbandingan pasangan ini secara konsisten buat SEMUA pasangan, dan
biarin sort yang stabil nerapin itu, itulah yang menjamin hasil akhirnya
adalah yang paling besar buat seluruh array (aturan pasangan ini adalah
"total order" yang valid -- bisa dibuktikan transitif, yang persis
dibutuhin sama comparator buat sort).

Karena a+b dan b+a selalu punya panjang total yang PERSIS SAMA buat
pasangan manapun (a dan b bareng-bareng nyumbang |a|+|b| karakter di
kedua urutan), bandingin dua string itu langsung secara lexicographic
(`>`, `<`) berperilaku identik sama bandingin sebagai angka -- nggak
perlu parsing ke angka sama sekali.

Setelah disortir, string-stringnya udah dalam urutan akhir yang benar --
tinggal disambung. Satu edge case yang tersisa: kalau seluruh array isinya
nol (misal [0,0]), nyambungnya ngasih "00", tapi jawaban yang diharapkan
"0". Ngecek apakah string PERTAMA setelah disortir itu "0" (yang cuma
bisa kejadian kalau SEMUA angka itu 0 -- kalau nggak, pasti ada yang
lebih besar yang ke-sort duluan) udah cukup buat nangkep kasus ini dan
langsung return "0".

  Time:  O(n log n) perbandingan dari sort, tiap perbandingan makan
         O(k) kerjaan (penyambungan/perbandingan string buat angka
         sampai 10 digit sesuai constraint) -- jadi kira-kira
         O(n log n * k), dan k di sini konstanta kecil, jadi efektifnya
         O(n log n).
  Space: O(n) buat array angka yang udah di-string-in.

─── PERBANDINGAN KOMPLEKSITAS ──────────────────────────────────────────
                          Time              Space
  1. Brute force          O(n! * n)         O(n! * n)
  2. Custom comparator    O(n log n)        O(n)
*/
