/*
SORTING ALGORITHMS — REFERENCE

Why does sorting matter for DSA?
Many problems become easy once the data is sorted (Group Anagrams, 3Sum, Binary Search, etc).
Knowing HOW sorting works helps you understand the time complexity cost you're paying.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUICK SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Algorithm       Time (avg)      Time (worst)    Space       Stable?
─────────────   ─────────────   ─────────────   ────────    ───────
Bubble Sort     O(n²)           O(n²)           O(1)        Yes
Selection Sort  O(n²)           O(n²)           O(1)        No
Insertion Sort  O(n²)           O(n²)           O(1)        Yes
Merge Sort      O(n log n)      O(n log n)      O(n)        Yes
Quick Sort      O(n log n)      O(n²)           O(log n)    No
JS .sort()      O(n log n)      O(n log n)      O(n)        Yes (uses TimSort)

Stable = equal elements keep their original order.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. BUBBLE SORT — O(n²)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Idea: repeatedly compare adjacent pairs and swap if out of order.
Each full pass "bubbles" the largest unseen value to its correct position.

[5, 3, 8, 1]
Pass 1: compare 5&3 → swap → [3,5,8,1]
        compare 5&8 → ok   → [3,5,8,1]
        compare 8&1 → swap → [3,5,1,8]   ← 8 is in place
Pass 2: compare 3&5 → ok
        compare 5&1 → swap → [3,1,5,8]   ← 5 is in place
Pass 3: compare 3&1 → swap → [1,3,5,8]   ← done
*/
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {          // n-1 passes
        for (let j = 0; j < n - 1 - i; j++) {  // -i because last i elements are already sorted
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // swap
            }
        }
    }
    return arr;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. SELECTION SORT — O(n²)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Idea: find the minimum in the unsorted portion, swap it to the front.

[5, 3, 8, 1]
Pass 1: min in [5,3,8,1] = 1 → swap with index 0 → [1, 3, 8, 5]
Pass 2: min in [3,8,5]   = 3 → already at index 1 → [1, 3, 8, 5]
Pass 3: min in [8,5]     = 5 → swap with index 2 → [1, 3, 5, 8]
*/
function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. INSERTION SORT — O(n²), but fast on nearly-sorted data
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Idea: like sorting playing cards — pick each element and insert it
into its correct position in the already-sorted left portion.

[5, 3, 8, 1]
i=1: take 3, compare left → 5>3 so shift 5 right → insert 3 → [3, 5, 8, 1]
i=2: take 8, compare left → 5<8 so stop           → insert 8 → [3, 5, 8, 1]
i=3: take 1, shift 8,5,3 right                    → insert 1 → [1, 3, 5, 8]
*/
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const current = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j]; // shift right
            j--;
        }
        arr[j + 1] = current; // insert
    }
    return arr;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. MERGE SORT — O(n log n)  ← the important one to know
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Idea: divide the array in half recursively until each piece is 1 element
(a single element is always sorted), then merge the pieces back in order.

[5, 3, 8, 1]
  split → [5, 3]       [8, 1]
  split → [5] [3]      [8] [1]
  merge → [3, 5]       [1, 8]
  merge → [1, 3, 5, 8]

Why O(n log n)?
  log n levels of splitting × n work to merge at each level = n log n
*/
function mergeSort(arr) {
    if (arr.length <= 1) return arr; // base case: already sorted

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let l = 0, r = 0;

    // compare front of each half, take the smaller one
    while (l < left.length && r < right.length) {
        if (left[l] <= right[r]) result.push(left[l++]);
        else result.push(right[r++]);
    }

    // one side ran out — append whatever's left
    return result.concat(left.slice(l)).concat(right.slice(r));
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. QUICK SORT — O(n log n) avg, O(n²) worst
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Idea: pick a pivot, partition — everything smaller goes left,
everything larger goes right, then recursively sort each side.

[5, 3, 8, 1]  pivot = 5
  left  = [3, 1]  (< 5)
  right = [8]     (> 5)
  → quickSort([3,1]) + [5] + quickSort([8])
  → [1,3] + [5] + [8]
  → [1, 3, 5, 8]

Worst case O(n²) happens when the pivot is always the min or max
(e.g. already-sorted array with last element as pivot).
*/
function quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[arr.length - 1];
    const left = arr.slice(0, -1).filter(x => x <= pivot);
    const right = arr.slice(0, -1).filter(x => x > pivot);

    return [...quickSort(left), pivot, ...quickSort(right)];
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW JAVASCRIPT'S .sort() WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JS uses TimSort (hybrid of Merge Sort + Insertion Sort) → O(n log n).

GOTCHA: .sort() without a comparator sorts by string Unicode, not number!
  [10, 9, 2].sort()         → [10, 2, 9]  ← WRONG for numbers
  [10, 9, 2].sort((a,b) => a - b) → [2, 9, 10]  ← correct

For strings (like in Group Anagrams):
  'eat'.split('').sort().join('')  → 'aet'  ← works correctly by default

When you call .sort() on a word of length K inside a loop of N words,
the total cost is O(N · K log K) — that K log K is the sorting cost per word.
*/
