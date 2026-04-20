/*

2078. Two Furthest Houses With Different Colors
Solved
Easy
Topics
premium lock icon
Companies
Hint
There are n houses evenly lined up on the street, and each house is beautifully painted. You are given a 0-indexed integer array colors of length n, where colors[i] represents the color of the ith house.

Return the maximum distance between two houses with different colors.

The distance between the ith and jth houses is abs(i - j), where abs(x) is the absolute value of x.

 

Example 1:


Input: colors = [1,1,1,6,1,1,1]
Output: 3
Explanation: In the above image, color 1 is blue, and color 6 is red.
The furthest two houses with different colors are house 0 and house 3.
House 0 has color 1, and house 3 has color 6. The distance between them is abs(0 - 3) = 3.
Note that houses 3 and 6 can also produce the optimal answer.
Example 2:


Input: colors = [1,8,3,8,3]
Output: 4
Explanation: In the above image, color 1 is blue, color 8 is yellow, and color 3 is green.
The furthest two houses with different colors are house 0 and house 4.
House 0 has color 1, and house 4 has color 3. The distance between them is abs(0 - 4) = 4.
Example 3:

Input: colors = [0,1]
Output: 1
Explanation: The furthest two houses with different colors are house 0 and house 1.
House 0 has color 0, and house 1 has color 1. The distance between them is abs(0 - 1) = 1.
 

Constraints:

n == colors.length
2 <= n <= 100
0 <= colors[i] <= 100
Test data are generated such that at least two houses have different colors.

*/

// ANSWER
/**
 * @param {number[]} colors
 * @return {number}
 */
var maxDistance = function(colors) {
    const n = colors.length;
    let ans = 0;

    // loop 1: from right to left, find the first house with different color than the first house (index 0)
    for (let i = n - 1; i >= 0; i--){ 
        if(colors[i] !== colors[0]){
            ans = Math.max(ans, i-0 ); // distance from index 0 to i
            break; // found the rightmost different color, stop
        }
    }

    // loop 2: from left to right, find the first house with different color than the last house (index n-1)
    for (let i = 0; i<n; i++){ 
        if(colors[i] !== colors[n-1]){
            ans = Math.max(ans, (n-1)-i ); // distance from i to the last index
            break; // found the leftmost different color, stop
        }
    }
    return ans;
};

// Time complexity: O(n) because we loop through the array twice, but we break early when we find the first different color, so in practice it might be less than O(n) depending on the input. 
// Space complexity: O(1) because we only use a constant amount of extra space for variables.
