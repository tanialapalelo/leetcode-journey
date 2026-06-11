/*
271. Encode and Decode Strings
Medium
(Premium problem — free on Lintcode: https://www.lintcode.com/problem/659)

Design an algorithm to encode a list of strings into a single string,
and then decode that single string back to the original list.

The encoded string is sent over a network — it must survive any characters
inside the original strings, including special characters.

Example 1:
Input:  ["lint","code","love","you"]
Output: ["lint","code","love","you"]

Example 2:
Input:  ["we","say",":","yes"]
Output: ["we","say",":","yes"]

Example 3 (edge cases):
Input:  [""]        Output: [""]    ← one empty string
Input:  []          Output: []     ← empty list

Constraints:
  0 <= strs.length <= 200
  0 <= strs[i].length <= 200
  strs[i] contains any possible character (0–255 ASCII)
*/

/*
WHY IS THIS HARD?

You can't just join with a delimiter like "#":
  encode(["ab","c#d"]) → "ab#c#d"
  decode("ab#c#d")     → ["ab","c","d"]  ← WRONG, lost the original split

Any single character you pick as a separator could appear inside the strings.
You need a smarter encoding.

Two solutions:
  Approach 1 — Length prefix:  tell the decoder exactly how long each string is
  Approach 2 — Non-ASCII char: use a Unicode character no real string will contain
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROACH 1 — Length Prefix  ← the standard interview answer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before each string, write its LENGTH followed by a "#" separator.
The decoder reads the length first, then reads exactly that many characters.
This way "#" inside a string is never confused with the separator.

Encode:
  ["lint","code","love","you"]
  → "4#lint" + "4#code" + "4#love" + "3#you"
  → "4#lint4#code4#love3#you"

Decode:
  i=0 → read until "#" → length=4 → read next 4 chars → "lint" → i=6
  i=6 → read until "#" → length=4 → read next 4 chars → "code" → i=12
  ... and so on

Works even if strings contain "#":
  encode(["a#b"]) → "3#a#b"
  decode: length=3 → read 3 chars after "#" → "a#b" ✓

Time: O(n)  Space: O(1) extra
*/
class Codec1 {
    encode(strs) {
        let result = '';
        for (const s of strs) {
            result += s.length + '#' + s; // e.g. "4#lint"
        }
        return result;
    }

    decode(s) {
        const result = [];
        let i = 0;

        while (i < s.length) {
            let j = i;
            while (s[j] !== '#') j++;         // scan forward to find the '#'
            const len = parseInt(s.slice(i, j)); // number before '#' is the length
            result.push(s.slice(j + 1, j + 1 + len)); // read exactly len chars
            i = j + 1 + len;                 // jump to the start of the next entry
        }
        return result;
    }
}

/*
WALKTHROUGH — encode(["we","say",":","yes"])
  "we"  → "2#we"
  "say" → "3#say"
  ":"   → "1#:"
  "yes" → "3#yes"
  encoded = "2#we3#say1#:3#yes"

WALKTHROUGH — decode("2#we3#say1#:3#yes")
  i=0: scan → j=1, s[1]='#' → len=2 → slice(2,4)="we"  → i=4
  i=4: scan → j=5, s[5]='#' → len=3 → slice(6,9)="say" → i=9
  i=9: scan → j=10, s[10]='#' → len=1 → slice(11,12)=":" → i=12
  i=12: scan → j=13, s[13]='#' → len=3 → slice(14,17)="yes" → i=17
  result = ["we","say",":","yes"] ✓
*/


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROACH 2 — Non-ASCII Character Separator  (from the course)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use Unicode character 257 as the separator between strings.
Regular ASCII only goes up to 255, so char(257) can never appear
in a normal ASCII string — safe to use as a delimiter.

Use char(258) as a special signal meaning "this was an empty list []",
not to be confused with a list containing one empty string [""].

Encode:
  ["lint","code","love","you"] → "lint" + char(257) + "code" + char(257) + ...
  []                           → char(258)

Decode:
  Split by char(257) → back to original array
  char(258)          → return []

Time: O(n)  Space: O(1) extra

Downside: subtle — relies on knowing the input won't contain char(257/258).
          Works for ASCII inputs; breaks if input can be arbitrary Unicode.
*/
class Codec2 {
    encode(strs) {
        if (strs.length === 0) return String.fromCharCode(258); // empty list signal
        return strs.join(String.fromCharCode(257));             // join with char(257)
    }

    decode(s) {
        if (s === String.fromCharCode(258)) return [];          // was an empty list
        return s.split(String.fromCharCode(257));               // split on char(257)
    }
}

/*
WALKTHROUGH — encode(["we","say",":","yes"])
  joins with char(257): "we░say░:░yes"  (░ represents char(257))
  → one string, no ambiguity since ░ is never in the original strings

decode("we░say░:░yes")
  split on ░ → ["we","say",":","yes"] ✓

Edge case: encode([""]) → ""  (one empty string, not char(258))
           decode("")  → [""]  ← split("") returns [""] ✓
           encode([])  → char(258)
           decode(char(258)) → [] ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHICH TO USE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Approach 1 (length prefix) — safer, works with ANY input including Unicode
  Approach 2 (char 257)      — simpler code, but assumes ASCII-only input

In an interview, mention both and explain why Approach 1 is more robust.
*/
