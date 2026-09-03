/*
953. Verifying an Alien Dictionary
Easy

In an alien language, surprisingly, they also use English lowercase letters, but possibly in a different order. The order of the alphabet is some permutation of lowercase letters.

Given a sequence of words written in the alien language, and the order of the alphabet, return true if and only if the given words are sorted lexicographically in this alien language.

 

Example 1:

Input: words = ["hello","leetcode"], order = "hlabcdefgijkmnopqrstuvwxyz"
Output: true
Explanation: As 'h' comes before 'l' in this language, then the sequence is sorted.
Example 2:

Input: words = ["word","world","row"], order = "worldabcefghijkmnpqstuvxyz"
Output: false
Explanation: As 'd' comes after 'l' in this language, then words[0] > words[1], hence the sequence is unsorted.
Example 3:

Input: words = ["apple","app"], order = "abcdefghijklmnopqrstuvwxyz"
Output: false
Explanation: The first three characters "app" match, and the second string is shorter (in size.) According to lexicographical rules "apple" > "app", because 'l' > '∅', where '∅' is defined as the blank character which is less than any other character (More info).
 

Constraints:

1 <= words.length <= 100
1 <= words[i].length <= 20
order.length == 26
All characters in words[i] and order are English lowercase letters.
 
*/

// ANSWER
/**
 * @param {string[]} words
 * @param {string} order
 * @return {boolean}
 */
var isAlienSorted = function(words, order) {
    const orderMap = new Map();
    for (let i=0; i<order.length;i++){
        orderMap.set(order.charAt(i), i)
    }
    console.log("orderMap",orderMap);
    //iterate for every word
    // length-1 cuz if we reach last index then no need to compare to the next nonexisted word
    for(let i=0; i<words.length-1; i++){
        // iterate every characters between 2 adjacent words
        for(let c=0; c<words[i].length; c++){
         // ie: Batman, Bat where length of current c is greater than length of the next word
         if(c >= words[i+1].length){
            return false;
         }

         // if the character not the same as the next word's char then compare
         if(words[i].charAt(c) != words[i+1].charAt(c)){
            const currLetter = orderMap.get(words[i].charAt(c));
            const nextLetter = orderMap.get(words[i+1].charAt(c));
            console.log(c,"currLetter",currLetter)
            console.log(c,"nextLetter",nextLetter)
            if(nextLetter < currLetter) return false; //there's missmatch, example word (current) and world (next), d (current) is 4 and l (next) is 3
            else break; // if the order is correct, then we can break out of here
         }
        }
    }
    // if we're able to get out of the for loop meaning all true order
    return true;
    
};

// Time complexity: O(total characters across words) - adjacent word pairs are compared
// character by character, but the inner loop breaks as soon as a differing character is found.
// Space complexity: O(1) extra - orderMap always holds at most 26 entries.

/* NOTE FROM GPT

Copilot said: 
Nice work — your logic is mostly correct ✅
You only need a few best-practice fixes.
Main fixes

    Declare loop vars with let (i, c) — right now they become globals.
    Use strict compare !== instead of !=.
    Optional: use arrays instead of Map for a tiny speed gain.

Your current algorithm is already O(total chars), which is optimal.

----------------------------------------------------------------------
Clean solution with the same logic:
var isAlienSorted = function(words, order) {
    const orderMap = new Map();
    for (let i = 0; i < order.length; i++) {
        orderMap.set(order.charAt(i), i);
    }

    for (let i = 0; i < words.length - 1; i++) {
        for (let c = 0; c < words[i].length; c++) {
            if (c >= words[i + 1].length) return false; // prefix case

            if (words[i].charAt(c) !== words[i + 1].charAt(c)) {
                const currLetter = orderMap.get(words[i].charAt(c));
                const nextLetter = orderMap.get(words[i + 1].charAt(c));
                if (nextLetter < currLetter) return false;
                break; // this pair decided, move to next pair
            }
        }
    }

    return true;
};

----------------------------------------------------------------------
Copilot said: 

In your code you wrote things like:

for (i = 0; i < order.length; i++)

and

for (c = 0; c < words[i].length; c++)

Because there is no let/const/var, JavaScript creates i and c as global variables (in non-strict mode).
That is risky and bad practice.

Use:
JavaScript

for (let i = 0; i < order.length; i++) { ... }
for (let c = 0; c < words[i].length; c++) { ... }

Why it matters

    Globals can be accidentally reused/overwritten.
    Bugs appear when loops/nested functions share same variable names.
    Harder to debug.
    Interviewers expect block-scoped let.

So “they become globals” = they live outside the loop/function scope and can leak state.

*/