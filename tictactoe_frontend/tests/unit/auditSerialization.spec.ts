import { describe, it, expect } from 'vitest'
import { ref, reactive } from 'vue'
import { toPlainSafe, safeStringify } from '@/utils/serialization'
import { useAuditTrail } from '@/composables/useAuditTrail'
import { useTicTacToe } from '@/composables/useTicTacToe'

describe('serialization utilities', () => {
  it('toPlainSafe handles refs and reactive without throwing', () => {
    const r = ref({ a: 1 })
    const obj = reactive({ x: r, y: [ref(2), { z: ref(3) }] })
    const plain = toPlainSafe(obj)
    expect(plain).toEqual({ x: { a: 1 }, y: [2, { z: 3 }] })
  })

  it('safeStringify handles circular structures', () => {
    const a: any = { name: 'a' }
    const b: any = { name: 'b', a }
    a.b = b
    const s = safeStringify(a)
    expect(s).toContain('"name":"a"')
    expect(s).toContain('[Circular]')
  })
})

describe('useAuditTrail serialization safety', () => {
  it('logs entries with reactive payload safely', () => {
    const audit = useAuditTrail()
    const payload = reactive({ foo: ref(1), bar: { baz: ref('q') } })
    audit.log({
      userLabel: 'System',
      actionType: 'NEW_GAME',
      payload,
    })
    expect(audit.entries.value.length).toBe(1)
    const entry = audit.entries.value[0]
    // payload should be plain
    expect(entry.payload).toEqual({ foo: 1, bar: { baz: 'q' } })
  })

  it('snapshots computed reactive game state safely', () => {
    const audit = useAuditTrail()
    const game = useTicTacToe(audit)
    // trigger a move to create non-trivial state
    game.makeMove(0)
    const snap = audit.snapshot(game.state.value)
    // should be plain and serializable
    const s = safeStringify(snap)
    expect(typeof s).toBe('string')
    expect(() => JSON.parse(s)).not.toThrow()
  })
})
