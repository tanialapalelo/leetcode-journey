/**
41. First Missing Positive
Hard

Given an unsorted integer array nums. Return the smallest positive integer that is not present in nums.

    You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.



    Example 1:

Input: nums = [1,2,0]
Output: 3
Explanation: The numbers in the range [1,2] are all in the array.
    Example 2:

Input: nums = [3,4,-1,1]
Output: 2
Explanation: 1 is in the array but 2 is missing.
    Example 3:

Input: nums = [7,8,9,11,12]
Output: 1
Explanation: The smallest positive integer 1 is missing.


    Constraints:

1 <= nums.length <= 105
-231 <= nums[i] <= 231 - 1

 */

// ANSWER
/**
 * @param {number[]} nums
 * @return {number}
 */
function firstMissingPositive(nums) {

    const n = nums.length;

    console.log("START nums =", JSON.stringify(nums), "n =", n);
    console.log("Goal: place value v into index (v - 1) for v in [1..n]");
    console.log("------------------------------------------------------");

    // PLACEMENT PHASE
    for (let i = 0; i < n; i++) {
        console.log(`\n[i=${i}] ENTER index i with nums =`, JSON.stringify(nums));

        while (true) {
            const v = nums[i];
            console.log(`  at i=${i}, v=nums[i]=${v}`);

            // 1) ignore out of range values
            if (v < 1 || v > n) {
                console.log(`  break: v=${v} is out of range [1..${n}]`);
                break;
            }

            const home = v - 1;
            console.log(`  v=${v} belongs at home=v-1 => home=${home}`);

            // 2) already placed / duplicate guard
            if (nums[home] === v) {
                console.log(
                    `  break: nums[home]=nums[${home}]=${nums[home]} already equals v=${v} (already placed or duplicate)`
                );
                break;
            }

            // 3) swap
            console.log(
                `  SWAP: nums[i]=nums[${i}]=${nums[i]} with nums[home]=nums[${home}]=${nums[home]}`
            );
            [nums[i], nums[home]] = [nums[home], nums[i]];
            console.log(`  after swap nums =`, JSON.stringify(nums));

            // loop continues because nums[i] is now a new value that might also need placing
        }
    }

    console.log("\n------------------------------------------------------");
    console.log("After placement nums =", JSON.stringify(nums));
    console.log("Now scan: first index i where nums[i] !== i+1 => answer i+1");
    console.log("------------------------------------------------------");

    // SCAN PHASE
    for (let i = 0; i < n; i++) {
        const expected = i + 1;
        console.log(
            `scan i=${i}: nums[${i}]=${nums[i]}, expected=${expected}`,
            nums[i] === expected ? "OK" : "MISMATCH -> return " + expected
        );

        if (nums[i] !== expected) return expected;
    }

    console.log(`All positions 1..${n} are present -> return ${n + 1}`);
    return n + 1;
}

/**
 * TEST 1
 * Input
 * nums =
 * [3,4,-1,1]
 * Stdout
 * START nums = [3,4,-1,1] n = 4
 * Goal: place value v into index (v - 1) for v in [1..n]
 * ------------------------------------------------------
 *
 * [i=0] ENTER index i with nums = [3,4,-1,1]
 *   at i=0, v=nums[i]=3
 *   v=3 belongs at home=v-1 => home=2
 *   SWAP: nums[i]=nums[0]=3 with nums[home]=nums[2]=-1
 *   after swap nums = [-1,4,3,1]
 *   at i=0, v=nums[i]=-1
 *   break: v=-1 is out of range [1..4]
 *
 * [i=1] ENTER index i with nums = [-1,4,3,1]
 *   at i=1, v=nums[i]=4
 *   v=4 belongs at home=v-1 => home=3
 *   SWAP: nums[i]=nums[1]=4 with nums[home]=nums[3]=1
 *   after swap nums = [-1,1,3,4]
 *   at i=1, v=nums[i]=1
 *   v=1 belongs at home=v-1 => home=0
 *   SWAP: nums[i]=nums[1]=1 with nums[home]=nums[0]=-1
 *   after swap nums = [1,-1,3,4]
 *   at i=1, v=nums[i]=-1
 *   break: v=-1 is out of range [1..4]
 *
 * [i=2] ENTER index i with nums = [1,-1,3,4]
 *   at i=2, v=nums[i]=3
 *   v=3 belongs at home=v-1 => home=2
 *   break: nums[home]=nums[2]=3 already equals v=3 (already placed or duplicate)
 *
 * [i=3] ENTER index i with nums = [1,-1,3,4]
 *   at i=3, v=nums[i]=4
 *   v=4 belongs at home=v-1 => home=3
 *   break: nums[home]=nums[3]=4 already equals v=4 (already placed or duplicate)
 *
 * ------------------------------------------------------
 * After placement nums = [1,-1,3,4]
 * Now scan: first index i where nums[i] !== i+1 => answer i+1
 * ------------------------------------------------------
 * scan i=0: nums[0]=1, expected=1 OK
 * scan i=1: nums[1]=-1, expected=2 MISMATCH -> return 2
 *
 * END OF TEST 1
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * TEST 2
 * Input
 * nums =
 * [1,2,0]
 * Stdout
 * START nums = [1,2,0] n = 3
 * Goal: place value v into index (v - 1) for v in [1..n]
 * ------------------------------------------------------
 *
 * [i=0] ENTER index i with nums = [1,2,0]
 *   at i=0, v=nums[i]=1
 *   v=1 belongs at home=v-1 => home=0
 *   break: nums[home]=nums[0]=1 already equals v=1 (already placed or duplicate)
 *
 * [i=1] ENTER index i with nums = [1,2,0]
 *   at i=1, v=nums[i]=2
 *   v=2 belongs at home=v-1 => home=1
 *   break: nums[home]=nums[1]=2 already equals v=2 (already placed or duplicate)
 *
 * [i=2] ENTER index i with nums = [1,2,0]
 *   at i=2, v=nums[i]=0
 *   break: v=0 is out of range [1..3]
 *
 * ------------------------------------------------------
 * After placement nums = [1,2,0]
 * Now scan: first index i where nums[i] !== i+1 => answer i+1
 * ------------------------------------------------------
 * scan i=0: nums[0]=1, expected=1 OK
 * scan i=1: nums[1]=2, expected=2 OK
 * scan i=2: nums[2]=0, expected=3 MISMATCH -> return 3
 *
 * END OF TEST 2
 */


// ANOTHER EASIER ANSWER
function firstMissingPositive(nums) {
    const n = nums.length;

    // 1) normalize
    for (let i = 0; i < n; i++) {
        if (nums[i] <= 0 || nums[i] > n) nums[i] = n + 1;
    }

    // 2) mark
    for (let i = 0; i < n; i++) {
        const num = Math.abs(nums[i]);
        if (num >= 1 && num <= n) {
            const idx = num - 1;
            nums[idx] = -Math.abs(nums[idx]);
        }
    }

    // 3) first positive index
    for (let i = 0; i < n; i++) {
        if (nums[i] > 0) return i + 1;
    }

    return n + 1;
}

// explanation of easier answer:
// 1) normalize: replace all non-positive and out of range values with n+1 (a dummy value that is out of our target range [1..n])
// 2) mark: for each number num in [1..n], mark its presence by negating the value at index num-1 (if it's not already negative)
// 3) first positive index: the first index i that has a positive value means that number i+1 is missing, so return i+1. If all indices are negative, then return n+1.

// Time complexity: O(n) - three separate linear passes (normalize, mark, scan), not nested.
// Space complexity: O(1) - values are marked in place, no extra data structures.