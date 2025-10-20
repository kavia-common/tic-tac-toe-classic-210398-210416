import { describe, it, expect } from 'vitest'
import { bestMove } from '@/composables/useAI'

describe('useAI bestMove', () => {
  it('returns a valid index for empty board', () => {
    const idx = bestMove([null,null,null,null,null,null,null,null,null], 'O')
    expect(idx).not.toBeNull()
    expect(idx).toBeGreaterThanOrEqual(0)
    expect(idx as number).toBeLessThan(9)
  })

  it('blocks immediate opponent win', () => {
    // X about to win at 2 (0 and 1 are X). O should block at 2.
    const board = ['X','X',null, null,'O',null, null,null,null] as any
    expect(bestMove(board, 'O')).toBe(2)
  })

  it('takes winning move if available', () => {
    const board = ['O','O',null, 'X','X',null, null,null,null] as any
    expect(bestMove(board, 'O')).toBe(2)
  })
})
