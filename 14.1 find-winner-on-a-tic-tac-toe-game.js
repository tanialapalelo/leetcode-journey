/**
 *
 * 1275. Find Winner on a Tic Tac Toe Game
 * Easy
 * 
 * Tic-tac-toe is played by two players A and B on a 3 x 3 grid. The rules of Tic-Tac-Toe are:
 *
 * Players take turns placing characters into empty squares ' '.
 * The first player A always places 'X' characters, while the second player B always places 'O' characters.
 * 'X' and 'O' characters are always placed into empty squares, never on filled ones.
 * The game ends when there are three of the same (non-empty) character filling any row, column, or diagonal.
 * The game also ends if all squares are non-empty.
 * No more moves can be played if the game is over.
 * Given a 2D integer array moves where moves[i] = [rowi, coli] indicates that the ith move will be played on grid[rowi][coli]. return the winner of the game if it exists (A or B). In case the game ends in a draw return "Draw". If there are still movements to play return "Pending".
 *
 * You can assume that moves is valid (i.e., it follows the rules of Tic-Tac-Toe), the grid is initially empty, and A will play first.
 *
 *
 *
 * Example 1:
 *
 *
 * Input: moves = [[0,0],[2,0],[1,1],[2,1],[2,2]]
 * Output: "A"
 * Explanation: A wins, they always play first.
 * Example 2:
 *
 *
 * Input: moves = [[0,0],[1,1],[0,1],[0,2],[1,0],[2,0]]
 * Output: "B"
 * Explanation: B wins.
 * Example 3:
 *
 *
 * Input: moves = [[0,0],[1,1],[2,0],[1,0],[1,2],[2,1],[0,1],[0,2],[2,2]]
 * Output: "Draw"
 * Explanation: The game ends in a draw since there are no moves to make.
 *
 *
 * Constraints:
 *
 * 1 <= moves.length <= 9
 * moves[i].length == 2
 * 0 <= rowi, coli <= 2
 * There are no repeated elements on moves.
 * moves follow the rules of tic tac toe.
 */

// ANSWER with help of GPT

/**
 * @param {number[][]} moves
 * @return {string}
 */
function tictactoe(moves) {
    const rows = [0, 0, 0]; // score for row 0, row 1, and row 2
    const cols = [0, 0, 0];
    let diag = 0;
    let anti = 0;

    for (let i = 0; i < moves.length; i++) {
        const [r, c] = moves[i]; // if moves[i] = [2,1], then r=2, c=1
        const player = (i % 2 === 0) ? "A" : "B";
        const val = (player === "A") ? 1 : -1; // decide who is playing, A: +1, B: -1

        // update counters
        // If A plays at (r,c), that row and column get +1. If B plays at (r,c), they get -1
        rows[r] += val;
        cols[c] += val;
        if (r === c) diag += val;
        if (r + c === 2) anti += val;

        // minimalist log: one line per move
        console.log(
            `i=${i} ${player} move=(${r},${c}) -> rows=${JSON.stringify(rows)} cols=${JSON.stringify(cols)} diag=${diag} anti=${anti}`
        );

        // win check
        // example [[0,0],[1,0],[0,1],[1,1],[0,2]] → rows[0] === 3 → A owns row 0 → win (rows[r] === 3 here means A has played 3 times in this row)
        // example [[0,0],[0,1],[1,1],[0,2],[2,2]] → A wins on the main diagonal (A has (0,0), (1,1), (2,2) → that’s the diagonal cuz +1+1+1 every time on A's turns)
        if (
            Math.abs(rows[r]) === 3 ||
            Math.abs(cols[c]) === 3 ||
            Math.abs(diag) === 3 ||
            Math.abs(anti) === 3
        ) {
            console.log(`WIN -> ${player}`);
            return player;
        }
    }

    // if we finish all moves and no winner, then check if it's a draw or pending
    const result = moves.length === 9 ? "Draw" : "Pending";
    console.log(`END -> ${result}`);
    return result;
}

// Time complexity: O(m) where m = moves.length (at most 9) - single pass, O(1) work per move.
// Space complexity: O(1) - rows/cols arrays are fixed size 3, diag/anti are scalars.