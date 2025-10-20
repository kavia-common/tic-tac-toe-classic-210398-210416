<!--
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TTT-004
User Story: I need controls to start new game, reset scores, toggle opponent, and audit panel.
Acceptance Criteria: Buttons present and emit events with clear labels.
GxP Impact: NO - Controls only; audit logs handled in composable.
Risk Level: LOW
Validation Protocol: VP-TTT-001
============================================================================
-->
<script setup lang="ts">
const props = defineProps<{
  opponentMode: 'human' | 'ai',
  auditOpen?: boolean
}>()

const emit = defineEmits<{
  'new-game': []
  'reset-scores': []
  'toggle-opponent': []
  'toggle-audit': []
}>()
</script>

<template>
  <div class="card p-4">
    <div class="flex flex-wrap items-center gap-2">
      <button class="btn btn-primary" @click="emit('new-game')">
        New Game
      </button>
      <button class="btn btn-outline" @click="emit('reset-scores')">
        Reset Scores
      </button>
      <button class="btn btn-secondary" @click="emit('toggle-opponent')">
        Opponent: {{ props.opponentMode === 'ai' ? 'AI' : 'Human' }}
      </button>
      <button class="btn btn-outline ml-auto" @click="emit('toggle-audit')">
        {{ props.auditOpen ? 'Hide' : 'Show' }} Audit Trail
      </button>
    </div>
  </div>
</template>
