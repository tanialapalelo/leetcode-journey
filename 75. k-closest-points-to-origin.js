/*
973. K Closest Points to Origin
Medium

Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).

The distance between two points on the X-Y plane is the Euclidean distance (i.e., √(x1 - x2)2 + (y1 - y2)2).

You may return the answer in any order. The answer is guaranteed to be unique (except for the order that it is in).

 

Example 1:


Input: points = [[1,3],[-2,2]], k = 1
Output: [[-2,2]]
Explanation:
The distance between (1, 3) and the origin is sqrt(10).
The distance between (-2, 2) and the origin is sqrt(8).
Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.
We only want the closest k = 1 points from the origin, so the answer is just [[-2,2]].
Example 2:

Input: points = [[3,3],[5,-1],[-2,4]], k = 2
Output: [[3,3],[-2,4]]
Explanation: The answer [[-2,4],[3,3]] would also be accepted.
 

Constraints:

1 <= k <= points.length <= 104
-104 <= xi, yi <= 104

*/

/* 
Explanation:

The origin points will be [0, 0] and k is the number of closest points to the origin that we need to find.

The formula to calculate the Euclidean distance between a point [x, y] and the origin [0, 0] is:

distance = √(x^2 + y^2)

However, calculating a square root  √ is slow for a computer. Because we only want to know which point is closer, we can drop the square root entirely. 
If √8 < √10, then it is also true that 8 < 10.

Therefore, we use the squared distance formula: x^2 + y^2. 
In JavaScript, a point is represented as an array: [x, y]. x is point[0], y is point[1] So the formula in JavaScript code is:

const distance = point[0] * point[0] + point[1] * point[1];

-------------------------------------------------------------------------------

DEEP DIVE APPROACHES:
1. Brute Force: 
    Calculate the distance of each point from the origin, sort the points based on the distance, and return the first k points.
    The time complexity of this approach is O(n log n) due to sorting, where n is the number of points.

    var kClosest = function(points, k) {
        // Sort points based on their squared distance from origin: x^2 + y^2
        points.sort((a, b) => {

            // Calculate squared distance for point 'a'
            const distA = a[0] * a[0] + a[1] * a[1];
            // Calculate squared distance for point 'b'
            const distB = b[0] * b[0] + b[1] * b[1];

            // A negative result means 'a' is closer than 'b' (comes first)
            // A positive result means 'b' is closer than 'a' (comes first)
            return distA - distB; // Ascending order
        });
        
        // Return the first K elements now that they're ordered
        return points.slice(0, k);
    };
    Complexity Analysis Time Complexity: O(n log n) where n is the number of points. 
    This is due to the built-in Array.prototype.sort() method.
    Space Complexity: O(1) if sorting in place, or O(N) depending on the JS engine's internal sorting implementation (Timsort/MergeSort).


2. Max Heap: 
    The Max-Heap approach can be counter-intuitive. If we are looking for the closest (smallest) points, why are we using a Max Heap (which tracks the largest items)? 
    Think of a Max-Heap like a room with a low ceiling where the tallest person always has their head touching the ceiling, making them easiest to kick out. 
    We cap the room size to k.

    If the input array is massive and k is very small, sorting the entire array is inefficient. 
    Instead, we can maintain a Max-Heap of size k. 
    Since JavaScript doesn't have a built-in Heap class,
    we can use the modern native MinPriorityQueue or MaxPriorityQueue available on LeetCode. 

    The Step-by-Step Logic: 
    1. We start adding points into our Max-Heap room. The heap automatically pushes the farthest point (largest distance) to the very top.
    2. Once the room has more than k points, we must kick someone out.
    3. Because the farthest point is sitting right at the top, we easily evict it (maxHeap.dequeue()).
    4. By constantly kicking out the farthest point whenever our count exceeds k, the room is naturally left holding only the k closest points. 

    var kClosest = function(points, k) {

        // Helper function to get squared distance
        const getDist = (p) => p[0] * p[0] + p[1] * p[1];
        
        // We tell the Max Heap to look at the x^2 + y^2 distance to rank items
        const maxHeap = new MaxPriorityQueue({
            compare: (a, b) => getDist(b) - getDist(a)  // Max-Heap order
        });
        
        for (const point of points) {
            maxHeap.enqueue(point); // Add point to the heap
            
            // If we have more than K elements, kick out the absolute farthest one
            if (maxHeap.size() > k) {
                maxHeap.dequeue();
            }
        }
        
        // What remains in the heap are the K closest points, so we can return them directly.
        return maxHeap.toArray();
    };
    Complexity Analysis:
    Time Complexity: O (n log k). Inserting into a heap takes O(log k). We do this for all n elements.
    Space Complexity: O(k) to store at most k elements inside the heap structure. 

3. QuickSelect: 
    Use the QuickSelect algorithm to partition the points based on their distance from the origin. 
    After partitioning, the first k points will be the closest points to the origin.


*/