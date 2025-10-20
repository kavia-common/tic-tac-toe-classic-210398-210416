import { describe, it, expect } from 'vitest'
import { useTicTacToe } from '@/composables/useTicTacToe'

function makeAudit() {
  const entries: any[] = []
  return {
    entries,
    log: (e: any) => entries.push({ ...e, timestamp: 'T' }),
    snapshot: (s: any) => JSON.parse(JSON.stringify(s)),
  }
}

describe('useTicTacToe', () => {
  it('initializes with empty board and X to play', () => {
    const audit = makeAudit()
    const game = useTicTacToe(audit as any)
    expect(game.board.value.filter(Boolean).length).toBe(0)
    expect(game.currentPlayer.value).toBe('X')
    expect(game.gameOver.value).toBe(false)
  })

  it('prevents move on occupied cell', () => {
    const audit = makeAudit()
    const game = useTicTacToe(audit as any)
    game.makeMove(0)
    const first = game.board.value[0]
    game.makeMove(0)
    expect(game.board.value[0]).toBe(first)
  })

  it('detects a winning line', () => {
    const audit = makeAudit()
    const g = useTicTacToe(audit as any)
    // X 0 1 2, O 3 4 5, X 6 7 8
    g.makeMove(0) // X
    g.toggleOpponent() // switch to AI; may auto-move; switch back to human for controlled test
    g.toggleOpponent()
    g.makeMove(3) // O
    g.makeMove(1) // X
    g.makeMove(4) // O
    g.makeMove(2) // X wins
    expect(g.gameOver.value).toBe(true)
    expect(g.winner.value).toBe('X')
    expect(g.scores.value.X).toBe(1)
  })

  it('newGame resets board but keeps scores', () => {
    const audit = makeAudit()
    const g = useTicTacToe(audit as any)
    g.makeMove(0)
    g.makeMove(3)
    g.makeMove(1)
    g.makeMove(4)
    g.makeMove(2) // X wins
    expect(g.scores.value.X).toBe(1)
    g.newGame()
    expect(g.board.value.filter(Boolean).length).toBe(0)
    expect(g.scores.value.X).toBe(1)
  })
})
