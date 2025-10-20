import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameBoard from '@/components/GameBoard.vue'

describe('GameBoard', () => {
  const emptyBoard = [null, null, null, null, null, null, null, null, null] as Array<'X'|'O'|null>

  it('renders safely when winningLine is null', () => {
    const wrapper = mount(GameBoard as any, {
      props: {
        board: emptyBoard,
        disabled: false,
        winningLine: null
      }
    })
    expect(wrapper.exists()).toBe(true)
    // ensure no win class present
    const cells = wrapper.findAll('button.board-cell')
    expect(cells.some(c => c.classes().includes('win'))).toBe(false)
  })

  it('renders safely when winningLine is undefined', () => {
    const wrapper = mount(GameBoard as any, {
      props: {
        board: emptyBoard,
        disabled: false
        // winningLine intentionally omitted
      }
    })
    expect(wrapper.exists()).toBe(true)
    const cells = wrapper.findAll('button.board-cell')
    expect(cells.some(c => c.classes().includes('win'))).toBe(false)
  })

  it('applies win class when index is in winningLine', () => {
    const board = ['X','X','X', null, null, null, null, null, null] as any
    const wrapper = mount(GameBoard as any, {
      props: {
        board,
        disabled: true,
        winningLine: [0,1,2]
      }
    })
    const cells = wrapper.findAll('button.board-cell')
    expect(cells[0].classes()).toContain('win')
    expect(cells[1].classes()).toContain('win')
    expect(cells[2].classes()).toContain('win')
    // non-winning cells should not have win class
    expect(cells[3].classes()).not.toContain('win')
  })
})
