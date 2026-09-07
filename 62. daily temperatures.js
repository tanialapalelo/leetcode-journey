/*
739. Daily Temperatures
Medium

Given an array of integers temperatures represents the daily temperatures, 
return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. 
If there is no future day for which this is possible, keep answer[i] == 0 instead.

 

Example 1:

Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
Example 2:

Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]
Example 3:

Input: temperatures = [30,60,90]
Output: [1,1,0]
 

Constraints:

1 <= temperatures.length <= 105
30 <= temperatures[i] <= 100

*/

/*
UNDERSTANDING THE PROBLEM (walk through Example 1 by hand first)

Input:  temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
Index:                    0   1   2   3   4   5   6   7

For EACH index i, answer[i] = "how many days do I have to wait, starting
from day i, until I see a temperature STRICTLY WARMER than temperatures[i]?"
If no such day exists later in the array, answer[i] = 0.

Going index by index (this is what the expected output [1,1,4,2,1,1,0,0]
actually means, in plain words):
  i=0 (73): next day (i=1) is 74, warmer -> that's 1 day away    -> answer[0] = 1
  i=1 (74): next day (i=2) is 75, warmer -> 1 day away           -> answer[1] = 1
  i=2 (75): i=3 is 71 (colder), i=4 is 69 (colder), i=5 is 72
            (colder), i=6 is 76 (WARMER, finally) -> 6 - 2 = 4    -> answer[2] = 4
  i=3 (71): i=4 is 69 (colder), i=5 is 72 (warmer) -> 5 - 3 = 2   -> answer[3] = 2
  i=4 (69): i=5 is 72 (warmer) -> 5 - 4 = 1                       -> answer[4] = 1
  i=5 (72): i=6 is 76 (warmer) -> 6 - 5 = 1                       -> answer[5] = 1
  i=6 (76): nothing after it is warmer (only 73 left)             -> answer[6] = 0
  i=7 (73): last day, nothing after it at all                     -> answer[7] = 0

Result: [1, 1, 4, 2, 1, 1, 0, 0]  <- matches the example

The confusing part when just reading the problem text is "number of days
you have to wait" - it just means (index of the next warmer day) minus
(current index). It is NOT the temperature difference, it's a distance
between positions in the array.
*/

/*
APPROACH 1: BRUTE FORCE

For each day i, look forward day by day until you find one that's warmer,
and record how far away it is. If you reach the end without finding one,
the answer for that day stays 0.

Time:  O(n^2) - for every i, the inner loop can scan up to the rest of the array
Space: O(1) extra (output array doesn't count)
*/

/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperaturesBruteForce = function(temperatures) {
    const n = temperatures.length;
    const answer = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (temperatures[j] > temperatures[i]) {
                answer[i] = j - i;
                break;
            }
        }
    }
    return answer;
};

/*
APPROACH 2: OPTIMAL (monotonic decreasing stack)

Recognizing the pattern: this is a "next greater element" problem (see the
Stack recognition notes in 2.reference-data-structures.js) - for every
index we need "the next index to the right with a bigger value". That
"look back and resolve the most recent unresolved thing first" shape is
exactly what a stack is for.

The stack holds INDICES of days that are still "waiting" for a warmer day,
kept in decreasing order of temperature from bottom to top (hence
"monotonic decreasing"). Walk the array left to right:
  - while the current temperature is WARMER than the temperature at the
    index on top of the stack: pop that index, and this current day IS its
    answer (today - thatIndex). Keep popping while this keeps being true.
  - push the current index (it's now "waiting" for its own warmer day).
Whatever indices are still sitting in the stack at the end never found a
warmer day, so their answer stays 0 (the array was pre-filled with 0s).

Each index gets pushed exactly once and popped at most once -> the total
work across the whole run is O(n), even though there's a nested while loop.

WHY STORE INDICES, NOT THE ACTUAL TEMPERATURE VALUES:
The answer we need per day is a DISTANCE ("how many days away"), and the
only way to compute a distance between two days is (later day's position)
minus (earlier day's position) - positions are indices, not temperatures.

If the stack held raw temperature values instead of indices, at the moment
we find a warmer day we'd know WHAT temperature was waiting, but we'd have
no way to know WHICH DAY (which position in the array) that value came
from - so we couldn't compute `i - thatDay`, and we wouldn't know which
slot of the answer[] array to write the result into either.

An index gives you BOTH things at once, because the value is always one
lookup away:
  - the temperature for comparison:  temperatures[stack[stack.length-1]]
  - the day number for the distance & for writing the answer: the index itself
So storing the index is strictly more information than storing the value -
you can always go from index -> value via temperatures[index], but you can
never go backwards from a bare value -> "which day was this".

WALKTHROUGH - [73, 74, 75, 71, 69, 72, 76, 73]  (stack holds indices)

Read every line as: "day i has temperature X. Compare X against the
temperature of whatever index currently sits on top of the stack."
Each stack snapshot below also shows the actual temperatures in parentheses
so you don't have to look them up yourself while reading.

i=0 (73): stack empty -> push 0
          stack: [0]              (temps: 73)

i=1 (74): 74 > temp[0]=73 -> pop 0, answer[0] = 1-0 = 1
          stack empty -> push 1
          stack: [1]              (temps: 74)

i=2 (75): 75 > temp[1]=74 -> pop 1, answer[1] = 2-1 = 1
          stack empty -> push 2
          stack: [2]              (temps: 75)

i=3 (71): 71 < temp[2]=75 -> nothing to pop, just push 3
          stack: [2, 3]           (temps: 75, 71)

i=4 (69): 69 < temp[3]=71 -> nothing to pop, just push 4
          stack: [2, 3, 4]        (temps: 75, 71, 69)

i=5 (72): 72 > temp[4]=69 -> pop 4, answer[4] = 5-4 = 1
          72 > temp[3]=71 -> pop 3, answer[3] = 5-3 = 2
          72 < temp[2]=75 -> stop popping, push 5
          stack: [2, 5]           (temps: 75, 72)

i=6 (76): 76 > temp[5]=72 -> pop 5, answer[5] = 6-5 = 1
          76 > temp[2]=75 -> pop 2, answer[2] = 6-2 = 4
          stack empty -> push 6
          stack: [6]              (temps: 76)

i=7 (73): 73 < temp[6]=76 -> nothing to pop, just push 7
          stack: [6, 7]           (temps: 76, 73)

End of array. Indices 6 and 7 are still stuck in the stack -> they never
found a warmer day -> answer[6] and answer[7] stay 0 (their initial value).

Result: [1, 1, 4, 2, 1, 1, 0, 0]  <- matches

WHY TIME IS O(n) DESPITE THE NESTED for + while LOOP:
This looks like it should be O(n^2), the same shape as the brute force's
nested loops - but the key difference is WHAT BOUNDS the inner loop.

In the brute force, the inner loop's cost is NOT shared across outer
iterations: EVERY single i can independently scan up to the rest of the
array in the worst case, so worst case is n * n = O(n^2).

In the stack version, every index gets pushed onto the stack EXACTLY ONCE
(one push per iteration of the outer for-loop, n pushes total, guaranteed),
and once an index is popped, it is GONE FOREVER - it can never be pushed
or popped again. So across the WHOLE run of the algorithm, from i=0 to
i=n-1, the total number of pop operations (summed over every iteration of
the while loop, across every iteration of the for loop) can never exceed n,
because you can't pop more things than you ever pushed.

Check it against the walkthrough above: n = 8, and the total pops that
happened across the ENTIRE run were: i=1 (1 pop), i=2 (1 pop), i=5 (2
pops), i=6 (2 pops) = 6 pops total, i=3/4/7 (0 pops) - 6 is less than
n=8, confirming the "at most n pops total" bound.

So total work = (n pushes) + (at most n pops, summed over the WHOLE run,
not per outer iteration) = O(n) + O(n) = O(2n) = O(n). This reasoning
style is called "amortized analysis": a single iteration's while loop
might look expensive, but the COST IS SHARED/CAPPED across the entire
run, so the true total is linear even though it doesn't look that way
from a single nested-loop glance.

Time:  O(n) - each index is pushed once and popped at most once
Space: O(n) worst case - if temperatures strictly decrease, nothing ever
       gets popped and every index sits in the stack at once
*/

/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
    const n = temperatures.length;
    const answer = new Array(n).fill(0);
    const stack = []; // indices waiting for a warmer day

    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            answer[prevIndex] = i - prevIndex;
        }
        stack.push(i);
    }

    return answer;
};