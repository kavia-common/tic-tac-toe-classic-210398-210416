/*
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TTT-006
User Story: As a system, I want to record actions with timestamps for traceability.
Acceptance Criteria: In-memory array with ISO timestamps, actor, and before/after.
GxP Impact: NO - Demo scaffold; not persistent.
Risk Level: LOW
Validation Protocol: VP-TTT-001
============================================================================
*/
import { ref } from 'vue'
import type { AuditEntry, GameState } from '@/types/game'

// PUBLIC_INTERFACE
export function useAuditTrail() {
  /** This is a public function. Provides an in-memory audit trail API. */
  const entries = ref<AuditEntry[]>([])

  // PUBLIC_INTERFACE
  function log(entry: Omit<AuditEntry, 'timestamp'>) {
    /** Add an audit entry with ISO timestamp, with input validation and error trapping. */
    try {
      if (!entry || !entry.userLabel || !entry.actionType) {
        throw new Error('Invalid audit entry')
      }
      entries.value.push({
        ...entry,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      // Best-effort error log
      const e = err as Error
      entries.value.push({
        userLabel: 'System',
        actionType: 'ERROR',
        payload: { message: e.message },
        timestamp: new Date().toISOString(),
      })
    }
  }

  // PUBLIC_INTERFACE
  function snapshot(state: Partial<GameState>): Partial<GameState> {
    /** Return a shallow clone suitable for audit before/after capture. */
    return JSON.parse(JSON.stringify(state))
  }

  return {
    entries,
    log,
    snapshot,
  }
}
