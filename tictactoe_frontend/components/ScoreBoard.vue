<!--
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TTT-003
User Story: As a user I want to see session scores for X, O, and draws.
Acceptance Criteria: Clearly display counts, Ocean theme.
GxP Impact: NO - UI display only.
Risk Level: LOW
Validation Protocol: VP-TTT-001
============================================================================
-->
<script setup lang="ts">
const props = defineProps<{
  xWins: number
  oWins: number
  draws: number
}>()
</script>

<template>
  <div class="card p-4">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-semibold text-gray-800">Scoreboard</h2>
      <div class="text-xs text-gray-500">Session</div>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="panel p-3 text-center">
        <div class="text-xs text-gray-500 mb-1">X Wins</div>
        <div class="text-2xl font-bold" style="color:#2563EB">{{ props.xWins }}</div>
      </div>
      <div class="panel p-3 text-center">
        <div class="text-xs text-gray-500 mb-1">O Wins</div>
        <div class="text-2xl font-bold" style="color:#F59E0B">{{ props.oWins }}</div>
      </div>
      <div class="panel p-3 text-center">
        <div class="text-xs text-gray-500 mb-1">Draws</div>
        <div class="text-2xl font-bold text-gray-800">{{ props.draws }}</div>
      </div>
    </div>
  </div>
</template>
