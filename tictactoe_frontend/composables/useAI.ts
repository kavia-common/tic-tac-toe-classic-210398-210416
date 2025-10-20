/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TTT-007
User Story: Provide a simple AI to play optimally or near-optimally.
Acceptance Criteria: Compute next index for 'O' given a board using minimax.
GxP Impact: NO - Game logic; deterministic and pure.
Risk Level: LOW
Validation Protocol: VP-TTT-002 (unit tests)
============================================================================
*/
import type { Board, Player } from '@/types/game'

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

function evaluate(board: Board): Player | 'draw' | null {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  if (board.every(c => c !== null)) return 'draw'
  return null
}

function availableMoves(board: Board): number[] {
  const moves: number[] = []
  for (let i=0;i<board.length;i++) if (board[i] === null) moves.push(i)
  return moves
}

function clone(board: Board): Board {
  return board.slice()
}

// PUBLIC_INTERFACE
export function bestMove(board: Board, aiPlayer: Player = 'O', depthLimit = 9): number | null {
  /** Determine best available move for aiPlayer using depth-limited minimax. */
  if (!Array.isArray(board) || board.length !== 9) return null
  const opponent: Player = aiPlayer === 'X' ? 'O' : 'X'

  function scoreResult(result: Player | 'draw' | null, depth: number): number {
    if (result === aiPlayer) return 10 - depth
    if (result === opponent) return depth - 10
    return 0
  }

  let bestIdx: number | null = null
  let bestScore = -Infinity

  const moves = availableMoves(board)
  for (const mv of moves) {
    const b = clone(board)
    b[mv] = aiPlayer
    const s = minimax(b, false, 1)
    if (s > bestScore) {
      bestScore = s
      bestIdx = mv
    }
  }
  return bestIdx

  function minimax(bd: Board, isMax: boolean, depth: number): number {
    const res = evaluate(bd)
    if (res !== null || depth >= depthLimit) {
      return scoreResult(res, depth)
    }
    const moves = availableMoves(bd)
    if (isMax) {
      let best = -Infinity
      for (const mv of moves) {
        const b2 = clone(bd)
        b2[mv] = aiPlayer
        best = Math.max(best, minimax(b2, false, depth + 1))
      }
      return best
    } else {
      let worst = Infinity
      for (const mv of moves) {
        const b2 = clone(bd)
        b2[mv] = opponent
        worst = Math.min(worst, minimax(b2, true, depth + 1))
      }
      return worst
    }
  }
}
