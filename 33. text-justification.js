/*
https://leetcode.com/problems/text-justification/description/

68. Text Justification
Hard

Given an array of strings words and a width maxWidth, format the text such that each line has exactly maxWidth characters and is fully (left and right) justified.

You should pack your words in a greedy approach; that is, pack as many words as you can in each line. Pad extra spaces ' ' when necessary so that each line has exactly maxWidth characters.

Extra spaces between words should be distributed as evenly as possible. If the number of spaces on a line does not divide evenly between words, the empty slots on the left will be assigned more spaces than the slots on the right.

For the last line of text, it should be left-justified, and no extra space is inserted between words.

Note:

A word is defined as a character sequence consisting of non-space characters only.
Each word's length is guaranteed to be greater than 0 and not exceed maxWidth.
The input array words contains at least one word.
 

Example 1:

Input: words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16
Output:
[
   "This    is    an",
   "example  of text",
   "justification.  "
]
Example 2:

Input: words = ["What","must","be","acknowledgment","shall","be"], maxWidth = 16
Output:
[
  "What   must   be",
  "acknowledgment  ",
  "shall be        "
]
Explanation: Note that the last line is "shall be    " instead of "shall     be", because the last line must be left-justified instead of fully-justified.
Note that the second line is also left-justified because it contains only one word.
Example 3:

Input: words = ["Science","is","what","we","understand","well","enough","to","explain","to","a","computer.","Art","is","everything","else","we","do"], maxWidth = 20
Output:
[
  "Science  is  what we",
  "understand      well",
  "enough to explain to",
  "a  computer.  Art is",
  "everything  else  we",
  "do                  "
]
 

Constraints:

1 <= words.length <= 300
1 <= words[i].length <= 20
words[i] consists of only English letters and symbols.
1 <= maxWidth <= 100
words[i].length <= maxWidth

*/

// EXPLANATION

/*

This is a simulation/greedy problem, not a "clever algorithm" one - the hard part is
carefully implementing the packing + spacing rules exactly as described.

Step 1 - GREEDY LINE PACKING
Walk through the words and keep adding words to the current line as long as they still
fit within maxWidth, counting one mandatory space between each pair of words on the line.
A line holding words [w1, w2, ..., wk] needs:
    (sum of word lengths) + (k - 1 mandatory spaces) <= maxWidth
As soon as adding the next word would overflow this, the current line is "closed" and a
new line starts with that word.

Step 2 - JUSTIFYING A CLOSED LINE
Once we know which words belong to a line, we decide how many spaces go between each
pair of words so the line is exactly maxWidth characters wide:

  a) LAST LINE, or a line with only ONE word -> left-justify:
     join the words with a single space, then pad the remainder with spaces on the right.

  b) Otherwise (a normal "full" line) -> spread the leftover spaces evenly across the
     gaps between words:
        totalSpaces = maxWidth - (sum of word lengths)
        gaps        = numberOfWords - 1
        spacePerGap = floor(totalSpaces / gaps)
        extraSpaces = totalSpaces % gaps   (leftover that doesn't divide evenly)

     The extra spaces are NOT split fractionally - the problem says the LEFTMOST gaps
     get one extra space each until the leftover runs out. So gap 0 gets
     (spacePerGap + 1) spaces, gap 1 gets (spacePerGap + 1), ... until `extraSpaces`
     is exhausted, then the remaining gaps just get `spacePerGap` spaces.

Example: words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16

Line 1 packs "This", "is", "an" -> word lengths = 4+2+2 = 8, gaps = 2, totalSpaces = 16-8 = 8
   spacePerGap = floor(8/2) = 4, extraSpaces = 8 % 2 = 0
   -> "This" + 4 spaces + "is" + 4 spaces + "an" = "This    is    an" (16 chars)

Line 2 packs "example", "of", "text" -> word lengths = 7+2+4 = 13, gaps = 2, totalSpaces = 16-13 = 3
   spacePerGap = floor(3/2) = 1, extraSpaces = 3 % 2 = 1
   -> gap 0 gets 1+1=2 spaces (extraSpaces consumed), gap 1 gets 1 space
   -> "example" + "  " + "of" + " " + "text" = "example  of text" (16 chars)

Line 3 packs "justification." -> this is the LAST line, so left-justify:
   "justification." (14 chars) + 2 trailing spaces = "justification.  " (16 chars)

Time complexity: O(n) where n is the total number of characters across all words -
each word/space is visited a constant number of times while packing and justifying.
Space complexity: O(n) for the output lines (excluding output itself, extra space is O(1)).

*/

// ANSWER

/**
 * @param {string[]} words
 * @param {number} maxWidth
 * @return {string[]}
 */
var fullJustify = function(words, maxWidth) {
    const result = [];
    let line = [];
    let lineLength = 0; // sum of word lengths currently in `line` (spaces not counted yet)

    const justify = (line, lineLength, isLastLine) => {
        // last line or a single-word line: left-justify, pad the rest with spaces
        if (isLastLine || line.length === 1) {
            const leftJustified = line.join(' ');
            return leftJustified + ' '.repeat(maxWidth - leftJustified.length);
        }

        const totalSpaces = maxWidth - lineLength;
        const gaps = line.length - 1;
        const spacePerGap = Math.floor(totalSpaces / gaps);
        let extraSpaces = totalSpaces % gaps; // leftmost gaps absorb these one at a time

        let justified = '';
        for (let i = 0; i < gaps; i++) {
            justified += line[i];
            justified += ' '.repeat(spacePerGap + (extraSpaces > 0 ? 1 : 0));
            if (extraSpaces > 0) extraSpaces--;
        }
        justified += line[line.length - 1];
        return justified;
    };

    for (const word of words) {
        // +line.length accounts for one mandatory space before each word already on the line
        if (lineLength + line.length + word.length > maxWidth) {
            result.push(justify(line, lineLength, false));
            line = [];
            lineLength = 0;
        }
        line.push(word);
        lineLength += word.length;
    }

    result.push(justify(line, lineLength, true)); // last line is always left-justified

    return result;
};

// WALKTHROUGH OF CODE
/*
For words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16:

Packing phase:
  word="This":           lineLength+line.length+word.length = 0+0+4=4  <= 16  -> line=["This"], lineLength=4
  word="is":              4+1+2=7  <= 16  -> line=["This","is"], lineLength=6
  word="an":               6+2+2=10 <= 16  -> line=["This","is","an"], lineLength=8
  word="example":          8+3+7=18 > 16   -> CLOSE line ["This","is","an"], justify(isLastLine=false)
                            -> "This    is    an"
                            reset: line=["example"], lineLength=7
  word="of":               7+1+2=10 <= 16  -> line=["example","of"], lineLength=9
  word="text":             9+2+4=15 <= 16  -> line=["example","of","text"], lineLength=13
  word="justification.":   13+3+14=30 > 16 -> CLOSE line ["example","of","text"], justify(isLastLine=false)
                            -> "example  of text"
                            reset: line=["justification."], lineLength=14

End of words loop -> push justify(["justification."], 14, isLastLine=true)
                    -> "justification.  "

Result:
[
  "This    is    an",
  "example  of text",
  "justification.  "
]
*/
