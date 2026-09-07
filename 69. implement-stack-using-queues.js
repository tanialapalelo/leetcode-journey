/**
 * 225. Implement Stack using Queues
Easy

Implement a last-in-first-out (LIFO) stack using only two queues. 
The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).

Implement the MyStack class:

void push(int x) Pushes element x to the top of the stack.
int pop() Removes the element on the top of the stack and returns it.
int top() Returns the element on the top of the stack.
boolean empty() Returns true if the stack is empty, false otherwise.
Notes:

You must use only standard operations of a queue, which means that only push to back, peek/pop from front, size and is empty operations are valid.
Depending on your language, the queue may not be supported natively. 
You may simulate a queue using a list or deque (double-ended queue) as long as you use only a queue's standard operations.
 

Example 1:

Input
["MyStack", "push", "push", "top", "pop", "empty"]
[[], [1], [2], [], [], []]
Output
[null, null, null, 2, 2, false]

Explanation
MyStack myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.top(); // return 2
myStack.pop(); // return 2
myStack.empty(); // return False
 

Constraints:

1 <= x <= 9
At most 100 calls will be made to push, pop, top, and empty.
All the calls to pop and top are valid.
 

Follow-up: Can you implement the stack using only one queue?

 */

/*
WHY IS THIS TRICKY?

A stack needs the MOST RECENTLY pushed element to be instantly
reachable (the "top"). A queue only gives cheap access to the FRONT
(the OLDEST element) -- the exact opposite end from where a stack
needs it. So somewhere, something has to "rotate" the newest element
to the front. That rotation touches every existing element, so it
costs O(size) -- there's no way around that.
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROACH 1 — Two queues, expensive push (clearest to reason about first)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
On every push(x): build a brand new queue with x enqueued FIRST, then
drain the old queue into the new one behind it. x ends up at the
front -- which is exactly where "top of stack" needs to live.

  push(x): newQueue = [x]; drain old queue into newQueue (front to back)
           this.queue = newQueue
  pop():   dequeue from the front -- that's the top, O(1)
  top():   peek the front -- O(1)
  empty(): queue.length === 0

Time:  push O(n), pop/top/empty O(1)
Space: O(n) for the queue (peak momentarily touches ~n while swapping)
*/
class MyStackTwoQueues {
    constructor() {
        this.queue = []; // array used as a queue: push() = enqueue back, shift() = dequeue front
    }

    push(x) {
        const newQueue = [x];
        while (this.queue.length) {
            newQueue.push(this.queue.shift());
        }
        this.queue = newQueue;
    }

    pop() {
        return this.queue.shift();
    }

    top() {
        return this.queue[0];
    }

    empty() {
        return this.queue.length === 0;
    }
}

/*
WALKTHROUGH — matches the example in the problem statement
  push(1): newQueue=[1], old queue empty -> nothing to drain -> queue=[1]
  push(2): newQueue=[2], drain old queue([1]) behind it -> queue=[2,1]
  top()  -> queue[0] = 2                                          ✓
  pop()  -> queue.shift() = 2, queue=[1]                          ✓
  empty()-> queue.length=1 -> false                                ✓
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROACH 2 — One queue only (answers the follow-up)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same idea as Approach 1, but you don't actually need a second queue
object -- you can rotate IN PLACE using just this one queue's own
enqueue/dequeue operations: enqueue x to the back, then rotate the
(size - 1) elements that were already there around to the back too,
one at a time. x ends up at the front either way.

  push(x): queue.push(x)              -- enqueue to back
           repeat (queue.length - 1) times:
             queue.push(queue.shift()) -- move one old element behind x
  pop():   queue.shift()  -- O(1)
  top():   queue[0]       -- O(1)
  empty(): queue.length === 0

Time:  push O(n), pop/top/empty O(1)  -- same as Approach 1
Space: O(n) for the queue, O(1) extra (no second queue needed)
*/
class MyStack {
    constructor() {
        this.queue = [];
    }

    push(x) {
        this.queue.push(x);
        let rotations = this.queue.length - 1;
        while (rotations > 0) {
            this.queue.push(this.queue.shift());
            rotations--;
        }
    }

    pop() {
        return this.queue.shift();
    }

    top() {
        return this.queue[0];
    }

    empty() {
        return this.queue.length === 0;
    }
}

/*
WALKTHROUGH — same example, one queue this time
  push(1): queue=[1], rotations = 0 -> no rotation -> queue=[1]
  push(2): queue=[1,2], rotations = 1
           -> shift 1, push it back: queue=[2,1]
  top()  -> queue[0] = 2                                          ✓
  pop()  -> queue.shift() = 2, queue=[1]                          ✓
  empty()-> false                                                  ✓

Extra check -- LIFO order actually holds for 3+ elements:
  push(1), push(2), push(3) -> queue ends up [3,2,1]
  pop(), pop(), pop() -> 3, 2, 1  (correct LIFO order)             ✓
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATATAN (BAHASA INDONESIA) — kenapa soal ini TIDAK bisa amortized
O(1) seperti soal 68 (queue-dari-2-stack)?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Di soal 68, trik amortized-nya jalan karena PINDAH DARI STACK KE
STACK itu MEMBALIK URUTAN -- dan dua kali balik = balik lagi ke
urutan semula. Itu sebabnya pemindahan cuma perlu kejadian SESEKALI
(cuma pas outStack kosong), lalu hasilnya "dipakai" berkali-kali
gratis sampai outStack habis lagi.

Di soal ini, PINDAH DARI QUEUE KE QUEUE itu TIDAK membalik urutan
(dequeue depan, enqueue belakang -> urutan tetap sama). Jadi gak ada
"dua kali balik = balik lagi" yang bisa dimanfaatkan di sini. Gak ada
cara buat "menunda" pekerjaan rotasi ke waktu yang lebih murah --
setiap push HARUS langsung merotasi semua elemen yang sudah ada,
SAAT ITU JUGA, karena top()/pop() bisa dipanggil kapan saja setelahnya
dan harus langsung benar.

Makanya soal ini gak punya jalan pintas seperti soal 68 -- gak peduli
diatur gimana pun (bikin push mahal, atau bikin pop yang mahal), tetap
akan ada satu operasi yang beneran O(n) SETIAP KALI dipanggil, bukan
cuma sesekali. Ini contoh bagus buat ngerti bahwa "amortized O(1)"
bukan trik yang selalu bisa dipaksakan ke soal manapun -- itu muncul
kalau strukturnya memang punya sifat "membalik dua kali = balik lagi"
seperti stack, dan gak muncul kalau strukturnya gak punya sifat itu,
seperti queue.
*/