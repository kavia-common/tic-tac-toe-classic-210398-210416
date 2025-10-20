/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TTT-008
User Story: Manage Tic-Tac-Toe state, moves, winner detection, scores, and AI.
Acceptance Criteria: Make moves, detect game over, update scores, provide controls.
GxP Impact: NO - In-app game logic with audit scaffolding.
Risk Level: LOW
Validation Protocol: VP-TTT-001/002 (unit tests)
============================================================================
*/
import { ref, computed, watch } from 'vue'
import type { Board, GameState, Player, Scores } from '@/types/game'
import { bestMove } from './useAI'

const WIN_LINES: number[][] = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

interface AuditApi {
  /**
   * Accepts entries where payload/before/after will be sanitized by the audit implementation.
   * Implementations must not attempt to JSON.stringify reactive state directly.
   */
  log: (entry: any) => void
  /**
   * Returns a deep, plain clone safe for serialization.
   */
  snapshot: (state: Partial<GameState>) => Partial<GameState>
}

// PUBLIC_INTERFACE
export function useTicTacToe(audit: AuditApi) {
  /** This is a public function. Provides reactive game state and operations. */

  // State
  const board = ref<Board>(Array(9).fill(null))
  const currentPlayer = ref<Player>('X')
  const gameOver = ref(false)
  const winner = ref<Player | 'draw' | null>(null)
  const winningLine = ref<number[] | null>(null)
  const opponentMode = ref<'human'|'ai'>('human')
  const scores = ref<Scores>({ X: 0, O: 0, draws: 0 })

  const state = computed<GameState>(() => ({
    board: board.value,
    currentPlayer: currentPlayer.value,
    gameOver: gameOver.value,
    winner: winner.value,
    winningLine: winningLine.value,
    opponentMode: opponentMode.value,
    scores: scores.value,
  }))

  // Helpers
  function checkWinner(b: Board): { winner: Player | 'draw' | null, line: number[] | null } {
    for (const line of WIN_LINES) {
      const [a,bIdx,c] = line
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return { winner: b[a]!, line }
    }
    if (b.every(v => v !== null)) return { winner: 'draw', line: null }
    return { winner: null, line: null }
  }

  function finalizeGame(result: Player | 'draw', line: number[] | null) {
    gameOver.value = true
    winner.value = result
    winningLine.value = line
    if (result === 'draw') scores.value.draws += 1
    else scores.value[result] += 1
  }

  // PUBLIC_INTERFACE
  function newGame() {
    /** Start a new round; keep scores. */
    const before = audit.snapshot(state.value)
    board.value = Array(9).fill(null)
    currentPlayer.value = 'X'
    gameOver.value = false
    winner.value = null
    winningLine.value = null
    audit.log({
      userLabel: 'System',
      actionType: 'NEW_GAME',
      beforeState: before,
      afterState: audit.snapshot(state.value),
    })
  }

  // PUBLIC_INTERFACE
  function resetScores() {
    /** Reset scoreboard to zero. */
    const before = audit.snapshot(state.value)
    scores.value = { X: 0, O: 0, draws: 0 }
    audit.log({
      userLabel: 'System',
      actionType: 'RESET_SCORES',
      beforeState: before,
      afterState: audit.snapshot(state.value),
    })
  }

  // PUBLIC_INTERFACE
  function toggleOpponent() {
    /** Toggle between human and AI opponent. */
    const before = audit.snapshot(state.value)
    opponentMode.value = opponentMode.value === 'human' ? 'ai' : 'human'
    audit.log({
      userLabel: 'System',
      actionType: 'TOGGLE_OPPONENT',
      beforeState: before,
      afterState: audit.snapshot(state.value),
      payload: { opponentMode: opponentMode.value }
    })
    // If switched to AI and it's AI's turn, let AI move.
    maybeAIMove()
  }

  // PUBLIC_INTERFACE
  function makeMove(index: number) {
    /**
     * Place the current player's mark at index if valid.
     * Input validation and audit logging included.
     */
    try {
      if (gameOver.value) return
      if (typeof index !== 'number' || index < 0 || index > 8) return
      if (board.value[index] !== null) return

      const before = audit.snapshot(state.value)

      board.value[index] = currentPlayer.value

      const result = checkWinner(board.value)
      if (result.winner) {
        finalizeGame(result.winner, result.line)
      } else {
        // switch player
        currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
      }

      audit.log({
        userLabel: currentPlayer.value === 'X' ? 'Player O' : 'Player X', // actor who just moved
        actionType: 'MOVE',
        payload: { index, mark: board.value[index] },
        beforeState: before,
        afterState: audit.snapshot(state.value),
      })

      // If AI is opponent and game not over and it's AI's turn, let AI move.
      maybeAIMove()
    } catch (err) {
      audit.log({
        userLabel: 'System',
        actionType: 'ERROR',
        payload: { message: (err as Error).message }
      })
    }
  }

  function maybeAIMove() {
    if (opponentMode.value !== 'ai') return
    if (gameOver.value) return
    if (currentPlayer.value !== 'O') return // AI plays 'O' by convention

    // AI move
    const aiIdx = bestMove(board.value, 'O', 9)
    if (aiIdx !== null) {
      // slight delay for UX could be added; keeping sync for tests
      makeMove(aiIdx)
    }
  }

  // If a user switches to AI mid-game and it's AI's turn, trigger move
  watch([opponentMode, currentPlayer, board], () => {
    maybeAIMove()
  })

  return {
    // state
    board,
    currentPlayer,
    gameOver,
    winner,
    winningLine,
    opponentMode,
    scores,
    state,

    // actions
    newGame,
    resetScores,
    toggleOpponent,
    makeMove,
  }
}
