/*
1086. High Five
Easy

Given a list of the scores of different students, items, where items[i] = [IDi, scorei] represents one score from a student with IDi. 
Calculate each student's top five average.
Return the answer as an array of pairs result, where result[j] = [IDj, topFiveAveragej] represents the student with IDj and their top five average.
Sort result by ID in increasing order.

A student's top five average is calculated by taking the sum of their top five scores and dividing it by 5 using integer division.

Example:
Input: items = [[1,91],[1,92],[2,93],[2,97],[1,60],[2,77],[1,65],[1,87],[1,100],[2,100],[2,76]]
Output: [[1,87],[2,88]]
Explanation: 
The student with ID 1 has scores [91,92,60,65,87,100]. The top five scores are [91,92,87,100,65]. The average is (91+92+87+100+65)/5 = 87.
The student with ID 2 has scores [93,97,77,100,76]. The top five scores are [93,97,77,100,76]. The average is (93+97+77+100+76)/5 = 88.


*/

/* Approach:
 1. Sort the items array by student ID (ties broken by score descending), then iterate 5 times for each
 student to sum their top five scores and divide by 5 to get the top five average, then move forward to
 the next ID.
 Time complexity: O(n log n) due to sorting the items array, where n is the number of items.
 Space complexity: O(m) where m is the number of unique student IDs, for the result array (the sum is
 accumulated on the fly, not stored).

 2. Use a Map with ID as key and a MinHeap (capped at size 5) as value, so each heap only ever holds a
 student's current top 5 scores (a 6th, smaller score gets evicted immediately). Sum each heap and divide
 by 5, then sort the result array by ID once at the end (JS has no TreeMap, so there's no need to keep
 keys sorted throughout, just sort once when producing the final output).
 Time complexity: O(n) to build the capped heaps (each insert/evict is O(log 5) = O(1)) + O(m log m) to
 sort the final result by ID.
 Space complexity: O(m), since each heap is capped at 5 elements regardless of how many scores a student has.

 3. Use a Map with ID as key and an array of ALL of that student's scores as value. Sort each array
 descending, take the top five, sum and divide by 5, then sort the result array by ID.
 Time complexity: O(n) to group + O(sum of k_i log k_i) to sort each student's own scores (worst case
 O(n log n) if one student holds nearly all n scores) + O(m log m) for the final sort.
 Space complexity: O(n), since every raw score is retained (not capped like approach 2's heap).
*/

// IMPLEMENTATION
// Approach 1
var highFive = function(items) {
    // Sort primarily by ID (ascending), then by score (descending)
    items.sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        return b[1] - a[1];
    });
    
    const res = [];
    let i = 0;
    
    while (i < items.length) {
        const studentId = items[i][0];
        let sum = 0;
        
        // Sum the top 5 scores for this student
        for (let j = 0; j < 5; j++) {
            sum += items[i + j][1];
        }
        res.push([studentId, Math.floor(sum / 5)]);
        
        // Advance index past all scores belonging to the current student
        while (i < items.length && items[i][0] === studentId) {
            i++;
        }
    }
    
    return res;
}


// Approach 2:
// JS has no built-in TreeMap/PriorityQueue, so:
//  - TreeMap -> a plain Map works fine; we only need sorted IDs once at the end, so we sort there instead of keeping the map sorted the whole time.
//  - PriorityQueue -> a small MinHeap, capped at size 5 so it only ever holds a student's top 5 scores.
// Capping the heap at 5 makes each push/pop O(log 5) = O(1), so building all heaps is O(n) instead of O(n log n).
class MinHeap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    push(val) {
        this.heap.push(val);
        this.#bubbleUp(this.heap.length - 1);
    }

    // removes and returns the smallest value
    pop() {
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.#bubbleDown(0);
        }
        return top;
    }

    #bubbleUp(i) {
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (this.heap[parent] <= this.heap[i]) break;
            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
            i = parent;
        }
    }

    #bubbleDown(i) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
            if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;
            if (smallest === i) break;
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
}

var highFive2 = function(items) {
    const scores = new Map(); // id -> MinHeap holding (at most) that student's top 5 scores

    for (const [id, score] of items) {
        if (!scores.has(id)) scores.set(id, new MinHeap());
        const heap = scores.get(id);
        heap.push(score);
        if (heap.size() > 5) heap.pop(); // evict the current smallest so only the top 5 remain
    }

    const res = [];
    for (const [id, heap] of scores) {
        let sum = 0;
        while (heap.size() > 0) sum += heap.pop();
        res.push([id, Math.floor(sum / 5)]);
    }

    // equivalent to TreeMap's sorted-key order, done once instead of maintained throughout
    res.sort((a, b) => a[0] - b[0]);

    return res;
}


// Approach 3: no heap, no manual TreeMap - just group with a Map, then sort each (small) group directly.
// Time: O(n) to group + O(sum(k_i log k_i)) to sort each student's own scores (worst case O(n log n) if one
//       student has nearly all n scores) + O(m log m) to sort the result by ID.
// Space: O(n) - every raw score is kept (not capped like the heap version), plus O(m) for the result.
var highFive3 = function(items) {
    const scores = new Map(); // id -> all of that student's scores (unsorted)

    for (const [id, score] of items) {
        if (!scores.has(id)) scores.set(id, []);
        scores.get(id).push(score);
    }

    const res = [];
    for (const [id, arr] of scores) {
        arr.sort((a, b) => b - a); // descending, so the top 5 are the first 5
        const topFiveSum = arr.slice(0, 5).reduce((sum, score) => sum + score, 0);
        res.push([id, Math.floor(topFiveSum / 5)]);
    }

    res.sort((a, b) => a[0] - b[0]);

    return res;
} 