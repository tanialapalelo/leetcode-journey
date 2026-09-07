/**
 * 232. Implement Queue using Stacks
Easy

Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).

Implement the MyQueue class:

void push(int x) Pushes element x to the back of the queue.
int pop() Removes the element from the front of the queue and returns it.
int peek() Returns the element at the front of the queue.
boolean empty() Returns true if the queue is empty, false otherwise.
Notes:

You must use only standard operations of a stack, which means only push to top, peek/pop from top, size, and is empty operations are valid.
Depending on your language, the stack may not be supported natively. You may simulate a stack using a list or deque (double-ended queue) as long as you use only a stack's standard operations.
 

Example 1:

Input
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]
Output
[null, null, null, 1, 1, false]

Explanation
MyQueue myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
myQueue.peek(); // return 1
myQueue.pop(); // return 1, queue is [2]
myQueue.empty(); // return false
 

Constraints:

1 <= x <= 9
At most 100 calls will be made to push, pop, peek, and empty.
All the calls to pop and peek are valid.
 

Follow-up: Can you implement the queue such that each operation is amortized O(1) time complexity?
In other words, performing n operations will take overall O(n) time even if one of those operations may take longer.
 */

/*
WHY IS THIS TRICKY?

A single stack always REVERSES order (last in = first out). Flip that
reversal TWICE and you're back to the original (first in = first out)
order. That's the whole trick: use two stacks so the second one undoes
the first stack's reversal.
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROACH 1 — One stack, expensive push
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Keep the front of the queue always at the TOP of the stack, by rotating
on every push: move everything off, push the new value, move everything
back on top of it.

  push(x): move all elements to a temp stack, push x, move them all back
           -> x ends up at the BOTTOM, old front stays on TOP
  pop():   just stack.pop() -- front is already on top
  peek():  just look at the top
  empty(): stack.length === 0

Time:  push O(n), pop/peek/empty O(1)
Space: O(n) for the temp stack during push
*/
class MyQueueNaive {
    constructor() {
        this.stack = [];
    }

    push(x) {
        const temp = [];
        while (this.stack.length) temp.push(this.stack.pop());
        this.stack.push(x);
        while (temp.length) this.stack.push(temp.pop());
    }

    pop() {
        return this.stack.pop();
    }

    peek() {
        return this.stack[this.stack.length - 1];
    }

    empty() {
        return this.stack.length === 0;
    }
}

/*
WALKTHROUGH — push(1), push(2)
  push(1): stack=[] -> temp=[] -> push 1 -> stack=[1]
  push(2): temp=[1] (moved off), push 2 -> stack=[2],
           move temp back -> stack=[2,1]
  stack top = 1  <- the first element pushed, correctly on top
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROACH 2 — Two stacks, lazy transfer (amortized O(1))  ← answers the follow-up
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
inStack:  where push() always goes -- O(1), no rotating.
outStack: where pop()/peek() read from.

Only move elements from inStack to outStack when outStack is EMPTY.
Moving reverses the order, so after the move, the oldest element
(the true front of the queue) ends up on top of outStack.

  push(x):  inStack.push(x)                              -- always O(1)
  _transfer(): if outStack is empty, pop everything off
               inStack and push it onto outStack
  pop():    _transfer(); return outStack.pop()
  peek():   _transfer(); return outStack's top
  empty():  inStack and outStack are both empty

Why "amortized" O(1) and not plain O(1)?
  A single pop() COULD be O(n) if it has to transfer a big inStack.
  But each element only ever gets moved from inStack to outStack ONCE
  in its whole lifetime (push -> maybe sit in inStack -> transfer once
  -> sit in outStack -> popped). Spread that one-time O(n) transfer cost
  across all the pushes that built up inStack, and every element costs
  O(1) on average across n operations -- that's what "amortized" means.

Time:  O(1) amortized per operation (push always O(1); pop/peek O(1)
       amortized, occasionally O(n) when a transfer happens)
Space: O(n) total across both stacks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATATAN (BAHASA INDONESIA) — apa itu "amortized"?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analogi: nabung di toples.
  - Tiap hari masukin Rp1.000 ke toples -> ringan, cepat, gak berat.
  - Sekali-sekali (misal tiap 10 hari) toples dibuka, SEMUA isinya
    dikeluarkan buat beli sesuatu -> berat, sekali doang.

  Pertanyaan "hari ke-10 itu, berapa usahanya?" -> berat (semua
  dikeluarkan sekaligus).
  Pertanyaan "rata-rata usaha PER HARI selama 10 hari itu?" -> ringan,
  karena 9 hari sisanya cuma "masukin Rp1.000" doang.

  AMORTIZED = jawaban dari pertanyaan kedua. Bukan "operasi ini pasti
  selalu ringan", tapi "kalau dirata-ratain sepanjang banyak operasi,
  ternyata ringan -- walau sesekali ada satu yang berat."

Mapping ke kode di atas:
  - push(x)  = "masukin Rp1.000 ke toples" -> selalu ringan.
  - pop() PERTAMA setelah beberapa push  = "buka toples, keluarkan
    SEMUA isi" -> berat kalau inStack lagi banyak isinya (harus
    transfer satu-satu ke outStack).
  - pop() SETELAH itu (selama outStack masih ada isi) = ringan lagi,
    tinggal outStack.pop().

  Kalau ditanya "pop() ini SENDIRIAN, berapa biayanya?" -> bisa mahal
  (O(n), pas kena transfer).
  Kalau ditanya "rata-rata biaya PER OPERASI, dihitung sepanjang
  banyak push+pop?" -> itu O(1), karena tiap elemen cuma "berat"
  (ditransfer) SATU KALI doang sepanjang hidupnya (push -> nunggu di
  inStack -> ditransfer sekali -> nunggu di outStack -> di-pop).
  Sisanya selalu ringan.

  Jadi "amortized O(1)" = "boleh sesekali lambat, tapi kalau
  dirata-ratain sepanjang waktu, tetap cepat." Itu aja intinya.

Cara jawab kalau ditanya interviewer "ini O(1) kan?":
  "Amortized O(1), bukan strict O(1). Satu pop() tertentu bisa kena
  O(n) kalau harus transfer, tapi karena setiap elemen cuma
  ditransfer sekali sepanjang hidupnya, biaya itu 'dicicil' ke semua
  push sebelumnya -- jadi sepanjang n operasi, totalnya tetap O(n),
  rata-rata O(1) per operasi."
*/
class MyQueue {
    constructor() {
        this.inStack = [];
        this.outStack = [];
    }

    push(x) {
        this.inStack.push(x);
    }

    _transfer() {
        if (this.outStack.length === 0) {
            while (this.inStack.length) {
                this.outStack.push(this.inStack.pop());
            }
        }
    }

    pop() {
        this._transfer();
        return this.outStack.pop();
    }

    peek() {
        this._transfer();
        return this.outStack[this.outStack.length - 1];
    }

    empty() {
        return this.inStack.length === 0 && this.outStack.length === 0;
    }
}

/*
WALKTHROUGH — matches the example in the problem statement
  push(1): inStack=[1]              outStack=[]
  push(2): inStack=[1,2]            outStack=[]
  peek():  outStack empty -> transfer:
             pop 2 from inStack -> push to outStack: outStack=[2]
             pop 1 from inStack -> push to outStack: outStack=[2,1]
           outStack top = 1 -> peek() returns 1               ✓
  pop():   outStack not empty, no transfer needed
           outStack.pop() -> returns 1, outStack=[2]           ✓
  empty(): inStack=[] outStack=[2] -> false                    ✓

Note: while outStack still has elements, new push()es just pile up in
inStack underneath -- they'll only get flipped into outStack once
outStack fully drains. That's what keeps push() always O(1).
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAME SOLUTION, TWO SYNTAXES — `class` vs `function` + `.prototype`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LeetCode's own skeleton for this problem uses the OLDER JavaScript
syntax (constructor function + assigning methods onto `.prototype`)
instead of the `class` keyword used above. They are NOT two different
solutions -- they are the exact same thing, written two ways.

  `class Foo { constructor(){...} method(){...} }`
is what `class` compiles down to underneath:
  `var Foo = function() {...}; Foo.prototype.method = function() {...};`

`class` is "syntax sugar" -- a nicer way to write the same
constructor-function-plus-prototype pattern JS has always had. There is
no behavior difference; pick whichever a given editor/skeleton expects.

SAME / DIFFERENT AT A GLANCE
  constructor() {}          <->  var MyQueue = function() {}
  methodName(args) {}       <->  MyQueue.prototype.methodName = function(args) {}
  this.inStack inside either style refers to the same instance either way.
  `new MyQueue()` works identically for both -- creates an object whose
  methods are looked up on `MyQueue.prototype`.

On LeetCode: you don't have to keep whatever skeleton is shown. The
judge just calls `new MyQueue()`, `obj.push(x)`, etc. -- it does not
care whether you wrote `class` or `function` + `.prototype`. You can
delete the given skeleton entirely and paste the `class MyQueue`
version above; it will run exactly the same way.

Below is the identical amortized O(1) queue, written in the
function + prototype style, for reference. (Renamed to
MyQueueProtoStyle only so both versions can coexist in this one file
without a naming clash -- on LeetCode itself you'd just call it
MyQueue, same as the skeleton they give you.)
*/
var MyQueueProtoStyle = function() {
    this.inStack = [];
    this.outStack = [];
};

MyQueueProtoStyle.prototype.push = function(x) {
    this.inStack.push(x);
};

MyQueueProtoStyle.prototype._transfer = function() {
    if (this.outStack.length === 0) {
        while (this.inStack.length) {
            this.outStack.push(this.inStack.pop());
        }
    }
};

MyQueueProtoStyle.prototype.pop = function() {
    this._transfer();
    return this.outStack.pop();
};

MyQueueProtoStyle.prototype.peek = function() {
    this._transfer();
    return this.outStack[this.outStack.length - 1];
};

MyQueueProtoStyle.prototype.empty = function() {
    return this.inStack.length === 0 && this.outStack.length === 0;
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATATAN (BAHASA INDONESIA) — class vs function+prototype
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAMA-nya:
  - Logika di dalamnya PERSIS SAMA. inStack, outStack, _transfer(),
    push/pop/peek/empty -- semua kerja identik. Cuma "baju"-nya beda.
  - `class` itu cuma cara nulis yang lebih baru (ES6) buat pola yang
    SUDAH ADA dari dulu di JS: function sebagai constructor + method
    ditempel ke `.prototype`. Kalau di-compile, `class` diubah jadi
    bentuk function+prototype juga di baliknya -- makanya sering
    disebut "syntax sugar" (gula-gula sintaks: manis buat dibaca,
    tapi isinya sama).
  - `new MyQueue()` di kedua gaya, hasilnya sama: sebuah object yang
    method-nya dicari lewat prototype.

BEDA-nya (cuma cara nulis):
  - class:      constructor() { ... }            method() { ... }
  - prototype:  var X = function() { ... }        X.prototype.method = function() { ... }
  - Di gaya class, semua method udah otomatis "nempel" ke prototype
    di balik layar tanpa kamu tulis manual. Di gaya lama, kamu HARUS
    nempelin manual satu-satu pakai `NamaClass.prototype.namaMethod =`.

Kapan ketemu yang mana:
  - Kode kamu sendiri di file ini & repo ini -> pakai `class` (lebih
    ringkas, lebih gampang dibaca).
  - Skeleton starter code LeetCode buat soal-soal "design a class"
    kayak soal ini -> kadang pakai gaya lama (function+prototype).
    Boleh dihapus semua dan diganti `class` punya kamu -- LeetCode
    gak peduli gaya penulisannya, yang penting hasilnya bener.

Kalau ditanya interviewer "tau bedanya class sama prototype di JS?" ->
jawabannya persis ini: class itu syntax sugar di atas prototype-based
object model yang udah ada dari dulu di JavaScript, bukan konsep baru
yang beda.
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATATAN (BAHASA INDONESIA) — cara baca format Input/Output LeetCode
untuk soal "design a class" (MyQueue, MinStack, dll)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contoh dari soal ini:

  Input
  ["MyQueue","push","push","peek","pop","empty"]
  [[],[1],[2],[],[],[]]

  Output
  [null,null,null,1,1,false]

Ada 2 array di Input, dan mereka JALAN BERPASANGAN berdasarkan index
yang sama (index 0 sama index 0, index 1 sama index 1, dst):
  - Array pertama = daftar METHOD yang dipanggil, berurutan.
  - Array kedua   = daftar ARGUMEN buat setiap method itu (index-nya
    nyambung sama array pertama).
  - Array Output  = hasil RETURN dari setiap panggilan, index-nya
    juga nyambung ke dua array Input di atas.

Dibedah per index:

  index | method dipanggil | argumen | artinya                    | return value
  ------|-------------------|---------|----------------------------|-------------
    0   | "MyQueue"         | []      | new MyQueue() -> bikin obj | null
    1   | "push"            | [1]     | obj.push(1)                | null
    2   | "push"            | [2]     | obj.push(2)                | null
    3   | "peek"            | []      | obj.peek()                 | 1
    4   | "pop"             | []      | obj.pop()                  | 1
    5   | "empty"           | []      | obj.empty()                | false

Poin penting:
  - "MyQueue" di index 0 itu SELALU manggil constructor (bukan method
    biasa), dan argumennya ([] di soal ini) adalah argumen buat
    constructor tersebut.
  - Method yang @return {void} (kayak push) tetap muncul sebagai
    `null` di Output -- bukan berarti kamu HARUS return null secara
    manual, itu cuma cara LeetCode nunjukkin "gak ada return value
    yang relevan buat method ini".
  - Kalau Output kamu ada `undefined` padahal Expected-nya angka
    (misal `undefined` vs `1`), itu tandanya method tersebut LUPA
    `return` -- lihat contoh bug di bawah.

CONTOH BUG NYATA yang bikin Wrong Answer (pernah kejadian di pop()):

    MyQueue.prototype.pop = function() {
        this._transfer();
        this.outStack.pop();   // <- cuma MANGGIL pop() dari array,
                                //    hasilnya gak pernah di-`return`!
    };

  Karena gak ada `return`, JS otomatis balikin `undefined` dari
  `MyQueue.prototype.pop`, walau `this.outStack.pop()` di dalamnya
  sebenarnya berhasil ngembalikan nilai yang benar. Fix-nya cuma
  tambah `return`:

    MyQueue.prototype.pop = function() {
        this._transfer();
        return this.outStack.pop();   // <- tambahin return
    };

  Ini bug klasik: gampang lupa `return` pas function-nya ada 2 baris
  atau lebih (transfer dulu, baru ambil nilai) -- beda sama function
  1-baris yang biasanya otomatis kepikiran buat nulis return. Selalu
  cek: "apakah baris terakhir method ini punya `return` di depannya,
  kalau method itu memang harus balikin sesuatu (bukan void)?"
*/