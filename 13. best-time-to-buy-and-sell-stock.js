/**
 * # [**121. Best Time to Buy and Sell Stock**](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
 *
 * Easy
 *
 * You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.
 *
 * You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.
 *
 * Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return `0`.
 *
 * **Example 1:**
 *
 * ```
 * Input: prices = [7,1,5,3,6,4]
 * Output: 5
 * Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
 * Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
 * ```
 *
 * **Example 2:**
 *
 * ```
 * Input: prices = [7,6,4,3,1]
 * Output: 0
 * Explanation: In this case, no transactions are done and the max profit = 0.
 * ```
 *
 * **Constraints:**
 *
 * - `1 <= prices.length <= 105`
 * - `0 <= prices[i] <= 104`
 *
 * **From GPT**
 *
 * How to “see” it as sliding window
 *
 * A typical sliding window keeps a constraint like “sum <= k”. Here the constraint is:
 *
 * > buy day must be before sell day, and buy price should be the minimum in the window.
 * >
 *
 * So the window “slides” when you find a new minimum price (a better buy point).
 */

// ANSWER
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let profit = 0;
    let buy = prices[0];
    for(const price of prices){
        if (price < buy) buy = price;
        else profit = Math.max(profit, price - buy)
    }
    return profit;
};

// Time complexity: O(n) - single pass through prices.
// Space complexity: O(1) - only a few scalar variables.

// Another solution with sliding window approach
/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
    let left = 0;   // buy day
    let best = 0;

    for (let right = 1; right < prices.length; right++) {
        if (prices[right] < prices[left]) {
            // found a cheaper buy price, slide the window
            left = right;
        } else {
            // try selling on 'right'
            const profit = prices[right] - prices[left];
            if (profit > best) best = profit;
        }
    }

    return best;
}
/** Explanation: We use two pointers, `left` and `right`, to represent the buy and sell days. We iterate through the prices with the `right` pointer. If we find a price that is lower than the current buy price (pointed by `left`), we move the `left` pointer to that day, effectively sliding the window to start from this new potential buy day. If the current price is higher than the buy price, we calculate the profit and update our best profit if it's greater than the previously recorded best.
 * Trace on the classic example
 * prices = [7,1,5,3,6,4]
 *
 * Start: left=0 (7), right=1, best=0
 *
 * right=1, price=1
 * 1 < 7 → update buy day: left=1 (buy at 1)
 * right=2, price=5
 * profit = 5 - 1 = 4 → best=4
 * right=3, price=3
 * profit = 3 - 1 = 2 → best stays 4
 * right=4, price=6
 * profit = 6 - 1 = 5 → best=5
 * right=5, price=4
 * profit = 4 - 1 = 3 → best stays 5
 * Answer = 5.
 *
 * Notice: the “window” started at buy=7 then slid to buy=1 when we found a better buy day
 */

// Time complexity: O(n) - single pass with the right pointer.
// Space complexity: O(1) - only left/best scalars are used.