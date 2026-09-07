/**
 * 853. Car Fleet
Medium

There are n cars at given miles away from the starting mile 0, traveling to reach the mile target.

You are given two integer arrays position and speed, both of length n, where position[i] is the starting mile of the ith car and speed[i] is the speed of the ith car in miles per hour.

A car cannot pass another car, but it can catch up and then travel next to it at the speed of the slower car.

A car fleet is a single car or a group of cars driving next to each other. The speed of the car fleet is the minimum speed of any car in the fleet.

If a car catches up to a car fleet at the mile target, it will still be considered as part of the car fleet.

Return the number of car fleets that will arrive at the destination.

 

Example 1:

Input: target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]

Output: 3

Explanation:

The cars starting at 10 (speed 2) and 8 (speed 4) become a fleet, meeting each other at 12. The fleet forms at target.
The car starting at 0 (speed 1) does not catch up to any other car, so it is a fleet by itself.
The cars starting at 5 (speed 1) and 3 (speed 3) become a fleet, meeting each other at 6. The fleet moves at speed 1 until it reaches target.
Example 2:

Input: target = 10, position = [3], speed = [3]

Output: 1

Explanation:

There is only one car, hence there is only one fleet.
Example 3:

Input: target = 100, position = [0,2,4], speed = [4,2,1]

Output: 1

Explanation:

The cars starting at 0 (speed 4) and 2 (speed 2) become a fleet, meeting each other at 4. The car starting at 4 (speed 1) travels to 5.
Then, the fleet at 4 (speed 2) and the car at position 5 (speed 1) become one fleet, meeting each other at 6. The fleet moves at speed 1 until it reaches target.
 

Constraints:

n == position.length == speed.length
1 <= n <= 105
0 < target <= 106
0 <= position[i] < target
All the values of position are unique.
0 < speed[i] <= 106

 */

/*
UNDERSTANDING THE PROBLEM - START HERE, NO MATH YET

Picture a ONE-LANE road. Every car drives toward the same finish line,
`target` (say, mile 12). `position[i]` = where car i starts. `speed[i]` =
how fast it drives. THE RULE THAT MAKES THIS PROBLEM WEIRD: nobody can
overtake anybody, ever - it's one lane.

So what happens if a fast car is BEHIND a slower car? It drives up right
behind it... and then is stuck. It can't pass, so from that point on it's
forced to crawl along at the SLOWER car's speed, glued right behind it,
like a mini traffic jam. That "car + whatever's stuck behind it" group is
called a FLEET. A fleet always moves at the speed of its slowest member,
because everyone behind it is trapped by it.

The question "how many fleets reach the finish line" really just means:
"how many separate, never-merging groups end up on the road" - because
once cars merge into a fleet, they stay merged (a fleet can never speed
back up or split apart again).

Let's physically trace Example 1 on a number line from 0 to 12, using the
actual positions/speeds (this is the SAME reasoning the official example
explanation uses, just slowed down step by step):

  position:  0    3        5              8        10         (target: 12)
  speed:    (1)  (3)      (1)            (4)        (2)

- Car at 10 (speed 2) and car at 8 (speed 4): the car at 8 is BEHIND and
  FASTER. Does it catch up before mile 12? Car at 10 needs (12-10)/2 = 1
  hour. Car at 8 needs (12-8)/4 = 1 hour too. They arrive at the exact
  same moment -> they meet right at the finish line -> 1 fleet.

- Car at 5 (speed 1) and car at 3 (speed 3): the car at 3 is behind and
  much faster. It physically catches up to the car at 5 at some point
  BEFORE mile 12 (the problem says mile 6), then gets stuck behind it,
  crawling the rest of the way at speed 1 -> 1 fleet.

- Car at 0 (speed 1): nothing is behind it to get stuck on, and it's not
  fast enough to catch anyone ahead of it either -> travels alone -> its
  own fleet.

Total distinct fleets: {10, 8}, {5, 3}, {0} -> 3. Matches the example.

WHY WE DON'T JUST SIMULATE THIS MINUTE-BY-MINUTE:
Physically tracing positions like above works, but doing it by literally
moving every car forward tick by tick and checking collisions would be
painfully slow and messy to code. We need a way to answer "does car A ever
get stuck behind car B?" using pure arithmetic instead of a simulation.

THE KEY TRICK: compute time[i] = (target - position[i]) / speed[i] for
every car - "how long would car i take to reach the finish line if the
road were completely empty and nothing ever blocked it". This one number
secretly encodes everything we need:
  - if a car's own time is SMALLER OR EQUAL to the time of whatever is
    directly ahead of it, it either arrives at the exact same time (like
    10 & 8 above) or would arrive earlier if unobstructed - but it CAN'T
    pass, so in reality it's forced to slow down and get stuck in that
    fleet instead.
  - if a car's own time is STRICTLY LARGER than everything ahead of it,
    even in the best case (empty road) it would still arrive after
    everyone ahead - it never catches anyone, so it's a fleet of its own.

So "how many fleets arrive" = "how many cars have a strictly bigger
own-time than every single car ahead of them".

WALKTHROUGH - Example 1: target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]

  car:      pos=10  pos=8  pos=0  pos=5  pos=3
  time:     (12-10)/2=1   (12-8)/4=1   (12-0)/1=12   (12-5)/1=7   (12-3)/3=3

Sort by position DESCENDING (closest to target first, since a car can only
ever be blocked by whatever is directly ahead of it):
  pos=10 (time 1) -> pos=8 (time 1) -> pos=5 (time 7) -> pos=3 (time 3) -> pos=0 (time 12)

Walk through, tracking the slowest (max) time seen so far among cars ahead:
  pos=10, time=1: nothing ahead -> new fleet. slowestSoFar = 1        fleets=1
  pos=8,  time=1: 1 <= slowestSoFar(1) -> catches up, merges           fleets=1
  pos=5,  time=7: 7 >  slowestSoFar(1) -> new fleet. slowestSoFar = 7  fleets=2
  pos=3,  time=3: 3 <= slowestSoFar(7) -> catches up, merges           fleets=2
  pos=0,  time=12: 12 > slowestSoFar(7) -> new fleet. slowestSoFar=12  fleets=3

Result: 3 fleets - matches the example (10&8 merge, 5&3 merge, 0 is alone).
*/

/*
APPROACH 1: BRUTE FORCE (recompute the slowest-time-so-far from scratch)

Same rule as above: a car forms a NEW fleet only if its own time is
STRICTLY GREATER than every car's time ahead of it (position-wise). The
brute-force way to check that is to literally rescan every previously
seen car each time, instead of remembering the answer as you go - the same
kind of naive re-scan you'd do before discovering the prefix-max trick
(see 12.reference-prefix-and-suffix.js), just with Math.max as the
combining operation instead of + or *.

Time:  O(n log n) for the sort + O(n^2) for the rescan-every-time check
Space: O(n) for the sorted (position, time) pairs
*/

/**
 * @param {number} target
 * @param {number[]} position
 * @param {number[]} speed
 * @return {number}
 */
var carFleetBruteForce = function(target, position, speed) {
    const n = position.length;
    const cars = [];
    for (let i = 0; i < n; i++) {
        cars.push({ time: (target - position[i]) / speed[i], position: position[i] });
    }
    cars.sort((a, b) => b.position - a.position); // closest to target first

    let fleets = 0;
    for (let i = 0; i < n; i++) {
        let maxSoFar = -Infinity;
        for (let j = 0; j < i; j++) {
            maxSoFar = Math.max(maxSoFar, cars[j].time);
        }
        if (cars[i].time > maxSoFar) fleets++; // slower than everything ahead -> new fleet
    }
    return fleets;
};

/*
APPROACH 2: OPTIMAL (running max — a "collapsed" monotonic stack)

Same rule, but instead of rescanning from scratch every time, keep a
single running variable holding the max time seen so far and update it
once per car - O(1) each, instead of an O(n) rescan each time. This is the
exact same prefix-running-value optimization as prefix sums/products (see
12.reference-prefix-and-suffix.js), just with Math.max instead of + or *.

Many explanations frame this as a STACK: push a car's time whenever it's
greater than the value on top (a new, slower fleet forms), skip pushing
(merge) when it's <= the top. Because a value only ever gets pushed when
it's bigger than the current top, the stack's contents are always
increasing bottom-to-top - so the top is ALWAYS just the max of everything
pushed so far. The "stack" degenerates to needing only its top element,
which is exactly the single `slowestTimeSoFar` variable below - same
algorithm, just skipping values you'd never look at again anyway.

Time:  O(n log n) - dominated by the sort; the pass after the sort is O(n)
Space: O(n) - for the sorted (position, time) pairs
*/

/**
 * @param {number} target
 * @param {number[]} position
 * @param {number[]} speed
 * @return {number}
 */
var carFleet = function(target, position, speed) {
    const n = position.length;
    const cars = [];
    for (let i = 0; i < n; i++) {
        cars.push({ time: (target - position[i]) / speed[i], position: position[i] });
    }
    cars.sort((a, b) => b.position - a.position); // closest to target first

    let fleets = 0;
    let slowestTimeSoFar = -Infinity;
    for (const car of cars) {
        if (car.time > slowestTimeSoFar) {
            fleets++;                    // slower than every fleet ahead -> its own new fleet
            slowestTimeSoFar = car.time;
        }
        // else: car.time <= slowestTimeSoFar -> catches up, merges, no new fleet
    }
    return fleets;
};