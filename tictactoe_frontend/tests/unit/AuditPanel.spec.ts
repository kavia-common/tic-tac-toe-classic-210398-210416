import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuditPanel from '@/components/AuditPanel.vue'

describe('AuditPanel safe rendering', () => {
  it('renders entries with complex payloads without throwing', () => {
    const entries = [
      {
        userLabel: 'System',
        actionType: 'NEW_GAME',
        payload: { nested: { a: 1 } },
        beforeState: { currentPlayer: 'X' },
        afterState: { currentPlayer: 'X' },
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    ]
    const wrapper = mount(AuditPanel as any, {
      props: { entries },
    })
    expect(wrapper.text()).toContain('NEW_GAME')
    expect(wrapper.text()).toContain('System')
  })
})
