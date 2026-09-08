/*
QUESTION: 347. Top K Frequent Elements
Medium

Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

 

Example 1:

Input: nums = [1,1,1,2,2,3], k = 2

Output: [1,2]

Example 2:

Input: nums = [1], k = 1

Output: [1]

Example 3:

Input: nums = [1,2,1,2,1,2,3,1,3,2], k = 2

Output: [1,2]

 

Constraints:

    1 <= nums.length <= 105
    -104 <= nums[i] <= 104
    k is in the range [1, the number of unique elements in the array].
    It is guaranteed that the answer is unique.

 

Follow up: Your algorithm's time complexity must be better than O(n log n), where n is the array's size.


*/

// ANSWER

/*
MENTAL MODEL — Min-Heap (Binary Heap)

Soal minta k elemen paling sering muncul, dan harus lebih cepat dari O(n log n).
Itu artinya kita gak boleh sort semua elemen. Solusinya: jaga cuma "k kandidat
terbaik sejauh ini" pakai struktur yang bisa buang kandidat terlemah dengan cepat.
Struktur yang pas untuk itu adalah HEAP.

1) Apa itu heap?
   Pohon biner (binary tree) dengan aturan: parent selalu <= (min-heap) atau
   >= (max-heap) dibanding anak-anaknya. Bukan urutan penuh kayak sorted array,
   cuma urutan parent-vs-child. Karena itu, root (index 0) selalu elemen
   terkecil (min-heap) atau terbesar (max-heap) — bisa diambil O(1).

2) Kenapa direpresentasikan pakai array, bukan node+pointer kayak linked list?
   Heap selalu berbentuk COMPLETE binary tree (terisi rapat dari kiri ke kanan,
   gak ada "lubang"). Karena rapat, posisi tiap node bisa dihitung pakai index
   matematis, gak perlu simpan pointer left/right/parent secara eksplisit:

       parent(i) = (i - 1) >> 1
       left(i)   = 2*i + 1
       right(i)  = 2*i + 2

   Contoh array [1, 3, 2, 7, 4] direpresentasikan sebagai pohon:

            1            index 0 = root
          /   \
         3     2         index 1, 2
        / \
       7   4              index 3, 4

   index 1 (nilai 3) anaknya index 3 (nilai 7) dan index 4 (nilai 4) — cocok
   dengan rumus 2*1+1=3 dan 2*1+2=4. Linked list gak bisa hitung posisi kayak
   gini karena node-nya gak dijamin "rapat", jadi array jauh lebih efisien
   (O(1) hitung index vs harus nyimpan+ikutin pointer).

3) Gimana urutan tetap valid pas push/pop? (lihat _siftUp / _siftDown di bawah)
   - push: taruh elemen baru di AKHIR array (posisi "paling bawah-kanan" di
     pohon), lalu _siftUp: bandingkan sama parent, tukar posisi selama masih
     melanggar aturan (elemen baru lebih kecil dari parent-nya).
   - pop: root (elemen terkecil) itu yang mau diambil. Kosongin root dengan
     mindahin elemen TERAKHIR ke posisi root, lalu _siftDown: bandingkan sama
     kedua anak, tukar dengan anak terkecil selama masih melanggar aturan.
   Kedua operasi ini cuma butuh O(log n) karena tinggi pohon biner = log n.

4) Trik "top K" pakai MIN-heap (bukan max-heap):
   Heap dibatasi ukurannya maksimal k. Tiap kali push elemen baru dan ukuran
   heap > k, kita pop — dan karena ini MIN-heap, yang ke-pop adalah yang
   COUNT-nya PALING KECIL, yaitu kandidat terlemah. Jadi anggota yang tersisa
   di heap selalu "k kandidat dengan count terbesar sejauh ini". Kalau pakai
   max-heap malah salah arah: yang gampang di-pop adalah yang paling besar,
   padahal itu yang paling ingin dipertahankan.

5) Priority queue vs heap: "priority queue" itu KONSEP/kontrak ("kasih saya
   elemen prioritas tertinggi/terendah duluan"), "heap" itu cara IMPLEMENTASI
   konkretnya yang efisien. JS gak ada heap/priority queue built-in (beda dari
   Python `heapq` atau Java `PriorityQueue`), makanya class MyMinHeap dibikin
   manual di bawah ini.
*/

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
class MyMinHeap {
  constructor() {
    this.a = []; // array penyimpan heap
  }

  size() { return this.a.length; }
  peek() { return this.a[0]; } // O(1): elemen terkecil selalu di index 0

  push(val) {
    this.a.push(val);                 // taruh di akhir
    this._siftUp(this.a.length - 1);  // naikkan kalau melanggar aturan
  }

  pop() {
    if (this.a.length === 0) return undefined;

    const min = this.a[0];            // root = yang paling kecil
    const last = this.a.pop();        // ambil elemen terakhir

    if (this.a.length > 0) {
      this.a[0] = last;               // pindahkan last ke root
      this._siftDown(0);              // turunkan sampai aturan benar
    }
    return min;
  }

  // elemen baru selalu masuk di posisi terakhir array dulu (paling bawah pohon),
  // baru "dirambatkan naik" ke posisi yang benar sesuai aturan heap
  _siftUp(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;         // parent index
      if (this.a[p][1] <= this.a[i][1]) break; // compare count
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }

  // dipanggil setelah root ditumpuk elemen terakhir (lihat pop()); elemen itu
  // "dirambatkan turun" pilih jalur ke anak terkecil, sampai posisinya benar
  _siftDown(i) {
    const n = this.a.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let s = i; // smallest index (by count)

      if (l < n && this.a[l][1] < this.a[s][1]) s = l;
      if (r < n && this.a[r][1] < this.a[s][1]) s = r;

      if (s === i) break; // sudah lebih kecil dari kedua anak => valid
      [this.a[i], this.a[s]] = [this.a[s], this.a[i]];
      i = s;
    }
  }
}

var topKFrequent = function(nums, k) {
  // step 1: hitung berapa kali tiap angka muncul -> [angka, count]
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);

  const heap = new MyMinHeap();

  // step 2: jaga heap berisi maksimal k pasangan [num, count] dengan count
  // terbesar. tiap kali lebih dari k, buang yang count-nya PALING KECIL
  // (root min-heap) supaya yang tersisa selalu k kandidat terkuat sejauh ini
  for (const [num, count] of freq) {
    heap.push([num, count]);
    if (heap.size() > k) heap.pop();
  }

  // step 3: sisa isi heap = k elemen dengan count terbesar (urutan bebas)
  const res = [];
  while (heap.size() > 0) res.push(heap.pop()[0]);
  return res;
};

// Time complexity: O(n log k) - building freq takes O(n); for each of the up to n unique
// elements we push/pop from a heap capped at size k, each operation costing O(log k).
// Space complexity: O(n + k) - freq map holds up to n unique elements, heap holds up to k.