/* 
FYI: An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.

Given two strings s and t, return true if t is an

of s, and false otherwise.

 

Example 1:

Input: s = "anagram", t = "nagaram"

Output: true

Example 2:

Input: s = "rat", t = "car"

Output: false

 

Constraints:

    1 <= s.length, t.length <= 5 * 104
    s and t consist of lowercase English letters.

 

Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?
============================================================================================================= */

// ANSWER

/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    tempMap = new Map();
    if (s.length !== t.length) return false
    for (let i = 0; i < s.length; i++)
    {
        if(tempMap.has(s[i])){
            const total = tempMap.get(s[i])
            tempMap.set(s[i], total-1)
        }
        else{
            tempMap.set(s[i], -1)
        }
    }
    for (let i = 0; i < t.length; i++)
    {
        if(tempMap.has(t[i])){
            const total = tempMap.get(t[i])
            tempMap.set(t[i], total+1)
        }
        else{
            tempMap.set(t[i], 1)
        }
    }

    for(const [key, value] of tempMap){
        if(value !== 0) return false
    }
    return true
};


// BETTER ANSWER AFTER CHECK DISCUSSION
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    if (s.length !== t.length) return false

    const tempMap = new Map();
    for (let i = 0; i < s.length; i++)
    {
        if(tempMap.has(s[i])) tempMap.set(s[i], tempMap.get(s[i])-1)
        else tempMap.set(s[i], -1)
    }
    for (let i = 0; i < t.length; i++)
    {
        if(!tempMap.has(t[i]) || tempMap.get(t[i]) === 0){
            return false
        }
        tempMap.set(t[i], tempMap.get(t[i])+1)
    }
    return true
};

/* EXPLANATION
1. First, we check if the lengths of the two strings are different. If they are, we can immediately return false since anagrams must be of the same length.
2. We create a Map to keep track of the character counts.
3. We iterate through the first string s, decrementing the count for each character in the Map.
4. We then iterate through the second string t. For each character, we check if it exists in the Map and if its count is zero. If either condition is true, we return false since it means t has an extra character not in s or more occurrences of a character than s.
5. If the character exists and its count is not zero, we increment the count in the Map.
6. If we complete both loops without returning false, it means the strings are anagrams, and we return true.
*/