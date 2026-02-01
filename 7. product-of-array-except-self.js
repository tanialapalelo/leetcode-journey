/**
238. Product of Array Except Self
Medium
Topics: Array, Prefix Sum

Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.

 

Example 1:

Input: nums = [1,2,3,4]
Output: [24,12,8,6]

Example 2:

Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]

 

Constraints:

    2 <= nums.length <= 105
    -30 <= nums[i] <= 30
    The input is generated such that answer[i] is guaranteed to fit in a 32-bit integer.

 

Follow up: Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)
 */


// ANSWER
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
    let answer = new Array(nums.length);
    // console.log("init", answer)
    let pre = 1;
    let post = 1;
    for(i = 0; i < nums.length; i++){
        answer[i] = pre;
        pre = pre * nums[i];
    }
    // console.log("pre", answer)
    for(i = nums.length - 1; i >= 0; i--){
        answer[i] = answer[i] * post;
        post = post * nums[i];
    }
    // console.log("final answer", answer)
    return answer;
};

/* EXPLANATION
We use pre and post variables to keep track of the product of all elements to the left and right of the current index, respectively.

In the first loop, we iterate through the nums array from left to right. For each index i, we set answer[i] to pre (which is the product of all elements to the left of i). Then, we update pre by multiplying it with nums[i].
In the second loop, we iterate through the nums array from right to left. For each index i, we multiply answer[i] by post (which is the product of all elements to the right of i). Then, we update post by multiplying it with nums[i].

By the end of these two loops, answer[i] contains the product of all elements in nums except nums[i]. This approach runs in O(n) time and uses O(1) extra space (not counting the output array).
*/