/*
752. Open the Lock
Medium

You have a lock in front of you with 4 circular wheels. Each wheel has 10 slots: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'. The wheels can rotate freely and wrap around: for example we can turn '9' to be '0', or '0' to be '9'. Each move consists of turning one wheel one slot.

The lock initially starts at '0000', a string representing the state of the 4 wheels.

You are given a list of deadends dead ends, meaning if the lock displays any of these codes, the wheels of the lock will stop turning and you will be unable to open it.

Given a target representing the value of the wheels that will unlock the lock, return the minimum total number of turns required to open the lock, or -1 if it is impossible.



Example 1:

Input: deadends = ["0201","0101","0102","1212","2002"], target = "0202"
Output: 6
Explanation:
A sequence of valid moves would be "0000" -> "1000" -> "1100" -> "1200" -> "1201" -> "1202" -> "0202".
Note that a sequence like "0000" -> "0001" -> "0002" -> "0102" -> "0202" would be invalid,
because the wheels of the lock become stuck after the display becomes the dead end "0102".
Example 2:

Input: deadends = ["8888"], target = "0009"
Output: 1
Explanation: We can turn the last wheel in reverse to move from "0000" -> "0009".
Example 3:

Input: deadends = ["8887","8889","8878","8898","8788","8988","7888","9888"], target = "8888"
Output: -1
Explanation: We cannot reach the target without getting stuck.


Constraints:

1 <= deadends.length <= 500
deadends[i].length == 4
target.length == 4
target will not be in the list deadends.
target and deadends[i] consist of digits only.

 */

/*
UNDERSTANDING THE PROBLEM, what is the lock actually doing?

The lock shows 4 digits, like a bike lock: "0000". One MOVE means
turning ONE wheel by ONE slot, either up (+1) or down (-1). The digits
wrap around, so 9 -> 0 is one move up, and 0 -> 9 is one move down.

So from "0000" there are exactly 8 possible moves (4 wheels x 2 directions):

  wheel 1:  1000  9000
  wheel 2:  0100  0900
  wheel 3:  0010  0090
  wheel 4:  0001  0009

Same from any other code. "1202" has 8 neighbors too, like "2202",
"0202", "1302", "1102", "1212", "1292", "1203", "1201".

`deadends` are codes you are NOT allowed to land on. If the lock ever
shows one, it locks up and you can't turn anything anymore. So treat a
deadend as a wall, you can never step onto it and continue.

Goal: fewest moves from "0000" to `target`, or -1 if walls block every route.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE EXAMPLES, why are the answers 6, 1 and -1?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Example 2 (the easy one): deadends = ["8888"], target = "0009"
  From "0000", turn the LAST wheel DOWN: 0 -> 9 (wraps around).
  "0000" -> "0009", one move. The deadend 8888 is nowhere near, it
  doesn't matter. Answer 1. This example just shows that 0 and 9 are
  neighbors on a wheel, which is why the digit needs the wrap trick.

Example 1: deadends = ["0201","0101","0102","1212","2002"], target = "0202"
  Ignoring deadends, how many moves would it take? Wheel 2 needs 0 -> 2
  (2 moves) and wheel 4 needs 0 -> 2 (2 moves), so 4 moves in total,
  just in some order. Each order passes through codes of the form 0_0_:

     wheel 4 ->   0     1     2
     wheel 2
        0       0000  0001  0002
        1       0100  0101  0102
        2       0200  0201  0202   <- target

  You only ever step right (wheel 4 up) or down (wheel 2 up) in this
  table. But 0101, 0102 and 0201 are deadends (walls), so you can't get
  through the middle. From 0200 the only way on is 0201 (wall), from
  0002 the only way on is 0102 (wall). The 4-move routes are all blocked.

  The example's answer walks AROUND the wall by using wheel 1, which
  none of the walls are in the way of:
     "0000" -> "1000" -> "1100" -> "1200" -> "1201" -> "1202" -> "0202"
  Turn wheel 1 up (1 move), do the same 4 moves on wheels 2 and 4, then
  turn wheel 1 back down (1 move) = 4 + 2 = 6.

  The example also says "0000" -> "0001" -> "0002" -> "0102" -> "0202"
  is INVALID, because "0102" is a deadend, you'd be stuck there.

Example 3: deadends = ["8887","8889","8878","8898","8788","8988","7888","9888"],
           target = "8888"
  Look at the 8 deadends, they are exactly the 8 neighbors of "8888":
  every wheel one step up and one step down. So every single way INTO
  the target goes through a wall. It can't be reached, answer -1.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW WORDS USED BELOW: node, edge, neighbor, BFS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A "graph" is just a bunch of THINGS with CONNECTIONS between some of them.

  node      = one of the things.        Here: one lock code, like "0000".
  edge      = a connection between two nodes.
                                        Here: "one wheel turn takes you
                                        from this code to that code".
  neighbor  = a node you share an edge with. In plain words:
              "a code you can reach in exactly ONE move".

Real life picture: nodes are houses, edges are the doors/streets between
them, and your neighbors are the houses right next door. To reach a
house 3 doors down you pass through 2 neighbors on the way.

For the lock, the neighbors of "0000" are the 8 codes
  1000 9000 0100 0900 0010 0090 0001 0009
and the neighbors of "1202" are
  2202 0202 1302 1102 1212 1292 1203 1201
`getNeighbors(code)` in the solution just builds that list of 8. Nothing
fancy, "neighbor" only ever means "one move away".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BFS FROM ZERO (Breadth First Search), with a tiny example
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The idea: to find the SHORTEST way from a start to a target, don't pick
one path and follow it all the way to the end. Instead look at
EVERYTHING 1 move away, then EVERYTHING 2 moves away, then 3, and so
on, widening one ring at a time. "Breadth first" = go wide before deep.

Tiny example, NOT the lock. Nodes A to F, and these roads:

          B --- D --- E
         /             \
    A --                 F
         \             /
          C -----------

  neighbors:  A: B, C     B: A, D     C: A, F
              D: B, E     E: D, F     F: E, C

Goal: shortest way from A to F. There are two routes:
  A -> C -> F             2 moves
  A -> B -> D -> E -> F   4 moves

The BFS recipe (this is exactly what openLock does):
  - keep a `visited` set of nodes you already saw
  - keep `level` = the current ring (all nodes the same number of moves away)
  - each round, for every node in `level`, look at its neighbors:
      already visited?  skip it
      is it the target? return `moves`, done
      otherwise:        mark it visited and put it in `nextLevel`
  - then `level = nextLevel` and `moves++`

Trace, step by step:

  start:    visited = {A}         level = [A]        moves = 0

  round 1 (moves = 1), process A:
      neighbor B -> new, mark visited, add to nextLevel
      neighbor C -> new, mark visited, add to nextLevel
    end of round: visited = {A, B, C}   level = [B, C]

  round 2 (moves = 2), process B, then C:
      B's neighbor A -> already visited, skip
      B's neighbor D -> new, add to nextLevel
      C's neighbor A -> already visited, skip
      C's neighbor F -> THAT'S THE TARGET, return 2

Answer 2, correct. Notice BFS never even reached E. A depth-first
search that happened to try B first would have walked A -> B -> D -> E -> F
and found the 4-move route first, with no way to know a 2-move route existed.

Why the first hit is the shortest: ring k holds exactly the nodes that
need k moves. Ring 1 is fully checked before ring 2 starts, so when
the target finally shows up in ring k, nothing closer was missed.

Where's the "queue" everyone mentions with BFS? A queue is first-in,
first-out, so nodes found EARLIER (closer) get processed before nodes
found LATER (farther). `level` and `nextLevel` do that same job one
ring at a time. See references/14.reference-queues.js for the plain
queue version.

Mapping the tiny example onto the lock:
  node A..F               -> a 4-digit code
  its neighbors           -> the 8 codes one wheel turn away
  target F                -> the `target` string
  `visited`               -> a Set of codes (deadends put in it up front)
  ring number / `moves`   -> `moves`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE APPROACH, turn it into a graph, then BFS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1, spot the graph. Every 4-digit code is a NODE (there are exactly
10,000 of them, "0000" to "9999"). Two codes are connected by an EDGE
if one move turns one into the other. Deadends are nodes you must
never enter.

Step 2, spot the question type. "Minimum number of moves" where every
move costs the same (1) is "shortest path in an UNWEIGHTED graph".
That is exactly what BFS is for.

Step 3, why BFS and not DFS? BFS explores in rings, like a ripple
spreading from a stone dropped in water:

  ring 0: "0000"                       (0 moves)
  ring 1: every code 1 move away       (the 8 neighbors)
  ring 2: every NEW code 2 moves away
  ring 3: ...

The FIRST time the ripple touches `target`, you got there in the
fewest possible moves, because every code closer than that was already
covered by an earlier ring. DFS dives down one long route first and
could reach the target after 40 moves when 6 was possible, so it
can't stop at the first hit.

Step 4, the three details that make it work:
  1. `visited` set: without it you'd go 0000 -> 1000 -> 0000 -> 1000...
     forever. Mark a code as visited when you ADD it to the queue.
  2. Put all the deadends into `visited` at the very start. A deadend
     then looks like "already seen", so BFS naturally never enters it.
     No separate deadend check needed in the loop.
  3. Count moves by rings (levels). Process one whole ring at a time,
     then `moves++`.

THE WRAPAROUND (same trick as the circular queue, problem 70)
Turning a wheel up:    (digit + 1) % 10        9 -> 0
Turning a wheel down:  (digit + 9) % 10        0 -> 9

Why +9 for down and not -1? In JavaScript, (0 - 1) % 10 is -1, and
there is no wheel slot -1. Adding 9 is the same as subtracting 1 on a
10-slot wheel, but never goes negative: (0 + 9) % 10 = 9, and
(5 + 9) % 10 = 4.

EDGE CASES
  - "0000" is itself a deadend -> the lock is stuck before the first
    move, return -1.
  - target is "0000" -> already open, 0 moves. (The constraints promise
    target is not a deadend, so this can't collide with the check above.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WALKTHROUGH, Example 1, ring by ring
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
deadends = ["0201","0101","0102","1212","2002"], target = "0202"

start:  visited = { 0201, 0101, 0102, 1212, 2002,   <- the 5 deadends
                    0000 }                          <- the start
        level   = ["0000"]      moves = 0       visited size = 6

HOW TO READ THE TRACE BELOW
  "expand X"   take code X out of `level` and look at its 8 neighbors
  NEW          not in `visited` yet -> mark visited, add to `nextLevel`
  rep          already in `visited` (an earlier code found it first) -> skip
  DEAD         a deadend, in `visited` since the start -> skip, it's a wall
  End of every round: `level = nextLevel`, and `moves` is the ring number.
  (Neighbors come out in this order: wheel 1 up, wheel 1 down, wheel 2 up,
   wheel 2 down, ... wheel 4 up, wheel 4 down.)

━━ ring 1 (moves = 1) ━━  level in: ["0000"]
  expand 0000: 1000 NEW, 9000 NEW, 0100 NEW, 0900 NEW,
               0010 NEW, 0090 NEW, 0001 NEW, 0009 NEW      => 8 new

  end of round:
    level   = [1000, 9000, 0100, 0900, 0010, 0090, 0001, 0009]   (8)
    visited = the 6 from before + these 8 = 14 codes
    Not the target yet.

━━ ring 2 (moves = 2) ━━  level in: the 8 codes above, 8 x 8 = 64 slots
  Watch how `visited` stops the same code being added twice. Codes are
  expanded in the order they sit in `level`:

  expand 1000: 2000 NEW, 0000 rep, 1100 NEW, 1900 NEW, 1010 NEW,
               1090 NEW, 1001 NEW, 1009 NEW                  => 7 new
  expand 9000: 0000 rep, 8000 NEW, 9100 NEW, 9900 NEW, 9010 NEW,
               9090 NEW, 9001 NEW, 9009 NEW                  => 7 new
  expand 0100: 1100 rep, 9100 rep, 0200 NEW, 0000 rep, 0110 NEW,
               0190 NEW, 0101 DEAD, 0109 NEW                 => 4 new
  expand 0900: 1900 rep, 9900 rep, 0000 rep, 0800 NEW, 0910 NEW,
               0990 NEW, 0901 NEW, 0909 NEW                  => 5 new
  expand 0010: 1010 rep, 9010 rep, 0110 rep, 0910 rep, 0020 NEW,
               0000 rep, 0011 NEW, 0019 NEW                  => 3 new
  expand 0090: 1090 rep, 9090 rep, 0190 rep, 0990 rep, 0000 rep,
               0080 NEW, 0091 NEW, 0099 NEW                  => 3 new
  expand 0001: 1001 rep, 9001 rep, 0101 DEAD, 0901 rep, 0011 rep,
               0091 rep, 0002 NEW, 0000 rep                  => 1 new
  expand 0009: 1009 rep, 9009 rep, 0109 rep, 0909 rep, 0019 rep,
               0099 rep, 0000 rep, 0008 NEW                  => 1 new

  Look at "expand 0100": its neighbor 1100 was already found back when
  we expanded 1000, so it's a `rep` and gets skipped. Same code, only
  the FIRST finder adds it. Also 0101 is DEAD, so the wall stops us there
  (0100 and 0001 both tried to step onto it).

  Tally: 7 + 7 + 4 + 5 + 3 + 3 + 1 + 1 = 31 new.
         64 slots = 31 NEW + 31 rep + 2 DEAD.
  end of round:
    level   = [2000, 1100, 1900, 1010, 1090, 1001, 1009, 8000, 9100, 9900,
               9010, 9090, 9001, 9009, 0200, 0110, 0190, 0109, 0800, 0910,
               0990, 0901, 0909, 0020, 0011, 0019, 0080, 0091, 0099, 0002,
               0008]                                                (31)
    visited = 14 + 31 = 45 codes
    Not the target yet.

━━ ring 3 (moves = 3) ━━  level in: the 31 codes above, 31 x 8 = 248 slots
  248 slots = 86 NEW + 160 rep + 2 DEAD, so 86 new codes.
  The two DEAD hits: 0200 -> 0201 and 0002 -> 0102.
  Those are the two ways the direct route wanted to keep going, and both
  are walls. (0200 and 0002 are the ends of the blocked 4-move routes.)
  Following the codes that lead to the answer: "1200" is NEW here,
  found while expanding "1100" (it sits at position 8 of 86).
  end of round:  level = 86 codes,  visited = 45 + 86 = 131

━━ ring 4 (moves = 4) ━━  level in: 86 codes, 86 x 8 = 688 slots
  688 slots = 190 NEW + 492 rep + 6 DEAD, so 190 new codes.
  DEAD hits: 2001->2002, 1101->0101, 1002->2002, 9101->0101,
             0111->0101, 0191->0101
  A 4-move route would have ended HERE, at "0202", but the codes right
  before it were walls, so "0202" is NOT among the 190.
  On our path: "1201" is NEW, found while expanding "1200" (position 28 of 190).
  end of round:  level = 190 codes,  visited = 131 + 190 = 321

━━ ring 5 (moves = 5) ━━  level in: 190 codes, 190 x 8 = 1520 slots
  1520 slots = 356 NEW + 1154 rep + 10 DEAD, so 356 new codes.
  DEAD hits: 1201->0201, 1102->0102, 9201->0201, 9102->0102,
             0301->0201, 0211->0201, 0291->0201, 0112->0102,
             0192->0102, 0103->0102
  Still no "0202" among them, it is not 5 moves away, its true distance is 6.
  On our path: "1202" is NEW, found while expanding "1201" (position 74 of 356).
  end of round:  level = 356 codes,  visited = 321 + 356 = 677

━━ ring 6 (moves = 6) ━━  level in: 356 codes
  We expand these in order. Around position 74 we reach "1202".
    expand 1202: 2202, 0202 ...
  Its wheel-1-down neighbor is (1 + 9) % 10 = 0, giving "0202".
  "0202" is NOT in `visited`, and it equals `target`
  -> return moves = 6, immediately, without even finishing ring 6.

WHAT THE PROGRAM IS TRACKING, the whole way:
  ring (moves)   codes in `level`   visited size after the round
       0                 1                     6   (5 deadends + start)
       1                 8                    14
       2                31                    45
       3                86                   131
       4               190                   321
       5               356                   677
       6           found target mid-round -> return 6

  Only THREE things ever change: `visited` (grows), `level` (replaced by
  the next ring each round) and `moves` (+1 each round). Deadends never
  move, they just sit in `visited` from the start so they get skipped.

  Why the rings 3 to 5 lists aren't printed in full: 86, 190 and 356
  codes won't fit on a page, and the pattern is the same as ring 2. To
  see them yourself, add `console.log(moves, level.length, level)` at the
  top of the while loop body in the solution below.

  The number of new codes per ring keeps growing (8, 31, 86, 190, 356), that
  is the ripple getting wider. The deadends only punch a few holes in
  it, but they were exactly enough to block every 4-move route, so the
  answer went from 4 to 6.

WALKTHROUGH, Example 2, one ring
  start: visited = {"8888", "0000"}   level = ["0000"]   moves = 0
  ring 1 (moves = 1): expand "0000", neighbor "0009" is the target
    (last wheel: (0 + 9) % 10 = 9). Return 1.

WALKTHROUGH, Example 3, why -1
  The rings keep growing (8, 32, 88, 192, 356, 576, 820, ...) and then
  shrink again as the ripple runs out of new codes: (..., 88, 32, 8, 1).
  Every ring that touches a neighbor of "8888" gets rejected because
  those neighbors are the deadends already in `visited`. Eventually a
  ring produces 0 new states, the queue is empty, the loop ends and we
  return -1. Every code that can be reached without crossing a deadend
  was visited, and the target was never one of them.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

/**
 * @param {string[]} deadends
 * @param {string} target
 * @return {number}
 */
var openLock = function(deadends, target) {
    const visited = new Set(deadends); // deadends count as "already seen", so BFS never enters them
    if (visited.has("0000")) return -1; // stuck before the first move
    if (target === "0000") return 0;

    visited.add("0000");
    let level = ["0000"]; // every code exactly `moves` turns from the start
    let moves = 0;

    while (level.length) {
        moves++; // everything we discover in this pass is `moves` turns away
        const nextLevel = [];

        for (const code of level) {
            for (const next of getNeighbors(code)) {
                if (visited.has(next)) continue;
                if (next === target) return moves; // first time we touch it = shortest
                visited.add(next); // mark when ADDED, not when processed
                nextLevel.push(next);
            }
        }

        level = nextLevel;
    }

    return -1; // ran out of reachable codes without touching target
};

/*
getNeighbors, LINE BY LINE (traced on code = "1202")

Job: given a code, return the 8 codes that are one wheel-turn away.
Idea: for each of the 4 wheels, make one code with that wheel turned UP
and one with it turned DOWN, leaving the other 3 wheels alone.
4 wheels x 2 directions = 8 codes.

  for (let i = 0; i < 4; i++)
      i is the wheel number, 0 = leftmost wheel ... 3 = rightmost.

  const digit = Number(code[i]);
      code[i] is the CHARACTER at that wheel, like "1". Number() turns it
      into the number 1 so we can do math on it.

  const up   = (digit + 1) % 10;      const down = (digit + 9) % 10;
      The new digit for turning up / down. The % 10 is the wraparound
      (9 up -> 0, 0 down -> 9). Same idea as problem 70.

  code.slice(0, i) + up + code.slice(i + 1)
      This builds the new code. JavaScript strings can't be edited in
      place (code[0] = "9" silently does nothing), so we REBUILD it out
      of three parts:
         code.slice(0, i)   everything BEFORE wheel i  (stays the same)
         up (or down)       the new digit for wheel i
         code.slice(i + 1)  everything AFTER wheel i   (stays the same)
      Example, code = "1202", i = 2, up = 1:
         "1202" split around index 2 is   "12" | "0" | "2"
         keep "12", swap the "0" for 1, keep "2"   ->  "12" + 1 + "2" = "1212"
      (a string + a number joins them as text, so 1 becomes "1")

Full trace for "1202", one wheel per loop pass:

  i=0  digit=1  up=2  down=0    before=""     after="202"   ->  2202  0202
  i=1  digit=2  up=3  down=1    before="1"    after="02"    ->  1302  1102
  i=2  digit=0  up=1  down=9    before="12"   after="2"     ->  1212  1292
  i=3  digit=2  up=3  down=1    before="120"  after=""      ->  1203  1201

  result = [2202, 0202, 1302, 1102, 1212, 1292, 1203, 1201]   (8 codes)

Notice down = (0 + 9) % 10 = 9 at i=2: wheel 3 was on 0 and wrapped
around to 9. That is the "0 -> 9" turn from Example 2.
The 4 is hardcoded because the lock always has 4 wheels.
*/
/*
WHY (digit + 1) % 10 AND (digit + 9) % 10

A wheel has 10 slots, 0 to 9, arranged in a circle. Turning it up moves
+1, turning it down moves -1, and both must wrap around the circle.

UP is the easy one, the same as the circular queue:
  digit + 1     would go 0..9 -> 1..10, and 10 is not a slot
  (digit + 1) % 10   turns that 10 back into 0, everything else is unchanged
    9 + 1 = 10,  10 % 10 = 0   <- the wrap

DOWN is the tricky one. The natural formula is (digit - 1) % 10, but:
    (0 - 1) % 10  gives  -1   in JavaScript
  In JavaScript, % keeps the sign of the number on the left, so a
  negative number stays negative. There is no wheel slot -1, and the
  bad code would silently become "-100" or similar. Only digit 0 breaks,
  every other digit is fine (see the table).

The fix: add 10 before the %.
    (digit - 1 + 10) % 10   =   (digit + 9) % 10
  Why is adding 10 allowed? 10 is exactly ONE FULL LAP of the wheel.
  Spinning a full lap lands you back where you started, and `% 10`
  throws away full laps. So adding 10 changes nothing about the final
  slot, it only makes sure the number is never negative before `%` runs.
  That's why "down" is written as +9: it's "-1, plus a full lap".

Every digit, both directions:

  digit   up (d+1)%10   down (d+9)%10   the naive (d-1)%10
    0          1              9               -1   <- broken
    1          2              0                0
    2          3              1                1
    3          4              2                2
    4          5              3                3
    5          6              4                4
    6          7              5                5
    7          8              6                6
    8          9              7                7
    9          0              8                8

Only the digit 0 row differs for the down formula, and the digit 9 row is
the one where up wraps. Those two rows are the whole reason for `% 10`.

If the modulo trick still feels like magic, this does the same thing with
an if, and works for every digit:
    const up   = digit === 9 ? 0 : digit + 1;
    const down = digit === 0 ? 9 : digit - 1;
The modulo version is just the same two if-cases folded into one line.
*/
// the 8 codes one wheel-turn away from `code`
function getNeighbors(code) {
    const result = [];
    for (let i = 0; i < 4; i++) {
        const digit = Number(code[i]);
        const up = (digit + 1) % 10;
        const down = (digit + 9) % 10; // same as digit - 1, but never negative
        result.push(code.slice(0, i) + up + code.slice(i + 1));
        result.push(code.slice(0, i) + down + code.slice(i + 1));
    }
    return result;
}

// Time: O(10^4), at most 10,000 codes, each processed once, 8 neighbors each
// Space: O(10^4), the visited set and the level arrays
// (explained step by step in the COMPLEXITY note below)

/*
COMPLEXITY, in plain words

TIME = "how many little steps does the work take, at the very worst?"
  1. How many codes exist? 4 wheels with 10 digits each:
       10 x 10 x 10 x 10 = 10,000 codes ("0000" up to "9999").
  2. How many times can BFS PROCESS one code (look at its neighbors)?
     Only ONCE. The `visited` set blocks any repeat, that is the whole
     reason it exists.
  3. What does processing one code cost? Build its 8 neighbors and check
     each one in the set. That's 8 lookups on 4-character strings, a
     small fixed amount of work.

  Worst case: 10,000 codes x 8 neighbors = 80,000 checks, plus putting
  the (at most 500) deadends in the set at the start. We call that
  O(10^4): the work is proportional to how many codes exist.

  In graph vocabulary this is the standard BFS cost O(V + E):
    V = 10,000 nodes, each visited once.
    E = 40,000 edges (10,000 nodes x 8 neighbors, but each edge is
        shared by 2 nodes, so divide by 2). Each edge gets looked at
        from both ends, which is the 80,000 checks above.

  Because a lock ALWAYS has 4 wheels of 10 digits, that 10,000 never
  grows with the input, so some people simply call it O(1). It's the
  same work, just described as "constant, but a big constant".

  Why `visited` matters so much: without it every ring multiplies by 8.
  Ring 1 = 8 codes, ring 2 = 64, ring 6 = 8^6 = 262,144, and it never
  stops (0000 -> 1000 -> 0000 -> 1000 ...).

SPACE = "how much memory is in use at once?"
  `visited` holds up to 10,000 four-character strings. `level` and
  `nextLevel` hold one ring at a time, and a ring is only a slice of
  those same codes (in Example 3 the biggest ring was 1,286 codes).
  Nothing can exceed 10,000 codes total, so O(10^4).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"BUT WHERE ARE n AND m?", the same answer with variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Most problems have an input that can be any size (an array of n numbers),
so the answer is written with n. Here the thing being searched is the
LOCK itself, which never changes size. It's like a grid problem where the
grid is always exactly 100 x 100. So the honest answer is a constant.

But you can name the fixed parts, and then it looks like a normal formula:

  W = number of wheels          (4 here)
  B = digits per wheel          (10 here)
  D = deadends.length           (at most 500, the only input that varies)

  Number of codes (nodes):      B^W        10^4 = 10,000
  Neighbors per code:           2 x W      2 x 4 = 8

  Time  = O(D x W)              putting D deadends (W characters each) in the set
        + O(B^W x W^2)          each of the B^W codes is processed once, and
                                processing one code means building 2W neighbors,
                                each a string of W characters (W work each),
                                plus 2W set lookups (also W work each)

        = O(D x W + B^W x W^2)

  Space = O(B^W x W)            visited can hold every code, each W characters

Plug in W = 4, B = 10: B^W x W^2 = 10,000 x 16 = 160,000, a fixed number.
Most people treat the W-character strings as "small" and write it the short
way: Time O(B^W + D), Space O(B^W). Both are the same idea as above.

The ONE variable that comes from the input is D, and it only shows up in
"put the deadends in the set". It can't make the BFS itself slower,
because deadends only REMOVE codes from the search, they never add any.

WHY A BIGGER `deadends` DOESN'T MEAN MORE WORK IN THE LOOP
  No deadends: BFS could visit all 10,000 codes.
  With 500 deadends: at most 9,500 codes are left to visit.
  More deadends means the same or LESS searching, never more.
*/



// ------------------------------------------------------------------------------------------
/**
 * @param {string[]} deadends
 * @param {string} target
 * @return {number}
 */
var openLock = function(deadends, target) {
    // with BFS: the main idea is investigating all the nodes widely, since we're looking for shortest path
    const visited = new Set(deadends);
    if(visited.has("0000")) return -1; // edge cases
    if(target === "0000") return 0; // edge cases

    visited.add("0000"); // tracks already seen nodes so BFS never enter (won't be duplicate nodes below and above)

    let level = ["0000"]; // save all the nodes we will encounter from the start but the visited (except for 0000 since that'll be starting point and we've validation previously for when the target or visited is 0000)

    let moves = 0; // for the return moves

    while(level.length){
        moves++;
        const nextLevel = [];

        for(const node of level){
            for(const next of getNeighbors(node)){
                if(visited.has(next)) continue;
                if(next === target) return moves;
                visited.add(next);
                nextLevel.push(next);
            }
        }
        level = nextLevel;
    }
    return -1; //meaning impossible
};

// i.e node: 1000
function getNeighbors(node){
    const result = [];

    for (let i= 0; i<4; i++){ // 4 because we have 4 digits
        const digit = Number(node[i]);
        const up = (digit + 1) % 10;
        const down = (digit + 9) % 10;
        result.push(node.slice(0,i) + up + node.slice(i+1)) // start,end and if only 1 param then it'll be start point
        result.push(node.slice(0,i) + down + node.slice(i+1))
    }

    return result;
}
