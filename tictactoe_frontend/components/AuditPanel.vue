<!--
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TTT-005
User Story: View an in-app audit list of moves and control actions.
Acceptance Criteria: Timestamped entries with actor and action payload.
GxP Impact: NO - In-memory demo; scaffolding only.
Risk Level: LOW
Validation Protocol: VP-TTT-001
============================================================================
-->
<script setup lang="ts">
import type { AuditEntry } from '@/types/game'

const props = defineProps<{
  entries: AuditEntry[]
}>()
</script>

<template>
  <div class="panel">
    <div class="panel-header">Audit Trail (Session)</div>
    <div class="panel-body">
      <div v-if="!props.entries.length" class="text-sm text-gray-500">No entries yet.</div>
      <ul v-else class="space-y-2 text-sm">
        <li v-for="(e, i) in props.entries" :key="i" class="p-2 border border-gray-100 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="font-medium">{{ e.userLabel }}</div>
            <div class="text-xs text-gray-500">{{ e.timestamp }}</div>
          </div>
          <div class="text-gray-700">
            <span class="font-semibold">{{ e.actionType }}</span>
            <span v-if="e.payload"> — {{ JSON.stringify(e.payload) }}</span>
          </div>
          <details class="mt-1">
            <summary class="cursor-pointer text-xs text-gray-500">State diff</summary>
            <pre class="text-[11px] mt-1 overflow-auto bg-gray-50 p-2 rounded">{{ JSON.stringify({ before: e.beforeState, after: e.afterState }, null, 2) }}</pre>
          </details>
        </li>
      </ul>
      <div class="mt-3 text-xs text-gray-400">
        Note: This is a minimal, in-memory audit scaffold for demo purposes only.
      </div>
    </div>
  </div>
</template>
