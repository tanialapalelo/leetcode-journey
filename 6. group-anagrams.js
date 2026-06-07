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


/*
MENTAL MODEL

Anagrams are the same letters in a different order.
So "eat", "tea", "ate" all contain: a=1, e=1, t=1, they're identical.

The trick: find a way to turn each word into a KEY that is
identical for all anagrams. Then group words by that key using a HashMap.

Two ways to make that key:
  1. Sort the word alphabetically   → "eat" and "tea" both become "aet"
  2. Count each letter (a-z)        → both become "1#0#0#0#1#0#...#1#0#0"

Approach 1 is simpler to think of. Approach 2 is faster (no sorting).
*/


// APPROACH 1 — Sort each word to get the key
// Time: O(N · K log K)  — K log K is the cost of sorting each word of length K
// Space: O(N · K)       — storing all words in the map

var groupAnagrams = function(strs) {
    const map = new Map();

    for (const str of strs) {
        // sort the characters alphabetically to create the key
        // "eat" → ['e','a','t'] → ['a','e','t'] → "aet"
        // "tea" → ['t','e','a'] → ['a','e','t'] → "aet"  ← same key!
        const key = str.split('').sort().join('');

        if (!map.has(key)) map.set(key, []);
        map.get(key).push(str);
    }

    // map.values() gives us each group array, e.g. ["eat","tea","ate"]
    return Array.from(map.values());
};


// APPROACH 2 — Count letters (a–z) to get the key  ← optimal
// Time: O(N · K)   — just iterating characters, no sorting
// Space: O(N · K)

var groupAnagrams = function(strs) {
    const map = new Map();

    for (const str of strs) {
        // create a count array of 26 zeros, one slot per letter a–z
        const count = new Array(26).fill(0);

        for (const char of str) {
            // ASCII is a system that assigns a number to every character.
            // 'a'=97, 'b'=98, 'c'=99 ... 'z'=122
            // subtracting 97 converts the letter to a 0-based index:
            //   'a' → 97-97 = 0  (slot 0 in count[])
            //   'b' → 98-97 = 1  (slot 1)
            //   'z' → 122-97 = 25 (slot 25)
            // charCodeAt(0) is just JS's way of getting the ASCII number of a character
            count[char.charCodeAt(0) - 97]++;
        }

        // arrays can't be map keys directly (compared by reference, not value)
        // so we serialize the count array into a string like "1#0#0#0#1#0#...#1"
        // the '#' separator prevents "10#..." being confused with "1#0#..."
        const key = count.join('#');

        if (!map.has(key)) map.set(key, []);
        map.get(key).push(str);
    }

    return Array.from(map.values());
};

/*
Here's the key things to remember when you come back to this:

- The insight: anagrams → same character frequencies → same key → same group
- Approach 1 (sort): easiest to think of in an interview, start here
- Approach 2 (count): faster because no sorting — just counting characters using their ASCII position (char - 'a')
- Why .join('#'): arrays can't be Map keys because [1,0,1] === [1,0,1] is false in JS (reference comparison), so you serialize it to a string first
 */
