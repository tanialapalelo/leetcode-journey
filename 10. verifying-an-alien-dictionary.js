/*
953. Verifying an Alien Dictionary
Easy

In an alien language, surprisingly, they also use English lowercase letters, but possibly in a different order. The order of the alphabet is some permutation of lowercase letters.

Given a sequence of words written in the alien language, and the order of the alphabet, return true if and only if the given words are sorted lexicographically in this alien language.

 

Example 1:

Input: words = ["hello","leetcode"], order = "hlabcdefgijkmnopqrstuvwxyz"
Output: true
Explanation: As 'h' comes before 'l' in this language, then the sequence is sorted.
Example 2:

Input: words = ["word","world","row"], order = "worldabcefghijkmnpqstuvxyz"
Output: false
Explanation: As 'd' comes after 'l' in this language, then words[0] > words[1], hence the sequence is unsorted.
Example 3:

Input: words = ["apple","app"], order = "abcdefghijklmnopqrstuvwxyz"
Output: false
Explanation: The first three characters "app" match, and the second string is shorter (in size.) According to lexicographical rules "apple" > "app", because 'l' > '∅', where '∅' is defined as the blank character which is less than any other character (More info).
 

Constraints:

1 <= words.length <= 100
1 <= words[i].length <= 20
order.length == 26
All characters in words[i] and order are English lowercase letters.
 
*/

// ANSWER

/*
MENTAL MODEL — kenapa harus nested for?

Masalah ini punya DUA dimensi yang harus dicek, jadi butuh dua loop variable:
  1) dimensi "pasangan kata" — words[i] dibandingkan dengan words[i+1]
     (loop luar, variable i)
  2) dimensi "posisi karakter di dalam satu pasangan itu" — bandingin
     words[i].charAt(c) dengan words[i+1].charAt(c) satu-satu dari kiri
     (loop dalam, variable c)

Dua dimensi ini gak bisa digabung jadi satu loop flat, karena begitu pindah
ke pasangan berikutnya (i+1 vs i+2), index karakter c harus RESET ke 0 lagi
(pasangan baru, mulai bandingin dari karakter pertama lagi). Itu artinya c
selalu "terikat" ke i yang sedang aktif — hubungan ini paling natural ditulis
sebagai nested for, bukan satu loop panjang.

Loop dalam juga langsung BREAK begitu ketemu karakter yang beda (atau return
false kalau kepanjangan/kekurangan huruf dibanding kata berikutnya) — gak
perlu lanjut cek sisa karakter di pasangan itu karena hasilnya udah pasti.
Itu sebabnya walau strukturnya nested, total kerja tetap sedikit (lihat
complexity di bawah), bukan dikali dua tingkat.
*/

/**
 * @param {string[]} words
 * @param {string} order
 * @return {boolean}
 */
var isAlienSorted = function(words, order) {
    const orderMap = new Map();
    for (let i=0; i<order.length;i++){
        orderMap.set(order.charAt(i), i)
    }
    console.log("orderMap",orderMap);
    //iterate for every word
    // length-1 cuz if we reach last index then no need to compare to the next nonexisted word
    for(let i=0; i<words.length-1; i++){
        // iterate every characters between 2 adjacent words
        for(let c=0; c<words[i].length; c++){
         // ie: Batman, Bat where length of current c is greater than length of the next word
         if(c >= words[i+1].length){
            return false;
         }

         // if the character not the same as the next word's char then compare
         if(words[i].charAt(c) != words[i+1].charAt(c)){
            const currLetter = orderMap.get(words[i].charAt(c)); // urutan huruf sekarang
            const nextLetter = orderMap.get(words[i+1].charAt(c)); // urutan huruf di kata berikutnya
            console.log(c,"currLetter",currLetter)
            console.log(c,"nextLetter",nextLetter)
            if(nextLetter < currLetter) return false; //there's missmatch, example word (current) and world (next), d (current) is 4 and l (next) is 3
            else break; // if the order is correct, then we can break out of here
         }
        }
    }
    // if we're able to get out of the for loop meaning all true order
    return true;
    
};

// Time complexity: O(N · K)
//   N = words.length (jumlah kata), K = panjang kata terpanjang
//   - loop luar jalan (N - 1) kali, satu kali per pasangan kata bersebelahan
//   - loop dalam jalan MAKSIMAL K kali per pasangan, tapi break secepatnya begitu
//     ketemu karakter beda atau kata berikutnya lebih pendek (prefix case)
//   - worst case (semua kata mirip dan gak pernah beda sampai akhir) loop dalam
//     jalan penuh K kali per pasangan -> total N*K, ini sama dengan "total
//     karakter yang di-scan", bukan N*K dikali ekstra
//   - jadi walau ada 2 loop, biayanya tetap linear terhadap ukuran input, bukan
//     kuadratik -- karena loop dalam gak pernah mengulang kerja yang sama
//
// KENAPA INI BUKAN O(N²)? (kesalahpahaman umum: "nested loop = pasti O(n kuadrat)")
//   Nested loop cuma jadi O(n²) kalau KEDUA loop jalan di dimensi ukuran yang
//   SAMA (misal: for i in N, for j in N -- bandingin SETIAP kata ke SETIAP
//   kata lain, kayak bubble sort naif).
//   Di sini loop luar (i) dan loop dalam (c) jalan di DUA dimensi yang BEDA:
//     - i dibatasi N (jumlah kata) -- dan cuma bandingin pasangan BERSEBELAHAN
//       (i vs i+1), BUKAN semua pasangan kata (i vs semua j)
//     - c dibatasi K (panjang kata terpanjang) -- dimensi yang independen dari N
//   Karena cuma pasangan bersebelahan yang dicek (bukan semua N² pasangan),
//   dan K gak ikut membesar seiring N (dibatasi maks 20 di constraint), hasil
//   perkaliannya N*K, bukan N*N. Sama seperti cek array terurut: loop sekali
//   bandingin arr[i] vs arr[i+1] itu O(n), bukan O(n²) walau ada perbandingan
//   berpasangan, karena cuma tetangga yang dicek, bukan semua kombinasi.
//
// Space complexity: O(1) extra
//   - orderMap selalu isi 26 entry (jumlah huruf alfabet), gak ikut membesar
//     seiring N atau K, jadi dianggap konstan terhadap ukuran input

/* NOTE FROM GPT

Copilot said: 
Nice work — your logic is mostly correct ✅
You only need a few best-practice fixes.
Main fixes

    Declare loop vars with let (i, c) — right now they become globals.
    Use strict compare !== instead of !=.
    Optional: use arrays instead of Map for a tiny speed gain.

Your current algorithm is already O(total chars), which is optimal.

----------------------------------------------------------------------
Clean solution with the same logic:
var isAlienSorted = function(words, order) {
    const orderMap = new Map();
    for (let i = 0; i < order.length; i++) {
        orderMap.set(order.charAt(i), i);
    }

    for (let i = 0; i < words.length - 1; i++) {
        for (let c = 0; c < words[i].length; c++) {
            if (c >= words[i + 1].length) return false; // prefix case

            if (words[i].charAt(c) !== words[i + 1].charAt(c)) {
                const currLetter = orderMap.get(words[i].charAt(c));
                const nextLetter = orderMap.get(words[i + 1].charAt(c));
                if (nextLetter < currLetter) return false;
                break; // this pair decided, move to next pair
            }
        }
    }

    return true;
};

----------------------------------------------------------------------
Copilot said: 

In your code you wrote things like:

for (i = 0; i < order.length; i++)

and

for (c = 0; c < words[i].length; c++)

Because there is no let/const/var, JavaScript creates i and c as global variables (in non-strict mode).
That is risky and bad practice.

Use:
JavaScript

for (let i = 0; i < order.length; i++) { ... }
for (let c = 0; c < words[i].length; c++) { ... }

Why it matters

    Globals can be accidentally reused/overwritten.
    Bugs appear when loops/nested functions share same variable names.
    Harder to debug.
    Interviewers expect block-scoped let.

So “they become globals” = they live outside the loop/function scope and can leak state.

*/