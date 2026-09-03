/*

42. Trapping Rain Water
Hard
Topics
premium lock icon
Companies
Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

 

Example 1:


Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.
Example 2:

Input: height = [4,2,0,3,2,5]
Output: 9
 

Constraints:

n == height.length
1 <= n <= 2 * 104
0 <= height[i] <= 105

*/

// EXPLANATION

/*

The water trapped ABOVE any index i is bounded by the shorter of the tallest wall to its
left and the tallest wall to its right - water can't rise higher than the lower of the two
walls holding it in, and it can't go below the ground (height[i] itself):

    water[i] = min(maxLeft[i], maxRight[i]) - height[i]   (0 if this is negative)

Brute Force: O(n^2) time, O(1) space
For each index i, scan left to find maxLeft and scan right to find maxRight, then compute
water[i] and sum it all up.

Better: Precompute arrays - O(n) time, O(n) space
Precompute maxLeft[i] and maxRight[i] for every index in two passes, then sum water[i] in a
third pass. Trades the repeated scanning for two extra arrays.

Optimal: Two Pointers - O(n) time, O(1) space
We don't need the exact maxLeft/maxRight for every index - we only need to know which SIDE's
max is smaller, because that's the side that actually determines the trapped water.

Maintain two pointers `left` and `right` and two running maxes `leftMax`/`rightMax` seen so
far from each side. Whichever side currently has the SMALLER height decides what to do:
- if height[left] < height[right], we know for certain that rightMax >= height[right] >
  height[left], so the water above `left` is bounded by leftMax (whatever rightMax turns out
  to be doesn't matter, it's already guaranteed bigger). Process left, then left++.
- otherwise (height[right] <= height[left]) the mirrored argument holds for the right side.

This works because we always move the pointer on the side with the smaller current wall -
that side's water level is already decided (bounded by its own leftMax/rightMax), regardless
of what's still unknown on the taller side.

Example: height = [4,2,0,3,2,5]
left=0(4), right=5(5): height[left] < height[right] -> leftMax=max(0,4)=4, water += 4-4=0, left=1
left=1(2), right=5(5): height[left] < height[right] -> leftMax=max(4,2)=4, water += 4-2=2, left=2
left=2(0), right=5(5): height[left] < height[right] -> leftMax=max(4,0)=4, water += 4-0=4, left=3
left=3(3), right=5(5): height[left] < height[right] -> leftMax=max(4,3)=4, water += 4-3=1, left=4
left=4(2), right=5(5): height[left] < height[right] -> leftMax=max(4,2)=4, water += 4-2=2, left=5
left=5, right=5: loop ends (left < right is false)

Total water = 0+2+4+1+2 = 9 (matches expected output)

Time complexity: O(n) - left and right pointers move toward each other, each index visited once.
Space complexity: O(1) - only pointers and running maxes are used, no extra arrays.

*/

// ANSWER

/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            // rightMax is guaranteed >= height[right] > height[left], so leftMax alone decides the water level here
            leftMax = Math.max(leftMax, height[left]);
            water += leftMax - height[left];
            left++;
        } else {
            rightMax = Math.max(rightMax, height[right]);
            water += rightMax - height[right];
            right--;
        }
    }

    return water;
};

// WALKTHROUGH OF CODE
/*
For height = [4,2,0,3,2,5]:
Initial: left=0, right=5, leftMax=0, rightMax=0, water=0

left=0,right=5: height[0]=4 < height[5]=5 -> leftMax=max(0,4)=4, water+=4-4=0 (water=0), left=1
left=1,right=5: height[1]=2 < height[5]=5 -> leftMax=max(4,2)=4, water+=4-2=2 (water=2), left=2
left=2,right=5: height[2]=0 < height[5]=5 -> leftMax=max(4,0)=4, water+=4-0=4 (water=6), left=3
left=3,right=5: height[3]=3 < height[5]=5 -> leftMax=max(4,3)=4, water+=4-3=1 (water=7), left=4
left=4,right=5: height[4]=2 < height[5]=5 -> leftMax=max(4,2)=4, water+=4-2=2 (water=9), left=5
left=5,right=5: left < right is false -> loop ends

return water = 9 ✓
*/
