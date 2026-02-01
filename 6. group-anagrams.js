/** QUESTION
 * 49. Group Anagrams
Medium
Topics: Array, Hash Table, String, Sorting

Given an array of strings strs, group the together. You can return the answer in any order.

 

Example 1:

Input: strs = ["eat","tea","tan","ate","nat","bat"]

Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

Explanation:

    There is no string in strs that can be rearranged to form "bat".
    The strings "nat" and "tan" are anagrams as they can be rearranged to form each other.
    The strings "ate", "eat", and "tea" are anagrams as they can be rearranged to form each other.

Example 2:

Input: strs = [""]

Output: [[""]]

Example 3:

Input: strs = ["a"]

Output: [["a"]]

 

Constraints:

    1 <= strs.length <= 104
    0 <= strs[i].length <= 100
    strs[i] consists of lowercase English letters.


    **/


// ANSWER with help of youtube DSA crash course freecodecamp & GPT 
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    if(strs.length === 0) return [];
    
    // hashmap will have key and value where value contains array of same group anagram
    // and key will be something like "1#0#0#0#1#0#0#...#1#0#..."
    const map = new Map(); 

    // looping each string from array
    for (const str of strs){
        const count = new Array(26).fill(0); // a - z is 26 characters

        // looping each character in the string
        for(let i = 0; i < str.length; i++){
            // 'a' = 97 so if a then 1st index since our count is a - z
            // ASCII/Unicode codes: 'a' is 97, 'b' is 98, ... 'z' is 122
            const idx = str.charCodeAt(i) - 97;
            count[idx]++;

            // example: 
            /* Walkthrough for "tea"
            Start: count = [0,0,0,...,0] (26 zeros)
                i=0, s[i]='t'
                idx = 116 - 97 = 19
                count[19]++ → count[19] becomes 1

                i=1, s[i]='e'
                idx = 101 - 97 = 4
                count[4]++ → count[4] becomes 1

                i=2, s[i]='a'
                idx = 97 - 97 = 0
                count[0]++ → count[0] becomes 1

            Now count represents:
                a:1, e:1, t:1, everything else:0
            */
        }

        // turn counts into a stable hash key because arrays are compared by reference 
        // i.e array a = [1,0,...,1] and array b = [1,0,...,1], if we compare a === b then it will be false
        // a === b asks: “are these the same array object?” Not “do they contain the same numbers?”
        const key = count.join("#"); // [1,0,0,0,1,0,0,...,0,1,0,...] to string "1#0#0#0#1#0#0#...#1#0#..."

        // If this is the first time we see this fingerprint, create an empty group [].
        // Then add the current word s to that group.

        if(!map.has(key)) map.set(key, []);
        map.get(key).push(str);
    }

    return Array.from(map.values());
};

/*
EXPLANATION
1. We initialize a Map to group anagrams.
2. For each string, we create a count array of size 26 to count occurrences of each letter.
3. We convert the count array into a unique key by joining with a separator.
4. We use this key to group anagrams in the Map.
5. Finally, we return the grouped anagrams as an array of arrays.
6. The time complexity is O(N*K) where N is the number of strings and K is the maximum length of a string.
*/