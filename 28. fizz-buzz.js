/*
412. Fizz Buzz
Easy

Given an integer n, return a string array answer (1-indexed) where:

answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
answer[i] == "Fizz" if i is divisible by 3.
answer[i] == "Buzz" if i is divisible by 5.
answer[i] == i (as a string) if none of the above conditions are true.


Example 1:

Input: n = 3
Output: ["1","2","Fizz"]
Example 2:

Input: n = 5
Output: ["1","2","Fizz","4","Buzz"]
Example 3:

Input: n = 15
Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]


Constraints:

1 <= n <= 104
 */

/*

EXPLANATION

Example:
n = 5
1,2,3,4,5

since 1 is not divisible by 3 or 5 then return the string value -> "1"
however 3 is divisible by 3 so return "fizz"
and 5 is divisible by 5 so return "buzz"
if the value is divisible by 3 and 5, then we return "fizzbuzz"

result of our example:
"1", "2", "fizz", "4", "buzz"


 */

// MY ANSWER
var fizzBuzz = function(n) {
    let result = [];
    for (let i=1; i<=n; i++){
        if(i % 3 === 0 && i % 5 === 0) result.push("FizzBuzz");
        else if(i % 3 === 0) result.push("Fizz");
        else if(i % 5 === 0) result.push("Buzz");
        else result.push(String(i));
    }
    return result;
};

// BETTER APPROACH

// Approach 1: String concatenation — cleaner, removes redundant % 15 check, easy to extend
// Trade-off: += creates a new string each iteration, but cost is negligible here (max 2 tiny concatenations per loop)
var fizzBuzz = function(n) {
    let result = [];
    for (let i = 1; i <= n; i++) {
        let s = '';
        if (i % 3 === 0) s += 'Fizz';
        if (i % 5 === 0) s += 'Buzz';
        result.push(s || String(i));
    }
    return result;
};

// Approach 2: Counter — avoids modulo (%) and string concatenation entirely
// Increments fizz/buzz counters and resets when they hit 3 or 5 — cheaper CPU ops, zero temp strings
var fizzBuzz = function(n) {
    let result = [];
    let fizz = 0, buzz = 0;
    for (let i = 1; i <= n; i++) {
        fizz++; buzz++;
        if (fizz === 3 && buzz === 5) { result.push("FizzBuzz"); fizz = 0; buzz = 0; }
        else if (fizz === 3)          { result.push("Fizz");     fizz = 0; }
        else if (buzz === 5)          { result.push("Buzz");     buzz = 0; }
        else                            result.push(String(i));
    }
    return result;
};