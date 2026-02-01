/**
  Given an integer array nums and an integer k, 
  return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.


 Example 1:

 Input: nums = [1,2,3,1], k = 3
 Output: true

 Example 2:

 Input: nums = [1,0,1,1], k = 1 
 Output: true
 Explanation:
    There are two 1s in the array, one at index 2 and the other at index 3.
    (the distance between the two 1's is 1, focus on the last two elements 
    and you'll see they are duplicates and their indices difference is 1 which is <= k)

    
 Example 3:

 Input: nums = [1,2,3,1,2,3], k = 2
 Output: false

 

 Constraints:

     1 <= nums.length <= 105
     -109 <= nums[i] <= 109
     0 <= k <= 105

*/

// ANSWER
// Kamu harus cek apakah ada angka yang sama muncul dua kali tetapi jarak posisinya tidak lebih dari k.

// Secara formal: Ada i != j sehingga:

//     nums[i] == nums[j] (nilainya sama)
//     |i - j| <= k (selisih index-nya ≤ k)

// Kalau ada, hasilnya true. Kalau tidak ada, false.
// keyword nya harusnya di return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k
// Coba Ubah kalimat soal jadi 1 kalimat sederhana, Fokus ke “apa yang diminta outputnya”

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function(nums, k) {
    const uniqueMap = new Map();
    for(i=0; i<nums.length; i++){
        if(uniqueMap.has(nums[i]) && (Math.abs(i - uniqueMap.get(nums[i])) <= k)) return true
        else uniqueMap.set(nums[i],i)
    }
    return false;
};
// time complexity: O(n) dan space complexity: O(n) karena store semua data di map

// atau bisa juga yang lebih baik dari segi efisiensi memori dengan cara berikut dengan menggunakan sliding window dengan set:
var containsNearbyDuplicate = function(nums, k) {
    const uniqueSet = new Set();
    for(i=0; i<nums.length; i++){
        if(uniqueSet.has(nums[i])) return true
        uniqueSet.add(nums[i])
        if(uniqueSet.size > k){
            uniqueSet.delete(nums[i-k]) // delete so set will only contains data with distance <= k
        }
    }
    return false;
};
// time complexity: O(n) dan space complexity: O(k) karena maksimal menyimpan k+1 data di map
// kita menggunakan set karena kita hanya perlu cek ada/tidak data duplikat di dalam jendela (window) berukuran k, tidak perlu menyimpan index-nya seperti di map


/* ======================================================================================================================================
Simulasi super pelan: nums = [1,0,1,1], k = 1
Kita pakai konsep “Set” (karena Map kamu fungsinya seperti Set: cuma cek ada/tidak).

window = angka-angka yang masih “diingat” (maksimal 1 langkah terakhir)
i=0, angka=1

    window: {}
    1 belum ada → masukin 1
    window: {1}
    size=1, tidak > 1 → tidak buang apa-apa

i=1, angka=0

    window: {1}
    0 belum ada → masukin 0
    window: {1,0} (size=2, kebanyakan karena k=1)
    harus buang yang “terlalu lama”:
        buang nums[i-k] = nums[1-1] = nums[0] = 1
    window jadi {0}

Perhatikan: yang dibuang itu angka di index 0, karena sekarang kamu ada di index 1 dan hanya boleh ingat yang jaraknya ≤1.
i=2, angka=1

    window: {0}
    1 belum ada → masukin 1
    window: {0,1} (size=2) → buang yang terlalu lama
        buang nums[2-1] = nums[1] = 0
    window jadi {1}

i=3, angka=1

    window: {1}
    1 sudah ada → berarti ada dua angka 1 yang jaraknya ≤1 (index 2 dan 3)
    return true

4) Kenapa kondisi buangnya size > k?

Karena saat kamu sedang di index i, kamu ingin window berisi elemen dari index:

    i-k sampai i-1 (jumlahnya maksimal k elemen)

Begitu kamu tambah elemen baru, ukuran bisa jadi k+1, maka harus buang 1 elemen paling lama.

======================================================================================================================================
SIMULASI KEDUA
Untuk nums = [1,2,3,1,2,3] dan k = 2, jawabannya false (tidak ada duplikat yang jaraknya ≤ 2).

Kita simulasi dengan logika yang sama (sliding window pakai Set/Map): simpan hanya k elemen terakhir. Karena k=2, kita hanya “ingat” maksimal 2 angka terakhir.

Saya tulis window = isi yang disimpan saat itu.
i=0, nums[i]=1

    window awal: {}
    1 belum ada → tambah
    window: {1}
    size 1 ≤ 2 → tidak hapus

i=1, nums[i]=2

    window: {1}
    2 belum ada → tambah
    window: {1,2}
    size 2 ≤ 2 → tidak hapus

i=2, nums[i]=3

    window: {1,2}
    3 belum ada → tambah
    window: {1,2,3} (size 3 > 2) → harus hapus yang paling lama (index i-k)
    hapus nums[i-k] = nums[2-2] = nums[0] = 1
    window jadi: {2,3}

i=3, nums[i]=1

    window: {2,3}
    cek 1 ada? tidak → tambah
    window: {2,3,1} → size 3 > 2 → hapus nums[3-2]=nums[1]=2
    window: {3,1}
    (di sini 1 memang muncul lagi, tapi jaraknya dari 1 pertama: index 0 ke 3 = 3, terlalu jauh untuk k=2)

i=4, nums[i]=2

    window: {3,1}
    2 ada? tidak → tambah
    window: {3,1,2} → hapus nums[4-2]=nums[2]=3
    window: {1,2}
    (2 muncul lagi, jaraknya index 1 ke 4 = 3, juga terlalu jauh)

i=5, nums[i]=3

    window: {1,2}
    3 ada? tidak → tambah
    window: {1,2,3} → hapus nums[5-2]=nums[3]=1
    window: {2,3}
    selesai, tidak pernah ketemu “sudah ada di window” → false

Intuisi cepatnya

Duplikatnya ada (1 muncul lagi, 2 muncul lagi, 3 muncul lagi) tapi semuanya berjarak 3, sedangkan k=2. Jadi tidak memenuhi syarat.

Kalau k kamu ubah jadi 3, baru akan jadi true (misal 1 di index 0 dan 3 jaraknya 3).


======================================================================================================================================
CATATAN TAMBAHAN
>> Semua hash map dan hash set itu sliding window?
Tidak. HashMap/HashSet bukan berarti sliding window. Mereka hanya struktur data untuk lookup cepat.

Sliding window itu teknik: kita menjaga sebuah “rentang/jendela” data yang bergerak (misal ukurannya tetap atau dibatasi), lalu update saat index maju.
Bedanya singkat

    HashSet / HashMap: alat untuk menyimpan & cek cepat (O(1) rata-rata).
    Sliding window: cara memproses array/string dengan menjaga data untuk rentang tertentu yang bergeser.

Keduanya sering dipakai bareng, tapi tidak selalu.

>> Kapan jadi “sliding window + hash”?

Kalau ada batas seperti:

    “dalam jarak k”
    “panjang substring tanpa karakter berulang”
    “window ukuran k” dan kamu menghapus elemen yang keluar window atau menggeser left pointer, baru itu sliding window.

====================================================================================================================================== */
