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

Let's trace through nums = [1,2,3,4] step by step.

Pass 1 (left to right) — build prefix products, answer[i] = product of everything to the left of i
i	answer[i] = pre (before update)	            pre after (pre *= nums[i])
0	answer[0] = 1 (nothing to the left)	        pre = 1*1 = 1
1	answer[1] = 1 (just nums[0]=1)	            pre = 1*2 = 2
2	answer[2] = 2 (nums[0]nums[1]=12)	        pre = 2*3 = 6
3	answer[3] = 6 (nums[0]nums[1]nums[2]=123)	pre = 6*4 = 24

After pass 1: answer = [1, 1, 2, 6] — each slot has the product of everything before it.

Pass 2 (right to left) — multiply in suffix products, post = product of everything to the right of i

i	answer[i] *= post	                             post after (post *= nums[i])
3	answer[3] = 6 * 1 = 6 (nothing to the right)	 post = 1*4 = 4
2	answer[2] = 2 * 4 = 8	                         post = 4*3 = 12
1	answer[1] = 1 * 12 = 12	                         post = 12*2 = 24
0	answer[0] = 1 * 24 = 24	                         post = 24*1 = 24
Final: answer = [24, 12, 8, 6] ✅ matches the expected output.


=============================================

var productExceptSelf = function(nums) {
    let pre = 1; // all the left sides, 1 to still be able to multiply but not changing the value
    let post = 1; // all the right sides
    let answer = new Array(nums.length); // the size is as the same as the nums array
    // 1st iteration would be for all the left sides
    for (let i=0; i<nums.length; i++){
        answer[i] = pre;
        pre = pre * nums[i];
    }

    // 2nd iteration would be for all the right sides, means that we start from right to left (last index)
    for (let j=nums.length - 1; j>=0; j--){
        answer[j] = answer[j] * post; // if we only do answer[j] = post then we'll rewrite what we have for the left sides, so it should be answer[j] * post
        post = post * nums[j]
    }

    return answer;
};


// time complexity: O(n) because even though we have 2 loops, they are sequential not nested, so O(n) + O(n) = O(2n) or we can say O(n)
// space complexity: O(n) 1 since we have a new DS (1 array with length of n)

*/