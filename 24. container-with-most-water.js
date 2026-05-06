/*
11. Container With Most Water
Medium

You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.

 

Example 1:


Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.
Example 2:

Input: height = [1,1]
Output: 1
 

Constraints:

n == height.length
2 <= n <= 105
0 <= height[i] <= 104

*/

// ANSWER
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let result = 0;
    let l = 0;
    let r = height.length - 1;
    while (l < r){
        const width = r - l;
        const area = Math.min(height[l], height[r]) * width;
        result = Math.max(result, area);
        if(height[l] > height[r]) r--;
        else l++;
    }
    return result;
};

// EXPLANATION
// Two pointer approach: Start with the widest container (left and right ends) and move inward.
// Calculate area at each step and update max area.
// Move the pointer that has the shorter line, as it limits the area.
// Time complexity: O(n) - Each element is visited at most once by either pointer.
// Space complexity: O(1) - Only a constant amount of extra space is used.
// Why we use Math.min(height[l], height[r])? Because the area is limited by the shorter line. The water cannot exceed the height of the shorter line, so we take the minimum of the two heights to calculate the area.
// Why we use width = r - l? Because the width of the container is determined by the distance between the two lines, which is the difference in their indices. The left pointer (l) and right pointer (r) represent the positions of the lines, so the width is calculated as r - l.
// Why we use Math.max(result, area)? Because we want to keep track of the maximum area found so far. At each step, we calculate the area of the current container and compare it with the maximum area stored in the variable result. If the current area is larger, we update result with this new value. This way, by the end of the loop, result will contain the maximum area of water that can be contained by any two lines in the array.
// Why we use Math.min(height[l], height[r]) * width? Because the area of water that can be contained by the two lines is determined by the shorter line (the limiting factor) and the distance between them (the width). The formula for calculating the area is: Area = min(height[l], height[r]) * width. This ensures that we are calculating the area based on the maximum height of water that can be held between the two lines, which is limited by the shorter line.
// We got the formula for calculating the area from the fact that the water level can only rise up to the height of the shorter line. The width is simply the distance between the two lines, which is given by r - l. By multiplying these two factors, we get the total area of water that can be contained between the two lines.