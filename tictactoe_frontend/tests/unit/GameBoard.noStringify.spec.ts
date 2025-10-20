import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GameBoard from '@/components/GameBoard.vue'

describe('GameBoard rendering safety (no JSON.stringify on reactive nodes)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not call JSON.stringify during render of typical board states', () => {
    const spy = vi.spyOn(JSON, 'stringify')
    const emptyBoard = [null, null, null, null, null, null, null, null, null] as Array<'X'|'O'|null>

    const wrapper = mount(GameBoard as any, {
      props: {
        board: emptyBoard,
        disabled: false,
        winningLine: null
      }
    })

    expect(wrapper.exists()).toBe(true)
    // Ensure no stringify occurred in render path
    expect(spy).not.toHaveBeenCalled()
  })

  it('renders marks as primitives only and avoids stringifying reactive structures', () => {
    const spy = vi.spyOn(JSON, 'stringify')
    const board = ['X', null, 'O', null, null, null, null, null, null] as Array<'X'|'O'|null>
    const wrapper = mount(GameBoard as any, {
      props: {
        board,
        disabled: false,
        winningLine: [0, 2]
      }
    })
    const cells = wrapper.findAll('button.board-cell')
    expect(cells[0].text()).toBe('X')
    expect(cells[2].text()).toBe('O')
    expect(cells[1].text()).toBe('')

    // No stringify during render
    expect(spy).not.toHaveBeenCalled()
  })
})
