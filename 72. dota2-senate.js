/*
649. Dota2 Senate
Medium

In the world of Dota2, there are two parties: the Radiant and the Dire.

The Dota2 senate consists of senators coming from two parties. Now the Senate wants to decide on a change in the Dota2 game. The voting for this change is a round-based procedure. In each round, each senator can exercise one of the two rights:

Ban one senator's right: A senator can make another senator lose all his rights in this and all the following rounds.
Announce the victory: If this senator found the senators who still have rights to vote are all from the same party, he can announce the victory and decide on the change in the game.
Given a string senate representing each senator's party belonging. The character 'R' and 'D' represent the Radiant party and the Dire party. Then if there are n senators, the size of the given string will be n.

The round-based procedure starts from the first senator to the last senator in the given order. This procedure will last until the end of voting. All the senators who have lost their rights will be skipped during the procedure.

Suppose every senator is smart enough and will play the best strategy for his own party. Predict which party will finally announce the victory and change the Dota2 game. The output should be "Radiant" or "Dire".



Example 1:

Input: senate = "RD"
Output: "Radiant"
Explanation:
The first senator comes from Radiant and he can just ban the next senator's right in round 1.
And the second senator can't exercise any rights anymore since his right has been banned.
And in round 2, the first senator can just announce the victory since he is the only guy in the senate who can vote.
Example 2:

Input: senate = "RDD"
Output: "Dire"
Explanation:
The first senator comes from Radiant and he can just ban the next senator's right in round 1.
And the second senator can't exercise any rights anymore since his right has been banned.
And the third senator comes from Dire and he can ban the first senator's right in round 1.
And in round 2, the third senator can just announce the victory since he is the only guy in the senate who can vote.


Constraints:

n == senate.length
1 <= n <= 104
senate[i] is either 'R' or 'D'.
 */

/*
UNDERSTANDING THE PROBLEM, what is actually happening?

Picture a row of people, each wearing an R (Radiant) or D (Dire) badge:

    R  D  D          senate = "RDD", positions 0, 1, 2

They take turns from left to right. One pass down the row is a ROUND.
On your turn you do ONE of two things:

  1. BAN someone. Pick one senator from the OTHER party. That person is
     out for good: they lose their turn for the rest of THIS round (if
     they haven't gone yet) and for every round after it.
  2. ANNOUNCE VICTORY. Only allowed if everyone still in the game is
     from your party. Nobody left to fight, so you just win.

When the row ends, a new round starts from the left, with only the
people who are still in. Rounds keep repeating until one party is gone.

So the real question is: which party still has someone standing at the end?

"Every senator is smart" means each one bans whichever opponent helps
their own party most. The hard part is figuring out WHICH opponent that is.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Example 1: senate = "RD"   ->  "Radiant"
  Round 1: R (position 0) goes first and bans D (position 1).
           D is out, so D never gets a turn.
  Round 2: only R is left, R announces victory.

Example 2: senate = "RDD"   ->  "Dire"
  Round 1: R0 goes first and bans D1.
           D1 is out and skipped.
           D2 goes next and bans R0. R0 already had their turn this
           round, but they would have had another one in round 2, so
           banning them still matters.
  Round 2: only D2 is left, D2 announces victory.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE KEY QUESTION, whom should you ban?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Answer: the NEXT opponent who gets a turn after you (the nearest one).

Why? An opponent who is about to act will ban one of your teammates very
soon. An opponent whose turn is far away can be dealt with later. Banning
the one who acts soonest removes the most immediate danger.

Proof by example, senate = "RDRDD", where everybody uses one rule:

  everyone bans the NEAREST opponent       everyone bans the FARTHEST one
  round 1: R0 bans D1                      round 1: R0 bans D4
  round 1: R2 bans D3                      round 1: D1 bans R0   (D1 was
  round 1: D4 bans R0                                still alive to act!)
  round 2: R2 bans D4                      round 1: R2 bans D1
  only R2 left  ->  Radiant                round 1: D3 bans R2
                                           only D3 left  ->  Dire

Same senate, opposite winners. Banning the far-away opponent (D4) left the
near one (D1) alive, and D1 immediately banned R0. That is exactly the
mistake the "smart senator" avoids.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE APPROACH, two queues of positions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Simulating "find the next opponent after me, cycling around the row,
skipping banned people" directly is slow and fiddly. Instead:

  - one queue holds the positions of every R still in the game
  - one queue holds the positions of every D still in the game
  - both are kept in the order people will act (smallest position first)

Then repeat this "duel":
  1. take the FRONT of each queue: r = first R, d = first D
     (these are the two senators who act soonest)
  2. compare positions. The smaller one acts first, and by the rule above
     bans the front of the other queue, which is the opponent who acts
     soonest after them. That loser is simply not put back: banned for good.
  3. the winner will act again next round, so put them back at the END of
     their own queue, with position + n.

Keep going until one queue is empty. The party with people left wins.

WHY "+ n"?
  In round 1, seats are numbered 0 to n-1. Imagine the row printed twice
  back to back so the second round is visible:

       round 1:   0  1  2      round 2:   3  4  5     (n = 3)

  Seat 0 acting again in round 2 is "seat 3", which is 0 + n. Giving the
  winner position + n means:
    - they are now bigger than every round 1 position, so they act AFTER
      everyone who hasn't had their round 1 turn yet, and
    - the comparison "smaller position acts first" keeps working forever.
  It is the same circle idea as the circular queue (problem 70), except
  instead of wrapping back with % n we just keep counting up.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WALKTHROUGH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Example 1, senate = "RD"   (n = 2)
  start:  radiant = [0]    dire = [1]
  duel 1: r = 0, d = 1.  0 < 1, so R acts first and bans D.
          D is dropped. R goes back as 0 + 2 = 2.
          radiant = [2]    dire = []
  dire is empty, stop.  radiant has someone  ->  "Radiant"

Example 2, senate = "RDD"   (n = 3)
  start:  radiant = [0]    dire = [1, 2]
  duel 1: r = 0, d = 1.  0 < 1, so R0 acts first and bans D1.
          D1 is dropped. R0 goes back as 0 + 3 = 3.
          radiant = [3]    dire = [2]
  duel 2: r = 3, d = 2.  2 < 3, so D2 acts first (before R0's round 2
          turn) and bans R.
          R is dropped. D2 goes back as 2 + 3 = 5.
          radiant = []     dire = [5]
  radiant is empty, stop.  dire has someone  ->  "Dire"

A longer one, senate = "RRDDD"   (n = 5, seats: R0 R1 D2 D3 D4)
  start:  radiant = [0, 1]    dire = [2, 3, 4]
  duel 1: r = 0, d = 2.  R0 acts first, bans D2.  R0 returns as 5.
          radiant = [1, 5]    dire = [3, 4]
  duel 2: r = 1, d = 3.  R1 acts first, bans D3.  R1 returns as 6.
          radiant = [5, 6]    dire = [4]
  duel 3: r = 5, d = 4.  4 < 5, so D4 acts first and bans the R at 5
          (that is R0 in round 2). D4 returns as 4 + 5 = 9.
          radiant = [6]       dire = [9]
  duel 4: r = 6, d = 9.  R1 (round 2) acts first and bans D.
          R1 returns as 6 + 5 = 11.
          radiant = [11]      dire = []
  dire is empty, stop.  ->  "Radiant"

Notice each duel throws away exactly ONE senator and keeps the winner.
That is why the loop always ends.

EDGE CASES
  - Everyone is the same party ("RRR"): one queue is empty from the very
    start, the loop never runs, and the other party wins straight away.
  - n = 1: same thing, the only senator wins.
  - Two positions are never equal, so "r < d" never has to handle a tie.

COMPLEXITY
  n = senate.length (a real input size this time, unlike open the lock).
  Time:  O(n). Building the two queues is one pass. Every duel removes
         exactly one senator, so there are at most n - 1 duels, each doing
         a couple of queue operations.
         (Array.shift() moves the remaining items on a JS array, so
         strictly it costs a little more, but with n <= 10^4 that is
         fine. A linked-list queue or two head pointers avoids it.)
  Space: O(n), the two queues hold at most n positions between them.

BRUTE FORCE, for comparison: keep a `banned` array, loop round after round,
and for each active senator scan forward (wrapping around) to find the next
active opponent to ban. It works, but one ban can cost a scan of up to n
seats and there can be n bans, so O(n^2) worst case. The two queues avoid
the scanning because the next opponent is always sitting at the front.
*/

/**
 * @param {string} senate
 * @return {string}
 */
var predictPartyVictory = function(senate) {
    const n = senate.length;
    const radiant = []; // positions of the R senators still in, in the order they act
    const dire = [];    // same for the D senators

    for (let i = 0; i < n; i++) {
        if (senate[i] === "R") radiant.push(i);
        else dire.push(i);
    }

    // each pass is one ban: the two senators who act soonest face off
    while (radiant.length && dire.length) {
        const r = radiant.shift();
        const d = dire.shift();

        // smaller position acts first and bans the other (who is just not
        // put back). The winner returns for the next round, n seats later.
        if (r < d) radiant.push(r + n);
        else dire.push(d + n);
    }

    return radiant.length ? "Radiant" : "Dire";
};

// Time: O(n), each duel bans exactly one senator, so at most n - 1 duels
// Space: O(n), the two queues