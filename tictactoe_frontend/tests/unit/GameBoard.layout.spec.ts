import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameBoard from '@/components/GameBoard.vue'

describe('GameBoard layout (3x3 grid)', () => {
  it('renders exactly 9 cells in a 3x3 grid container', () => {
    const emptyBoard = Array(9).fill(null) as Array<'X'|'O'|null>
    const wrapper = mount(GameBoard as any, {
      props: {
        board: emptyBoard,
        disabled: false,
        winningLine: null,
      }
    })

    // Container should have Tailwind grid classes or fallback class if utilities missing
    const container = wrapper.find('[role="grid"]')
    expect(container.exists()).toBe(true)
    const cls = container.classes().join(' ')
    // Expect grid cols/rows classes present (Tailwind)
    expect(cls).toContain('grid')
    expect(cls).toContain('grid-cols-3')
    expect(cls).toContain('grid-rows-3')

    // Expect exactly 9 grid cells
    const cells = wrapper.findAll('button[role="gridcell"]')
    expect(cells.length).toBe(9)
  })
})
